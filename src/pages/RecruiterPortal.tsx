import React from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Sidebar from '../components/Sidebar';
import LoadingSpinner from '../components/LoadingSpinner';

const RecruiterPortal: React.FC = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  React.useEffect(() => {
    // Only redirect if we're done loading and the user is definitely not a recruiter
    if (!loading && user && user.role !== 'recruiter') {
      navigate('/dashboard');
    }
  }, [user, loading, navigate]);

  // Show loading spinner while authentication is being checked
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  // If no user after loading, redirect to login
  if (!user) {
    navigate('/login');
    return null;
  }

  // If user is not a recruiter, redirect to appropriate dashboard
  if (user.role !== 'recruiter') {
    navigate('/dashboard');
    return null;
  }

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar />
      <main className="flex-1 overflow-y-auto">
        <div className="p-8">
          {/* Child routes like the dashboard, jobs page, etc., will be rendered here */}
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default RecruiterPortal;
