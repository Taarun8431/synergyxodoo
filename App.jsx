import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Projects from './Projects.jsx';
import ProjectDetail from './ProjectDetail.jsx';
import { Toaster } from './components/ui/toaster.jsx';
import ErrorBoundary from './components/ErrorBoundary.jsx';

function App() {
  return (
    <Router>
      <div className="min-h-screen relative overflow-hidden">
        {/* Animated background */}
        <div className="fixed inset-0 gradient-bg opacity-5"></div>
        <div className="fixed inset-0 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100"></div>
        
        {/* Navigation Header */}
        <nav className="relative z-10 glass-card border-b border-white/20">
          <div className="container mx-auto px-6 py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-6">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    Project Manager
                  </h1>
                </div>
              </div>
              <div className="flex items-center space-x-6">
                <div className="hidden md:flex items-center space-x-4">
                  <div className="px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full border border-white/30">
                    <span className="text-sm font-medium text-gray-700">
                      Manage your projects and tasks efficiently
                    </span>
                  </div>
                </div>
                <div className="w-10 h-10 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center shadow-lg pulse-glow">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <main className="relative z-10 container mx-auto px-6 py-12">
          <ErrorBoundary>
            <Routes>
              <Route path="/" element={<Navigate to="/projects" replace />} />
              <Route path="/projects" element={<Projects />} />
              <Route path="/projects/:id" element={<ProjectDetail />} />
              <Route path="*" element={<Navigate to="/projects" replace />} />
            </Routes>
          </ErrorBoundary>
        </main>

        {/* Toast Notifications */}
        <Toaster />
      </div>
    </Router>
  );
}

export default App;
