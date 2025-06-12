import React, { useState, useEffect } from 'react';
import LoginPage from './app/login/login';
import SignupPage from './app/sigup/signup';
import DashboardPage from './app/dashboard/dashboard';
import ForgotPasswordPage from './app/forgotpage/forgotpage';


// Main App Component
const App = () => {
  const [currentPage, setCurrentPage] = useState('login');
  const [user, setUser] = useState(null);

  // Check token on load to stay logged in
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    if (token && storedUser) {
      setUser(JSON.parse(storedUser));
      setCurrentPage('dashboard');
    }
  }, []);

  const navigate = (page) => {
    setCurrentPage(page);
  };

  const handleLogin = (userData) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('token', userData.token); // Adjust key as needed
    navigate('dashboard');
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    navigate('login');
  };

  return (
    <div className="min-h-screen bg-gray-50 overflow-hidden">
      <div className="relative w-full h-full">
        {/* Login Page */}
        <div className={`absolute inset-0 transition-all duration-700 ease-in-out transform ${
          currentPage === 'login' 
            ? 'translate-x-0 opacity-100 scale-100' 
            : currentPage === 'signup' 
              ? '-translate-x-full opacity-0 scale-95'
              : 'translate-x-full opacity-0 scale-95'
        }`}>
          {currentPage === 'login' && (
            <LoginPage onNavigate={navigate} onLogin={handleLogin} />
          )}
        </div>

        {/* Signup Page */}
        <div className={`absolute inset-0 transition-all duration-700 ease-in-out transform ${
          currentPage === 'signup' 
            ? 'translate-x-0 opacity-100 scale-100' 
            : currentPage === 'login'
              ? 'translate-x-full opacity-0 scale-95'
              : '-translate-x-full opacity-0 scale-95'
        }`}>
          {currentPage === 'signup' && (
            <SignupPage onNavigate={navigate} onLogin={handleLogin} />
          )}
        </div>

        {/* Forgot Password Page */}
<div className={`absolute inset-0 transition-all duration-700 ease-in-out transform ${
  currentPage === 'forgot'
    ? 'translate-x-0 opacity-100 scale-100'
    : 'translate-y-full opacity-0 scale-95'
}`}>
  {currentPage === 'forgot' && (
    <ForgotPasswordPage onNavigate={navigate} />
  )}
</div>

        {/* Dashboard Page */}
        <div className={`absolute inset-0 transition-all duration-700 ease-in-out transform ${
          currentPage === 'dashboard' 
            ? 'translate-x-0 opacity-100 scale-100' 
            : 'translate-y-full opacity-0 scale-95'
        }`}>
          {currentPage === 'dashboard' && (
            <DashboardPage user={user} onLogout={handleLogout} />
          )}
        </div>
      </div>
    </div>
  );
};

export default App;