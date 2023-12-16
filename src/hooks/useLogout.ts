import { logout } from '../api/auth';

const useLogout = () => {
  const logoutUser = async () => {
    try {
      await logout();
      window.location.reload();
    } catch (error) {
      console.error(error);
    }
  };

  return { logoutUser };
};

export default useLogout;
