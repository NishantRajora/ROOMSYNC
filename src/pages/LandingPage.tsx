import React from 'react';
import {
  GraduationCap,
  ShieldCheck,
  MapPin,
  ClipboardList,
  CheckCircle,
  ArrowRight,
  ChevronDown,
  Star,
  Sparkles,
} from 'lucide-react';

interface LandingPageProps {
  onNavigate: (path: string) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onNavigate }) => {
  const scrollToHowItWorks = () => {
    const el = document.getElementById('how');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-[#f6f9f8] text-[#17222b] font-sans flex flex-col selection:bg-[#117c74]/20 selection:text-[#117c74]">
      {/* 1. TOP NAVBAR (public version, no sidebar, sticky on scroll) */}
      <header className="sticky top-0 z-50 w-full bg-white/90 backdrop-blur-md border-b border-[#e2ece9] px-6 lg:px-12 py-4 transition-all">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Logo / Wordmark */}
          <div
            onClick={() => onNavigate('/')}
            className="flex items-center gap-2.5 cursor-pointer select-none group"
          >
            <div className="w-9 h-9 rounded-xl bg-[#117c74] flex items-center justify-center text-white shadow-xs group-hover:bg-[#0d635c] transition-colors">
              <span className="font-heading font-bold text-lg">R</span>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-heading font-bold text-lg text-[#17222b] tracking-tight">
                  RoomSync
                </span>
              </div>
            </div>
          </div>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => onNavigate('/login')}
              className="px-4 py-2 text-xs font-semibold text-[#17222b] hover:text-[#117c74] hover:bg-[#f6f9f8] rounded-xl transition-colors cursor-pointer"
            >
              Log In
            </button>
            <button
              onClick={() => onNavigate('/signup')}
              className="px-4 py-2 bg-[#117c74] hover:bg-[#0d635c] text-white text-xs font-semibold rounded-xl shadow-xs transition-all cursor-pointer"
            >
              Sign Up
            </button>
          </div>
        </div>
      </header>

      {/* 2. HERO SECTION */}
      <section className="relative overflow-hidden pt-16 pb-20 lg:pt-24 lg:pb-32 px-6 lg:px-12 text-center">
        {/* Subtle background treatment (clean soft mint gradient & abstract shapes, no literal photo) */}
        <div className="absolute inset-0 pointer-events-none -z-10 flex items-center justify-center">
          <div className="w-[720px] h-[480px] bg-gradient-to-tr from-[#117c74]/10 via-[#10b981]/8 to-transparent rounded-full blur-3xl opacity-70 transform -translate-y-12" />
          <div className="absolute top-1/4 right-1/4 w-80 h-80 bg-[#117c74]/5 rounded-full blur-2xl" />
        </div>

        <div className="max-w-4xl mx-auto space-y-6">
          {/* Gold Pilot Badge */}
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-[#fef9c3] border border-[#fde047] text-[#854d0e] rounded-full text-xs font-semibold shadow-2xs">
            <span>🎓 Verified College Student Housing Network</span>
          </div>

          {/* Large Bold Headline */}
          <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-[#17222b] leading-[1.12]">
            Find a home that feels like yours.
          </h1>

          {/* Subheadline */}
          <p className="text-base sm:text-lg text-[#5f7572] max-w-2xl mx-auto leading-relaxed">
            India's first AI-powered flatmate matching and safe-renting platform built for college students. Verified peers, trusted listings, zero scams.
          </p>

          {/* Two CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
            <button
              onClick={() => onNavigate('/signup')}
              className="w-full sm:w-auto px-7 py-3.5 bg-[#117c74] hover:bg-[#0d635c] text-white font-semibold text-sm rounded-2xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer group"
            >
              <span>Get Started — It's Free</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </button>
            <button
              onClick={scrollToHowItWorks}
              className="w-full sm:w-auto px-6 py-3.5 bg-white hover:bg-[#f6f9f8] text-[#17222b] border border-[#e2ece9] font-semibold text-sm rounded-2xl transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <span>See How It Works</span>
              <span className="text-xs">↓</span>
            </button>
          </div>

          {/* Trust-Stats Row */}
          <div className="pt-6 text-xs text-[#5f7572] font-medium tracking-wide">
            Safety first <span className="mx-1.5 opacity-60">·</span> Transparency <span className="mx-1.5 opacity-60">·</span> Student-built
          </div>
        </div>
      </section>

      {/* 3. "HOW IT WORKS" SECTION (id="how") */}
      <section id="how" className="py-20 lg:py-28 px-6 lg:px-12 bg-white border-y border-[#e2ece9]">
        <div className="max-w-7xl mx-auto space-y-12">
          {/* Eyebrow & Heading */}
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[#117c74]">
              How it works
            </span>
            <h2 className="font-heading text-3xl sm:text-4xl font-bold text-[#17222b] tracking-tight">
              From sign-up to move-in in 4 steps
            </h2>
          </div>

          {/* 4 Numbered Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* 01 */}
            <div className="relative bg-[#f6f9f8] rounded-2xl border border-[#e2ece9] p-6 shadow-2xs hover:shadow-md hover:-translate-y-1 transition-all duration-200 flex flex-col justify-between overflow-hidden">
              <span className="font-heading font-bold text-5xl text-[#117c74]/20 select-none block mb-4">
                01
              </span>
              <div className="space-y-2">
                <h3 className="font-heading font-bold text-base text-[#17222b]">
                  Verify your student ID
                </h3>
                <p className="text-xs text-[#5f7572] leading-relaxed">
                  Sign up with your college email — get the gold Verified Student badge instantly
                </p>
              </div>
            </div>

            {/* 02 */}
            <div className="relative bg-[#f6f9f8] rounded-2xl border border-[#e2ece9] p-6 shadow-2xs hover:shadow-md hover:-translate-y-1 transition-all duration-200 flex flex-col justify-between overflow-hidden">
              <span className="font-heading font-bold text-5xl text-[#117c74]/20 select-none block mb-4">
                02
              </span>
              <div className="space-y-2">
                <h3 className="font-heading font-bold text-base text-[#17222b]">
                  Build your profile
                </h3>
                <p className="text-xs text-[#5f7572] leading-relaxed">
                  Tell us your sleep schedule, cleanliness vibe, food preferences, and budget
                </p>
              </div>
            </div>

            {/* 03 */}
            <div className="relative bg-[#f6f9f8] rounded-2xl border border-[#e2ece9] p-6 shadow-2xs hover:shadow-md hover:-translate-y-1 transition-all duration-200 flex flex-col justify-between overflow-hidden">
              <span className="font-heading font-bold text-5xl text-[#117c74]/20 select-none block mb-4">
                03
              </span>
              <div className="space-y-2">
                <h3 className="font-heading font-bold text-base text-[#17222b]">
                  Get matched
                </h3>
                <p className="text-xs text-[#5f7572] leading-relaxed">
                  Our algorithm scores compatibility across 5 dimensions — find your people
                </p>
              </div>
            </div>

            {/* 04 */}
            <div className="relative bg-[#f6f9f8] rounded-2xl border border-[#e2ece9] p-6 shadow-2xs hover:shadow-md hover:-translate-y-1 transition-all duration-200 flex flex-col justify-between overflow-hidden">
              <span className="font-heading font-bold text-5xl text-[#117c74]/20 select-none block mb-4">
                04
              </span>
              <div className="space-y-2">
                <h3 className="font-heading font-bold text-base text-[#17222b]">
                  Move in safely
                </h3>
                <p className="text-xs text-[#5f7572] leading-relaxed">
                  Use our trust scores, safety map, and SOS visit tool before signing anything
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. "WHY ROOMSYNC" SECTION */}
      <section className="py-20 lg:py-28 px-6 lg:px-12 max-w-7xl mx-auto w-full space-y-12">
        {/* Eyebrow & Heading */}
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-[#117c74]">
            Why RoomSync
          </span>
          <h2 className="font-heading text-3xl sm:text-4xl font-bold text-[#17222b] tracking-tight">
            Safety isn't an afterthought — it's the product
          </h2>
        </div>

        {/* 4 Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Card 1: College Verified */}
          <div className="bg-white rounded-2xl border border-[#e2ece9] p-6 shadow-2xs hover:shadow-md transition-all space-y-4">
            <div className="w-12 h-12 rounded-xl bg-[#fef9c3] border border-[#fde047] flex items-center justify-center text-xl">
              <GraduationCap className="w-6 h-6 text-[#ca8a04]" />
            </div>
            <div className="space-y-1.5">
              <h3 className="font-heading font-bold text-base text-[#17222b]">
                College Verified
              </h3>
              <p className="text-xs text-[#5f7572] leading-relaxed">
                Only real students get the gold badge — verified via your college email
              </p>
            </div>
          </div>

          {/* Card 2: Trust Scored Listings */}
          <div className="bg-white rounded-2xl border border-[#e2ece9] p-6 shadow-2xs hover:shadow-md transition-all space-y-4">
            <div className="w-12 h-12 rounded-xl bg-[#ecfdf5] border border-[#a7f3d0] flex items-center justify-center text-xl">
              <ShieldCheck className="w-6 h-6 text-[#10b981]" />
            </div>
            <div className="space-y-1.5">
              <h3 className="font-heading font-bold text-base text-[#17222b]">
                Trust Scored Listings
              </h3>
              <p className="text-xs text-[#5f7572] leading-relaxed">
                Every flat rated 0–100 using price, landlord, photos, and scam patterns
              </p>
            </div>
          </div>

          {/* Card 3: Safety Map */}
          <div className="bg-white rounded-2xl border border-[#e2ece9] p-6 shadow-2xs hover:shadow-md transition-all space-y-4">
            <div className="w-12 h-12 rounded-xl bg-[#117c74]/10 border border-[#117c74]/20 flex items-center justify-center text-xl">
              <MapPin className="w-6 h-6 text-[#117c74]" />
            </div>
            <div className="space-y-1.5">
              <h3 className="font-heading font-bold text-base text-[#17222b]">
                Safety Map
              </h3>
              <p className="text-xs text-[#5f7572] leading-relaxed">
                Crime, transit, and campus distance heatmap for every locality
              </p>
            </div>
          </div>

          {/* Card 4: Roommate Pact */}
          <div className="bg-white rounded-2xl border border-[#e2ece9] p-6 shadow-2xs hover:shadow-md transition-all space-y-4">
            <div className="w-12 h-12 rounded-xl bg-[#f6f9f8] border border-[#e2ece9] flex items-center justify-center text-xl">
              <ClipboardList className="w-6 h-6 text-[#17222b]" />
            </div>
            <div className="space-y-1.5">
              <h3 className="font-heading font-bold text-base text-[#17222b]">
                Roommate Pact
              </h3>
              <p className="text-xs text-[#5f7572] leading-relaxed">
                Digitally signed living agreements with a tamper-evident hash — no disputes, no he-said-she-said
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. FINAL CTA SECTION */}
      <section className="py-20 lg:py-24 px-6 lg:px-12 bg-white border-t border-[#e2ece9]">
        <div className="max-w-3xl mx-auto text-center space-y-6">
          <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-[#17222b] tracking-tight">
            Ready to find your people?
          </h2>
          <p className="text-sm sm:text-base text-[#5f7572] max-w-xl mx-auto leading-relaxed">
            Join students who've found their perfect flatmate through RoomSync. Open for all university and college students.
          </p>
          <div className="pt-2">
            <button
              onClick={() => onNavigate('/signup')}
              className="px-8 py-4 bg-[#117c74] hover:bg-[#0d635c] text-white font-semibold text-sm rounded-2xl shadow-md hover:shadow-lg transition-all cursor-pointer inline-flex items-center gap-2"
            >
              <span>Create Your Free Account</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* 6. MEET THE TEAM SECTION */}
      <section className="py-20 lg:py-28 px-6 lg:px-12 bg-[#f6f9f8]">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <h2 className="font-heading text-3xl sm:text-4xl font-bold text-[#17222b] tracking-tight">
              Meet the Team
            </h2>
            <p className="text-sm sm:text-base text-[#5f7572]">
              The students building safer housing for students.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-12 sm:gap-20">
            {[
              {
                name: 'Nishant Rajora',
                role: 'Co-founder',
                image: 'https://media.licdn.com/dms/image/v2/D4D03AQHMQWoRTPyreg/profile-displayphoto-scale_200_200/B4DZ4meXu4K4Ac-/0/1778761962723?e=1793232000&v=beta&t=hqSp9mP4gww0x78UE2wyJt9DvNfcHtU6zkK94Enl0Zc',
                initials: 'NR',
              },
              {
                name: 'Palak Kanasal',
                role: 'Co-founder',
                image: 'https://media.licdn.com/dms/image/v2/D4D35AQHKXqPfpa-tLA/profile-framedphoto-shrink_400_400/B4DZvmugB.JoAk-/0/1769102508509?e=1791993600&v=beta&t=RT7K2xJ2g5v5vZsU7Z7Q0ca0ppMQAYYG6ftAy_WFU00',
                initials: 'PK',
              },
              {
                name: 'Monika Nahadiya',
                role: 'Co-founder',
                image: 'https://media.licdn.com/dms/image/v2/D5603AQGG3Q_8GZnpJQ/profile-displayphoto-shrink_400_400/profile-displayphoto-shrink_400_400/0/1725642208347?e=1793232000&v=beta&t=p-JQWL0FcoJFyxEC5Kkfnrz65w28S1V5HkhH7knc-uw',
                initials: 'MN',
              },
            ].map((member) => (
              <div
                key={member.name}
                className="group flex flex-col items-center text-center space-y-4 transition-all duration-300 hover:-translate-y-2"
              >
                <div className="relative">
                  <img
                    src={member.image}
                    alt={member.name}
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                      (e.currentTarget.parentElement?.querySelector('.fallback-initials') as HTMLElement).style.display = 'flex';
                    }}
                    className="w-[130px] h-[130px] rounded-full object-cover border-2 border-[#e2ece9] group-hover:border-[#117c74] shadow-sm group-hover:shadow-md transition-all duration-300"
                  />
                  <div
                    className="fallback-initials hidden absolute inset-0 w-[130px] h-[130px] rounded-full bg-[#117c74] text-white items-center justify-center text-2xl font-bold border-2 border-[#117c74] shadow-sm"
                  >
                    {member.initials}
                  </div>
                </div>
                <div className="space-y-1">
                  <h3 className="font-heading font-bold text-[#17222b]">{member.name}</h3>
                  <p className="text-xs text-[#5f7572]">{member.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>


      {/* 6. FOOTER */}
      <footer className="border-t border-[#e2ece9] bg-[#f6f9f8] py-8 px-6 lg:px-12">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#5f7572]">
          <div className="flex items-center gap-2">
            <span className="font-heading font-bold text-[#17222b] text-sm">RoomSync</span>
            <span className="opacity-60">·</span>
            <span>College Student Housing Platform — 2026</span>
          </div>

          <div className="flex items-center gap-6">
            <button
              onClick={() => onNavigate('/signup')}
              className="hover:text-[#17222b] transition-colors cursor-pointer"
            >
              About
            </button>
            <button
              onClick={() => onNavigate('/login')}
              className="hover:text-[#17222b] transition-colors cursor-pointer"
            >
              Contact
            </button>
            <button
              onClick={() => onNavigate('/signup')}
              className="hover:text-[#17222b] transition-colors cursor-pointer"
            >
              Privacy
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
};
