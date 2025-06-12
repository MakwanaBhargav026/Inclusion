import React, { useState } from 'react';
import { Eye, EyeOff, User, Lock, Mail, UserPlus } from 'lucide-react';
import './signup.css';

const Signup = ({ onNavigate, onLogin }) => {
  const [currentPage, setCurrentPage] = useState('login');
  const [user, setUser] = useState(null);

  // Login state
  const [showPassword, setShowPassword] = useState(false);
  const [loginData, setLoginData] = useState({
    username: '',
    password: '',
    rememberMe: false,
  });
  const [loginError, setLoginError] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);

  // Signup state
  const [showSignupPassword, setShowSignupPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [signupData, setSignupData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    terms: false,
  });
  const [passwordMatch, setPasswordMatch] = useState(true);
  const [signupLoading, setSignupLoading] = useState(false);

  const handleLoginChange = (e) => {
    const { name, value, type, checked } = e.target;
    setLoginData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    if (loginError) setLoginError('');
  };

  const handleSignupChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSignupData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));

    if (name === 'confirmPassword' || name === 'password') {
      const match = name === 'confirmPassword' 
        ? value === signupData.password 
        : signupData.confirmPassword === value || signupData.confirmPassword === '';
      setPasswordMatch(match);
    }
  };

  const handleLogin = async () => {
    setLoginLoading(true);
    setLoginError('');

    await new Promise(resolve => setTimeout(resolve, 1500));

    if (loginData.username === 'admin' && loginData.password === 'admin') {
      setUser({ username: loginData.username, name: 'Administrator' });
    } else {
      setLoginError('Invalid credentials. Use "admin" for both username and password.');
    }
    setLoginLoading(false);
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    if (signupData.password !== signupData.confirmPassword) {
      setPasswordMatch(false);
      return;
    }

    URL=import.meta.env.VITE_API_BASE_URL;
    const API_URL = URL;

    setSignupLoading(true);
      try {
   const response = await fetch(`${URL}/signup`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    name: signupData.name,
    email: signupData.email,
    password: signupData.password
  })
});

    const data = await response.json();

    if (!response.ok) {
      alert(data.message || "Signup failed");
      setSignupLoading(false);
      return;
    }

    // Redirect to dashboard with user data
    onLogin({ name: signupData.name, email: signupData.email });


      setUser({ email: data.user.email, name: data.user.name });
    } catch (err) {
      alert(err.message);
    }
    setSignupLoading(false);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && currentPage === 'login') {
      handleLogin();
    }
  };


  if (user) {
    return (
      <div className="welcome-container">
        <div className="welcome-card">
          <h1 className="welcome-heading">Welcome!</h1>
          <p>Logged in as: {user.name || user.email}</p>
          <button 
            onClick={() => setUser(null)}
            className="logout-btn"
          >
            Logout
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      {currentPage === 'login' ? (
        <div className="login-container">
          <div className="background-overlay">
            <div className="bg-element-1"></div>
            <div className="bg-element-2"></div>
            <div className="bg-element-3"></div>
            <div className="bg-element-4"></div>
          </div>
          
          <div className="login-content">
            <div className="floating-wrapper">
              <div className="card-3d">
                <div className="glassmorphism-overlay"></div>

                <div className="card-content">
                  <div className="header-section">
                    <div className="avatar-icon">
                      <User style={{ width: '2rem', height: '2rem', color: 'white' }} />
                    </div>
                    <h1 className="welcome-title">Welcome Back</h1>
                    <p className="welcome-subtitle">Sign in to access your dashboard</p>
                  </div>

                  {loginError && (
                    <div className="error-message">
                      {loginError}
                    </div>
                  )}

                  <div className="form-container">
                    <div className="form-field">
                      <label className="field-label">
                        <User style={{ width: '1rem', height: '1rem' }} />
                        Email
                      </label>
                      <div className="input-wrapper">
                        <input
                          name="username"
                          type="text"
                          placeholder="Enter Email"
                          value={loginData.email}
                          onChange={handleLoginChange}
                          onKeyPress={handleKeyPress}
                          className="form-input"
                        />
                      </div>
                    </div>

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
                          value={loginData.password}
                          onChange={handleLoginChange}
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

                    <div className="remember-section">
                      <div className="remember-checkbox-wrapper">
                        <input
                          name="rememberMe"
                          type="checkbox"
                          checked={loginData.rememberMe}
                          onChange={handleLoginChange}
                          className="remember-checkbox"
                        />
                        <label className="remember-label">Remember me</label>
                      </div>
                      <button type="button" className="forgot-password-btn">
                        Forgot password?
                      </button>
                    </div>

                    <button
                      onClick={handleLogin}
                      disabled={loginLoading}
                      className="submit-btn"
                    >
                      <span className="btn-content">
                        {loginLoading ? (
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

                  <div className="navigation-section">
                    <div className="navigation-text">
                      Don't have an account?{" "}
                      <button
                        onClick={() => setCurrentPage('signup')}
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
      ) : (
        <div className="signup-container">
          <div className="background-overlay">
            <div className="bg-element-1"></div>
            <div className="bg-element-2"></div>
            <div className="bg-element-3"></div>
            <div className="bg-element-4"></div>
          </div>

          <div className="signup-content">
            <div className="floating-wrapper">
              <div className="card-3d">
                <div className="glassmorphism-overlay"></div>
                
                <div className="card-content">
                  <div className="header-section">
                    <div className="avatar-icon">
                      <UserPlus size={32} color="white" />
                    </div>
                    <h1 className="welcome-title">Create Account</h1>
                    <p className="welcome-subtitle">Join Inclusion Analyzer today</p>
                  </div>

                  {!passwordMatch && (
                    <div className="error-message">
                      Passwords do not match
                    </div>
                  )}

                  <div className="form-container">
                    <div className="form-field">
                      <label className="field-label">
                        <User size={16} />
                        Full Name
                      </label>
                      <div className="input-wrapper">
                        <input
                          name="name"
                          type="text"
                          placeholder="Enter your full name"
                          value={signupData.name}
                          onChange={handleSignupChange}
                          className="form-input"
                          required
                        />
                      </div>
                    </div>

                    <div className="form-field">
                      <label className="field-label">
                        <Mail size={16} />
                        Email Address
                      </label>
                      <div className="input-wrapper">
                        <input
                          name="email"
                          type="email"
                          placeholder="Enter your email"
                          value={signupData.email}
                          onChange={handleSignupChange}
                          className="form-input"
                          required
                        />
                      </div>
                    </div>

                    <div className="form-field">
                      <label className="field-label">
                        <Lock size={16} />
                        Password
                      </label>
                      <div className="input-wrapper">
                        <input
                          name="password"
                          type={showSignupPassword ? 'text' : 'password'}
                          placeholder="Create a strong password"
                          value={signupData.password}
                          onChange={handleSignupChange}
                          className="form-input password-input"
                          required
                        />
                        <button
                          type="button"
                          className="password-toggle"
                          onClick={() => setShowSignupPassword(!showSignupPassword)}
                        >
                          {showSignupPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                        </button>
                      </div>
                    </div>

                    <div className="form-field">
                      <label className="field-label">
                        <Lock size={16} />
                        Confirm Password
                      </label>
                      <div className="input-wrapper">
                        <input
                          name="confirmPassword"
                          type={showConfirmPassword ? 'text' : 'password'}
                          placeholder="Confirm your password"
                          value={signupData.confirmPassword}
                          onChange={handleSignupChange}
                          className={`form-input password-input ${!passwordMatch ? 'error-input' : ''}`}
                          required
                        />
                        <button
                          type="button"
                          className="password-toggle"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        >
                          {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                        </button>
                      </div>
                    </div>

                    <div className="remember-section">
                      <div className="remember-checkbox-wrapper">
                        <input
                          name="terms"
                          type="checkbox"
                          checked={signupData.terms}
                          onChange={handleSignupChange}
                          className="remember-checkbox"
                          required
                        />
                        <label className="remember-label">
                          I agree to the{' '}
                          <span className="forgot-password-btn" style={{cursor: 'pointer'}}>Terms of Service</span> and{' '}
                          <span className="forgot-password-btn" style={{cursor: 'pointer'}}>Privacy Policy</span>
                        </label>
                      </div>
                    </div>

                    <button 
                      onClick={handleSignup}
                      className="submit-btn" 
                      disabled={signupLoading || !signupData.terms}
                    >
                      <div className="btn-content">
                        {signupLoading && <div className="loading-spinner"></div>}
                        {signupLoading ? 'Creating Account...' : 'Create Account'}
                      </div>
                    </button>
                  </div>

                  <div className="navigation-section">
                    <p className="navigation-text">
                      Already have an account?{' '}
                      <button 
                        onClick={() => setCurrentPage('login')} 
                        className="signup-link"
                      >
                        Sign in
                      </button>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Signup;