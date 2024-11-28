import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { Settings, Home } from 'lucide-react';
import { NewsFeed } from './components/NewsFeed';
import { SettingsPage } from './components/SettingsPage';
import { Dashboard } from './components/Dashboard';
import { ErrorBoundary } from './components/ErrorBoundary';
import { NewsTicker } from './components/NewsTicker';
import { useAnalysisStore } from './store/analysis';

function App() {
  const { analyses } = useAnalysisStore();
  const latestAnalysis = analyses[0] || null;

  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <NewsTicker analysis={latestAnalysis} />
        
        <nav className="bg-white shadow-md">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex justify-between h-16">
              <div className="flex space-x-8">
                <Link to="/" className="flex items-center text-gray-900 hover:text-blue-600">
                  <Home className="w-5 h-5 mr-2" />
                  Accueil
                </Link>
                <Link to="/news" className="flex items-center text-gray-900 hover:text-blue-600">
                  Actualités
                </Link>
                <Link to="/settings" className="flex items-center text-gray-900 hover:text-blue-600">
                  <Settings className="w-5 h-5 mr-2" />
                  Paramètres
                </Link>
              </div>
            </div>
          </div>
        </nav>

        <main className="max-w-7xl mx-auto py-6 px-4">
          <ErrorBoundary>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/news" element={<NewsFeed />} />
              <Route path="/settings" element={<SettingsPage />} />
            </Routes>
          </ErrorBoundary>
        </main>
      </div>
    </Router>
  );
}

export default App;