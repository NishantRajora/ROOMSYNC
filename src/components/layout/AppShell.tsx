import React, { useState } from 'react';
import { useApp, NavigationTab } from '../../context/AppContext';
import {
  Compass,
  Users,
  MapPin,
  FileText,
  Scroll,
  Receipt,
  Star,
  MessageSquare,
  User,
  ShieldAlert,
  Search,
  Bell,
  CheckCircle,
  Menu,
  X,
  ExternalLink,
  ShieldCheck,
  LogOut,
} from 'lucide-react';
import { VerifiedBadge } from '../common/VerifiedBadge';
import { SosCheckinModal } from '../common/SosCheckinModal';
import { FloatingChat } from '../chat/FloatingChat';

interface AppShellProps {
  children: React.ReactNode;
  onLogout?: () => void;
}

export const AppShell: React.FC<AppShellProps> = ({ children, onLogout }) => {
  const {
    currentUser,
    activeTab,
    setActiveTab,
    activeVisitAlert,
    cancelVisitAlert,
    toastMessage,
    setIsAuthenticated,
  } = useApp();

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.setItem('roomsync_auth', 'false');
    if (onLogout) {
      onLogout();
    }
  };

  const [isSosModalOpen, setIsSosModalOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [globalSearch, setGlobalSearch] = useState('');

  const navItems: { tab: NavigationTab; label: string; icon: React.FC<{ className?: string }> }[] = [
    { tab: 'discover', label: 'Discover Flats', icon: Compass },
    { tab: 'matches', label: 'Roommate Matches', icon: Users },
    { tab: 'safetymap', label: 'Safety Map', icon: MapPin },
    { tab: 'analyzer', label: 'Agreement Analyzer', icon: FileText },
    { tab: 'pact', label: 'Roommate Pact', icon: Scroll },
    { tab: 'bills', label: 'Bill Splitter', icon: Receipt },
    { tab: 'reviews', label: 'Reviews & Landlords', icon: Star },
    { tab: 'messages', label: 'Messages', icon: MessageSquare },
    { tab: 'profile', label: 'Profile & Verified ID', icon: User },
  ];

  return (
    <div className="min-h-screen bg-[#f6f9f8] text-[#17222b] flex flex-col font-sans">
      {/* Active SOS Visit Banner if running */}
      {activeVisitAlert && (
        <div
          className={`py-2 px-4 text-xs font-semibold flex items-center justify-between transition-colors z-40 ${
            activeVisitAlert.status === 'alert_triggered'
              ? 'bg-[#f43f5e] text-white animate-pulse'
              : 'bg-[#117c74] text-white'
          }`}
        >
          <div className="flex items-center gap-2 max-w-2xl truncate">
            <ShieldAlert className="w-4 h-4 shrink-0" />
            <span>
              {activeVisitAlert.status === 'alert_triggered'
                ? 'EMERGENCY CHECK-IN MISSED: Alert sent for property visit!'
                : `Active Visit Check-in: ${Math.floor(activeVisitAlert.remainingSeconds / 60)}m ${
                    activeVisitAlert.remainingSeconds % 60
                  }s left at ${activeVisitAlert.destination}`}
            </span>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setIsSosModalOpen(true)}
              className="px-2.5 py-1 bg-white/20 hover:bg-white/30 rounded-lg text-white font-medium cursor-pointer"
            >
              View Timer
            </button>
            <button
              onClick={cancelVisitAlert}
              className="px-2.5 py-1 bg-white text-[#117c74] hover:bg-white/90 rounded-lg font-bold cursor-pointer"
            >
              I'm Safe
            </button>
          </div>
        </div>
      )}

      {/* Sticky Top Bar */}
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-[#e2ece9] px-4 lg:px-8 py-3.5 flex items-center justify-between">
        {/* Brand & Mobile Hamburger */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-1.5 text-[#5f7572] hover:text-[#17222b] lg:hidden rounded-lg cursor-pointer"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          <div
            onClick={() => setActiveTab('discover')}
            className="flex items-center gap-2.5 cursor-pointer select-none"
          >
            <div className="w-9 h-9 rounded-xl bg-[#117c74] flex items-center justify-center text-white shadow-xs">
              <span className="font-heading font-bold text-lg">R</span>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-heading font-bold text-lg text-[#17222b] tracking-tight">
                  RoomSync
                </span>
              </div>
              <span className="text-[11px] text-[#5f7572] hidden sm:block">
                Find Your People. Find Your Place.
              </span>
            </div>
          </div>
        </div>

        {/* Global Search Bar */}
        <div className="hidden md:flex items-center flex-1 max-w-md mx-6">
          <div className="relative w-full">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-[#5f7572]" />
            <input
              type="text"
              value={globalSearch}
              onChange={(e) => setGlobalSearch(e.target.value)}
              placeholder="Search Sector 23, DLF Phase 3, Palam Vihar, flatmates..."
              className="w-full pl-9 pr-4 py-2 text-xs bg-[#f6f9f8] border border-[#e2ece9] rounded-xl focus:outline-none focus:border-[#117c74] focus:bg-white text-[#17222b] transition-all"
            />
          </div>
        </div>

        {/* Right Action Icons & Profile Completion */}
        <div className="flex items-center gap-3">
          {/* Quick SOS Visit Trigger */}
          <button
            onClick={() => setIsSosModalOpen(true)}
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#fef2f2] hover:bg-[#fee2e2] text-[#f43f5e] border border-[#fecdd3] rounded-xl text-xs font-semibold transition-colors cursor-pointer"
            title="Start SOS Safety Check-in before visiting property"
          >
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>SOS Check-in</span>
          </button>

          {/* NCU Verification Indicator */}
          {currentUser.isStudentVerified ? (
            <div className="hidden sm:block">
              <VerifiedBadge college="Verified Student" size="sm" />
            </div>
          ) : (
            <button
              onClick={() => setActiveTab('profile')}
              className="hidden sm:inline-flex items-center gap-1 text-xs font-medium text-[#f59e0b] bg-[#fffbeb] px-2.5 py-1 rounded-full border border-[#fde68a] cursor-pointer"
            >
              Verify College ID
            </button>
          )}

          {/* Profile Completion Ring */}
          <div
            onClick={() => setActiveTab('profile')}
            className="flex items-center gap-2 pl-2 cursor-pointer group"
            title={`Profile ${currentUser.profileCompletion}% complete`}
          >
            <div className="relative w-9 h-9">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                <circle
                  cx="18"
                  cy="18"
                  r="15"
                  className="stroke-[#e2ece9]"
                  strokeWidth="2.5"
                  fill="none"
                />
                <circle
                  cx="18"
                  cy="18"
                  r="15"
                  className="stroke-[#117c74] transition-all duration-500"
                  strokeWidth="2.5"
                  strokeDasharray={`${currentUser.profileCompletion}, 100`}
                  strokeLinecap="round"
                  fill="none"
                />
              </svg>
              <img
                src={currentUser.avatarUrl}
                alt={currentUser.fullName}
                className="w-7 h-7 rounded-full object-cover absolute top-1 left-1"
              />
            </div>
            <div className="hidden xl:block text-left">
              <div className="text-xs font-semibold text-[#17222b] group-hover:text-[#117c74] transition-colors">
                {currentUser.fullName}
              </div>
              <div className="text-[10px] text-[#5f7572]">
                {currentUser.profileCompletion}% Complete
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Container: Sidebar + Content */}
      <div className="flex-1 flex max-w-[1920px] w-full mx-auto">
        {/* Left Sidebar (Desktop) */}
        <aside className="hidden lg:flex flex-col w-64 border-r border-[#e2ece9] bg-white p-4 shrink-0">
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.tab;
              return (
                <button
                  key={item.tab}
                  onClick={() => setActiveTab(item.tab)}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-[#117c74] text-white shadow-xs'
                      : 'text-[#5f7572] hover:text-[#17222b] hover:bg-[#f6f9f8]'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-[#5f7572]'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Quick Safety Box on sidebar */}
          <div className="mt-auto p-3.5 bg-[#f6f9f8] rounded-2xl border border-[#e2ece9] space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-[#17222b]">
              <ShieldCheck className="w-4 h-4 text-[#117c74]" />
              <span>Campus Safety Pilot</span>
            </div>
            <p className="text-[11px] text-[#5f7572] leading-relaxed">
              Curated for The NorthCap University student housing corridor in Sector 23, DLF 3 & Palam Vihar.
            </p>
            <button
              onClick={() => setActiveTab('safetymap')}
              className="text-[11px] font-semibold text-[#117c74] hover:underline flex items-center gap-1 cursor-pointer"
            >
              Explore Gurugram Risk Map &rarr;
            </button>
          </div>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="mt-3 w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-[#5f7572] hover:text-[#f43f5e] hover:bg-[#fef2f2] rounded-xl transition-colors cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>Log Out</span>
          </button>
        </aside>

        {/* Mobile Navigation Drawer */}
        {isMobileMenuOpen && (
          <div className="lg:hidden fixed inset-0 z-40 bg-black/50 flex">
            <div className="w-72 bg-white h-full p-4 flex flex-col space-y-2 shadow-2xl animate-in slide-in-from-left duration-200">
              <div className="flex items-center justify-between pb-3 border-b border-[#e2ece9]">
                <span className="font-heading font-bold text-base text-[#17222b]">Navigation</span>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-1 text-[#5f7572] hover:text-[#17222b] cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="flex-1 space-y-1 overflow-y-auto">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.tab;
                  return (
                    <button
                      key={item.tab}
                      onClick={() => {
                        setActiveTab(item.tab);
                        setIsMobileMenuOpen(false);
                      }}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold cursor-pointer ${
                        isActive
                          ? 'bg-[#117c74] text-white'
                          : 'text-[#5f7572] hover:text-[#17222b] hover:bg-[#f6f9f8]'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </div>
              <div className="pt-2 border-t border-[#e2ece9]">
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    handleLogout();
                  }}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold text-[#f43f5e] hover:bg-[#fef2f2] cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Log Out</span>
                </button>
              </div>
            </div>
            <div className="flex-1" onClick={() => setIsMobileMenuOpen(false)} />
          </div>
        )}

        {/* Main Content Area */}
        <main className="flex-1 p-4 lg:p-8 overflow-x-hidden min-h-[calc(100vh-65px)]">
          {children}
        </main>
      </div>

      {/* Floating Chat Widget */}
      <FloatingChat />

      {/* SOS Checkin Modal */}
      <SosCheckinModal
        isOpen={isSosModalOpen}
        onClose={() => setIsSosModalOpen(false)}
      />

      {/* Global Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-[#17222b] text-white text-xs font-medium px-4 py-2.5 rounded-2xl shadow-xl border border-white/10 flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2 duration-200">
          <CheckCircle className="w-4 h-4 text-[#10b981]" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
};
