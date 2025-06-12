import React, { useState, useEffect } from 'react';
import {
  AlertCircle, CheckCircle, Users, Search, Globe, Menu, X,
  Sparkles, Zap, BarChart3, AlertTriangle, Target, Home,
  FileText, LogOut, Moon, Sun, Download, Eye, EyeOff,
  Brain, ChevronDown, Code, Link
} from 'lucide-react';
import './dashboard.css';
import logo from '../../assets/Logo.png';
import html2pdf from "html2pdf.js";

const Dashboard = ({ user, onLogout }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [activeTab, setActiveTab] = useState('url');
  const [urlInput, setUrlInput] = useState('');
  const [htmlInput, setHtmlInput] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResults, setAnalysisResults] = useState(null);
  const [showSnippets, setShowSnippets] = useState({});
  const [downloadOpen, setDownloadOpen] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentView, setCurrentView] = useState('dashboard');
  const [typedText, setTypedText] = useState('');
  const [showCursor, setShowCursor] = useState(true);

  useEffect(() => {
    document.documentElement.classList.toggle('dark-mode', darkMode);
    localStorage.setItem('theme', darkMode ? 'dark' : 'light');
  }, [darkMode]);

  // Typing effect for welcome message
  useEffect(() => {
    if (currentView === 'dashboard') {
      const welcomeText = `Welcome to Inclusion`;
      let currentIndex = 0;
      setTypedText('');
      
      const typingInterval = setInterval(() => {
        if (currentIndex < welcomeText.length) {
          setTypedText(welcomeText.slice(0, currentIndex + 1));
          currentIndex++;
        } else {
          clearInterval(typingInterval);
        }
      }, 100);

      const cursorInterval = setInterval(() => {
        setShowCursor(prev => !prev);
      }, 500);

      return () => {
        clearInterval(typingInterval);
        clearInterval(cursorInterval);
      };
    }
  }, [currentView, user?.name]);

  const StatCard = ({ icon: Icon, title, value, subtitle, color, delay }) => (
    <div
      className={`stat-card ${color}`}
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="stat-icon">
        <Icon size={24} />
      </div>
      <div className="stat-content">
        <h3>{title}</h3>
        <p className="stat-value">{value}</p>
        <p className="stat-subtitle">{subtitle}</p>
      </div>
    </div>
  );

  const handleAnalyze = async () => {
    setIsAnalyzing(true);
    setAnalysisResults(null);
    try {
      const payload = activeTab === 'url' ? { url: urlInput } : { code: htmlInput };

      console.log("Sending payload to backend:", payload);

      const res = await fetch("http://localhost:8000/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        const errorText = await res.text();
        console.error("Server error:", res.status, errorText);
        alert(`Server error ${res.status}: ${errorText}`);
        return;
      }

      const data = await res.json();
      console.log("Received response:", data);

      if (data.analysis) {
        setAnalysisResults(data.analysis);
      } else {
        console.warn("No 'analysis' field found in response.");
        alert("Analysis failed. Try again.");
      }

    } catch (error) {
      console.error("Network or parsing error:", error);
      alert("An unexpected error occurred. Check console for details.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleDownloadPDF = async () => {
  let responseData = analysisResults;

  if (!responseData) {
    try {
      const response = await fetch("http://127.0.0.1:8000/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: urlInput }),
      });

      if (!response.ok) throw new Error("API fetch failed");

      responseData = await response.json();
    } catch (error) {
      alert("Failed to fetch analysis data.");
      console.error(error);
      return;
    }
  }

  // Create a container div (but keep it hidden instead of off-screen)
  const tempDiv = document.createElement("div");
  tempDiv.style.visibility = "hidden";
  tempDiv.style.position = "fixed";
  tempDiv.style.top = "0";
  tempDiv.style.left = "0";
  tempDiv.style.backgroundColor = "white";
  tempDiv.style.padding = "20px";
  tempDiv.style.width = "800px"; // A4 width
  tempDiv.style.fontFamily = "Arial, sans-serif";
  document.body.appendChild(tempDiv);

  // Safe fallback values
  const score = responseData?.score ?? "N/A";
  const components = responseData?.components ?? [];

  tempDiv.innerHTML = `
    <h1 style="color:#007bff;">Accessibility Report</h1>
    <p><strong>URL:</strong> ${urlInput || "N/A"}</p>
    <p><strong>Score:</strong> ${score}%</p>

    <h2 style="margin-top:20px;">Component Breakdown:</h2>
    ${components.map(comp => `
      <div style="margin:10px 0; padding:10px; border:1px solid #ccc;">
        <h3>${comp.name} - ${comp.score}%</h3>
        ${comp.issues.length ? comp.issues.map(issue => `
          <div style="margin:5px 0; padding:5px; background:#f9f9f9;">
            <strong>${issue.title}</strong><br/>
            <em>${issue.severity.toUpperCase()}</em><br/>
            ${issue.description}<br/>
            <strong>Fix:</strong> ${issue.suggestion}
          </div>
        `).join("") : "<p>No issues found.</p>"}
      </div>
    `).join("")}
  `;

  // Delay to allow DOM to render fully
  setTimeout(() => {
    html2pdf()
      .set({
        filename: `Accessibility-Report-${new Date().toISOString().split("T")[0]}.pdf`,
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: "mm", format: "a4", orientation: "portrait" }
      })
      .from(tempDiv)
      .save()
      .then(() => document.body.removeChild(tempDiv))
      .catch(err => {
        console.error("PDF generation error", err);
        document.body.removeChild(tempDiv);
      });
  }, 500);
};

  const handleLogout = () => {
    if (onLogout) {
      onLogout();
    }
    setSidebarOpen(false);
  };

  const handleNavigation = (view) => {
    setCurrentView(view);
    setSidebarOpen(false);
  };

  const toggleSnippet = (id) => {
    setShowSnippets(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const getSeverityClass = (severity) => {
    return `issue-card ${severity}`;
  };

  const getSeverityIcon = (severity) => {
    const icons = {
      critical: <AlertCircle className="severity-icon" />,
      moderate: <AlertTriangle className="severity-icon" />,
      minor: <AlertCircle className="severity-icon" />
    };
    return icons[severity] || icons.minor;
  };

  const CircularProgress1 = ({ percentage }) => {
    const strokeDasharray = 282.6;
    const strokeDashoffset = strokeDasharray - (percentage / 100) * strokeDasharray;

    return (
      <svg width="100" height="100" viewBox="0 0 100 100">
        <circle cx="50" cy="50" r="45" stroke="#eee" strokeWidth="10" fill="none" />
        <circle
          cx="50"
          cy="50"
          r="45"
          stroke="#00bfa6"
          strokeWidth="10"
          fill="none"
          strokeDasharray={strokeDasharray}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 1s ease-out' }}
        />
        <text x="50" y="55" textAnchor="middle" fontSize="20" fill="#333">
          {percentage}%
        </text>
      </svg>
    );
  };

  const CircularProgress = ({ percentage }) => {
    const radius = 45;
    const circumference = 2 * Math.PI * radius;
    const strokeDasharray = circumference;
    const strokeDashoffset = circumference - (percentage / 100) * circumference;

    return (
      <div className="circular-progress">
        <svg className="progress-svg" viewBox="0 0 100 100">
          <circle
            cx="50"
            cy="50"
            r={radius}
            stroke="currentColor"
            strokeWidth="8"
            fill="transparent"
            className="progress-bg"
          />
          <circle
            cx="50"
            cy="50"
            r={radius}
            stroke="currentColor"
            strokeWidth="8"
            fill="transparent"
            strokeDasharray={strokeDasharray}
            strokeDashoffset={strokeDashoffset}
            className="progress-bar"
            strokeLinecap="round"
          />
        </svg>
        <div className="progress-text">
          <span>{percentage}%</span>
        </div>
      </div>
    );
  };

  // Render different views based on currentView state
  const renderMainContent = () => {
    switch (currentView) {
      case 'analyze':
        return (
          <div className="view-container">
            <h2 className="view-title">🧠 Analysis WebPage</h2>
            <div className="analyzer-section">
              {/* Left Panel - Input Section */}
              <div className="input-panel">
                <div className="panel-header">
                  <div className="panel-icon">
                    <Brain size={24} />
                  </div>
                  <div className="panel-title">
                    <h2>Website Scanner</h2>
                    <p>Advanced accessibility analysis powered by AI</p>
                  </div>
                </div>

                {/* Tabs */}
                <div className="tabs">
                  <button
                    onClick={() => setActiveTab('url')}
                    className={`tab ${activeTab === 'url' ? 'active' : ''}`}
                  >
                    <Link size={16} />
                    URL Input
                  </button>
                  <button
                    onClick={() => setActiveTab('html')}
                    className={`tab ${activeTab === 'html' ? 'active' : ''}`}
                  >
                    <Code size={16} />
                    HTML Input
                  </button>
                </div>

                {/* Input Content */}
                {activeTab === 'url' ? (
                  <div className="input-section">
                    <label htmlFor="url">🌐 Website URL</label>
                    <div className="input-wrapper">
                      <input
                        id="url"
                        type="url"
                        placeholder="https://example.com"
                        value={urlInput}
                        onChange={(e) => setUrlInput(e.target.value)}
                        className="url-input"
                      />
                      <Globe className="input-icon" size={20} />
                    </div>
                  </div>
                ) : (
                  <div className="input-section">
                    <label htmlFor="html">📝 HTML Code</label>
                    <textarea
                      id="html"
                      placeholder="Paste your HTML code here..."
                      value={htmlInput}
                      onChange={(e) => setHtmlInput(e.target.value)}
                      rows="8"
                      className="html-input"
                    />
                  </div>
                )}

                <button
                  onClick={handleAnalyze}
                  disabled={isAnalyzing || (!urlInput.trim() && !htmlInput.trim())}
                  className="analyze-btn"
                >
                  {isAnalyzing ? (
                    <>
                      <div className="spinner" />
                      Analyzing with AI...
                    </>
                  ) : (
                    <>
                      <Brain size={20} />
                      Start AI Analysis
                      <Sparkles size={20} />
                    </>
                  )}
                </button>

                <p className="disclaimer">
                  Analysis based on WCAG 2.1 AA guidelines
                </p>

                  {isAnalyzing ? (
                  <div className="analyzing-state">
                    <CircularProgress percentage={progress} />
                    <p className="analyzing-title">🔍 AI Analysis in Progress</p>
                    <p className="analyzing-subtitle">Scanning for accessibility issues...</p>
                  </div>
                ) : analysisResults ? (
                  <div className="issues-section">
                      <h3>Issues Found</h3>
                      <div className="issues-list">
                        {analysisResults.components.flatMap((comp) =>
                          comp.issues.map((issue) => (
                            <div key={issue.id} className={getSeverityClass(issue.severity)}>
                              <div className="issue-header">
                                {getSeverityIcon(issue.severity)}
                                <div className="issue-content">
                                  <h4>{issue.title}</h4>
                                  <p className="issue-description">{issue.description}</p>
                                  <button
                                    onClick={() => toggleSnippet(issue.id)}
                                    className="toggle-snippet-btn"
                                  >
                                    {showSnippets[issue.id] ? <EyeOff size={16} /> : <Eye size={16} />}
                                    {showSnippets[issue.id] ? 'Hide' : 'Show'} Code Snippet
                                  </button>
                                  {showSnippets[issue.id] && (
                                    <div className="snippet-section">
                                      <code className="code-snippet">{issue.snippet}</code>
                                      <p className="snippet-location">
                                        <strong>Location:</strong> {issue.location}
                                      </p>
                                    </div>
                                  )}
                                  <div className="suggestion-box">
                                    <p><strong>💡 Fix:</strong> {issue.suggestion}</p>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
              
                ) : (
                  <div className="empty-state">
                    <Target size={64} className="empty-icon" />
                    <p className="empty-title">🚀 Ready to Analyze</p>
                    <p className="empty-subtitle">Enter a website URL or paste HTML code, then click "Start AI Analysis"</p>
                  </div>
                )}

              </div>

              <div className="results-panel">
                {isAnalyzing ? (
                  <div className="analyzing-state">
                    <CircularProgress percentage={progress} />
                    <p className="analyzing-title">🔍 AI Analysis in Progress</p>
                    <p className="analyzing-subtitle">Scanning for accessibility issues...</p>
                    <div className="progress-bar-container">
                      <div className="progress-bar-fill" style={{ width: `${progress}%` }} />
                    </div>
                  </div>
                ) : analysisResults ? (
                  <div className="results-content">
                    {/* Overall Score */}
                    <div className="score-display">
                      <CircularProgress percentage={analysisResults.score} />
                      <p className="score-label">WCAG Compliance Score</p>
                    </div>

                    {/* Individual Component Scores */}
                    <div className="component-scores">
                      {analysisResults.components.map((comp) => (
                        <div key={comp.name} className="component-card">
                          <h3>{comp.name}</h3>
                          <CircularProgress percentage={comp.score} />
                          <p>Score: {comp.score}/100</p>
                        </div>
                      ))}
                    </div>

                    {/* Suggestions Section */}
                    <div className="suggestions">
                      <h3>Suggestions to Improve</h3>
                      {analysisResults.components.map((comp) =>
                        comp.issues.map((issue) => (
                          <div key={issue.id} className="suggestion-card">
                            <h4>{comp.name}</h4>
                            <p>💡 {issue.suggestion}</p>
                          </div>
                        ))
                      )}
                    </div>

                    {/* Download Report */}
                    {/* <div className="download-section">
                      <button onClick={handleDownloadPDF} className="download-btn">
                        <Download size={20} />
                        Download PDF Report
                      </button>
                    </div> */}

                    
                  </div>
                ) : (
                  <div className="empty-state">
                    <Target size={64} className="empty-icon" />
                    <p className="empty-title">🚀 Ready to Analyze</p>
                    <p className="empty-subtitle">Enter a website URL or paste HTML code, then click "Start AI Analysis"</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        );

      default: // dashboard
        return (
          <div className="view-container">
            {/* Large Welcome Message with Typing Effect */}
            <div className="welcome-section">
              <h1 className="welcome-title">
                {typedText}
                <span className={`typing-cursor ${showCursor ? 'visible' : 'hidden'}`}>|</span>
              </h1>
              <p className="welcome-subtitle">
                Scan for inclusion, build for everyone
              </p>
            </div>
            
            <div className="dashboard-actions">
              <button 
                onClick={() => handleNavigation('analyze')}
                className="action-card"
              >
                <Brain size={32} />
                <h3>Start New Analysis</h3>
                <p>Scan a website for accessibility issues</p>
              </button>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="dashboard">
      {/* Background Animation */}
      <div className="background-animation">
        <div className="floating-shapes">
          <div className="shape shape-1"></div>
          <div className="shape shape-2"></div>
          <div className="shape shape-3"></div>
          <div className="shape shape-4"></div>
          <div className="shape shape-5"></div>
          <div className="shape shape-6"></div>
        </div>
        <div className="gradient-orbs">
          <div className="orb orb-1"></div>
          <div className="orb orb-2"></div>
          <div className="orb orb-3"></div>
        </div>
      </div>

      {/* Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="sidebar-overlay"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`sidebar ${sidebarOpen ? 'open' : 'closed'}`}>
        <div className="sidebar-header">
          <h1 className="sidebar-title">Inclusion</h1>
          <button
            onClick={() => setSidebarOpen(false)}
            className="close-btn"
            aria-label="Close sidebar"
          >
            <X size={20} />
          </button>
        </div>
        
        <nav className="sidebar-nav">
          <button 
            className={`nav-item ${currentView === 'dashboard' ? 'active' : ''}`}
            onClick={() => handleNavigation('dashboard')}
          >
            <Home size={20} />
            Dashboard
          </button>
          <button 
            className={`nav-item ${currentView === 'analyze' ? 'active' : ''}`}
            onClick={() => handleNavigation('analyze')}
          >
            <Brain size={20} />
            Analyze
          </button>
          
          <button 
            className="nav-item logout-btn" 
            onClick={handleLogout}
          >
            <LogOut size={20} />
            Logout
          </button>
        </nav>
      </div>

      {/* Main Content */}
      <div className="main-content">
        {/* Header */}
        <header className="header">
          <div className="header-left">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="sidebar-toggle-btn"
              aria-label="Toggle sidebar"
            >
              <Menu size={20} />
            </button>

            <div className="header-branding">
              <img src={logo} alt="Logo" className="logo-icon" />
              <div className="title-tagline">
                <h1 className="site-title">Inclusion</h1>
                <p className="site-tagline">Scan for inclusion, build for everyone</p>
              </div>
            </div>
          </div>
          
          <div className="header-right">
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="theme-btn"
            >
              {darkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="main">
          {renderMainContent()}
        </main>
      </div>
    </div>
  );
};

export default Dashboard;