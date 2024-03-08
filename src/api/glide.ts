import {
  addDoc,
  collection,
  doc,
  DocumentReference,
  getDoc,
  getDocs,
  increment,
  limit,
  onSnapshot,
  orderBy,
  query,
  QueryConstraint,
  QueryDocumentSnapshot,
  setDoc,
  startAfter,
  Timestamp,
  updateDoc,
  where,
} from 'firebase/firestore';
import { db } from '../db';
import { Glide, UserGlide } from '../types/Glide';
import { User } from '../types/User';

const getGlideById = async (id: string, uid: string) => {
  const userDocRef = doc(db, 'users', uid);
  const userGlideRef = doc(userDocRef, 'glides', id);

  const userGlideSnap = await getDoc(userGlideRef);
  const userGlide = userGlideSnap.data() as UserGlide;

  const glideSnap = await getDoc(userGlide.lookup);

  const userDocSnap = await getDoc(userDocRef);

  return {
    ...glideSnap.data(),
    user: userDocSnap.data() as User,
    id: glideSnap.id,
    lookup: glideSnap.ref.path,
  } as Glide;
};

const getGlides = async (loggedInUser: User, loadedLastGlide: QueryDocumentSnapshot | null) => {
  const _loggedUserDoc = doc(db, 'users', loggedInUser.uid);
  const constraints: QueryConstraint[] = [orderBy('date', 'desc'), limit(10)];

  if (loggedInUser.followingCount > 0) {
    constraints.push(where('user', 'in', [loggedInUser.following, _loggedUserDoc]));
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

const getSubglides = async (glideLookup: string) => {
  const ref = doc(db, glideLookup);
  const _collection = collection(ref, 'glides');

  const constraints = [orderBy('date', 'desc'), limit(10)];

  const q = query(_collection, ...constraints);

  const qSnapshot = await getDocs(q);

  const glides = await Promise.all(
    qSnapshot.docs.map(async (g) => {
      const glide = g.data() as Glide;
      const userSnap = await getDoc(glide.user as DocumentReference);

      glide.user = userSnap.data() as User;

      return { ...glide, id: g.id };
    }),
  );

  return {
    glides,
    lastGlide: null,
  };
};

const subscribeToGlides = (loggedInUser: User, getCallback: (newGlides: Glide[]) => void) => {
  const _loggedUserDoc = doc(db, 'users', loggedInUser.uid);
  const _collection = collection(db, 'glides');

  const constraints = [where('data', '>', Timestamp.now())];

  if (loggedInUser.followingCount > 0) {
    constraints.push(where('user', 'in', loggedInUser.following));
  } else {
    constraints.push(where('user', '==', _loggedUserDoc));
  }

  const q = query(_collection, ...constraints);

  return onSnapshot(q, async (querySnapshot) => {
    const glides = await Promise.all(
      querySnapshot.docs.reverse().map(async (doc) => {
        const glide = doc.data() as Glide;
        const userSnap = await getDoc(glide.user as DocumentReference);
        glide.user = userSnap.data() as User;
        return { ...glide, id: doc.id };
      }),
    );

    getCallback(glides);
  });
};

const getGlideCollection = (answerTo?: string) => {
  let glideCollection;

  if (!!answerTo) {
    const ref = doc(db, answerTo);
    glideCollection = collection(ref, 'glides');
  } else {
    glideCollection = collection(db, 'glides');
  }

  return glideCollection;
};

const createGlide = async (
  form: { content: string; uid: string },
  answerTo?: string,
): Promise<Glide> => {
  const userRef = doc(db, 'users', form.uid);

  const glideToStore = {
    ...form,
    user: userRef,
    likesCount: 0,
    subglidesCount: 0,
    date: Timestamp.now(),
  };

  if (!!answerTo) {
    const ref = doc(db, answerTo);
    await updateDoc(ref, {
      subglidesCount: increment(1),
    });
  }

  const glideCollection = getGlideCollection(answerTo);
  const added = await addDoc(glideCollection, glideToStore);

  const userGlideRef = doc(userRef, 'glides', added.id);
  await setDoc(userGlideRef, { lookup: added });

  return {
    ...glideToStore,
    id: added.id,
    lookup: added.path,
  };
};

export { getGlides, getSubglides, createGlide, subscribeToGlides, getGlideById };
