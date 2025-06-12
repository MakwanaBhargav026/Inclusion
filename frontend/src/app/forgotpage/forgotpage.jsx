import React, { useState } from 'react';
import { Lock, User } from 'lucide-react';
import '../login/login.css';

const ForgotPage = ({ onNavigate }) => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/update-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (response.ok) {
        onNavigate('dashboard');
      } else {
        setError(data.message || 'Failed to reset password');
      }
    } catch (err) {
      console.error(err);
      setError('Server error');
    } finally {
      setLoading(false);
    }
  };

  return (
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
                  <Lock style={{ width: '2rem', height: '2rem', color: 'white' }} />
                </div>
                <h1 className="welcome-title">Reset Password</h1>
                <p className="welcome-subtitle">Update your password securely</p>
              </div>

              {error && <div className="error-message">{error}</div>}

              <div className="form-container">
                <div className="form-field">
                  <label className="field-label">
                    <User style={{ width: '1rem', height: '1rem' }} /> Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    placeholder="Enter your name"
                    value={formData.name}
                    onChange={handleChange}
                    className="form-input"
                  />
                </div>

                <div className="form-field">
                  <label className="field-label">
                    <User style={{ width: '1rem', height: '1rem' }} /> Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={handleChange}
                    className="form-input"
                  />
                </div>

                <div className="form-field">
                  <label className="field-label">
                    <Lock style={{ width: '1rem', height: '1rem' }} /> New Password
                  </label>
                  <input
                    type="password"
                    name="password"
                    placeholder="Enter new password"
                    value={formData.password}
                    onChange={handleChange}
                    className="form-input"
                  />
                </div>

                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="submit-btn"
                >
                  <span className="btn-content">
                    {loading ? 'Updating...' : 'Reset Password'}
                  </span>
                </button>
              </div>

              <div className="navigation-section">
                <div className="navigation-text">
                  Back to{' '}
                  <button
                    onClick={() => onNavigate && onNavigate('login')}
                    className="signup-link"
                  >
                    Login
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

export default ForgotPage;