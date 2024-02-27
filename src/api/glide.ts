import {
  addDoc,
  collection,
  doc,
  DocumentReference,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
  QueryConstraint,
  QueryDocumentSnapshot,
  startAfter,
  Timestamp,
  where,
} from 'firebase/firestore';
import { db } from '../db';
import { Glide } from '../types/Glide';
import { User } from '../types/User';

const getGlides = async (loggedInUser: User, loadedLastGlide: QueryDocumentSnapshot | null) => {
  const _loggedUserDoc = doc(db, 'users', loggedInUser.uid);
  const constraints: QueryConstraint[] = [orderBy('date', 'desc'), limit(10)];

  if (loggedInUser.followingCount > 0) {
    constraints.push(where('user', 'in', loggedInUser.following));
  } else {
    constraints.push(where('user', '==', _loggedUserDoc));
  }

  if (!!loadedLastGlide) {
    constraints.push(startAfter(loadedLastGlide));
  }

  const q = query(collection(db, 'glides'), ...constraints);
  const qSnapshot = await getDocs(q);
  const lastGlide = qSnapshot.docs[qSnapshot.docs.length - 1] ?? null;

  return {
    glides: await Promise.all(
      qSnapshot.docs.map(async (g) => {
        const glide = g.data() as Glide;
        const userSnap = await getDoc(glide.user as DocumentReference);

        glide.user = userSnap.data() as User;

        return { ...glide, id: g.id };
      }),
    ),
    lastGlide: lastGlide,
  };
};

const createGlide = async (form: { content: string; uid: string }): Promise<Glide> => {
  const userRef = doc(db, 'users', form.uid);

  const glideToStore = {
    ...form,
    user: userRef,
    likesCount: 0,
    subglidesCount: 0,
    date: Timestamp.now(),
  };

  const glideCollection = collection(db, 'glides');
  const added = await addDoc(glideCollection, glideToStore);

  return {
    ...glideToStore,
    id: added.id,
  };
};

export { getGlides, createGlide };
