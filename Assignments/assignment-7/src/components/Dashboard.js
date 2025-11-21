import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
const Dashboard = () => {
    const { user, isTokenExpiringSoon, refreshToken, logout } = useAuth();
    const [showTokenWarning, setShowTokenWarning] = useState(false);
    useEffect(() => {
        // Check token expiry on component mount
        if (isTokenExpiringSoon()) {
            setShowTokenWarning(true);
        }
        // Check token expiry every minute
        const interval = setInterval(() => {
            if (isTokenExpiringSoon()) {
                setShowTokenWarning(true);
            }
        }, 60000);
        return () => clearInterval(interval);
    }, [isTokenExpiringSoon]);
    const handleRefreshToken = async () => {
        const success = await refreshToken();
        if (success) {
            setShowTokenWarning(false);
            alert('Token refreshed successfully!');
        } else {
            alert('Failed to refresh token. Please login again.');
            logout();
        }
    };
    const handleLogout = () => {
        if (window.confirm('Are you sure you want to logout?')) {
            logout();
        }
    };
    return (
        <div className="dashboard">
            <div className="dashboard-header">
                <h1>Dashboard</h1>
                <button onClick={handleLogout} className="logout-btn">
                    Logout
                </button>
            </div>
            {showTokenWarning && (
                <div className="token-warning">
                    <h3> Session Expiring Soon</h3>
                    <p>Your session will expire in less than 5 minutes.</p>
                    <button onClick={handleRefreshToken} className="refresh-btn">
                        Refresh Session
                    </button>
                </div>
            )}
            <div className="user-info">
                <h2>Welcome, {user?.name}!</h2>
                <div className="info-card">
                    <p><strong>Email:</strong> {user?.email}</p>
                    <p><strong>Role:</strong> {user?.role}</p>
                    <p><strong>User ID:</strong> {user?.id}</p>
                </div>
            </div>
            <div className="dashboard-content">
                <h3>Protected Content</h3>
                <p>This content is only visible to authenticated users.</p>
                <div className="content-grid">
                    <div className="content-card">
                        <h4>Feature 1</h4>
                        <p>Protected feature for logged-in users.</p>
                    </div>
                    <div className="content-card">
                        <h4>Feature 2</h4>
                        <p>Another protected feature.</p>
                    </div>
                    <div className="content-card">
                        <h4>Feature 3</h4>
                        <p>More exclusive content.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};
export default Dashboard;