import React, { useState } from 'react';
import { Eye, EyeOff, User, Lock } from 'lucide-react';
import './login.css';

const LoginPage = ({ onNavigate, onLogin }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false,
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    if (error) setError('');
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    setError('');

   try {
    const response = await fetch('http://localhost:5000/api/signin', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: formData.email, // Assuming this holds email
        password: formData.password,
      }),
    });

    const data = await response.json();

    if (response.ok) {
      onLogin(data.user); // Navigate to dashboard
    } else {
      setError(data.message || 'Login failed');
    }
  } catch (error) {
    console.error(error);
    setError('Server error');
  } finally {
    setIsLoading(false);
  }
};

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  return (
    <div className="login-container">
      {/* Animated Background Elements */}
      <div className="background-overlay">
        <div className="bg-element-1"></div>
        <div className="bg-element-2"></div>
        <div className="bg-element-3"></div>
        <div className="bg-element-4"></div>
      </div>
      
      <div className="login-content">
        {/* Floating Animation Wrapper */}
        <div className="floating-wrapper">
          {/* 3D Card Effect */}
          <div className="card-3d">
            {/* Glassmorphism overlay */}
            <div className="glassmorphism-overlay"></div>

            <div className="card-content">
              {/* Header with 3D effect */}
              <div className="header-section">
                <div className="avatar-icon">
                  <User style={{ width: '2rem', height: '2rem', color: 'white' }} />
                </div>
                <h1 className="welcome-title">
                  Welcome Back
                </h1>
                <p className="welcome-subtitle">Sign in to access your dashboard</p>
              </div>

              {/* Error Message */}
              {error && (
                <div className="error-message">
                  {error}
                </div>
              )}

              <div className="form-container">
                {/* Username Field */}
                <div className="form-field">
                  <label className="field-label">
                    <User style={{ width: '1rem', height: '1rem' }} />
                    Email
                  </label>
                  <div className="input-wrapper">
                    <input
                      name="email"
                      type="text"
                      placeholder="Enter Email"
                      value={formData.username}
                      onChange={handleChange}
                      onKeyPress={handleKeyPress}
                      className="form-input"
                    />
                  </div>
                </div>

                {/* Password Field */}
                <div className="form-field">
                  <label className="field-label">
                    <Lock style={{ width: '1rem', height: '1rem' }} />
                    Password
                  </label>
                  <div className="input-wrapper">
                    <input
                      name="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter password"
                      value={formData.password}
                      onChange={handleChange}
                      onKeyPress={handleKeyPress}
                      className="form-input password-input"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="password-toggle"
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                </div>

                {/* Remember Me */}
                <div className="remember-section">
                  <div className="remember-checkbox-wrapper">
                    <input
                      name="rememberMe"
                      type="checkbox"
                      checked={formData.rememberMe}
                      onChange={handleChange}
                      className="remember-checkbox"
                    />
                    <label className="remember-label">
                      Remember me
                    </label>
                  </div>
                  <button
                    type="button"
                    className="forgot-password-btn"
                    onClick={() => onNavigate && onNavigate('forgot')}
                  >
                    Forgot password?
                  </button>
                </div>

                {/* Submit Button */}
                <button
                  onClick={handleSubmit}
                  disabled={isLoading}
                  className="submit-btn"
                >
                  <span className="btn-content">
                    {isLoading ? (
                      <>
                        <div className="loading-spinner"></div>
                        Signing In...
                      </>
                    ) : (
                      'Sign In'
                    )}
                  </span>
                </button>
              </div>

              {/* Navigation Link */}
              <div className="navigation-section">
                <div className="navigation-text">
                  Don't have an account?{" "}
                  <button
                    onClick={() => onNavigate && onNavigate('signup')}
                    className="signup-link"
                  >
                    Sign up
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;