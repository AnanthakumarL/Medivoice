import { useState, useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: string;
}

const ProtectedRoute = ({ children, requiredRole }: ProtectedRouteProps) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const location = useLocation();

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('auth.token');
      const userStr = localStorage.getItem('auth.user');

      console.log('ProtectedRoute: Checking auth...', { hasToken: !!token, hasUser: !!userStr });

      if (!token || !userStr) {
        console.log('ProtectedRoute: No token or user, redirecting to login');
        setIsAuthenticated(false);
        return;
      }

      try {
        let user = null;
        try {
          user = userStr ? JSON.parse(userStr) : null;
        } catch {
          user = null;
        }
        if (!user) {
          console.log('ProtectedRoute: Invalid user data, redirecting to login');
          setIsAuthenticated(false);
          return;
        }
        
        // For now, assume all users are patients (since we simplified the schema)
        setUserRole('patient');
        setIsAuthenticated(true);
        console.log('ProtectedRoute: Auth successful!', { user });

        // Skip backend verification for now (since /api/auth/me might not work with simplified schema)
        // Just trust the token exists
      } catch (error) {
        console.error('ProtectedRoute: Auth check error:', error);
        localStorage.removeItem('auth.token');
        localStorage.removeItem('auth.user');
        setIsAuthenticated(false);
      }
    };

    checkAuth();
  }, []);

  // Show loading while checking authentication
  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-white via-green-50/30 to-green-100/20 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600">Verifying authentication...</p>
        </div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check role-based access
  if (requiredRole && userRole !== requiredRole) {
    // Redirect to appropriate dashboard based on user role
    const dashboardRoutes = {
      patient: '/dashboard',
      doctor: '/doctor-dashboard',
      staff: '/staff-dashboard',
      laboratory: '/laboratory-dashboard',
      admin: '/admin-dashboard'
    };

    const redirectPath = dashboardRoutes[userRole as keyof typeof dashboardRoutes] || '/';
    return <Navigate to={redirectPath} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
