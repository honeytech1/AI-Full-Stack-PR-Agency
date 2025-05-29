import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import Dashboard from './components/Dashboard';
import AuthPage from './components/AuthPage';
import AgentWorkspace from './components/AgentWorkspace';
import ReputationScanner from './components/ReputationScanner';
import BriefGenerator from './components/BriefGenerator';
import StressTester from './components/StressTester';
import ContentRepurposer from './components/ContentRepurposer';
import { AuthProvider, useAuth } from './context/AuthContext';

function AppRoutes() {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-secondary-50">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  return (
    <Routes>
      <Route 
        path="/auth" 
        element={!isAuthenticated ? <AuthPage /> : <Navigate to="/dashboard" />} 
      />
      <Route 
        path="/dashboard" 
        element={isAuthenticated ? <Dashboard /> : <Navigate to="/auth" />} 
      />
      <Route 
        path="/agents" 
        element={isAuthenticated ? <AgentWorkspace /> : <Navigate to="/auth" />} 
      />
      <Route 
        path="/agents/reputation" 
        element={isAuthenticated ? <ReputationScanner /> : <Navigate to="/auth" />} 
      />
      <Route 
        path="/agents/brief" 
        element={isAuthenticated ? <BriefGenerator /> : <Navigate to="/auth" />} 
      />
      <Route 
        path="/agents/stress-test" 
        element={isAuthenticated ? <StressTester /> : <Navigate to="/auth" />} 
      />
      <Route 
        path="/agents/content" 
        element={isAuthenticated ? <ContentRepurposer /> : <Navigate to="/auth" />} 
      />
      <Route path="/" element={<Navigate to="/dashboard" />} />
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <AppRoutes />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
