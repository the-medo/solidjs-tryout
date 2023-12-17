import { AuthForm } from '../types/Form';
import { authenticate, AuthType } from '../api/auth';
import { createSignal } from 'solid-js';
import { FirebaseError } from 'firebase/app';

const useAuth = (authType: AuthType) => {
  const [loading, setLoading] = createSignal(false);

  const authUser = async (form: AuthForm) => {
    setLoading(true);
    try {
      await authenticate(form, authType);
    } catch (error) {
      const message = (error as FirebaseError).message;
      console.error(message);
    } finally {
      setLoading(false);
    }
  };

  return { authUser, loading };
};
export default useAuth;
