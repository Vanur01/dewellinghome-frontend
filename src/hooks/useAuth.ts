import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/auth.store';

export const useAuth = (requireAuth: boolean = true) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, isLoading, user } = useAuthStore();

  useEffect(() => {
    // Skip if still loading
    if (isLoading) return;

    // If authentication is required and user is not authenticated
    // if (requireAuth && !isAuthenticated) {
    //   navigate('/login', { 
    //     replace: true,
    //     state: { from: location.pathname }
    //   });
    // }

    // If user is authenticated and trying to access auth pages
    if (isAuthenticated && ['/login', '/register'].includes(location.pathname)) {
      navigate('/', { replace: true });
    }
  }, [isAuthenticated, isLoading, requireAuth, navigate, location]);

  return {
    isAuthenticated,
    isLoading,
    user,
  };
};

export default useAuth; 