import { createSignal, onMount } from 'solid-js';
import { User } from '../types/User';
import * as api from '../api/user';
import { FirebaseError } from 'firebase/app';
import { useUIDispatch } from '../context/ui';
import { useAuthDispatch, useAuthState } from '../context/auth';

const useUsers = () => {
  const { user } = useAuthState()!;
  const { updateUser } = useAuthDispatch()!;
  const { addSnackbar } = useUIDispatch();
  const [users, setUsers] = createSignal<User[]>([]);
  const [loading, setLoading] = createSignal(true);
  const [loadingFollow, setLoadingFollow] = createSignal(false);

  const loadUsers = async () => {
    try {
      const users = await api.getUsers(user);
      setUsers(users);
    } catch (error) {
      const message = (error as FirebaseError).message;
      addSnackbar({ message, type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const followUser = async (followingUser: User) => {
    setLoadingFollow(true);
    try {
      if (!user) {
        throw new Error('You are not authenticated!');
      }

      if (user.following.find((following) => following.id === followingUser.uid)) {
        throw new Error('You already follow this user');
      }

      const followingRef = await api.followUser(user.uid, followingUser.uid);

      updateUser({
        followingCount: user.followingCount + 1,
        following: [followingRef, ...user.following],
      });

      setUsers((_users) => {
        return [];
      });

      addSnackbar({ message: `You started following ${followingUser.nickName}`, type: 'success' });
    } catch (error) {
      const message = (error as FirebaseError).message;
      addSnackbar({ message, type: 'error' });
    } finally {
      setLoadingFollow(false);
    }
  };

  onMount(() => {
    loadUsers();
  });

  return {
    loading,
    users,
    followUser,
    loadingFollow,
  };
};

export default useUsers;
