import { AuthForm } from '../types/Form';
import { login } from '../api/auth';

const useLogin = () => {
  const loginUser = async (loginForm: AuthForm) => {
    const user = await login(loginForm);
    console.log(user);
    window.location.reload();
  };

  return { loginUser };
};

export default useLogin;
