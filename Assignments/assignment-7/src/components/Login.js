import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { login, user } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    // Redirect if already logged in
    useEffect(() => {
        if (user) {
            const from = location.state?.from?.pathname || '/dashboard';
            navigate(from, { replace: true });
        }
    }, [user, navigate, location]);
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);
        const result = await login(email, password);
        if (result.success) {
            const from = location.state?.from?.pathname || '/dashboard';
            navigate(from, { replace: true });
        } else {
            setError(result.error);
        }
        setIsLoading(false);
    };
    // Demo credentials helper
    const fillDemoCredentials = () => {
        setEmail('archit@example.com');
        setPassword('password');
    };
    return (
        <div className="login-container">
            <div className="login-form">
                <h2>Login</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="email">Email:</label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            disabled={isLoading}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">Password:</label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            disabled={isLoading}
                        />
                    </div>
                    {error && <div className="error-message">{error}</div>}
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="login-btn"
                    >
                        {isLoading ? 'Logging in...' : 'Login'}
                    </button>
                    <div className="demo-credentials">
                        <p>Demo Credentials:</p>
                        <button
                            type="button"
                            onClick={fillDemoCredentials}
                            className="demo-btn"
                        >
                            Fill Demo Credentials
                        </button>
                        <p>Email: archit@example.com</p>
                        <p>Password: password</p>
                    </div>
                </form>
            </div>
        </div>
    );
};
export default Login;