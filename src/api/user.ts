import {
  arrayUnion,
  collection,
  doc,
  getDocs,
  increment,
  query,
  updateDoc,
  where,
} from 'firebase/firestore';
import { db } from '../db';
import { User } from '../types/User';

const getUsers = async (loggedInUser: User | null) => {
  const q = query(collection(db, 'users'), where('uid', '!=', loggedInUser?.uid));
  const querySnapshot = await getDocs(q);

  const users = querySnapshot.docs
    .map((doc) => doc.data() as User)
    .filter(
      (user) =>
        loggedInUser?.following.find((following) => following.id === user.uid) === undefined,
    );

  return users;
};

const followUser = async (followerUid: string, followingUid: string) => {
  const followerRef = doc(db, 'users', followerUid);
  const followingRef = doc(db, 'users', followingUid);

  await updateDoc(followerRef, {
    following: arrayUnion(followingRef),
    followingCount: increment(1),
  });

  await updateDoc(followingRef, {
    followers: arrayUnion(followerRef),
    followersCount: increment(1),
  });

  return followingRef;
};

export { getUsers, followUser };
