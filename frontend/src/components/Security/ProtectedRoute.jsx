import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { LoadingScreen } from '../Common/LoadingScreen';

export const ProtectedRoute = ({ children, allowedRoles }) => {
  const { isAuthenticated, user, loading, hasRole } = useAuth();
  const location = useLocation();

  if (loading) {
    return <LoadingScreen message="Authenticating session..." />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && !hasRole(allowedRoles)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};
