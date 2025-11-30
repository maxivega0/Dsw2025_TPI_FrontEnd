import { Navigate } from 'react-router-dom';
import useAuth from '../hook/useAuth';

function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to='/login' />;
  }else if (localStorage.getItem('role') !== 'Admin'){
    return <Navigate to='/' />;
  }

  return children;
};

export default ProtectedRoute;
