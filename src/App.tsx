import React, { useState, useEffect, useRef } from 'react';
import { AppProvider, NavigationTab, useApp } from './context/AppContext';
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

const TAB_PATHS: Record<NavigationTab, string> = {
  discover: '/dashboard',
  matches: '/matches',
  safetymap: '/safetymap',
  analyzer: '/analyzer',
  pact: '/pact',
  bills: '/bills',
  reviews: '/reviews',
  messages: '/messages',
  profile: '/profile',
};

const getTabFromPath = (path: string): NavigationTab | null => {
  const entry = Object.entries(TAB_PATHS).find(([, route]) => route === path);
  return entry ? (entry[0] as NavigationTab) : null;
};

const AppContent: React.FC = () => {
  const { activeTab, setActiveTab, isAuthenticated } = useApp();
  const skipFirstTabNavigation = useRef(true);

  // Reactive URL router
  const [currentPath, setCurrentPath] = useState<string>(() => {
    return window.location.pathname || '/';
  });

  const navigate = (path: string) => {
    if (window.location.pathname === path) {
      setCurrentPath(path);
      return;
    }
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

  // Keep the selected tab aligned with direct links and browser back/forward navigation.
  useEffect(() => {
    if (!isAuthenticated) {
      if (currentPath !== '/' && currentPath !== '/login' && currentPath !== '/signup' && currentPath !== '/analyzer') {
        navigate('/');
      }
      return;
    }

    if (currentPath === '/' || currentPath === '/login' || currentPath === '/signup') {
      setActiveTab('discover');
      navigate('/dashboard');
      return;
    }

    const tab = getTabFromPath(currentPath);
    if (tab) {
      setActiveTab(tab);
    } else {
      navigate('/dashboard');
    }
  }, [isAuthenticated, currentPath, setActiveTab]);

  // Selecting a tab updates the URL so inbox links can be shared or bookmarked.
  useEffect(() => {
    if (skipFirstTabNavigation.current) {
      skipFirstTabNavigation.current = false;
      return;
    }
    if (isAuthenticated) {
      navigate(TAB_PATHS[activeTab]);
    }
  }, [activeTab, isAuthenticated]);

  // If logged out:
  if (!isAuthenticated) {
    if (currentPath === '/login') {
      return <AuthPage initialMode="login" onNavigate={navigate} />;
    }
    if (currentPath === '/signup') {
      return <AuthPage initialMode="signup" onNavigate={navigate} />;
    }
    if (currentPath === '/analyzer') {
      return (
        <div className="min-h-screen bg-[#f7f7f7] text-[#222222] font-sans flex flex-col">
          <nav className="w-full bg-white/95 backdrop-blur-md border-b border-[#ebebeb] px-6 lg:px-12 py-4 flex items-center justify-between sticky top-0 z-40">
            <div
              onClick={() => navigate('/')}
              className="flex items-center gap-2.5 cursor-pointer select-none"
            >
              <div className="w-9 h-9 rounded-full bg-[#ff385c] flex items-center justify-center text-white shadow-xs">
                <span className="font-heading font-bold text-lg">R</span>
              </div>
              <span className="font-heading font-bold text-lg text-[#222222] tracking-tight">
                RoomSync
              </span>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate('/login')}
                className="px-4 py-2 text-xs font-semibold text-[#222222] hover:bg-[#f7f7f7] rounded-full transition-colors cursor-pointer"
              >
                Log In
              </button>
              <button
                onClick={() => navigate('/signup')}
                className="px-4 py-2 bg-[#222222] hover:bg-black text-white text-xs font-semibold rounded-full shadow-xs transition-all cursor-pointer"
              >
                Sign Up
              </button>
            </div>
          </nav>
          <main className="flex-1 p-4 sm:p-8 max-w-7xl mx-auto w-full">
            <AgreementAnalyzerPage />
          </main>
        </div>
      );
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
