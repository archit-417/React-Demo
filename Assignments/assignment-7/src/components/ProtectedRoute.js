import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
const ProtectedRoute = ({ children, requiredRole = null }) => {
    const { user, loading, isTokenExpiringSoon } = useAuth();
    const location = useLocation();
    if (loading) {
        return (
            <div className="loading-container">
                <div className="loading-spinner"></div>
                <p>Checking authentication...</p>
            </div>
        );
    }
    // Redirect to login if not authenticated
    if (!user) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }
    // Check role-based access
    if (requiredRole && user.role !== requiredRole) {
        return (
            <div className="access-denied">
                <h2>Access Denied</h2>
                <p>You don't have permission to access this page.</p>
            </div>
        );
    }
    // Show token expiry warning
    if (isTokenExpiringSoon()) {
        console.warn('Token expiring soon');
    }
    return children;
};
export default ProtectedRoute;