import { useEffect, useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../Providers/AuthProvider';
import LoadingSplash from './LoadingSplash';

const AuthGuard = () => {
  const { isLoading, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [showLoading, setShowLoading] = useState(false);

  useEffect(() => {
    if (!isLoading) {
      const token = sessionStorage.getItem('authToken');
      const userRole = sessionStorage.getItem('userRole');
      
      if (token && userRole) {
        const currentPath = location.pathname;
        
        const isNavigatingAfterLogin = 
          (currentPath === '/' || currentPath === '/login') && 
          (userRole === 'ADMIN' || userRole === 'AGENT' || userRole === 'REP');
        
        if (isNavigatingAfterLogin) {
          setShowLoading(true);
        }
        
        const roleRouteMap = {
          'ADMIN': '/admin',
          'AGENT': '/agent',
          'REP': '/rep'
        };
        
        const correctRoute = roleRouteMap[userRole as keyof typeof roleRouteMap] || '/';
        
        const isAccessingWrongArea = 
          (currentPath.startsWith('/admin') && userRole !== 'ADMIN') ||
          (currentPath.startsWith('/agent') && userRole !== 'AGENT') ||
          (currentPath.startsWith('/rep') && userRole !== 'REP');
        
        if (isNavigatingAfterLogin || isAccessingWrongArea) {
          navigate(correctRoute, { replace: true });
          
          setTimeout(() => {
            setShowLoading(false);
          }, 800);
        }
      }
    }
  }, [isLoading, navigate, location.pathname, user]);

  if (isLoading || showLoading) {
    return <LoadingSplash />;
  }

  return <Outlet />;
};

export default AuthGuard;