import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
const Navbar = () => {
    const { user, logout, isTokenExpiringSoon } = useAuth();
    const handleLogout = () => {
        if (window.confirm('Are you sure you want to logout?')) {
            logout();
        }
    };
    return (
        <nav className="navbar">
            <div className="nav-brand">
                <Link to="/">My App</Link>
            </div>
            <div className="nav-links">
                {user ? (
                    <>
                        <Link to="/dashboard">Dashboard</Link>
                        <Link to="/profile">Profile</Link>
                        {isTokenExpiringSoon() && (
                            <span className="token-warning-badge"> </span>
                        )}
                        <button onClick={handleLogout} className="nav-logout-btn">
                            Logout ({user.name})
                        </button>
                    </>
                ) : (
                    <>
                        <Link to="/login">Login</Link>
                        <Link to="/register">Register</Link>
                    </>
                )}
            </div>
        </nav>
    );
};
export default Navbar;