import { Navigate } from 'react-router-dom';
import useAuth from '../hook/useAuth';

function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to='/login' />;
  }else if (localStorage.getItem('role') !== 'Admin' ){
    return <Navigate to='/' />;
  }else if (localStorage.getItem('role') === 'Admin' && (window.location.pathname === '/login' || window.location.pathname === '/register')){
    return <Navigate to='/admin/home' />;
  }

  return children;
};

export default ProtectedRoute;
