import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';

interface ProtectedAdminRouteProps {
  children: React.ReactNode;
}

export function ProtectedAdminRoute({ children }: ProtectedAdminRouteProps) {
  const { currentUser, isAdmin, loading, roleLoading } = useAuth();
  const { toast } = useToast();
  const [hasChecked, setHasChecked] = useState(false);

  useEffect(() => {
    if (!loading && !roleLoading && currentUser && !isAdmin && !hasChecked) {
      toast({
        title: 'Access Denied',
        description: 'You do not have permission to access this area.',
        variant: 'destructive',
      });
      setHasChecked(true);
    }
  }, [loading, roleLoading, currentUser, isAdmin, hasChecked, toast]);

  // Show loading spinner while checking auth and role
  if (loading || roleLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // Not authenticated - redirect to home
  if (!currentUser) {
    return <Navigate to="/" replace />;
  }

  // Authenticated but not admin - redirect to feed
  if (!isAdmin) {
    return <Navigate to="/feed" replace />;
  }

  // Authenticated and admin - render children
  return <>{children}</>;
}
