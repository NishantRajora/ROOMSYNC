import React, { useState, useEffect } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { AppShell } from './components/layout/AppShell';
import { DiscoverPage } from './pages/DiscoverPage';
import { MatchesPage } from './pages/MatchesPage';
import { SafetyMapPage } from './pages/SafetyMapPage';
import { AgreementAnalyzerPage } from './pages/AgreementAnalyzerPage';
import { RoommatePactPage } from './pages/RoommatePactPage';
import { BillSplitterPage } from './pages/BillSplitterPage';
import { ReviewsPage } from './pages/ReviewsPage';
import { MessagesPage } from './pages/MessagesPage';
import { ProfilePage } from './pages/ProfilePage';
import { LandingPage } from './pages/LandingPage';
import { AuthPage } from './pages/AuthPage';

const AppContent: React.FC = () => {
  const { activeTab, setActiveTab, isAuthenticated } = useApp();

  // Reactive URL router
  const [currentPath, setCurrentPath] = useState<string>(() => {
    return window.location.pathname || '/';
  });

  const navigate = (path: string) => {
    window.history.pushState({}, '', path);
    setCurrentPath(path);
  };

  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname || '/');
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // When authenticated, visiting public root or auth routes redirects straight to /dashboard
  useEffect(() => {
    if (isAuthenticated && (currentPath === '/' || currentPath === '/login' || currentPath === '/signup')) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, currentPath]);

  // If logged out:
  if (!isAuthenticated) {
    if (currentPath === '/login') {
      return <AuthPage initialMode="login" onNavigate={navigate} />;
    }
    if (currentPath === '/signup') {
      return <AuthPage initialMode="signup" onNavigate={navigate} />;
    }
    // Default root route "/"
    return <LandingPage onNavigate={navigate} />;
  }

  // If logged in: render AppShell with dashboard tabs
  const renderActiveTab = () => {
    switch (activeTab) {
      case 'discover':
        return <DiscoverPage />;
      case 'matches':
        return <MatchesPage />;
      case 'safetymap':
        return <SafetyMapPage />;
      case 'analyzer':
        return <AgreementAnalyzerPage />;
      case 'pact':
        return <RoommatePactPage />;
      case 'bills':
        return <BillSplitterPage />;
      case 'reviews':
        return <ReviewsPage />;
      case 'messages':
        return <MessagesPage />;
      case 'profile':
        return <ProfilePage />;
      default:
        return <DiscoverPage />;
    }
  };

  return (
    <AppShell onLogout={() => navigate('/')}>
      {renderActiveTab()}
    </AppShell>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
