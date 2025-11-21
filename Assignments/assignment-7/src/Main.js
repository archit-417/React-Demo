import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import Navbar from './components/Navbar';
import './styles/App.css';
// Home component
const Home = () => {
    const { user } = useAuth();
    return (
        <div className="home">
            <h1>Welcome to My App</h1>
            {user ? (
                <p>You are logged in as {user.name}. <a href="/dashboard">Go to
                    Dashboard</a></p>
            ) : (
                <p>Please <a href="/login">login</a> to access protected content.</p>
            )}
        </div>
    );
};
// Profile component (example of another protected route)
const Profile = () => {
    const { user } = useAuth();
    return (
        <div className="profile">
            <h1>User Profile</h1>
            <div className="profile-info">
                <p><strong>Name:</strong> {user?.name}</p>
                <p><strong>Email:</strong> {user?.email}</p>
                <p><strong>Role:</strong> {user?.role}</p>
            </div>
        </div>
    );
};
function Main() {
    return (
        <AuthProvider>
            <Router>
                <div className="App">
                    <Navbar />
                    <main className="main-content">
                        <Routes>
                            {/* Public routes */}
                            <Route path="/" element={<Home />} />
                            <Route path="/login" element={<Login />} />
                            {/* Protected routes */}
                            <Route
                                path="/dashboard"
                                element={
                                    <ProtectedRoute>
                                        <Dashboard />
                                    </ProtectedRoute>
                                }
                            />
                            <Route
                                path="/profile"
                                element={
                                    <ProtectedRoute>
                                        <Profile />
                                    </ProtectedRoute>
                                }
                            />
                            {/* Admin route example (role-based) */}
                            <Route
                                path="/admin"
                                element={
                                    <ProtectedRoute requiredRole="admin">
                                        <div className="admin-panel">
                                            <h1>Admin Panel</h1>
                                            <p>This is only accessible to admins.</p>
                                        </div>
                                    </ProtectedRoute>
                                }
                            />
                            {/* Catch all route */}
                            <Route path="*" element={<Navigate to="/" replace />} />
                        </Routes>
                    </main>
                </div>
            </Router>
        </AuthProvider>
    );
}
export default Main;