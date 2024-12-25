import { Navigate, Outlet } from 'react-router-dom';

const AuthGuard = () => {
  const token = localStorage.getItem("token");

  if (!token) {
    // Redirect to login if no token exists
    return <Navigate to="/auth/login" replace />;
  }

  return <Outlet />;
};


export default AuthGuard;