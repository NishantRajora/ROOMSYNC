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
    logout,
  } = useApp();

  const handleLogout = () => {
    logout();
    if (onLogout) {
      onLogout();
    }
  };

  const [isSosModalOpen, setIsSosModalOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAccountDropdownOpen, setIsAccountDropdownOpen] = useState(false);
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
    <div className="min-h-screen bg-[#f7f7f7] text-[#222222] flex flex-col font-sans">
      {/* Active SOS Visit Banner if running */}
      {activeVisitAlert && (
        <div
          className={`py-2 px-4 text-xs font-semibold flex items-center justify-between transition-colors z-40 ${
            activeVisitAlert.status === 'alert_triggered'
              ? 'bg-[#f43f5e] text-white animate-pulse'
              : 'bg-[#222222] text-white'
          }`}
        >
          <div className="flex items-center gap-2 max-w-2xl truncate">
            <ShieldAlert className="w-4 h-4 shrink-0 text-[#ff385c]" />
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
              className="px-3 py-1 bg-white/20 hover:bg-white/30 rounded-full text-white font-medium cursor-pointer"
            >
              View Timer
            </button>
            <button
              onClick={cancelVisitAlert}
              className="px-3 py-1 bg-white text-[#222222] hover:bg-white/90 rounded-full font-bold cursor-pointer"
            >
              I'm Safe
            </button>
          </div>
        </div>
      )}

      {/* Sticky Top Bar (Airbnb 80px fixed header) */}
      <header className="sticky top-0 z-30 bg-white border-b border-[#ebebeb] px-4 lg:px-8 h-20 flex items-center justify-between">
        {/* Brand & Mobile Hamburger */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 text-[#6a6a6a] hover:text-[#222222] hover:bg-[#f7f7f7] lg:hidden rounded-full cursor-pointer transition-colors"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          <div
            onClick={() => setActiveTab('discover')}
            className="flex items-center gap-2.5 cursor-pointer select-none group"
          >
            <div className="w-10 h-10 rounded-full bg-[#ff385c] hover:bg-[#e00b41] flex items-center justify-center text-white shadow-sm transition-transform group-hover:scale-105">
              <span className="font-heading font-bold text-lg">R</span>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-heading font-bold text-xl text-[#222222] tracking-tight">
                  RoomSync
                </span>
              </div>
              <span className="text-[11px] text-[#6a6a6a] hidden sm:block">
                Find Your People. Find Your Place.
              </span>
            </div>
          </div>
        </div>

        {/* Global Search Bar (Airbnb Floating Capsule) */}
        <div className="hidden md:flex items-center flex-1 max-w-lg mx-6">
          <div className="relative w-full flex items-center bg-white border border-[#ebebeb] rounded-full p-1.5 shadow-[0_1px_2px_rgba(0,0,0,0.08),0_4px_12px_rgba(0,0,0,0.05)] hover:shadow-[0_2px_4px_rgba(0,0,0,0.12),0_6px_16px_rgba(0,0,0,0.08)] transition-all">
            <input
              type="text"
              value={globalSearch}
              onChange={(e) => setGlobalSearch(e.target.value)}
              placeholder="Search flats, roommates, localities..."
              className="w-full pl-4 pr-3 py-1.5 text-xs text-[#222222] placeholder-[#6a6a6a] bg-transparent focus:outline-none"
            />
            <button
              type="button"
              className="w-8 h-8 rounded-full bg-[#ff385c] hover:bg-[#e00b41] text-white flex items-center justify-center shrink-0 cursor-pointer transition-colors"
              title="Search"
            >
              <Search className="w-3.5 h-3.5 stroke-[2.5]" />
            </button>
          </div>
        </div>

        {/* Right Action Icons & Profile Capsule */}
        <div className="flex items-center gap-3">
          {/* Quick SOS Visit Trigger */}
          <button
            onClick={() => setIsSosModalOpen(true)}
            className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-[#f7f7f7] hover:bg-[#ebebeb] text-[#222222] border border-[#ebebeb] rounded-full text-xs font-semibold transition-colors cursor-pointer"
            title="Start SOS Safety Check-in before visiting property"
          >
            <ShieldAlert className="w-3.5 h-3.5 text-[#ff385c]" />
            <span>SOS Check-in</span>
          </button>

          {/* Verification Indicator */}
          {currentUser.isStudentVerified ? (
            <div className="hidden sm:block">
              <VerifiedBadge college={currentUser.courseYear || "Verified Student"} size="sm" />
            </div>
          ) : currentUser.isProfessionalVerified || currentUser.userType === 'professional' ? (
            <div className="hidden sm:inline-flex items-center gap-1 text-[11px] font-semibold text-[#222222] bg-[#f7f7f7] px-3 py-1 rounded-full border border-[#ebebeb]">
              <span>💼 Verified Pro</span>
            </div>
          ) : (
            <button
              onClick={() => setActiveTab('profile')}
              className="hidden sm:inline-flex items-center gap-1 text-xs font-medium text-[#222222] bg-[#f7f7f7] hover:bg-[#ebebeb] px-3 py-1 rounded-full border border-[#ebebeb] cursor-pointer"
            >
              Verify Profile ID
            </button>
          )}

          {/* Profile Capsule (Airbnb style border pill) */}
          <div className="relative">
            <div
              onClick={() => setIsAccountDropdownOpen((prev) => !prev)}
              className="flex items-center gap-2.5 p-1 pl-3.5 bg-white hover:shadow-md border border-[#ebebeb] rounded-full cursor-pointer transition-all"
              title={`Logged in as ${currentUser.fullName} · ${currentUser.profileCompletion}% complete`}
            >
              <Menu className="w-4 h-4 text-[#222222]" />
              <div className="relative w-8 h-8">
                <img
                  src={currentUser.avatarUrl}
                  alt={currentUser.fullName}
                  className="w-8 h-8 rounded-full object-cover border border-[#ebebeb]"
                />
              </div>
            </div>

            {/* Clean User Account Menu */}
            {isAccountDropdownOpen && (
              <div className="absolute right-0 top-14 z-50 w-64 bg-white rounded-2xl shadow-[0_6px_20px_rgba(0,0,0,0.12)] border border-[#ebebeb] p-3 space-y-2 animate-in fade-in zoom-in-95">
                <div className="flex items-center gap-2.5 p-2.5 bg-[#f7f7f7] rounded-xl border border-[#ebebeb]">
                  <img
                    src={currentUser.avatarUrl}
                    alt={currentUser.fullName}
                    className="w-10 h-10 rounded-full object-cover shrink-0 border border-[#ebebeb]"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="text-xs font-bold text-[#222222] truncate">
                      {currentUser.fullName}
                    </div>
                    <div className="text-[11px] text-[#6a6a6a] truncate">
                      {currentUser.email}
                    </div>
                    <div className="text-[10px] font-medium text-[#ff385c] mt-0.5">
                      {currentUser.courseYear || (currentUser.userType === 'student' ? 'Verified Student' : 'Working Professional')}
                    </div>
                  </div>
                </div>

                <div className="space-y-1">
                  <button
                    type="button"
                    onClick={() => {
                      setIsAccountDropdownOpen(false);
                      setActiveTab('profile');
                    }}
                    className="w-full py-2 px-3 text-left hover:bg-[#f7f7f7] rounded-xl text-xs font-medium text-[#222222] flex items-center justify-between cursor-pointer transition-colors"
                  >
                    <span>My Profile & Verified ID</span>
                    <span className="text-[10px] text-[#6a6a6a] font-bold">{currentUser.profileCompletion}%</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIsAccountDropdownOpen(false);
                      handleLogout();
                    }}
                    className="w-full py-2 px-3 text-left hover:bg-[#fef2f2] rounded-xl text-xs font-medium text-[#e00b41] flex items-center gap-2 cursor-pointer transition-colors"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Log Out</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Container: Sidebar + Content on #f7f7f7 Canvas */}
      <div className="flex-1 flex max-w-[1920px] w-full mx-auto">
        {/* Left Sidebar (Desktop) */}
        <aside className="hidden lg:flex flex-col w-64 border-r border-[#ebebeb] bg-white p-4 shrink-0">
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.tab;
              return (
                <button
                  key={item.tab}
                  onClick={() => setActiveTab(item.tab)}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-full text-xs font-medium transition-all cursor-pointer ${
                    isActive
                      ? 'bg-[#222222] text-white shadow-xs'
                      : 'text-[#6a6a6a] hover:text-[#222222] hover:bg-[#f7f7f7]'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-[#6a6a6a]'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Quick Safety Box on sidebar */}
          <div className="mt-auto p-4 bg-[#f7f7f7] rounded-2xl border border-[#ebebeb] space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-[#222222]">
              <ShieldCheck className="w-4 h-4 text-[#ff385c]" />
              <span>Campus Safety Guide</span>
            </div>
            <p className="text-[11px] text-[#6a6a6a] leading-relaxed">
              Curated student housing corridors, night lighting audit, transit access, and police chowki proximity.
            </p>
            <button
              onClick={() => setActiveTab('safetymap')}
              className="text-[11px] font-semibold text-[#222222] hover:text-[#ff385c] flex items-center gap-1 cursor-pointer transition-colors"
            >
              Explore Safety & Risk Map &rarr;
            </button>
          </div>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="mt-3 w-full flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-[#6a6a6a] hover:text-[#e00b41] hover:bg-[#fef2f2] rounded-full transition-colors cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>Log Out</span>
          </button>
        </aside>

        {/* Mobile Navigation Drawer */}
        {isMobileMenuOpen && (
          <div className="lg:hidden fixed inset-0 z-40 bg-black/40 flex backdrop-blur-xs">
            <div className="w-72 bg-white h-full p-4 flex flex-col space-y-2 shadow-2xl animate-in slide-in-from-left duration-200 border-r border-[#ebebeb]">
              <div className="flex items-center justify-between pb-3 border-b border-[#ebebeb]">
                <span className="font-heading font-bold text-base text-[#222222]">Navigation</span>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-1.5 text-[#6a6a6a] hover:text-[#222222] rounded-full hover:bg-[#f7f7f7] cursor-pointer"
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
                      className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-full text-xs font-medium cursor-pointer transition-colors ${
                        isActive
                          ? 'bg-[#222222] text-white'
                          : 'text-[#6a6a6a] hover:text-[#222222] hover:bg-[#f7f7f7]'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </div>
              <div className="pt-2 border-t border-[#ebebeb]">
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    handleLogout();
                  }}
                  className="w-full flex items-center gap-3 px-4 py-2.5 rounded-full text-xs font-medium text-[#e00b41] hover:bg-[#fef2f2] cursor-pointer transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Log Out</span>
                </button>
              </div>
            </div>
            <div className="flex-1" onClick={() => setIsMobileMenuOpen(false)} />
          </div>
        )}

        {/* Main Content Area on Faint Canvas */}
        <main className="flex-1 p-4 lg:p-8 overflow-x-hidden min-h-[calc(100vh-80px)] bg-[#f7f7f7]">
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
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-[#222222] text-white text-xs font-medium px-5 py-2.5 rounded-full shadow-2xl border border-white/10 flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2 duration-200">
          <CheckCircle className="w-4 h-4 text-[#10b981]" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
};
