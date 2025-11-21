import React, { createContext, useState, useContext, useEffect } from 'react';
const AuthContext = createContext();
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    // Check for existing token on app start
    useEffect(() => {
        const checkAuth = () => {
            const token = localStorage.getItem('token');
            const userData = localStorage.getItem('user');
            const tokenExpiry = localStorage.getItem('tokenExpiry');
            if (token && userData && tokenExpiry) {
                // Check if token is expired
                if (Date.now() > parseInt(tokenExpiry)) {
                    logout();
                } else {
                    setUser(JSON.parse(userData));
                    // Set auto-logout when token expires
                    const timeUntilExpiry = parseInt(tokenExpiry) - Date.now();
                    setTimeout(logout, timeUntilExpiry);
                }
            }
            setLoading(false);
        };
        checkAuth();
    }, []);
    // Mock login function - replace with actual API call
    const login = async (email, password) => {
        try {
            setLoading(true);
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000));
            // Mock validation
            if (email === 'archit@example.com' && password === 'password') {
                const userData = {
                    id: 1,
                    email: email,
                    name: 'Archit Srivastava',
                    role: 'user'
                };
                const token = 'mock_jwt_token_' + Date.now();
                const tokenExpiry = Date.now() + (30 * 60 * 1000); // 30 minutes
                // Store in localStorage
                localStorage.setItem('token', token);
                localStorage.setItem('user', JSON.stringify(userData));
                localStorage.setItem('tokenExpiry', tokenExpiry.toString());
                setUser(userData);
                // Set auto-logout
                setTimeout(logout, 30 * 60 * 1000);
                return { success: true };
            } else {
                return { success: false, error: 'Invalid credentials' };
            }
        } catch (error) {
            return { success: false, error: 'Login failed' };
        } finally {
            setLoading(false);
        }
    };
    const logout = () => {
        // Clear localStorage
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('tokenExpiry');
        // Clear state
        setUser(null);
        console.log('User logged out');
    };
    // Check if token is about to expire (within 5 minutes)
    const isTokenExpiringSoon = () => {
        const tokenExpiry = localStorage.getItem('tokenExpiry');
        if (!tokenExpiry) return true;
        const timeUntilExpiry = parseInt(tokenExpiry) - Date.now();
        return timeUntilExpiry < (5 * 60 * 1000); // 5 minutes
    };
    // Refresh token - mock function
    const refreshToken = async () => {
        try {
            const tokenExpiry = Date.now() + (30 * 60 * 1000); // Another 30 minutes
            localStorage.setItem('tokenExpiry', tokenExpiry.toString());
            // Set new auto-logout
            setTimeout(logout, 30 * 60 * 1000);
            return true;
        } catch (error) {
            console.error('Token refresh failed:', error);
            return false;
        }
    };
    const value = {
        user,
        login,
        logout,
        loading,
        isTokenExpiringSoon,
        refreshToken
    };
    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};