import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { initGoogleAuth, getCurrentUser, isAuthenticated } from './utils/auth';
import { initDB } from './utils/database';

// Components
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import TournamentView from './components/TournamentView';
import StatsView from './components/StatsView';
import Settings from './components/Settings';
import Layout from './components/Layout';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cleanup = null;

    async function initialize() {
      try {
        // Initialize database
        await initDB();

        // Initialize Google Auth
        await initGoogleAuth();

        // Check for existing user
        const currentUser = getCurrentUser();
        setUser(currentUser);

        // Listen for auth changes
        const handleAuthChange = (event) => {
          console.log('Auth change event:', event.detail);
          setUser(event.detail);
        };

        window.addEventListener('auth-change', handleAuthChange);

        // Store cleanup function
        cleanup = () => {
          window.removeEventListener('auth-change', handleAuthChange);
        };

      } catch (error) {
        console.error('Failed to initialize app:', error);
      } finally {
        setLoading(false);
      }
    }

    initialize();

    // Return cleanup function
    return () => {
      if (cleanup) {
        cleanup();
      }
    };
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading HeroTrack...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated()) {
    return <Login />;
  }

  return (
    <Router>
      <Layout user={user}>
        <Routes>
          <Route path="/" element={<Dashboard user={user} />} />
          <Route path="/tournament/:id" element={<TournamentView user={user} />} />
          <Route path="/stats" element={<StatsView user={user} />} />
          <Route path="/settings" element={<Settings user={user} />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
