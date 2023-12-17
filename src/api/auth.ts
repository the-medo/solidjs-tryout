import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { AuthForm, RegisterForm } from '../types/Form';
import { db, firebaseAuth } from '../db';
import { User } from '../types/User';
import { setDoc, doc, getDoc } from 'firebase/firestore';

export type AuthType = 'register' | 'login';

const register = async (form: RegisterForm) => {
  const { user: registeredUser } = await createUserWithEmailAndPassword(
    firebaseAuth,
    form.email,
    form.password,
  );

  const user: User = {
    uid: registeredUser.uid,
    nickName: form.nickName,
    fullName: form.fullName,
    email: form.email,
    avatar: form.avatar,
    followers: [],
    following: [],
    followersCount: 0,
    followingCount: 0,
  };

  await setDoc(doc(db, 'users', registeredUser.uid), user);

  return registeredUser;
};

const login = async (form: AuthForm) => {
  const { user } = await signInWithEmailAndPassword(firebaseAuth, form.email, form.password);

  return user;
};

const authenticate = (form: AuthForm, type: AuthType) => {
  return type === 'login' ? login(form) : register(form);
};

const logout = () => {
  return signOut(firebaseAuth);
};

const getUser = async (uid: string) => {
  const docRef = doc(db, 'users', uid);
  const docSnap = await getDoc(docRef);
  return docSnap.data() as User;
};

export { register, login, logout, authenticate, getUser };
