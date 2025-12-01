import { Navigate } from "react-router-dom";
import useAuth from "../hook/useAuth";

function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth();
  const role = localStorage.getItem("role");

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  } else if (role !== "Admin") {
    return <Navigate to="/" />;
  }

  return children;
}

export default ProtectedRoute;
