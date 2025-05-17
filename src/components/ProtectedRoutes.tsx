import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useAuthStore } from '../store/auth.store';
import LoadingScreen from './LoadingScreen';

type Props = {
  allowedRoles?: string[]; // e.g. ['admin'], ['client']
};

const ProtectedRoute = ({ allowedRoles }: Props) => {
  const location = useLocation();
  const { isAuthenticated, isLoading, user, restoreSession } = useAuthStore();
  const [restored, setRestored] = useState(false);

  useEffect(() => {
    const init = async () => {
      try {
        await restoreSession();
      } finally {
        setRestored(true);
      }
    };
    if (!isAuthenticated) {
      init();
    } else {
      setRestored(true);
    }
  }, []);

  if (isLoading || !restored) {
    return <LoadingScreen />;
  }

  if (!isAuthenticated) {
    return (
      <Navigate
        to="/unauthorized"
        replace
        state={{ from: location.pathname, reason: 'notLoggedIn' }}
      />
    );
  }

  if (allowedRoles && !allowedRoles.includes(user?.role)) {
    const reason =
      user?.role === 'admin' ? 'notClient' :
      user?.role === 'client' ? 'notAdmin' :
      'unauthorized';

    return (
      <Navigate
        to="/unauthorized"
        replace
        state={{ from: location.pathname, reason }}
      />
    );
  }

  return <Outlet />;
};

export default ProtectedRoute;
