import { AuthForm } from '../types/Form';
import { authenticate, AuthType } from '../api/auth';
import { createSignal } from 'solid-js';
import { FirebaseError } from 'firebase/app';
import { useUIDispatch } from '../context/ui';

const useAuth = (authType: AuthType) => {
  const [loading, setLoading] = createSignal(false);
  const { addSnackbar } = useUIDispatch();

  const authUser = async (form: AuthForm) => {
    setLoading(true);
    try {
      await authenticate(form, authType);
      addSnackbar({
        message: 'Logged in!',
        type: 'success',
      });
    } catch (error) {
      const message = (error as FirebaseError).message;
      console.error(message);
      addSnackbar({
        message: message,
        type: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  return { authUser, loading };
};
export default useAuth;
