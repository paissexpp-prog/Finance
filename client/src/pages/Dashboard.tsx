import { useAuth } from '@/contexts/AuthContext';
import { useLocation } from 'wouter';
import { useEffect } from 'react';
import { DashboardLayout } from '@/components/DashboardLayout';

/**
 * Dashboard Page - Main entry point after login
 * Routes to different dashboards based on user role
 */
export default function Dashboard() {
  const { user, isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (!isAuthenticated) {
      setLocation('/login');
    }
  }, [isAuthenticated, setLocation]);

  if (!user) {
    return null;
  }

  return <DashboardLayout />;
}
