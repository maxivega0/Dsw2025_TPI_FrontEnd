import { Navigate } from "react-router-dom";
import useAuth from "../../auth/hook/useAuth";

function PublicRoute({ children }) {
  const { isAuthenticated } = useAuth();
  const role = localStorage.getItem('role');

  if (isAuthenticated && role === 'Admin') {
    return <Navigate to="/admin/home" />;
  }else{
    if (isAuthenticated && role !== 'Admin'){
      return <Navigate to="/" />;
    }
  }
  
  return children;
}

export default PublicRoute;
