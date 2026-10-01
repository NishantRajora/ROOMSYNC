import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  ShieldCheck,
  Mail,
  Lock,
  User,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  CheckCircle,
  Moon,
  Sun,
  Utensils,
  BookOpen,
  Volume2,
  Cigarette,
  Home,
  Check,
  Award,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { SleepSchedule, CleanlinessLevel, SocialHabit, FoodPreference, StudyHabit } from '../types';

interface AuthPageProps {
  initialMode: 'login' | 'signup';
  onNavigate: (path: string) => void;
}

export const AuthPage: React.FC<AuthPageProps> = ({ initialMode, onNavigate }) => {
  const {
    currentUser,
    updateCurrentUser,
    setIsAuthenticated,
    showToast,
  } = useApp();

  const [mode, setMode] = useState<'login' | 'signup'>(initialMode);

  // Sign Up Multi-Step State (1: Account & College, 2: Lifestyle, 3: Preferences)
  const [signupStep, setSignupStep] = useState<1 | 2 | 3>(1);

  // Step 1: Account
  const [fullName, setFullName] = useState('');
  const [courseYear, setCourseYear] = useState('B.Tech CSE — 3rd Year');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Step 2: Lifestyle
  const [bedtime, setBedtime] = useState('11:00 PM');
  const [wakeTime, setWakeTime] = useState('07:30 AM');
  const [sleepSchedule, setSleepSchedule] = useState<SleepSchedule>('early_bird');
  const [cleanlinessRating, setCleanlinessRating] = useState<number>(4);
  const [guestFrequency, setGuestFrequency] = useState('Weekends only with notice');
  const [partyFrequency, setPartyFrequency] = useState('Zero parties / quiet flat');
  const [socialHabit, setSocialHabit] = useState<SocialHabit>('ambivert');
  const [substanceTolerance, setSubstanceTolerance] = useState('Non-smoking & alcohol-free');

  // Step 3: Preferences
  const [foodPreference, setFoodPreference] = useState<FoodPreference>('pure_veg');
  const [studySchedule, setStudySchedule] = useState('Night owl studier (10 PM – 2 AM)');
  const [studyHours, setStudyHours] = useState('3–4 hours/day');
  const [studyHabit, setStudyHabit] = useState<StudyHabit>('ambient_music');
  const [roomSharing, setRoomSharing] = useState<'private' | 'shared' | 'any'>('private');
  const [dealbreakers, setDealbreakers] = useState<string[]>([
    'No indoor smoking',
    'No late-night loud noise (after 11 PM)',
  ]);
  const [budgetMin, setBudgetMin] = useState(8000);
  const [budgetMax, setBudgetMax] = useState(16000);

  // Check if email ends with .edu
  const isEduEmail =
    email.trim().toLowerCase().endsWith('.edu') ||
    email.trim().toLowerCase().includes('.edu');

  const dealbreakerOptions = [
    'No indoor smoking',
    'No alcohol or parties in flat',
    'No non-veg food/cooking in kitchen',
    'No unannounced overnight guests',
    'No pets',
    'Strict quiet hours after 11 PM',
    'Dishes must be washed immediately',
  ];

  const toggleDealbreaker = (item: string) => {
    if (dealbreakers.includes(item)) {
      setDealbreakers(dealbreakers.filter((d) => d !== item));
    } else {
      setDealbreakers([...dealbreakers, item]);
    }
  };

  const handleStep1Next = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !fullName.trim()) return;
    setSignupStep(2);
  };

  const handleStep2Next = (e: React.FormEvent) => {
    e.preventDefault();
    setSignupStep(3);
  };

  const handleCompleteSignup = (e: React.FormEvent) => {
    e.preventDefault();

    // Map cleanlinessRating (1-5) to CleanlinessLevel
    let cleanlinessLevel: CleanlinessLevel = 'moderate';
    if (cleanlinessRating >= 4) cleanlinessLevel = 'neat_freak';
    else if (cleanlinessRating <= 2) cleanlinessLevel = 'relaxed';

    updateCurrentUser({
      fullName: fullName.trim(),
      email: email.trim(),
      collegeEmail: isEduEmail ? email.trim() : undefined,
      isStudentVerified: isEduEmail,
      courseYear: courseYear.trim() || 'B.Tech CSE — 3rd Year',
      sleepSchedule,
      bedtime,
      wakeTime,
      cleanliness: cleanlinessLevel,
      cleanlinessRating,
      socialHabits: socialHabit,
      noiseTolerance: `${guestFrequency} · ${partyFrequency}`,
      smokingDrinkingTolerance: substanceTolerance,
      foodPreference,
      studyHabits: studyHabit,
      studySchedule: `${studySchedule} (${studyHours})`,
      roomSharingPreference: roomSharing,
      dealbreakers,
      budgetMin,
      budgetMax,
      profileCompletion: 100,
    });

    setIsAuthenticated(true);
    localStorage.setItem('roomsync_auth', 'true');

    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
    });

    if (isEduEmail) {
      showToast('🎓 Golden Verified Student badge awarded! (.edu email verified)');
    } else {
      showToast('Account created successfully! Welcome to RoomSync.');
    }

    onNavigate('/dashboard');
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsAuthenticated(true);
    localStorage.setItem('roomsync_auth', 'true');
    showToast(`Welcome back, ${currentUser.fullName}!`);
    onNavigate('/dashboard');
  };

  const handleQuickDemoLogin = () => {
    setIsAuthenticated(true);
    localStorage.setItem('roomsync_auth', 'true');
    showToast('Logged in as Aarav Sharma (3rd Year CSE)');
    onNavigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-[#f6f9f8] text-[#17222b] font-sans flex flex-col justify-between selection:bg-[#117c74]/20 selection:text-[#117c74]">
      {/* Top Navbar */}
      <nav className="w-full bg-white/95 backdrop-blur-md border-b border-[#e2ece9] px-6 lg:px-12 py-4 flex items-center justify-between sticky top-0 z-40">
        <div
          onClick={() => onNavigate('/')}
          className="flex items-center gap-2.5 cursor-pointer select-none"
        >
          <div className="w-9 h-9 rounded-xl bg-[#117c74] flex items-center justify-center text-white shadow-xs">
            <span className="font-heading font-bold text-lg">R</span>
          </div>
          <div>
            <span className="font-heading font-bold text-lg text-[#17222b] tracking-tight">
              RoomSync
            </span>
          </div>
        </div>

        <button
          onClick={() => onNavigate('/')}
          className="text-xs font-semibold text-[#5f7572] hover:text-[#17222b] transition-colors cursor-pointer"
        >
          &larr; Back to Home
        </button>
      </nav>

      {/* Main Container */}
      <div className="flex-1 flex items-center justify-center p-4 sm:p-8">
        <div className="w-full max-w-xl bg-white rounded-3xl border border-[#e2ece9] shadow-xl overflow-hidden p-6 sm:p-8 space-y-6">
          {/* Header */}
          <div className="text-center space-y-1">
            <h2 className="font-heading text-2xl font-bold text-[#17222b]">
              {mode === 'login'
                ? 'Welcome back to RoomSync'
                : signupStep === 1
                ? 'Create Your Student Account'
                : signupStep === 2
                ? 'Step 2 — Lifestyle Habits'
                : 'Step 3 — Roommate Preferences'}
            </h2>
            <p className="text-xs text-[#5f7572]">
              {mode === 'login'
                ? 'Sign in to access your roommate compatibility feed and safe flats.'
                : signupStep === 1
                ? 'Any email is accepted. (.edu emails receive an instant Golden Verified badge!)'
                : signupStep === 2
                ? 'Tell us how you live so our algorithm can match compatible roommates.'
                : 'Define dietary norms, study rhythm, and flat dealbreakers.'}
            </p>
          </div>

          {/* Mode Switch Tabs (Only shown on Step 1 or Login) */}
          {(mode === 'login' || signupStep === 1) && (
            <div className="flex p-1 bg-[#f6f9f8] rounded-xl border border-[#e2ece9]">
              <button
                type="button"
                onClick={() => {
                  setMode('login');
                  onNavigate('/login');
                }}
                className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                  mode === 'login'
                    ? 'bg-white text-[#17222b] shadow-xs'
                    : 'text-[#5f7572] hover:text-[#17222b]'
                }`}
              >
                Log In
              </button>
              <button
                type="button"
                onClick={() => {
                  setMode('signup');
                  setSignupStep(1);
                  onNavigate('/signup');
                }}
                className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                  mode === 'signup'
                    ? 'bg-white text-[#17222b] shadow-xs'
                    : 'text-[#5f7572] hover:text-[#17222b]'
                }`}
              >
                Sign Up
              </button>
            </div>
          )}

          {/* Sign Up Progress Indicator (Steps 1, 2, 3) */}
          {mode === 'signup' && (
            <div className="flex items-center justify-between px-2 pt-1">
              {[
                { num: 1, label: 'Account' },
                { num: 2, label: 'Lifestyle' },
                { num: 3, label: 'Preferences' },
              ].map((s) => (
                <div key={s.num} className="flex items-center gap-2">
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                      signupStep >= s.num
                        ? 'bg-[#117c74] text-white shadow-2xs'
                        : 'bg-[#f6f9f8] text-[#5f7572] border border-[#e2ece9]'
                    }`}
                  >
                    {signupStep > s.num ? '✓' : s.num}
                  </div>
                  <span
                    className={`text-xs font-medium hidden sm:inline ${
                      signupStep >= s.num ? 'text-[#17222b] font-bold' : 'text-[#5f7572]'
                    }`}
                  >
                    {s.label}
                  </span>
                  {s.num < 3 && (
                    <div
                      className={`w-12 sm:w-16 h-0.5 mx-1 transition-colors ${
                        signupStep > s.num ? 'bg-[#117c74]' : 'bg-[#e2ece9]'
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Quick Demo One-Click Login */}
          {mode === 'login' && (
            <div className="p-3.5 bg-[#ecfdf5] border border-[#a7f3d0] rounded-2xl flex items-center justify-between gap-3">
              <div className="text-left">
                <div className="text-xs font-bold text-[#065f46] flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-[#10b981]" /> Demo Student Profile
                </div>
                <div className="text-[11px] text-[#065f46]/80 mt-0.5">
                  Instant sign in as Aarav Sharma (3rd Year CSE)
                </div>
              </div>
              <button
                type="button"
                onClick={handleQuickDemoLogin}
                className="px-3 py-1.5 bg-[#117c74] hover:bg-[#0d635c] text-white text-xs font-semibold rounded-xl shadow-xs transition-all whitespace-nowrap cursor-pointer"
              >
                One-Click Demo
              </button>
            </div>
          )}

          {/* ==================== LOGIN VIEW ==================== */}
          {mode === 'login' ? (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#5f7572] mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3 top-2.5 text-[#5f7572]" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="student@university.edu or user@gmail.com"
                    className="w-full pl-9 pr-3 py-2 text-xs bg-[#f6f9f8] border border-[#e2ece9] rounded-xl focus:outline-none focus:border-[#117c74] text-[#17222b]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#5f7572] mb-1">
                  Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3 top-2.5 text-[#5f7572]" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full pl-9 pr-3 py-2 text-xs bg-[#f6f9f8] border border-[#e2ece9] rounded-xl focus:outline-none focus:border-[#117c74] text-[#17222b]"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 px-4 bg-[#117c74] hover:bg-[#0d635c] text-white font-semibold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer mt-2"
              >
                <span>Log In to Dashboard</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          ) : (
            /* ==================== SIGN UP FLOW ==================== */
            <div>
              {/* STEP 1: Account & Academic Year */}
              {signupStep === 1 && (
                <form onSubmit={handleStep1Next} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#5f7572] mb-1">
                      Full Name
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 absolute left-3 top-2.5 text-[#5f7572]" />
                      <input
                        type="text"
                        required
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="e.g. Aarav Sharma"
                        className="w-full pl-9 pr-3 py-2 text-xs bg-[#f6f9f8] border border-[#e2ece9] rounded-xl focus:outline-none focus:border-[#117c74] text-[#17222b]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#5f7572] mb-1">
                      Course & Academic Year
                    </label>
                    <input
                      type="text"
                      required
                      value={courseYear}
                      onChange={(e) => setCourseYear(e.target.value)}
                      placeholder="B.Tech CSE — 3rd Year"
                      className="w-full px-3.5 py-2 text-xs bg-[#f6f9f8] border border-[#e2ece9] rounded-xl focus:outline-none focus:border-[#117c74] text-[#17222b]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#5f7572] mb-1">
                      Email Address (Any Email Accepted)
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 absolute left-3 top-2.5 text-[#5f7572]" />
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="student@college.edu or name@gmail.com"
                        className="w-full pl-9 pr-3 py-2 text-xs bg-[#f6f9f8] border border-[#e2ece9] rounded-xl focus:outline-none focus:border-[#117c74] text-[#17222b]"
                      />
                    </div>

                    {/* Golden Badge Real-time Banner if ends with .edu */}
                    {isEduEmail ? (
                      <div className="mt-2 p-2.5 bg-[#fef9c3] border border-[#fde047] rounded-xl flex items-center gap-2 text-xs text-[#854d0e] animate-in fade-in">
                        <Award className="w-4 h-4 text-[#ca8a04] shrink-0" />
                        <span>
                          <strong>🎓 .edu College Email detected!</strong> Golden Verified Student badge will be awarded.
                        </span>
                      </div>
                    ) : (
                      <span className="text-[10px] text-[#5f7572] mt-1.5 block">
                        Tip: You can use any email. If your email ends in <code className="font-mono-code font-semibold">.edu</code>, you get an automatic Golden Verified Student badge!
                      </span>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#5f7572] mb-1">
                      Password
                    </label>
                    <div className="relative">
                      <Lock className="w-4 h-4 absolute left-3 top-2.5 text-[#5f7572]" />
                      <input
                        type="password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Create a strong password"
                        className="w-full pl-9 pr-3 py-2 text-xs bg-[#f6f9f8] border border-[#e2ece9] rounded-xl focus:outline-none focus:border-[#117c74] text-[#17222b]"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 px-4 bg-[#117c74] hover:bg-[#0d635c] text-white font-semibold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer mt-4"
                  >
                    <span>Continue to Step 2 — Lifestyle</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </form>
              )}

              {/* STEP 2: Lifestyle */}
              {signupStep === 2 && (
                <form onSubmit={handleStep2Next} className="space-y-4">
                  {/* Sleep Schedule (bedtime & wake time) */}
                  <div className="p-4 bg-[#f6f9f8] rounded-2xl border border-[#e2ece9] space-y-3">
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#17222b] flex items-center gap-1.5">
                      <Moon className="w-4 h-4 text-[#117c74]" /> Sleep Schedule (Bedtime & Wake Time)
                    </label>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <span className="text-[11px] text-[#5f7572] block mb-1">Typical Bedtime</span>
                        <select
                          value={bedtime}
                          onChange={(e) => {
                            setBedtime(e.target.value);
                            if (e.target.value.includes('10:') || e.target.value.includes('11:')) {
                              setSleepSchedule('early_bird');
                            } else if (e.target.value.includes('1:') || e.target.value.includes('2:')) {
                              setSleepSchedule('night_owl');
                            } else {
                              setSleepSchedule('flexible');
                            }
                          }}
                          className="w-full px-2.5 py-1.5 text-xs bg-white border border-[#e2ece9] rounded-lg"
                        >
                          <option value="10:00 PM">10:00 PM (Early)</option>
                          <option value="11:00 PM">11:00 PM (Standard)</option>
                          <option value="12:00 AM">12:00 Midnight</option>
                          <option value="01:00 AM">01:00 AM (Night Owl)</option>
                          <option value="02:30 AM+">02:30 AM+ (Late Night)</option>
                        </select>
                      </div>

                      <div>
                        <span className="text-[11px] text-[#5f7572] block mb-1">Typical Wake Time</span>
                        <select
                          value={wakeTime}
                          onChange={(e) => setWakeTime(e.target.value)}
                          className="w-full px-2.5 py-1.5 text-xs bg-white border border-[#e2ece9] rounded-lg"
                        >
                          <option value="06:00 AM">06:00 AM (Early Riser)</option>
                          <option value="07:30 AM">07:30 AM (Standard)</option>
                          <option value="08:30 AM">08:30 AM (Lecture Prep)</option>
                          <option value="09:30 AM+">09:30 AM+ (Late Riser)</option>
                        </select>
                      </div>
                    </div>

                    <div className="flex gap-2 pt-1">
                      {[
                        { key: 'early_bird', label: 'Early Bird 🌅' },
                        { key: 'night_owl', label: 'Night Owl 🦉' },
                        { key: 'flexible', label: 'Flexible 🔄' },
                      ].map((s) => (
                        <button
                          key={s.key}
                          type="button"
                          onClick={() => setSleepSchedule(s.key as SleepSchedule)}
                          className={`flex-1 py-1.5 text-xs font-semibold rounded-lg border transition-colors cursor-pointer ${
                            sleepSchedule === s.key
                              ? 'bg-[#117c74] text-white border-[#117c74]'
                              : 'bg-white text-[#5f7572] border-[#e2ece9] hover:bg-[#f6f9f8]'
                          }`}
                        >
                          {s.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Cleanliness (1-5 Scale) */}
                  <div className="p-4 bg-[#f6f9f8] rounded-2xl border border-[#e2ece9] space-y-2.5">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-bold uppercase tracking-wider text-[#17222b] flex items-center gap-1.5">
                        <Sparkles className="w-4 h-4 text-[#117c74]" /> Cleanliness Level (1–5 Scale)
                      </label>
                      <span className="text-xs font-bold text-[#117c74]">
                        {cleanlinessRating === 1 && '1/5 — Very Relaxed'}
                        {cleanlinessRating === 2 && '2/5 — Easygoing'}
                        {cleanlinessRating === 3 && '3/5 — Moderately Tidy'}
                        {cleanlinessRating === 4 && '4/5 — Very Organized'}
                        {cleanlinessRating === 5 && '5/5 — Spotless / Neat Freak'}
                      </span>
                    </div>

                    <div className="flex items-center justify-between gap-2">
                      {[1, 2, 3, 4, 5].map((lvl) => (
                        <button
                          key={lvl}
                          type="button"
                          onClick={() => setCleanlinessRating(lvl)}
                          className={`flex-1 py-2 text-xs font-bold rounded-xl border transition-all cursor-pointer ${
                            cleanlinessRating === lvl
                              ? 'bg-[#117c74] text-white border-[#117c74] shadow-xs'
                              : 'bg-white text-[#17222b] border-[#e2ece9] hover:bg-[#f6f9f8]'
                          }`}
                        >
                          {lvl}
                        </button>
                      ))}
                    </div>
                    <div className="flex justify-between text-[10px] text-[#5f7572]">
                      <span>Casual & Relaxed</span>
                      <span>Spotless & Sterilized</span>
                    </div>
                  </div>

                  {/* Noise Tolerance & Social Behavior */}
                  <div className="p-4 bg-[#f6f9f8] rounded-2xl border border-[#e2ece9] space-y-3">
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#17222b] flex items-center gap-1.5">
                      <Volume2 className="w-4 h-4 text-[#117c74]" /> Noise & Social Behavior
                    </label>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <span className="text-[11px] text-[#5f7572] block mb-1">Guest Hosting</span>
                        <select
                          value={guestFrequency}
                          onChange={(e) => setGuestFrequency(e.target.value)}
                          className="w-full px-2.5 py-1.5 text-xs bg-white border border-[#e2ece9] rounded-lg"
                        >
                          <option value="Never or rarely">Never or rarely</option>
                          <option value="Weekends only with notice">Weekends only with notice</option>
                          <option value="1-2 times a week">1-2 times a week</option>
                          <option value="Frequent guests welcome">Frequent guests welcome</option>
                        </select>
                      </div>

                      <div>
                        <span className="text-[11px] text-[#5f7572] block mb-1">Party / Gathering Policy</span>
                        <select
                          value={partyFrequency}
                          onChange={(e) => setPartyFrequency(e.target.value)}
                          className="w-full px-2.5 py-1.5 text-xs bg-white border border-[#e2ece9] rounded-lg"
                        >
                          <option value="Zero parties / quiet flat">Zero parties / absolute quiet</option>
                          <option value="Occasional chill gatherings">Occasional chill gatherings</option>
                          <option value="Love hosting social weekends">Love hosting social weekends</option>
                        </select>
                      </div>
                    </div>

                    <div className="flex gap-2 pt-1">
                      {[
                        { key: 'introvert', label: 'Introvert' },
                        { key: 'ambivert', label: 'Ambivert' },
                        { key: 'extrovert', label: 'Extrovert' },
                      ].map((s) => (
                        <button
                          key={s.key}
                          type="button"
                          onClick={() => setSocialHabit(s.key as SocialHabit)}
                          className={`flex-1 py-1 text-xs font-semibold rounded-lg border transition-colors cursor-pointer ${
                            socialHabit === s.key
                              ? 'bg-[#117c74] text-white border-[#117c74]'
                              : 'bg-white text-[#5f7572] border-[#e2ece9]'
                          }`}
                        >
                          {s.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Smoking / Drinking Tolerance */}
                  <div className="p-4 bg-[#f6f9f8] rounded-2xl border border-[#e2ece9] space-y-2">
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#17222b] flex items-center gap-1.5">
                      <Cigarette className="w-4 h-4 text-[#117c74]" /> Smoking & Drinking Tolerance
                    </label>
                    <select
                      value={substanceTolerance}
                      onChange={(e) => setSubstanceTolerance(e.target.value)}
                      className="w-full px-3 py-2 text-xs bg-white border border-[#e2ece9] rounded-xl text-[#17222b]"
                    >
                      <option value="Non-smoking & alcohol-free">Strictly non-smoking & alcohol-free</option>
                      <option value="Balcony/outdoor smoking only">Balcony / outdoor smoking only</option>
                      <option value="Social drinking OK, zero smoking">Social drinking OK, zero smoking</option>
                      <option value="Tolerant / completely fine">Tolerant / completely fine</option>
                    </select>
                  </div>

                  <div className="flex gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setSignupStep(1)}
                      className="flex-1 py-2.5 px-4 bg-[#f6f9f8] hover:bg-[#e2ece9] text-[#17222b] font-semibold text-xs rounded-xl transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                    >
                      <ArrowLeft className="w-4 h-4" /> Back
                    </button>
                    <button
                      type="submit"
                      className="flex-1 py-2.5 px-4 bg-[#117c74] hover:bg-[#0d635c] text-white font-semibold text-xs rounded-xl shadow-md transition-all cursor-pointer flex items-center justify-center gap-1.5"
                    >
                      Continue to Step 3 <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </form>
              )}

              {/* STEP 3: Preferences & Dealbreakers */}
              {signupStep === 3 && (
                <form onSubmit={handleCompleteSignup} className="space-y-4">
                  {/* Food Preference */}
                  <div className="p-4 bg-[#f6f9f8] rounded-2xl border border-[#e2ece9] space-y-2">
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#17222b] flex items-center gap-1.5">
                      <Utensils className="w-4 h-4 text-[#117c74]" /> Food Preference
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {[
                        { key: 'pure_veg', label: 'Strict Vegetarian' },
                        { key: 'non_veg', label: 'Non-Vegetarian' },
                        { key: 'eggetarian', label: 'Eggetarian' },
                        { key: 'jain', label: 'Jain Diet' },
                        { key: 'vegan', label: 'Vegan' },
                      ].map((f) => (
                        <button
                          key={f.key}
                          type="button"
                          onClick={() => setFoodPreference(f.key as FoodPreference)}
                          className={`py-2 px-2.5 text-xs font-semibold rounded-xl border text-center transition-colors cursor-pointer ${
                            foodPreference === f.key
                              ? 'bg-[#117c74] text-white border-[#117c74]'
                              : 'bg-white text-[#17222b] border-[#e2ece9]'
                          }`}
                        >
                          {f.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Study Habits */}
                  <div className="p-4 bg-[#f6f9f8] rounded-2xl border border-[#e2ece9] space-y-3">
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#17222b] flex items-center gap-1.5">
                      <BookOpen className="w-4 h-4 text-[#117c74]" /> Study Habits
                    </label>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <span className="text-[11px] text-[#5f7572] block mb-1">Study Timing</span>
                        <select
                          value={studySchedule}
                          onChange={(e) => setStudySchedule(e.target.value)}
                          className="w-full px-2.5 py-1.5 text-xs bg-white border border-[#e2ece9] rounded-lg"
                        >
                          <option value="Early riser studier (morning)">Early riser studier (morning)</option>
                          <option value="Night owl studier (late night)">Night owl studier (late night)</option>
                          <option value="Flexible daytime studier">Flexible daytime studier</option>
                        </select>
                      </div>

                      <div>
                        <span className="text-[11px] text-[#5f7572] block mb-1">Study Hours</span>
                        <select
                          value={studyHours}
                          onChange={(e) => setStudyHours(e.target.value)}
                          className="w-full px-2.5 py-1.5 text-xs bg-white border border-[#e2ece9] rounded-lg"
                        >
                          <option value="1–2 hours/day">1–2 hours/day</option>
                          <option value="3–4 hours/day">3–4 hours/day</option>
                          <option value="5+ hours/day (heavy exams)">5+ hours/day (heavy prep)</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Room Sharing Preference */}
                  <div className="p-4 bg-[#f6f9f8] rounded-2xl border border-[#e2ece9] space-y-2">
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#17222b] flex items-center gap-1.5">
                      <Home className="w-4 h-4 text-[#117c74]" /> Room Sharing Preference
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { key: 'private', label: 'Private Room' },
                        { key: 'shared', label: 'Shared Room' },
                        { key: 'any', label: 'Open to Either' },
                      ].map((r) => (
                        <button
                          key={r.key}
                          type="button"
                          onClick={() => setRoomSharing(r.key as any)}
                          className={`py-2 px-2 text-xs font-semibold rounded-xl border text-center transition-colors cursor-pointer ${
                            roomSharing === r.key
                              ? 'bg-[#117c74] text-white border-[#117c74]'
                              : 'bg-white text-[#17222b] border-[#e2ece9]'
                          }`}
                        >
                          {r.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Dealbreakers (Checkbox List) */}
                  <div className="p-4 bg-[#f6f9f8] rounded-2xl border border-[#e2ece9] space-y-2.5">
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#17222b]">
                      Strict Dealbreakers (Select all that apply)
                    </label>
                    <div className="space-y-1.5">
                      {dealbreakerOptions.map((item) => {
                        const checked = dealbreakers.includes(item);
                        return (
                          <label
                            key={item}
                            onClick={() => toggleDealbreaker(item)}
                            className={`p-2 rounded-xl border text-xs flex items-center justify-between cursor-pointer transition-colors ${
                              checked
                                ? 'bg-[#fef2f2] border-[#fecdd3] text-[#991b1b] font-medium'
                                : 'bg-white border-[#e2ece9] text-[#5f7572]'
                            }`}
                          >
                            <span>{item}</span>
                            <div
                              className={`w-4 h-4 rounded-md flex items-center justify-center border text-[10px] ${
                                checked
                                  ? 'bg-[#f43f5e] text-white border-[#f43f5e]'
                                  : 'border-[#cbd5e1]'
                              }`}
                            >
                              {checked && '✓'}
                            </div>
                          </label>
                        );
                      })}
                    </div>
                  </div>

                  {/* Budget Slider */}
                  <div className="p-4 bg-[#f6f9f8] rounded-2xl border border-[#e2ece9] space-y-2">
                    <div className="flex justify-between text-xs font-bold text-[#17222b]">
                      <span>Monthly Rent Budget</span>
                      <span className="text-[#117c74]">
                        ₹{budgetMin.toLocaleString('en-IN')} – ₹{budgetMax.toLocaleString('en-IN')}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <span className="text-[10px] text-[#5f7572]">Min (₹{budgetMin})</span>
                        <input
                          type="range"
                          min={5000}
                          max={18000}
                          step={500}
                          value={budgetMin}
                          onChange={(e) => setBudgetMin(Number(e.target.value))}
                          className="w-full accent-[#117c74]"
                        />
                      </div>
                      <div>
                        <span className="text-[10px] text-[#5f7572]">Max (₹{budgetMax})</span>
                        <input
                          type="range"
                          min={10000}
                          max={35000}
                          step={500}
                          value={budgetMax}
                          onChange={(e) => setBudgetMax(Number(e.target.value))}
                          className="w-full accent-[#117c74]"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setSignupStep(2)}
                      className="flex-1 py-3 px-4 bg-[#f6f9f8] hover:bg-[#e2ece9] text-[#17222b] font-semibold text-xs rounded-xl transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                    >
                      <ArrowLeft className="w-4 h-4" /> Back
                    </button>
                    <button
                      type="submit"
                      className="flex-1 py-3 px-4 bg-[#117c74] hover:bg-[#0d635c] text-white font-semibold text-xs rounded-xl shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
                    >
                      <span>Complete Sign Up 🚀</span>
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}

          {/* Toggle mode link */}
          <div className="text-center text-xs text-[#5f7572] pt-2">
            {mode === 'login' ? (
              <span>
                Don't have an account?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setMode('signup');
                    setSignupStep(1);
                    onNavigate('/signup');
                  }}
                  className="font-bold text-[#117c74] hover:underline cursor-pointer"
                >
                  Sign Up Free
                </button>
              </span>
            ) : (
              <span>
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setMode('login');
                    onNavigate('/login');
                  }}
                  className="font-bold text-[#117c74] hover:underline cursor-pointer"
                >
                  Log In
                </button>
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="py-4 text-center text-xs text-[#5f7572] border-t border-[#e2ece9] bg-white">
        RoomSync — College Student Housing Platform (2026)
      </footer>
    </div>
  );
};
