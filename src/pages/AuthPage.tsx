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
  Clock,
  Coffee,
  Briefcase,
  GraduationCap,
  Laptop,
  AlertCircle,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { SleepSchedule, CleanlinessLevel, SocialHabit, FoodPreference, StudyHabit } from '../types';
import { INDIAN_STUDENT_AVATARS } from '../data/seedData';

interface AuthPageProps {
  initialMode: 'login' | 'signup';
  onNavigate: (path: string) => void;
}

export const AuthPage: React.FC<AuthPageProps> = ({ initialMode, onNavigate }) => {
  const {
    currentUser,
    login,
    register,
    showToast,
  } = useApp();

  const [mode, setMode] = useState<'login' | 'signup'>(initialMode);

  // Initial Account Details
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [userType, setUserType] = useState<'professional' | 'student' | 'freelancer' | 'other'>('professional');
  const [professionOrCollege, setProfessionOrCollege] = useState('Senior Product Designer');
  const [loginError, setLoginError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Secondary Onboarding Modal State
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);
  const [onboardingStep, setOnboardingStep] = useState<1 | 2>(1);

  // Lifestyle Details (Step 1)
  const [bedtime, setBedtime] = useState('11:00 PM');
  const [wakeTime, setWakeTime] = useState('07:30 AM');
  const [sleepSchedule, setSleepSchedule] = useState<SleepSchedule>('early_bird');
  const [cleanlinessRating, setCleanlinessRating] = useState<number>(4);
  const [guestFrequency, setGuestFrequency] = useState('Weekends only with notice');
  const [partyFrequency, setPartyFrequency] = useState('Zero parties / quiet flat');
  const [socialHabit, setSocialHabit] = useState<SocialHabit>('ambivert');
  const [substanceTolerance, setSubstanceTolerance] = useState('Strictly non-smoking & alcohol-free');

  // Preferences (Step 2)
  const [foodPreference, setFoodPreference] = useState<FoodPreference>('pure_veg');
  const [cookPreference, setCookPreference] = useState('Cook sharing (ghar ka khana split 50:50)');
  const [studySchedule, setStudySchedule] = useState('Regular daytime work routine (9 AM - 6 PM)');
  const [studyHours, setStudyHours] = useState('3–4 hours/day');
  const [studyHabit, setStudyHabit] = useState<StudyHabit>('ambient_music');
  const [roomSharing, setRoomSharing] = useState<'private' | 'shared' | 'any'>('private');
  const [dealbreakers, setDealbreakers] = useState<string[]>([
    'No indoor smoking (balcony only)',
    'Strict quiet hours after 11 PM',
  ]);
  const [selectedAvatar, setSelectedAvatar] = useState(INDIAN_STUDENT_AVATARS[0].url);
  const [budgetMin, setBudgetMin] = useState(10000);
  const [budgetMax, setBudgetMax] = useState(20000);

  // Check if email ends with .edu
  const isEduEmail =
    email.trim().toLowerCase().endsWith('.edu') ||
    email.trim().toLowerCase().includes('.edu');

  const dealbreakerOptions = [
    'No indoor smoking (balcony only)',
    'No alcohol or parties inside the flat',
    'No non-veg food / cookware in kitchen',
    'No unannounced overnight guests',
    'No pets',
    'Strict quiet hours after 11 PM',
    'Dishes must be washed immediately after eating',
    'Equal split of maid & cook bills by 1st of month',
  ];

  const toggleDealbreaker = (item: string) => {
    if (dealbreakers.includes(item)) {
      setDealbreakers(dealbreakers.filter((d) => d !== item));
    } else {
      setDealbreakers([...dealbreakers, item]);
    }
  };

  // Step 1 of Initial Account Submit -> Triggers the secondary Onboarding modal
  const handleInitialSignupSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !fullName.trim()) return;
    setIsOnboardingOpen(true);
    setOnboardingStep(1);
  };

  // Final Complete Sign Up Submit from Onboarding Modal
  const handleCompleteOnboarding = async (e: React.FormEvent) => {
    e.preventDefault();

    let cleanLevel: CleanlinessLevel = 'moderate';
    if (cleanlinessRating >= 4) cleanLevel = 'neat_freak';
    else if (cleanlinessRating <= 2) cleanLevel = 'relaxed';

    setIsSubmitting(true);
    try {
      const res = await register({
        fullName: fullName.trim(),
        email: email.trim(),
        password: password.trim() || 'password123',
        profileUpdates: {
          userType,
          courseYear: professionOrCollege.trim() || (userType === 'student' ? 'College Student' : 'Working Professional'),
          company: userType === 'professional' ? professionOrCollege.trim() : undefined,
          college: userType === 'student' ? professionOrCollege.trim() : undefined,
          collegeEmail: isEduEmail ? email.trim() : undefined,
          isStudentVerified: isEduEmail,
          isProfessionalVerified: !isEduEmail && userType === 'professional',
          sleepSchedule,
          bedtime,
          wakeTime,
          cleanliness: cleanLevel,
          cleanlinessRating,
          socialHabits: socialHabit,
          noiseTolerance: `${guestFrequency} · ${partyFrequency}`,
          smokingDrinkingTolerance: substanceTolerance,
          foodPreference,
          studyHabits: studyHabit,
          studySchedule: `${studySchedule} (${studyHours})`,
          roomSharingPreference: roomSharing,
          dealbreakers,
          avatarUrl: selectedAvatar,
          budgetMin,
          budgetMax,
          profileCompletion: 100,
        },
      });

      if (res.success) {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
        });

        if (isEduEmail) {
          showToast('🎓 Golden Verified Student badge awarded! (.edu email verified)');
        } else if (userType === 'professional') {
          showToast('💼 Welcome! Professional roommate profile created.');
        } else {
          showToast('Account created & roommate profile configured in database!');
        }

        onNavigate('/dashboard');
      } else {
        showToast(res.message || 'Registration failed');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);
    if (!email.trim()) return;

    setIsSubmitting(true);
    try {
      const res = await login(email.trim(), password.trim() || undefined);
      if (res.success) {
        onNavigate('/dashboard');
      } else {
        setLoginError(res.message || 'Login failed. Please check credentials or sign up.');
      }
    } finally {
      setIsSubmitting(false);
    }
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
        <div className="w-full max-w-md bg-white rounded-3xl border border-[#e2ece9] shadow-xl overflow-hidden p-6 sm:p-8 space-y-6">
          {/* Header */}
          <div className="text-center space-y-1">
            <h2 className="font-heading text-2xl font-bold text-[#17222b]">
              {mode === 'login' ? 'Welcome back to RoomSync' : 'Create Your RoomSync Account'}
            </h2>
            <p className="text-xs text-[#5f7572]">
              {mode === 'login'
                ? 'Sign in to access your roommate compatibility feed and verified flats.'
                : 'For working professionals, students, and flatmates. Find verified roommates with real compatibility.'}
            </p>
          </div>

          {/* Mode Switch Tabs */}
          <div className="flex p-1 bg-[#f6f9f8] rounded-xl border border-[#e2ece9]">
            <button
              type="button"
              onClick={() => {
                setMode('login');
                setLoginError(null);
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
                setLoginError(null);
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

          {/* ==================== LOGIN VIEW ==================== */}
          {mode === 'login' ? (
            <div className="space-y-4">
              {loginError && (
                <div className="p-3 bg-[#fef2f2] border border-[#fecdd3] rounded-xl text-xs text-[#991b1b] flex items-start gap-2 animate-in fade-in">
                  <AlertCircle className="w-4 h-4 shrink-0 text-[#f43f5e] mt-0.5" />
                  <div className="flex-1">
                    <span>{loginError}</span>
                    <button
                      type="button"
                      onClick={() => {
                        setMode('signup');
                        setLoginError(null);
                        onNavigate('/signup');
                      }}
                      className="block text-[#117c74] font-bold underline mt-1 cursor-pointer"
                    >
                      Sign up with "{email}" instead &rarr;
                    </button>
                  </div>
                </div>
              )}

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
                      placeholder="you@email.com or company@work.com"
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
                      placeholder="Enter your password"
                      className="w-full pl-9 pr-3 py-2 text-xs bg-[#f6f9f8] border border-[#e2ece9] rounded-xl focus:outline-none focus:border-[#117c74] text-[#17222b]"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 px-4 bg-[#117c74] hover:bg-[#0d635c] text-white font-semibold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer mt-2 disabled:opacity-50"
                >
                  <span>{isSubmitting ? 'Authenticating...' : 'Log In to Dashboard'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            </div>
          ) : (
            /* ==================== SIGN UP INITIAL FORM ==================== */
            <form onSubmit={handleInitialSignupSubmit} className="space-y-4">
              {/* User Type / Role Selector */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#5f7572] mb-1.5">
                  I am a:
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { key: 'professional', label: 'Working Professional', icon: Briefcase },
                    { key: 'student', label: 'College Student', icon: GraduationCap },
                    { key: 'freelancer', label: 'Freelancer / Remote', icon: Laptop },
                    { key: 'other', label: 'Flatmate / Other', icon: Home },
                  ].map((t) => {
                    const Icon = t.icon;
                    const isSelected = userType === t.key;
                    return (
                      <button
                        key={t.key}
                        type="button"
                        onClick={() => {
                          setUserType(t.key as any);
                          if (t.key === 'professional') setProfessionOrCollege('Software Engineer @ TechCorp');
                          else if (t.key === 'student') setProfessionOrCollege('B.Tech CSE — 3rd Year');
                          else if (t.key === 'freelancer') setProfessionOrCollege('Freelance UI Designer');
                          else setProfessionOrCollege('Flatseeker');
                        }}
                        className={`p-2 rounded-xl border text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-[#117c74] text-white border-[#117c74] shadow-xs'
                            : 'bg-[#f6f9f8] text-[#17222b] border-[#e2ece9] hover:bg-white'
                        }`}
                      >
                        <Icon className="w-4 h-4 shrink-0" />
                        <span className="truncate text-[11px]">{t.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

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
                    placeholder="e.g. Priya Patel or Aarav Sharma"
                    className="w-full pl-9 pr-3 py-2 text-xs bg-[#f6f9f8] border border-[#e2ece9] rounded-xl focus:outline-none focus:border-[#117c74] text-[#17222b]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#5f7572] mb-1">
                  {userType === 'student'
                    ? 'College & Academic Year'
                    : userType === 'professional'
                    ? 'Company & Job Title'
                    : 'Profession / Field'}
                </label>
                <div className="relative">
                  {userType === 'student' ? (
                    <GraduationCap className="w-4 h-4 absolute left-3 top-2.5 text-[#5f7572]" />
                  ) : (
                    <Briefcase className="w-4 h-4 absolute left-3 top-2.5 text-[#5f7572]" />
                  )}
                  <input
                    type="text"
                    required
                    value={professionOrCollege}
                    onChange={(e) => setProfessionOrCollege(e.target.value)}
                    placeholder={
                      userType === 'student'
                        ? 'e.g. B.Tech CSE — 3rd Year'
                        : userType === 'professional'
                        ? 'e.g. Senior UX Designer @ TechCorp'
                        : 'e.g. Freelance Architect'
                    }
                    className="w-full pl-9 pr-3 py-2 text-xs bg-[#f6f9f8] border border-[#e2ece9] rounded-xl focus:outline-none focus:border-[#117c74] text-[#17222b]"
                  />
                </div>
              </div>

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
                    placeholder="name@gmail.com or company@work.com"
                    className="w-full pl-9 pr-3 py-2 text-xs bg-[#f6f9f8] border border-[#e2ece9] rounded-xl focus:outline-none focus:border-[#117c74] text-[#17222b]"
                  />
                </div>

                {/* Badge preview if .edu email */}
                {isEduEmail ? (
                  <div className="mt-2 p-2.5 bg-[#fef9c3] border border-[#fde047] rounded-xl flex items-center gap-2 text-xs text-[#854d0e] animate-in fade-in">
                    <Award className="w-4 h-4 text-[#ca8a04] shrink-0" />
                    <span>
                      <strong>🎓 .edu College Email detected!</strong> Golden Verified Student badge will be awarded.
                    </span>
                  </div>
                ) : (
                  <span className="text-[10px] text-[#5f7572] mt-1.5 block">
                    Any email is accepted. All profiles receive trust verification.
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
                className="w-full py-3 px-4 bg-[#117c74] hover:bg-[#0d635c] text-white font-semibold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer mt-2"
              >
                <span>Continue to Lifestyle & Preferences</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}

          {/* Toggle mode link */}
          <div className="text-center text-xs text-[#5f7572]">
            {mode === 'login' ? (
              <span>
                Don't have an account?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setMode('signup');
                    setLoginError(null);
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
                    setLoginError(null);
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

      {/* ==================== SECONDARY ONBOARDING MODAL ==================== */}
      {isOnboardingOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
          <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-[#e2ece9] overflow-hidden max-h-[92vh] flex flex-col">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-[#e2ece9] bg-gradient-to-r from-[#117c74]/10 via-transparent to-[#10b981]/10 flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-heading text-lg font-bold text-[#17222b]">
                    {onboardingStep === 1
                      ? 'Step 2 — Lifestyle'
                      : 'Step 3 — Preferences'}
                  </h3>
                  <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-[#117c74] text-white">
                    Step {onboardingStep === 1 ? '2 of 3' : '3 of 3'}
                  </span>
                </div>
                <p className="text-xs text-[#5f7572] mt-0.5">
                  {onboardingStep === 1
                    ? `Welcome, ${fullName || 'Flatmate'}! Tell us your sleep routine, cleanliness, and social vibe.`
                    : 'Configure food preferences, work/study routine, room sharing, and flat dealbreakers.'}
                </p>
              </div>

              {/* Verified badge preview in header */}
              {isEduEmail && (
                <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-1 bg-[#fef9c3] border border-[#fde047] text-[#854d0e] text-[11px] font-bold rounded-full">
                  🎓 .edu Golden Badge Active
                </span>
              )}
            </div>

            {/* Modal Progress Line */}
            <div className="w-full bg-[#e2ece9] h-1">
              <div
                className="bg-[#117c74] h-full transition-all duration-300"
                style={{ width: onboardingStep === 1 ? '50%' : '100%' }}
              />
            </div>

            {/* Modal Form Content */}
            <div className="p-6 overflow-y-auto space-y-5 flex-1">
              {/* STEP 1: LIFESTYLE DETAILS */}
              {onboardingStep === 1 && (
                <div className="space-y-4">
                  {/* Indian Student Avatar Selector */}
                  <div className="p-4 bg-[#f6f9f8] rounded-2xl border border-[#e2ece9] space-y-2">
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#17222b]">
                      Choose Your Avatar
                    </label>
                    <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
                      {INDIAN_STUDENT_AVATARS.map((av) => {
                        const isSelected = selectedAvatar === av.url;
                        return (
                          <button
                            key={av.id}
                            type="button"
                            onClick={() => setSelectedAvatar(av.url)}
                            className={`relative rounded-2xl overflow-hidden aspect-square border-2 transition-transform cursor-pointer ${
                              isSelected
                                ? 'border-[#117c74] scale-105 shadow-md ring-2 ring-[#117c74]/20'
                                : 'border-transparent hover:scale-102 opacity-80 hover:opacity-100'
                            }`}
                            title={av.name}
                          >
                            <img
                              src={av.url}
                              alt={av.name}
                              className="w-full h-full object-cover"
                            />
                            {isSelected && (
                              <div className="absolute inset-0 bg-[#117c74]/20 flex items-center justify-center">
                                <Check className="w-4 h-4 text-white drop-shadow-md stroke-[3]" />
                              </div>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Sleep Schedule (bedtime / wake time) */}
                  <div className="p-4 bg-[#f6f9f8] rounded-2xl border border-[#e2ece9] space-y-3">
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#17222b] flex items-center gap-1.5">
                      <Moon className="w-4 h-4 text-[#117c74]" /> Sleep Schedule (Bedtime & Wake Time)
                    </label>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <span className="text-[11px] text-[#5f7572] block mb-1">
                          Typical Bedtime
                        </span>
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
                          className="w-full px-3 py-2 text-xs bg-white border border-[#e2ece9] rounded-xl text-[#17222b]"
                        >
                          <option value="10:00 PM">10:00 PM (Early Bird)</option>
                          <option value="11:00 PM">11:00 PM (Balanced)</option>
                          <option value="12:00 AM">12:00 Midnight</option>
                          <option value="01:00 AM">01:00 AM (Late night coding/study)</option>
                          <option value="02:30 AM+">02:30 AM+ (Night Owl)</option>
                        </select>
                      </div>

                      <div>
                        <span className="text-[11px] text-[#5f7572] block mb-1">
                          Typical Wake Time
                        </span>
                        <select
                          value={wakeTime}
                          onChange={(e) => setWakeTime(e.target.value)}
                          className="w-full px-3 py-2 text-xs bg-white border border-[#e2ece9] rounded-xl text-[#17222b]"
                        >
                          <option value="06:00 AM">06:00 AM (Early workout/prep)</option>
                          <option value="07:30 AM">07:30 AM (Morning prep)</option>
                          <option value="08:30 AM">08:30 AM (Standard)</option>
                          <option value="09:30 AM+">09:30 AM+ (Late riser)</option>
                        </select>
                      </div>
                    </div>

                    <div className="flex gap-2 pt-1">
                      {[
                        { key: 'early_bird', label: 'Early Bird 🌅', note: 'Sleep before 11 PM' },
                        { key: 'night_owl', label: 'Night Owl 🦉', note: 'Active past 1 AM' },
                        { key: 'flexible', label: 'Flexible 🔄', note: 'Adaptable routine' },
                      ].map((s) => (
                        <button
                          key={s.key}
                          type="button"
                          onClick={() => setSleepSchedule(s.key as SleepSchedule)}
                          className={`flex-1 p-2 rounded-xl border text-center transition-all cursor-pointer ${
                            sleepSchedule === s.key
                              ? 'bg-[#117c74] text-white border-[#117c74] shadow-xs'
                              : 'bg-white text-[#5f7572] border-[#e2ece9]'
                          }`}
                        >
                          <div className="text-xs font-bold">{s.label}</div>
                          <div className="text-[10px] opacity-80 mt-0.5">{s.note}</div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Cleanliness (1-5 Scale) */}
                  <div className="p-4 bg-[#f6f9f8] rounded-2xl border border-[#e2ece9] space-y-2.5">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-bold uppercase tracking-wider text-[#17222b] flex items-center gap-1.5">
                        <Sparkles className="w-4 h-4 text-[#117c74]" /> Cleanliness (1–5 Scale)
                      </label>
                      <span className="text-xs font-bold text-[#117c74]">
                        {cleanlinessRating === 1 && '1/5 — Very Casual'}
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
                              : 'bg-white text-[#17222b] border-[#e2ece9]'
                          }`}
                        >
                          {lvl}
                        </button>
                      ))}
                    </div>
                    <div className="flex justify-between text-[10px] text-[#5f7572]">
                      <span>Casual about clutter</span>
                      <span>Daily sweep & zero dishes in sink</span>
                    </div>
                  </div>

                  {/* Noise Tolerance & Social/Party Habits */}
                  <div className="p-4 bg-[#f6f9f8] rounded-2xl border border-[#e2ece9] space-y-3">
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#17222b] flex items-center gap-1.5">
                      <Volume2 className="w-4 h-4 text-[#117c74]" /> Social & Party Behavior
                    </label>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <span className="text-[11px] text-[#5f7572] block mb-1">
                          Guest Hosting Frequency
                        </span>
                        <select
                          value={guestFrequency}
                          onChange={(e) => setGuestFrequency(e.target.value)}
                          className="w-full px-3 py-2 text-xs bg-white border border-[#e2ece9] rounded-xl text-[#17222b]"
                        >
                          <option value="Never or rarely">Never or rarely</option>
                          <option value="Weekends only with notice">Weekends only with notice</option>
                          <option value="1-2 times a week">1-2 times a week</option>
                          <option value="Frequent guests welcome">Frequent guests welcome</option>
                        </select>
                      </div>

                      <div>
                        <span className="text-[11px] text-[#5f7572] block mb-1">
                          Party & Gathering Policy
                        </span>
                        <select
                          value={partyFrequency}
                          onChange={(e) => setPartyFrequency(e.target.value)}
                          className="w-full px-3 py-2 text-xs bg-white border border-[#e2ece9] rounded-xl text-[#17222b]"
                        >
                          <option value="Zero parties / quiet flat">Zero parties / strict quiet flat</option>
                          <option value="Occasional chill chai/study gatherings">Occasional chill chai/study gatherings</option>
                          <option value="Love hosting social weekends">Love hosting social weekends</option>
                        </select>
                      </div>
                    </div>

                    <div className="flex gap-2 pt-1">
                      {[
                        { key: 'introvert', label: 'Introvert 🧘', desc: 'Quiet personal recharge' },
                        { key: 'ambivert', label: 'Ambivert ⚖️', desc: 'Balanced social vibe' },
                        { key: 'extrovert', label: 'Extrovert 🎉', desc: 'Enjoys socializing' },
                      ].map((s) => (
                        <button
                          key={s.key}
                          type="button"
                          onClick={() => setSocialHabit(s.key as SocialHabit)}
                          className={`flex-1 p-2 text-xs font-semibold rounded-xl border text-center transition-all cursor-pointer ${
                            socialHabit === s.key
                              ? 'bg-[#117c74] text-white border-[#117c74] shadow-xs'
                              : 'bg-white text-[#5f7572] border-[#e2ece9]'
                          }`}
                        >
                          <div className="font-bold">{s.label}</div>
                          <div className="text-[10px] opacity-80 mt-0.5">{s.desc}</div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Smoking & Drinking Tolerance */}
                  <div className="p-4 bg-[#f6f9f8] rounded-2xl border border-[#e2ece9] space-y-2">
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#17222b] flex items-center gap-1.5">
                      <Cigarette className="w-4 h-4 text-[#117c74]" /> Smoking & Drinking Tolerance
                    </label>
                    <select
                      value={substanceTolerance}
                      onChange={(e) => setSubstanceTolerance(e.target.value)}
                      className="w-full px-3 py-2 text-xs bg-white border border-[#e2ece9] rounded-xl text-[#17222b]"
                    >
                      <option value="Strictly non-smoking & alcohol-free">Strictly non-smoking & alcohol-free flat</option>
                      <option value="Balcony / outdoor smoking only">Balcony / outdoor smoking only</option>
                      <option value="Social drinking OK, zero indoor smoke">Social drinking OK, zero indoor smoke</option>
                      <option value="Tolerant / completely fine">Tolerant / completely fine</option>
                    </select>
                  </div>
                </div>
              )}

              {/* STEP 2: PREFERENCES */}
              {onboardingStep === 2 && (
                <div className="space-y-4">
                  {/* Food preference (veg / non-veg / eggetarian / Jain / vegan) */}
                  <div className="p-4 bg-[#f6f9f8] rounded-2xl border border-[#e2ece9] space-y-3">
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#17222b] flex items-center gap-1.5">
                      <Utensils className="w-4 h-4 text-[#117c74]" /> Food Preferences
                    </label>

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {[
                        { key: 'pure_veg', label: 'Strict Vegetarian 🥦', desc: 'No eggs, no meat' },
                        { key: 'non_veg', label: 'Non-Vegetarian 🍗', desc: 'Chicken/meat OK' },
                        { key: 'eggetarian', label: 'Eggetarian 🥚', desc: 'Eggs OK, no meat' },
                        { key: 'jain', label: 'Jain Diet 🌾', desc: 'No root vegetables' },
                        { key: 'vegan', label: 'Vegan 🌱', desc: 'Plant-based only' },
                      ].map((f) => (
                        <button
                          key={f.key}
                          type="button"
                          onClick={() => setFoodPreference(f.key as FoodPreference)}
                          className={`p-2.5 text-xs font-semibold rounded-xl border text-center transition-all cursor-pointer ${
                            foodPreference === f.key
                              ? 'bg-[#117c74] text-white border-[#117c74] shadow-xs'
                              : 'bg-white text-[#17222b] border-[#e2ece9]'
                          }`}
                        >
                          <div className="font-bold">{f.label}</div>
                          <div className="text-[10px] opacity-80 mt-0.5">{f.desc}</div>
                        </button>
                      ))}
                    </div>

                    <div className="pt-1">
                      <span className="text-[11px] text-[#5f7572] block mb-1">
                        Cook & Tiffin Plan
                      </span>
                      <select
                        value={cookPreference}
                        onChange={(e) => setCookPreference(e.target.value)}
                        className="w-full px-3 py-2 text-xs bg-white border border-[#e2ece9] rounded-xl text-[#17222b]"
                      >
                        <option value="Cook sharing (ghar ka khana split 50:50)">Hire common flat cook (ghar ka khana split 50:50)</option>
                        <option value="Tiffin service delivery">Daily tiffin delivery</option>
                        <option value="Self-cooking in flat">Self-cooking / independent groceries</option>
                        <option value="Order via Swiggy/Zomato">Campus mess / food delivery</option>
                      </select>
                    </div>
                  </div>

                  {/* Work / Study habits (schedule, intensity, focus) */}
                  <div className="p-4 bg-[#f6f9f8] rounded-2xl border border-[#e2ece9] space-y-3">
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#17222b] flex items-center gap-1.5">
                      <BookOpen className="w-4 h-4 text-[#117c74]" /> Work & Study Focus (Rhythm & Routine)
                    </label>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <span className="text-[11px] text-[#5f7572] block mb-1">
                          Daily Work / Study Schedule
                        </span>
                        <select
                          value={studySchedule}
                          onChange={(e) => setStudySchedule(e.target.value)}
                          className="w-full px-3 py-2 text-xs bg-white border border-[#e2ece9] rounded-xl text-[#17222b]"
                        >
                          <option value="Standard daytime (9 AM – 6 PM work/classes)">Standard 9 AM – 6 PM (Office/Campus)</option>
                          <option value="Early riser focus (06:00 AM start)">Early riser (06:00 AM morning focus)</option>
                          <option value="Night owl routine (11 PM – 03 AM late hours)">Night owl (Late night coder / studier)</option>
                          <option value="Flexible hybrid / remote routine">Flexible hybrid / remote schedule</option>
                        </select>
                      </div>

                      <div>
                        <span className="text-[11px] text-[#5f7572] block mb-1">
                          Focus Intensity / Screen Time
                        </span>
                        <select
                          value={studyHours}
                          onChange={(e) => setStudyHours(e.target.value)}
                          className="w-full px-3 py-2 text-xs bg-white border border-[#e2ece9] rounded-xl text-[#17222b]"
                        >
                          <option value="2–3 hours/day">2–3 hours/day (Casual)</option>
                          <option value="4–6 hours/day">4–6 hours/day (Standard)</option>
                          <option value="7–9 hours/day">7–9 hours/day (Full-time job / Intensive)</option>
                        </select>
                      </div>
                    </div>

                    <div className="flex gap-2 pt-1">
                      {[
                        { key: 'ambient_music', label: 'Lo-Fi / Ambient 🎧' },
                        { key: 'deep_silence', label: 'Library Silence 🤫' },
                        { key: 'group_study', label: 'Group Discussions 👥' },
                      ].map((st) => (
                        <button
                          key={st.key}
                          type="button"
                          onClick={() => setStudyHabit(st.key as StudyHabit)}
                          className={`flex-1 py-1.5 text-xs font-semibold rounded-lg border text-center transition-colors cursor-pointer ${
                            studyHabit === st.key
                              ? 'bg-[#117c74] text-white border-[#117c74]'
                              : 'bg-white text-[#5f7572] border-[#e2ece9]'
                          }`}
                        >
                          {st.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Room sharing preference */}
                  <div className="p-4 bg-[#f6f9f8] rounded-2xl border border-[#e2ece9] space-y-2">
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#17222b] flex items-center gap-1.5">
                      <Home className="w-4 h-4 text-[#117c74]" /> Room Sharing Preference
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { key: 'private', label: 'Private Room', sub: 'Single room in flat' },
                        { key: 'shared', label: 'Shared Room', sub: 'Twin sharing in room' },
                        { key: 'any', label: 'Open to Either', sub: 'Flexible' },
                      ].map((r) => (
                        <button
                          key={r.key}
                          type="button"
                          onClick={() => setRoomSharing(r.key as any)}
                          className={`p-2.5 text-xs font-semibold rounded-xl border text-center transition-all cursor-pointer ${
                            roomSharing === r.key
                              ? 'bg-[#117c74] text-white border-[#117c74] shadow-xs'
                              : 'bg-white text-[#17222b] border-[#e2ece9]'
                          }`}
                        >
                          <div className="font-bold">{r.label}</div>
                          <div className="text-[10px] opacity-75 mt-0.5">{r.sub}</div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Checklist for Dealbreakers */}
                  <div className="p-4 bg-[#f6f9f8] rounded-2xl border border-[#e2ece9] space-y-2.5">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-bold uppercase tracking-wider text-[#17222b]">
                        Checklist for Flat Dealbreakers
                      </label>
                      <span className="text-[10px] text-[#5f7572]">
                        {dealbreakers.length} selected
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
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
                            <span className="truncate pr-2">{item}</span>
                            <div
                              className={`w-4 h-4 rounded-md flex items-center justify-center border text-[10px] shrink-0 ${
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
                </div>
              )}
            </div>

            {/* Modal Footer Controls */}
            <div className="px-6 py-4 border-t border-[#e2ece9] bg-white flex items-center justify-between">
              {onboardingStep === 1 ? (
                <button
                  type="button"
                  onClick={() => setIsOnboardingOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-[#5f7572] hover:bg-[#f6f9f8] rounded-xl cursor-pointer"
                >
                  Edit Account Details
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => setOnboardingStep(1)}
                  className="px-4 py-2 text-xs font-semibold text-[#5f7572] hover:bg-[#f6f9f8] rounded-xl cursor-pointer flex items-center gap-1.5"
                >
                  <ArrowLeft className="w-4 h-4" /> Back to Lifestyle
                </button>
              )}

              {onboardingStep === 1 ? (
                <button
                  type="button"
                  onClick={() => setOnboardingStep(2)}
                  className="px-5 py-2.5 bg-[#117c74] hover:bg-[#0d635c] text-white font-semibold text-xs rounded-xl shadow-xs transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <span>Continue to Step 3 — Preferences</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleCompleteOnboarding}
                  className="px-6 py-2.5 bg-[#117c74] hover:bg-[#0d635c] text-white font-bold text-xs rounded-xl shadow-md transition-all cursor-pointer flex items-center gap-2"
                >
                  <CheckCircle className="w-4 h-4" />
                  <span>Complete Onboarding & Find Matches 🚀</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="py-4 text-center text-xs text-[#5f7572] border-t border-[#e2ece9] bg-white">
        RoomSync — College Student Housing Platform (2026)
      </footer>
    </div>
  );
};
