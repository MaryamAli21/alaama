import React, { useState } from 'react';
import { Eye, EyeOff, LogIn } from 'lucide-react';
import { apiService } from '../../services/api';

const AdminLogin = ({ onLoginSuccess }) => {
  const [credentials, setCredentials] = useState({
    username: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await apiService.login(credentials);
      
      if (response.access_token) {
        onLoginSuccess();
      }
    } catch (err) {
      setError(err.response?.data?.detail || 'Login failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-bg-page flex items-center justify-center p-4">
      <div className="bg-bg-card border border-border-medium rounded-lg p-8 w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-brand-primary rounded-full flex items-center justify-center mx-auto mb-4">
            <LogIn size={32} className="text-text-inverse" />
          </div>
          <h1 className="heading-3 mb-2">Admin Login</h1>
          <p className="body-small text-text-secondary">
            Access the Alaama CMS dashboard
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-900 border border-red-700 rounded-lg p-4 mb-6">
            <p className="body-small text-red-100">{error}</p>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="username" className="body-small font-medium text-text-primary block mb-2">
              Username
            </label>
            <input
              type="text"
              id="username"
              name="username"
              value={credentials.username}
              onChange={handleChange}
              required
              className="w-full p-4 bg-bg-page border border-border-medium rounded-lg text-text-primary placeholder-text-muted focus:border-brand-primary focus:outline-none transition-colors"
              placeholder="Enter your username"
            />
          </div>

          <div>
            <label htmlFor="password" className="body-small font-medium text-text-primary block mb-2">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                name="password"
                value={credentials.password}
                onChange={handleChange}
                required
                className="w-full p-4 pr-12 bg-bg-page border border-border-medium rounded-lg text-text-primary placeholder-text-muted focus:border-brand-primary focus:outline-none transition-colors"
                placeholder="Enter your password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-text-secondary hover:text-text-primary transition-colors"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading || !credentials.username || !credentials.password}
            className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-text-inverse border-t-transparent rounded-full animate-spin"></div>
                Logging in...
              </>
            ) : (
              <>
                <LogIn size={16} />
                Login to CMS
              </>
            )}
          </button>
        </form>

        {/* Default Credentials Info */}
        <div className="mt-8 p-4 bg-bg-page border border-border-medium rounded-lg">
          <h3 className="body-medium font-semibold text-text-primary mb-2">
            Default Credentials (Development)
          </h3>
          <p className="body-small text-text-secondary mb-2">
            Username: <span className="text-brand-primary font-mono">admin</span>
          </p>
          <p className="body-small text-text-secondary">
            Password: <span className="text-brand-primary font-mono">admin123</span>
          </p>
          <p className="body-small text-yellow-400 mt-2">
            ⚠️ Change these credentials in production!
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;