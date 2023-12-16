import { RegisterForm } from '../types/Form';
import { register } from '../api/auth';

const useRegister = () => {
  const registerUser = async (registerForm: RegisterForm) => {
    const user = await register(registerForm);
    console.log(user);
    window.location.reload();
  };

  return { registerUser };
};

export default useRegister;
