import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/Providers/AuthProvider';


interface ProtectedRouteProps {
  children: ReactNode;
  requiredRole: string;
}

const ProtectedRoute = ({ children, requiredRole }: ProtectedRouteProps) => {
  const { isAuthenticated, user, isLoading } = useAuth();
  
  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">
      <div className="w-12 h-12 border-4 rounded-full border-t-blue-500 border-b-blue-700 animate-spin"></div>
    </div>;
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }
  
  if (requiredRole && user?.role !== requiredRole) {
    const roleRouteMap = {
      'ADMIN': '/admin',
      'AGENT': '/agent',
      'REP': '/rep'
    };
    
    return <Navigate to={roleRouteMap[user?.role as keyof typeof roleRouteMap] || '/'} replace />;
  }
  
  return <>{children}</>;
};

export default ProtectedRoute;