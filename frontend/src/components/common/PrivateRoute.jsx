import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';

// Pass e.g. <PrivateRoute roles={['admin']} /> to additionally restrict a
// group of routes to a specific role. With no roles prop, any logged-in
// user is allowed through.
const PrivateRoute = ({ roles }) => {
  const { userInfo } = useSelector((state) => state.auth);

  if (!userInfo) {
    return <Navigate to="/login" replace />;
  }

  if (roles && !roles.includes(userInfo.role)) {
    return <Navigate to="/home" replace />;
  }

  return <Outlet />;
};

export default PrivateRoute;