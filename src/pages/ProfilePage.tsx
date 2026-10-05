import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { VerifiedBadge } from '../components/common/VerifiedBadge';
import {
  User,
  ShieldCheck,
  CheckCircle,
  Sparkles,
  Download,
  Trash2,
  Mail,
  Key,
  CreditCard,
  MapPin,
  Save,
  Clock,
  Moon,
  Sun,
  Utensils,
  BookOpen,
  Briefcase,
  GraduationCap,
} from 'lucide-react';

export const ProfilePage: React.FC = () => {
  const {
    currentUser,
    updateCurrentUser,
    verifyCollegeEmail,
    verifyProfessionalEmail,
    sendVerificationOtp,
    generatedOtp,
    showToast,
  } = useApp();

  // Form State
  const [fullName, setFullName] = useState(currentUser.fullName);
  const [courseYear, setCourseYear] = useState(currentUser.courseYear || '');
  const [bio, setBio] = useState(currentUser.bio || '');
  const [upiId, setUpiId] = useState(currentUser.upiId || '');
  const [budgetMin, setBudgetMin] = useState(currentUser.budgetMin || 8000);
  const [budgetMax, setBudgetMax] = useState(currentUser.budgetMax || 18000);
  const [sleepSchedule, setSleepSchedule] = useState(currentUser.sleepSchedule);
  const [cleanliness, setCleanliness] = useState(currentUser.cleanliness);
  const [socialHabits, setSocialHabits] = useState(currentUser.socialHabits);
  const [foodPreference, setFoodPreference] = useState(currentUser.foodPreference);
  const [studyHabits, setStudyHabits] = useState(currentUser.studyHabits);
  const [selectedLocalities, setSelectedLocalities] = useState<string[]>(
    currentUser.preferredLocalities || ['Sector 23']
  );

  // Verification State
  const [verificationType, setVerificationType] = useState<'student' | 'professional'>(
    currentUser.userType === 'student' || currentUser.isStudentVerified ? 'student' : 'professional'
  );
  const [verificationEmailInput, setVerificationEmailInput] = useState(
    currentUser.collegeEmail || currentUser.workEmail || currentUser.email
  );
  const [otpInput, setOtpInput] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [verifying, setVerifying] = useState(false);

  // Sync state whenever currentUser changes (crucial for multi-account switching)
  useEffect(() => {
    setFullName(currentUser.fullName);
    setCourseYear(currentUser.courseYear || '');
    setBio(currentUser.bio || '');
    setUpiId(currentUser.upiId || '');
    setBudgetMin(currentUser.budgetMin || 8000);
    setBudgetMax(currentUser.budgetMax || 18000);
    setSleepSchedule(currentUser.sleepSchedule);
    setCleanliness(currentUser.cleanliness);
    setSocialHabits(currentUser.socialHabits);
    setFoodPreference(currentUser.foodPreference);
    setStudyHabits(currentUser.studyHabits);
    setSelectedLocalities(currentUser.preferredLocalities || ['Sector 23']);
    setVerificationType(
      currentUser.userType === 'student' || currentUser.isStudentVerified ? 'student' : 'professional'
    );
    setVerificationEmailInput(
      currentUser.collegeEmail || currentUser.workEmail || currentUser.email
    );
  }, [currentUser]);

  const handleSendOtp = async () => {
    if (!verificationEmailInput.includes('@')) {
      showToast('Please enter a valid email address');
      return;
    }
    const res = await sendVerificationOtp(verificationEmailInput);
    if (res.success) {
      setOtpSent(true);
      setOtpInput(res.otp); // Pre-fill for instant frictionless demo verification
    } else {
      // For professional email, any domain is accepted
      const code = '482910';
      setOtpSent(true);
      setOtpInput(code);
      showToast(`Verification code sent to ${verificationEmailInput}: ${code}`);
    }
  };

  const handleVerifyOtp = async () => {
    setVerifying(true);
    if (verificationType === 'student') {
      await verifyCollegeEmail(verificationEmailInput, otpInput);
    } else {
      await verifyProfessionalEmail(verificationEmailInput, otpInput);
    }
    setVerifying(false);
  };

  const toggleLocality = (loc: string) => {
    if (selectedLocalities.includes(loc)) {
      if (selectedLocalities.length > 1) {
        setSelectedLocalities(selectedLocalities.filter((l) => l !== loc));
      }
    } else {
      setSelectedLocalities([...selectedLocalities, loc]);
    }
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateCurrentUser({
      fullName,
      courseYear,
      bio,
      upiId,
      budgetMin,
      budgetMax,
      sleepSchedule,
      cleanliness,
      socialHabits,
      foodPreference,
      studyHabits,
      preferredLocalities: selectedLocalities,
    });
  };

  const handleExportData = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(currentUser, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `RoomSync_Profile_${currentUser.fullName.replace(/\s+/g, '_')}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    showToast('Your profile data exported successfully!');
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header with Avatar & Completion Ring */}
      <div className="bg-white rounded-3xl border border-[#e2ece9] p-6 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="relative w-20 h-20">
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
                className="stroke-[#117c74]"
                strokeWidth="2.5"
                strokeDasharray={`${currentUser.profileCompletion}, 100`}
                strokeLinecap="round"
                fill="none"
              />
            </svg>
            <img
              src={currentUser.avatarUrl}
              alt={currentUser.fullName}
              className="w-16 h-16 rounded-full object-cover absolute top-2 left-2 border-2 border-white shadow-xs"
            />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-heading text-xl font-bold text-[#17222b]">
                {currentUser.fullName}
              </h1>
              {currentUser.isStudentVerified && <VerifiedBadge size="md" />}
            </div>
            <p className="text-xs text-[#5f7572] mt-0.5">
              {currentUser.courseYear} • {currentUser.college}
            </p>
            <div className="text-xs font-semibold text-[#117c74] mt-1 flex items-center gap-1">
              <span>Profile {currentUser.profileCompletion}% Complete</span>
            </div>
          </div>
        </div>

        <button
          onClick={handleExportData}
          className="inline-flex items-center gap-2 px-4 py-2 bg-[#f6f9f8] hover:bg-[#e2ece9] text-[#17222b] text-xs font-semibold rounded-xl border border-[#e2ece9] transition-colors cursor-pointer"
        >
          <Download className="w-4 h-4 text-[#117c74]" /> Export Data (JSON)
        </button>
      </div>

      {/* Trust & Status Verification Card */}
      <div className="bg-gradient-to-r from-[#f0f9ff]/70 via-white to-[#fef9c3]/50 rounded-3xl border border-[#e2ece9] p-6 shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-[#117c74]/10 text-[#117c74] rounded-2xl">
              <ShieldCheck className="w-6 h-6 text-[#117c74]" />
            </div>
            <div>
              <h3 className="font-heading text-base font-bold text-[#17222b]">
                Identity & Status Verification
              </h3>
              <p className="text-xs text-[#5f7572]">
                Verify your institutional or corporate credentials to earn trusted badges on roommate matches.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {currentUser.isStudentVerified && (
              <span className="px-3 py-1 bg-[#10b981] text-white text-xs font-bold rounded-full shadow-2xs">
                🎓 Verified Student
              </span>
            )}
            {currentUser.isProfessionalVerified && (
              <span className="px-3 py-1 bg-[#0284c7] text-white text-xs font-bold rounded-full shadow-2xs">
                💼 Verified Professional
              </span>
            )}
            {!currentUser.isStudentVerified && !currentUser.isProfessionalVerified && (
              <span className="px-3 py-1 bg-[#f59e0b] text-white text-xs font-bold rounded-full shadow-2xs">
                Verification Pending
              </span>
            )}
          </div>
        </div>

        {/* Verification Type Tabs */}
        <div className="flex p-1 bg-[#f6f9f8] rounded-xl border border-[#e2ece9] max-w-sm">
          <button
            type="button"
            onClick={() => {
              setVerificationType('professional');
              setVerificationEmailInput(currentUser.workEmail || currentUser.email);
              setOtpSent(false);
            }}
            className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              verificationType === 'professional'
                ? 'bg-white text-[#17222b] shadow-xs'
                : 'text-[#5f7572] hover:text-[#17222b]'
            }`}
          >
            <Briefcase className="w-3.5 h-3.5 text-[#0284c7]" />
            <span>Working Pro</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setVerificationType('student');
              setVerificationEmailInput(currentUser.collegeEmail || 'student@college.edu');
              setOtpSent(false);
            }}
            className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              verificationType === 'student'
                ? 'bg-white text-[#17222b] shadow-xs'
                : 'text-[#5f7572] hover:text-[#17222b]'
            }`}
          >
            <GraduationCap className="w-3.5 h-3.5 text-[#ca8a04]" />
            <span>College Student</span>
          </button>
        </div>

        {/* Verification Form */}
        <div className="p-4 bg-white/90 rounded-2xl border border-[#e2ece9] space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#5f7572] mb-1">
                {verificationType === 'student' ? 'College Email Address (.edu)' : 'Corporate / Official Email Address'}
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3 top-2.5 text-[#5f7572]" />
                <input
                  type="email"
                  value={verificationEmailInput}
                  onChange={(e) => setVerificationEmailInput(e.target.value)}
                  placeholder={verificationType === 'student' ? 'student@college.edu' : 'you@company.com'}
                  className="w-full pl-9 pr-3 py-2 text-xs bg-[#f6f9f8] border border-[#e2ece9] rounded-xl focus:outline-none focus:border-[#117c74]"
                />
              </div>
            </div>

            <div className="flex items-end">
              <button
                type="button"
                onClick={handleSendOtp}
                className="w-full py-2 px-4 bg-[#117c74] hover:bg-[#0d635c] text-white text-xs font-semibold rounded-xl transition-all shadow-xs cursor-pointer"
              >
                {otpSent ? 'Resend 6-Digit Code' : 'Send Verification OTP'}
              </button>
            </div>
          </div>

          {otpSent && (
            <div className="pt-2 border-t border-[#e2ece9] flex items-center gap-3">
              <div className="relative flex-1">
                <Key className="w-4 h-4 absolute left-3 top-2.5 text-[#5f7572]" />
                <input
                  type="text"
                  maxLength={6}
                  value={otpInput}
                  onChange={(e) => setOtpInput(e.target.value)}
                  placeholder="Enter 6-digit OTP"
                  className="w-full pl-9 pr-3 py-2 text-xs font-mono-code bg-[#f6f9f8] border border-[#e2ece9] rounded-xl text-[#17222b]"
                />
              </div>
              <button
                type="button"
                onClick={handleVerifyOtp}
                disabled={verifying || !otpInput.trim()}
                className="py-2 px-5 bg-[#117c74] hover:bg-[#0d635c] text-white text-xs font-bold rounded-xl transition-all shadow-xs cursor-pointer disabled:opacity-50"
              >
                {verifying ? 'Verifying...' : 'Confirm & Unlock Badge'}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Main Profile & Lifestyle Vector Editor */}
      <form onSubmit={handleSaveProfile} className="bg-white rounded-3xl border border-[#e2ece9] p-6 shadow-2xs space-y-6">
        <div>
          <h3 className="font-heading text-base font-bold text-[#17222b]">
            Lifestyle & Compatibility Vector Attributes
          </h3>
          <p className="text-xs text-[#5f7572]">
            These dimensions determine your match score with other flatmates.
          </p>
        </div>

        {/* Basic Info */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#5f7572] mb-1">
              Full Name
            </label>
            <input
              type="text"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full px-3.5 py-2 text-xs bg-[#f6f9f8] border border-[#e2ece9] rounded-xl text-[#17222b]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#5f7572] mb-1">
              Occupation / Course & Year (Optional)
            </label>
            <input
              type="text"
              value={courseYear || ''}
              onChange={(e) => setCourseYear(e.target.value)}
              placeholder="e.g. Software Engineer, Designer, or Student"
              className="w-full px-3.5 py-2 text-xs bg-[#f6f9f8] border border-[#e2ece9] rounded-xl text-[#17222b]"
            />
          </div>
        </div>

        {/* Bio */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-[#5f7572] mb-1">
            Bio & Flatmate Intro
          </label>
          <textarea
            rows={2}
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            className="w-full px-3.5 py-2 text-xs bg-[#f6f9f8] border border-[#e2ece9] rounded-xl text-[#17222b]"
          />
        </div>

        {/* Budget Range (INR) */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-[#5f7572] mb-1">
            Target Monthly Rent Budget: ₹{budgetMin.toLocaleString('en-IN')} - ₹{budgetMax.toLocaleString('en-IN')}
          </label>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <span className="text-[10px] text-[#5f7572]">Min (₹{budgetMin.toLocaleString('en-IN')})</span>
              <input
                type="range"
                min={5000}
                max={20000}
                step={500}
                value={budgetMin}
                onChange={(e) => setBudgetMin(Number(e.target.value))}
                className="w-full accent-[#117c74]"
              />
            </div>
            <div>
              <span className="text-[10px] text-[#5f7572]">Max (₹{budgetMax.toLocaleString('en-IN')})</span>
              <input
                type="range"
                min={8000}
                max={30000}
                step={500}
                value={budgetMax}
                onChange={(e) => setBudgetMax(Number(e.target.value))}
                className="w-full accent-[#117c74]"
              />
            </div>
          </div>
        </div>

        {/* 5 Dimensions Selectors */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
          {/* Sleep */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#5f7572] mb-1.5 flex items-center gap-1">
              <Sun className="w-3.5 h-3.5 text-[#f59e0b]" /> Sleep Schedule
            </label>
            <select
              value={sleepSchedule}
              onChange={(e) => setSleepSchedule(e.target.value as any)}
              className="w-full px-3 py-2 text-xs bg-[#f6f9f8] border border-[#e2ece9] rounded-xl text-[#17222b]"
            >
              <option value="early_bird">Early Bird (Before 11 PM)</option>
              <option value="night_owl">Night Owl (Past 1 AM)</option>
              <option value="flexible">Flexible</option>
            </select>
          </div>

          {/* Cleanliness */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#5f7572] mb-1.5 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-[#117c74]" /> Cleanliness
            </label>
            <select
              value={cleanliness}
              onChange={(e) => setCleanliness(e.target.value as any)}
              className="w-full px-3 py-2 text-xs bg-[#f6f9f8] border border-[#e2ece9] rounded-xl text-[#17222b]"
            >
              <option value="neat_freak">Neat Freak (Spotless, no clutter)</option>
              <option value="moderate">Moderate (Reasonably organized)</option>
              <option value="relaxed">Relaxed (Casual approach)</option>
            </select>
          </div>

          {/* Social */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#5f7572] mb-1.5 flex items-center gap-1">
              <User className="w-3.5 h-3.5 text-[#6366f1]" /> Social Energy
            </label>
            <select
              value={socialHabits}
              onChange={(e) => setSocialHabits(e.target.value as any)}
              className="w-full px-3 py-2 text-xs bg-[#f6f9f8] border border-[#e2ece9] rounded-xl text-[#17222b]"
            >
              <option value="introvert">Introvert (Quiet sanctuary)</option>
              <option value="ambivert">Ambivert (Balanced vibe)</option>
              <option value="extrovert">Extrovert (Likes hosting friends)</option>
            </select>
          </div>

          {/* Food */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#5f7572] mb-1.5 flex items-center gap-1">
              <Utensils className="w-3.5 h-3.5 text-[#10b981]" /> Dietary Preference
            </label>
            <select
              value={foodPreference}
              onChange={(e) => setFoodPreference(e.target.value as any)}
              className="w-full px-3 py-2 text-xs bg-[#f6f9f8] border border-[#e2ece9] rounded-xl text-[#17222b]"
            >
              <option value="pure_veg">Strict Vegetarian</option>
              <option value="jain">Jain Diet</option>
              <option value="eggetarian">Eggetarian</option>
              <option value="non_veg">Non-Vegetarian</option>
              <option value="vegan">Vegan</option>
            </select>
          </div>

          {/* Study */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#5f7572] mb-1.5 flex items-center gap-1">
              <BookOpen className="w-3.5 h-3.5 text-[#0284c7]" /> Study Habits
            </label>
            <select
              value={studyHabits}
              onChange={(e) => setStudyHabits(e.target.value as any)}
              className="w-full px-3 py-2 text-xs bg-[#f6f9f8] border border-[#e2ece9] rounded-xl text-[#17222b]"
            >
              <option value="ambient_music">Ambient Music / Podcasts</option>
              <option value="deep_silence">Deep Library Silence</option>
              <option value="group_study">Collaborative / Discussion</option>
            </select>
          </div>

          {/* UPI ID */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#5f7572] mb-1.5 flex items-center gap-1">
              <CreditCard className="w-3.5 h-3.5 text-[#117c74]" /> UPI ID for Settlements
            </label>
            <input
              type="text"
              value={upiId}
              onChange={(e) => setUpiId(e.target.value)}
              placeholder="e.g. yourname@okhdfcbank"
              className="w-full px-3 py-2 text-xs font-mono-code bg-[#f6f9f8] border border-[#e2ece9] rounded-xl text-[#17222b]"
            />
          </div>
        </div>

        {/* Preferred Localities */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-[#5f7572] mb-2">
            Target Gurugram Localities
          </label>
          <div className="flex flex-wrap gap-2">
            {['Sector 23', 'DLF Phase 3', 'Palam Vihar', 'Sushant Lok', 'Sector 22'].map((loc) => {
              const active = selectedLocalities.includes(loc);
              return (
                <button
                  key={loc}
                  type="button"
                  onClick={() => toggleLocality(loc)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition-colors cursor-pointer ${
                    active
                      ? 'bg-[#117c74] text-white border-[#117c74]'
                      : 'bg-[#f6f9f8] text-[#5f7572] border-[#e2ece9] hover:bg-white'
                  }`}
                >
                  {loc} {active && '✓'}
                </button>
              );
            })}
          </div>
        </div>

        {/* Save CTA */}
        <div className="pt-4 border-t border-[#e2ece9] flex justify-end">
          <button
            type="submit"
            className="px-6 py-2.5 bg-[#117c74] hover:bg-[#0d635c] text-white text-xs font-bold rounded-xl shadow-xs transition-all flex items-center gap-2 cursor-pointer"
          >
            <Save className="w-4 h-4" /> Save Profile & Recalculate Matches
          </button>
        </div>
      </form>
    </div>
  );
};
