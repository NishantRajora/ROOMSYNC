import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Sparkles,
  Moon,
  Sun,
  Volume2,
  Cigarette,
  Utensils,
  BookOpen,
  Home,
  Check,
  ArrowRight,
  ArrowLeft,
  X,
  User,
  CheckCircle,
  Coffee,
} from 'lucide-react';
import { SleepSchedule, CleanlinessLevel, SocialHabit, FoodPreference, StudyHabit } from '../../types';
import { INDIAN_STUDENT_AVATARS } from '../../data/seedData';
import confetti from 'canvas-confetti';

interface OnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete?: () => void;
}

export const OnboardingModal: React.FC<OnboardingModalProps> = ({
  isOpen,
  onClose,
  onComplete,
}) => {
  const { currentUser, updateCurrentUser, showToast } = useApp();

  const [step, setStep] = useState<1 | 2>(1);

  // Lifestyle Details (Step 1)
  const [bedtime, setBedtime] = useState(currentUser.bedtime || '11:00 PM');
  const [wakeTime, setWakeTime] = useState(currentUser.wakeTime || '07:30 AM');
  const [sleepSchedule, setSleepSchedule] = useState<SleepSchedule>(
    currentUser.sleepSchedule || 'early_bird'
  );
  const [cleanlinessRating, setCleanlinessRating] = useState<number>(
    currentUser.cleanlinessRating || 4
  );
  const [guestFrequency, setGuestFrequency] = useState('Weekends only with notice');
  const [partyFrequency, setPartyFrequency] = useState('Zero parties / quiet flat');
  const [socialHabit, setSocialHabit] = useState<SocialHabit>(
    currentUser.socialHabits || 'ambivert'
  );
  const [substanceTolerance, setSubstanceTolerance] = useState(
    currentUser.smokingDrinkingTolerance || 'Strictly non-smoking & alcohol-free'
  );

  // Preferences (Step 2)
  const [foodPreference, setFoodPreference] = useState<FoodPreference>(
    currentUser.foodPreference || 'pure_veg'
  );
  const [cookPreference, setCookPreference] = useState('Cook sharing (ghar ka khana)');
  const [studySchedule, setStudySchedule] = useState('Night owl studier (10 PM – 2 AM)');
  const [studyHours, setStudyHours] = useState('3–4 hours/day');
  const [studyHabit, setStudyHabit] = useState<StudyHabit>(
    currentUser.studyHabits || 'ambient_music'
  );
  const [roomSharing, setRoomSharing] = useState<'private' | 'shared' | 'any'>(
    currentUser.roomSharingPreference || 'private'
  );
  const [dealbreakers, setDealbreakers] = useState<string[]>(
    currentUser.dealbreakers || [
      'No indoor smoking',
      'Strict quiet hours after 11 PM',
    ]
  );
  const [selectedAvatar, setSelectedAvatar] = useState(
    currentUser.avatarUrl || INDIAN_STUDENT_AVATARS[0].url
  );
  const [budgetMin, setBudgetMin] = useState(currentUser.budgetMin || 8000);
  const [budgetMax, setBudgetMax] = useState(currentUser.budgetMax || 16000);

  if (!isOpen) return null;

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

  const handleFinish = (e: React.FormEvent) => {
    e.preventDefault();

    let cleanLevel: CleanlinessLevel = 'moderate';
    if (cleanlinessRating >= 4) cleanLevel = 'neat_freak';
    else if (cleanlinessRating <= 2) cleanLevel = 'relaxed';

    updateCurrentUser({
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
    });

    confetti({
      particleCount: 90,
      spread: 70,
      origin: { y: 0.6 },
    });

    showToast('Roommate lifestyle & preferences updated successfully!');
    if (onComplete) onComplete();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-[#e2ece9] overflow-hidden max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#e2ece9] bg-gradient-to-r from-[#117c74]/10 via-transparent to-[#10b981]/10 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-heading text-lg font-bold text-[#17222b]">
                {step === 1 ? 'Step 1 — Lifestyle Details' : 'Step 2 — Roommate Preferences'}
              </h3>
              <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-[#117c74] text-white">
                Step {step} of 2
              </span>
            </div>
            <p className="text-xs text-[#5f7572] mt-0.5">
              {step === 1
                ? 'Your sleep routine, cleanliness standards, and social energy'
                : 'Dietary habits, study intensity, room type, and non-negotiables'}
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-[#5f7572] hover:text-[#17222b] rounded-full cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step Progress Bar */}
        <div className="w-full bg-[#e2ece9] h-1">
          <div
            className="bg-[#117c74] h-full transition-all duration-300"
            style={{ width: step === 1 ? '50%' : '100%' }}
          />
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {/* ================= STEP 1: LIFESTYLE ================= */}
          {step === 1 && (
            <div className="space-y-5">
              {/* Indian Student Avatar Selector */}
              <div className="p-4 bg-[#f6f9f8] rounded-2xl border border-[#e2ece9] space-y-2.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-[#17222b]">
                  Choose Your Student Profile Avatar
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

              {/* Sleep schedule (bedtime/wake time) */}
              <div className="p-4 bg-[#f6f9f8] rounded-2xl border border-[#e2ece9] space-y-3">
                <label className="block text-xs font-bold uppercase tracking-wider text-[#17222b] flex items-center gap-1.5">
                  <Moon className="w-4 h-4 text-[#117c74]" /> Sleep Schedule & Daily Rhythm
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
                      <option value="10:00 PM">10:00 PM (Early to bed)</option>
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
                      <option value="06:00 AM">06:00 AM (Early workout/focus)</option>
                      <option value="07:30 AM">07:30 AM (College morning prep)</option>
                      <option value="08:30 AM">08:30 AM (Standard)</option>
                      <option value="09:30 AM+">09:30 AM+ (Late riser)</option>
                    </select>
                  </div>
                </div>

                <div className="flex gap-2 pt-1">
                  {[
                    { key: 'early_bird', label: 'Early Bird 🌅', note: 'Sleep before 11 PM' },
                    { key: 'night_owl', label: 'Night Owl 🦉', note: 'Active past 1 AM' },
                    { key: 'flexible', label: 'Flexible 🔄', note: 'Adaptable sleep' },
                  ].map((s) => (
                    <button
                      key={s.key}
                      type="button"
                      onClick={() => setSleepSchedule(s.key as SleepSchedule)}
                      className={`flex-1 p-2 rounded-xl border text-center transition-all cursor-pointer ${
                        sleepSchedule === s.key
                          ? 'bg-[#117c74] text-white border-[#117c74] shadow-xs'
                          : 'bg-white text-[#5f7572] border-[#e2ece9] hover:bg-[#f6f9f8]'
                      }`}
                    >
                      <div className="text-xs font-bold">{s.label}</div>
                      <div className="text-[10px] opacity-80 mt-0.5">{s.note}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Cleanliness (1-5 scale) */}
              <div className="p-4 bg-[#f6f9f8] rounded-2xl border border-[#e2ece9] space-y-2.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold uppercase tracking-wider text-[#17222b] flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-[#117c74]" /> Cleanliness Level (1–5 Scale)
                  </label>
                  <span className="text-xs font-bold text-[#117c74]">
                    {cleanlinessRating === 1 && '1/5 — Very Casual / Laidback'}
                    {cleanlinessRating === 2 && '2/5 — Easygoing'}
                    {cleanlinessRating === 3 && '3/5 — Moderately Tidy'}
                    {cleanlinessRating === 4 && '4/5 — Very Organized & Clean'}
                    {cleanlinessRating === 5 && '5/5 — Spotless / Neat Freak'}
                  </span>
                </div>

                <div className="flex items-center justify-between gap-2">
                  {[1, 2, 3, 4, 5].map((lvl) => (
                    <button
                      key={lvl}
                      type="button"
                      onClick={() => setCleanlinessRating(lvl)}
                      className={`flex-1 py-2.5 text-xs font-bold rounded-xl border transition-all cursor-pointer ${
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
                  <span>Relaxed about clutter</span>
                  <span>Daily sweep & sterilized sink</span>
                </div>
              </div>

              {/* Noise tolerance / social behavior */}
              <div className="p-4 bg-[#f6f9f8] rounded-2xl border border-[#e2ece9] space-y-3">
                <label className="block text-xs font-bold uppercase tracking-wider text-[#17222b] flex items-center gap-1.5">
                  <Volume2 className="w-4 h-4 text-[#117c74]" /> Noise Tolerance & Social Behavior
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
                      Parties & Gathering Policy
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
                    { key: 'introvert', label: 'Introvert 🧘', desc: 'Need quiet personal zone' },
                    { key: 'ambivert', label: 'Ambivert ⚖️', desc: 'Balanced social vibe' },
                    { key: 'extrovert', label: 'Extrovert 🎉', desc: 'Love hosting & chatting' },
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

              {/* Smoking / drinking tolerance */}
              <div className="p-4 bg-[#f6f9f8] rounded-2xl border border-[#e2ece9] space-y-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-[#17222b] flex items-center gap-1.5">
                  <Cigarette className="w-4 h-4 text-[#117c74]" /> Smoking & Drinking Tolerance
                </label>
                <select
                  value={substanceTolerance}
                  onChange={(e) => setSubstanceTolerance(e.target.value)}
                  className="w-full px-3 py-2.5 text-xs bg-white border border-[#e2ece9] rounded-xl text-[#17222b]"
                >
                  <option value="Strictly non-smoking & alcohol-free">Strictly non-smoking & alcohol-free flat</option>
                  <option value="Balcony / outdoor smoking only">Balcony / outdoor smoking only</option>
                  <option value="Social drinking OK, zero indoor smoke">Social drinking OK, zero indoor smoke</option>
                  <option value="Tolerant / completely fine">Tolerant / completely fine</option>
                </select>
              </div>
            </div>
          )}

          {/* ================= STEP 2: PREFERENCES ================= */}
          {step === 2 && (
            <div className="space-y-5">
              {/* Food preference (veg / non-veg / eggetarian / Jain / vegan) */}
              <div className="p-4 bg-[#f6f9f8] rounded-2xl border border-[#e2ece9] space-y-3">
                <label className="block text-xs font-bold uppercase tracking-wider text-[#17222b] flex items-center gap-1.5">
                  <Utensils className="w-4 h-4 text-[#117c74]" /> Food & Kitchen Preferences
                </label>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {[
                    { key: 'pure_veg', label: 'Strict Vegetarian 🥦', desc: 'No eggs, no meat' },
                    { key: 'non_veg', label: 'Non-Vegetarian 🍗', desc: 'Chicken/fish OK' },
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
                    Meal / Tiffin Plan
                  </span>
                  <select
                    value={cookPreference}
                    onChange={(e) => setCookPreference(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-white border border-[#e2ece9] rounded-xl text-[#17222b]"
                  >
                    <option value="Cook sharing (ghar ka khana)">Hire common cook (ghar ka khana split 50:50)</option>
                    <option value="Tiffin service delivery">Daily tiffin delivery</option>
                    <option value="Self-cooking in flat">Self-cooking / independent groceries</option>
                    <option value="Order via Swiggy/Zomato">Mostly campus mess / food delivery</option>
                  </select>
                </div>
              </div>

              {/* Study habits (early/night owl, intensity, hours/day) */}
              <div className="p-4 bg-[#f6f9f8] rounded-2xl border border-[#e2ece9] space-y-3">
                <label className="block text-xs font-bold uppercase tracking-wider text-[#17222b] flex items-center gap-1.5">
                  <BookOpen className="w-4 h-4 text-[#117c74]" /> Study Habits & Intensity
                </label>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <span className="text-[11px] text-[#5f7572] block mb-1">
                      Study Schedule Preference
                    </span>
                    <select
                      value={studySchedule}
                      onChange={(e) => setStudySchedule(e.target.value)}
                      className="w-full px-3 py-2 text-xs bg-white border border-[#e2ece9] rounded-xl text-[#17222b]"
                    >
                      <option value="Early riser studier (morning focus)">Early riser studier (06:00 AM focus)</option>
                      <option value="Night owl studier (midnight crunch)">Night owl studier (11 PM – 03 AM)</option>
                      <option value="Flexible daytime studier">Flexible daytime studier</option>
                    </select>
                  </div>

                  <div>
                    <span className="text-[11px] text-[#5f7572] block mb-1">
                      Daily Study Intensity
                    </span>
                    <select
                      value={studyHours}
                      onChange={(e) => setStudyHours(e.target.value)}
                      className="w-full px-3 py-2 text-xs bg-white border border-[#e2ece9] rounded-xl text-[#17222b]"
                    >
                      <option value="1–2 hours/day (Casual)">1–2 hours/day (Casual)</option>
                      <option value="3–4 hours/day (Standard)">3–4 hours/day (Standard)</option>
                      <option value="5+ hours/day (Intensive / Exams / Coding)">5+ hours/day (Intensive / Exams / Coding)</option>
                    </select>
                  </div>
                </div>

                <div className="flex gap-2 pt-1">
                  {[
                    { key: 'ambient_music', label: 'Lo-Fi / Ambient 🎧' },
                    { key: 'deep_silence', label: 'Library Silence 🤫' },
                    { key: 'group_study', label: 'Group Prep 👥' },
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

              {/* Room sharing preference (private room vs shared) */}
              <div className="p-4 bg-[#f6f9f8] rounded-2xl border border-[#e2ece9] space-y-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-[#17222b] flex items-center gap-1.5">
                  <Home className="w-4 h-4 text-[#117c74]" /> Room Sharing Preference
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { key: 'private', label: 'Private Room', sub: 'Single occupancy' },
                    { key: 'shared', label: 'Shared Room', sub: 'Twin sharing' },
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
                    Checklist for Strict Dealbreakers
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
                        className={`p-2.5 rounded-xl border text-xs flex items-center justify-between cursor-pointer transition-colors ${
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

              {/* Monthly Budget Range in INR */}
              <div className="p-4 bg-[#f6f9f8] rounded-2xl border border-[#e2ece9] space-y-2">
                <div className="flex justify-between text-xs font-bold text-[#17222b]">
                  <span>Target Rent Budget Range</span>
                  <span className="text-[#117c74]">
                    ₹{budgetMin.toLocaleString('en-IN')} – ₹{budgetMax.toLocaleString('en-IN')} / mo
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
                      max={30000}
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
          {step === 1 ? (
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-[#5f7572] hover:bg-[#f6f9f8] rounded-xl cursor-pointer"
            >
              Skip for Now
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setStep(1)}
              className="px-4 py-2 text-xs font-semibold text-[#5f7572] hover:bg-[#f6f9f8] rounded-xl cursor-pointer flex items-center gap-1.5"
            >
              <ArrowLeft className="w-4 h-4" /> Back to Lifestyle
            </button>
          )}

          {step === 1 ? (
            <button
              type="button"
              onClick={() => setStep(2)}
              className="px-5 py-2.5 bg-[#117c74] hover:bg-[#0d635c] text-white font-semibold text-xs rounded-xl shadow-xs transition-all cursor-pointer flex items-center gap-1.5"
            >
              <span>Continue to Preferences</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleFinish}
              className="px-6 py-2.5 bg-[#117c74] hover:bg-[#0d635c] text-white font-bold text-xs rounded-xl shadow-md transition-all cursor-pointer flex items-center gap-2"
            >
              <CheckCircle className="w-4 h-4" />
              <span>Save & Compute Flatmate Matches</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
