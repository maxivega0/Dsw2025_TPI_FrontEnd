import { useContext } from 'react';
import { AuthContext } from '../context/AuthProvider';

const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    new Error('useAuth no debe ser usado por fuera de AuthProvider');
  }

  return {
    isAuthenticated: context.isAuthenticated,
    role: context.role,
    username: context.username,
    singin: context.singin,
    singout: context.singout,
    singup: context.singup,
  };

};

export default useAuth;
