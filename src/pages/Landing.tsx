import { Link } from "react-router-dom";

const FEATURES = [
  { icon: "🎓", title: "College Verified", desc: "Only real students get the gold badge — verified via your .edu email" },
  { icon: "🛡", title: "Trust Scored Listings", desc: "Every flat rated 0–100 using price, landlord, photos, and scam patterns" },
  { icon: "🗺", title: "Safety Map", desc: "Crime, transit, and campus distance heatmap for every locality" },
  { icon: "📋", title: "Roommate Pact", desc: "Blockchain-anchored living agreements — no disputes, no he-said-she-said" },
];

const STEPS = [
  { n: "01", title: "Verify your student ID", desc: "Sign up with your college email — get the gold Verified Student badge instantly" },
  { n: "02", title: "Build your profile", desc: "Tell us your sleep schedule, cleanliness vibe, food preferences, and budget" },
  { n: "03", title: "Get matched", desc: "Our algorithm scores compatibility across 5 dimensions — find your people" },
  { n: "04", title: "Move in safely", desc: "Use our trust scores, safety map, and SOS visit tool before signing anything" },
];

export default function Landing() {
  return (
    <div style={{ fontFamily: "'Inter', sans-serif", background: "#f6f9f8", minHeight: "100vh" }}>
      {/* Navbar */}
      <nav
        className="sticky top-0 z-30 flex items-center px-8 border-b"
        style={{ height: 72, background: "rgba(255,255,255,0.95)", borderColor: "#e2ece9", backdropFilter: "blur(8px)" }}
      >
        <div className="flex items-center gap-2 mr-auto">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: "#117c74" }}>
            <span className="text-white font-bold text-sm" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>R</span>
          </div>
          <span className="font-bold text-xl" style={{ fontFamily: "'Space Grotesk', sans-serif", color: "#117c74" }}>RoomSync</span>
        </div>
        <div className="flex items-center gap-8 text-sm" style={{ color: "#5f7572" }}>
          <a href="#how" style={{ textDecoration: "none", color: "inherit" }} className="hover:text-mint transition-colors">How it works</a>
          <a href="#trust" style={{ textDecoration: "none", color: "inherit" }}>Trust & Safety</a>
          <a href="#" style={{ textDecoration: "none", color: "inherit" }}>For Landlords</a>
        </div>
        <div className="flex items-center gap-3 ml-8">
          <Link to="/signup" style={{ textDecoration: "none" }}>
            <button
              className="px-5 py-2.5 rounded-xl text-sm font-medium border transition-all hover:bg-gray-50"
              style={{ borderColor: "#e2ece9", color: "#17222b" }}
            >
              Log in
            </button>
          </Link>
          <Link to="/signup" style={{ textDecoration: "none" }}>
            <button
              className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white transition-all"
              style={{ background: "#117c74" }}
              onMouseEnter={e => (e.currentTarget.style.background = "#0d635c")}
              onMouseLeave={e => (e.currentTarget.style.background = "#117c74")}
            >
              Get Started
            </button>
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section
        className="relative flex flex-col items-center justify-center text-center"
        style={{
          minHeight: 600,
          padding: "80px 24px",
          background: "linear-gradient(160deg, #ecfdf5 0%, #f6f9f8 50%, #fff8f0 100%)",
        }}
      >
        {/* Floating badge */}
        <div
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium mb-8"
          style={{ background: "#fef9c3", color: "#854d0e", border: "1px solid #fef08a" }}
        >
          <span>🎓</span> Pilot launch — NCU Gurugram & Delhi NCR
        </div>

        <h1
          className="text-5xl font-bold leading-tight mb-5 max-w-3xl"
          style={{ fontFamily: "'Space Grotesk', sans-serif", color: "#17222b", letterSpacing: "-1.5px" }}
        >
          Find a home that<br />
          <span style={{ color: "#117c74" }}>feels like yours.</span>
        </h1>

        <p className="text-xl max-w-xl mb-10" style={{ color: "#5f7572", lineHeight: 1.6 }}>
          India's first AI-powered flatmate matching and safe-renting platform built for college students. Verified peers, trusted listings, zero scams.
        </p>

        <div className="flex items-center gap-4">
          <Link to="/signup" style={{ textDecoration: "none" }}>
            <button
              className="px-8 py-4 rounded-xl text-base font-semibold text-white transition-all shadow-lg"
              style={{ background: "#117c74", height: 52 }}
              onMouseEnter={e => (e.currentTarget.style.background = "#0d635c")}
              onMouseLeave={e => (e.currentTarget.style.background = "#117c74")}
            >
              Get Started — It's Free
            </button>
          </Link>
          <a href="#how" style={{ textDecoration: "none" }}>
            <button
              className="px-8 py-4 rounded-xl text-base font-semibold border transition-all"
              style={{ height: 52, borderColor: "#117c74", color: "#117c74", background: "transparent" }}
            >
              See How It Works ↓
            </button>
          </a>
        </div>

        {/* Social proof */}
        <div className="flex items-center gap-6 mt-12 text-sm" style={{ color: "#5f7572" }}>
          <div className="flex items-center gap-2">
            <div className="flex -space-x-2">
              {["photo-1494790108755-2616b612b67c", "photo-1534528741775-53994a69daeb", "photo-1517841905240-472988babdf9"].map((id, i) => (
                <img key={i} src={`https://images.unsplash.com/${id}?w=40&h=40&fit=crop&auto=format`} alt="" className="w-8 h-8 rounded-full border-2 border-white object-cover" />
              ))}
            </div>
            <span><strong style={{ color: "#17222b" }}>1,200+</strong> students matched</span>
          </div>
          <span>·</span>
          <span><strong style={{ color: "#17222b" }}>98%</strong> scam-free listings</span>
          <span>·</span>
          <span>⭐ 4.8 avg. rating</span>
        </div>

        {/* Hero image mockup */}
        <div
          className="mt-16 rounded-2xl overflow-hidden shadow-2xl border"
          style={{ maxWidth: 900, width: "100%", borderColor: "#e2ece9" }}
        >
          <img
            src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=900&h=450&fit=crop&auto=format"
            alt="Students collaborating"
            className="w-full object-cover"
            style={{ height: 360 }}
          />
        </div>
      </section>

      {/* How it works */}
      <section id="how" style={{ padding: "80px 24px", background: "#fff" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div className="text-center mb-14">
            <div className="text-sm font-semibold mb-3 uppercase tracking-widest" style={{ color: "#117c74" }}>How it works</div>
            <h2 className="text-3xl font-bold" style={{ fontFamily: "'Space Grotesk', sans-serif", color: "#17222b", letterSpacing: "-0.5px" }}>
              From sign-up to move-in in 4 steps
            </h2>
          </div>
          <div className="grid grid-cols-4 gap-8">
            {STEPS.map((step, i) => (
              <div key={i} className="relative">
                {i < STEPS.length - 1 && (
                  <div className="absolute top-8 left-full w-full h-px z-0" style={{ background: "#e2ece9" }} />
                )}
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center mb-5 font-bold text-xl relative z-10"
                  style={{ background: "#ecfdf5", color: "#117c74", fontFamily: "'Space Grotesk', sans-serif" }}
                >
                  {step.n}
                </div>
                <h3 className="font-semibold mb-2 text-base" style={{ fontFamily: "'Space Grotesk', sans-serif", color: "#17222b" }}>{step.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: "#5f7572" }}>{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust features */}
      <section id="trust" style={{ padding: "80px 24px", background: "#f6f9f8" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div className="text-center mb-14">
            <div className="text-sm font-semibold mb-3 uppercase tracking-widest" style={{ color: "#117c74" }}>Why RoomSync</div>
            <h2 className="text-3xl font-bold" style={{ fontFamily: "'Space Grotesk', sans-serif", color: "#17222b", letterSpacing: "-0.5px" }}>
              Safety isn't an afterthought — it's the product
            </h2>
          </div>
          <div className="grid grid-cols-2 gap-6">
            {FEATURES.map((f, i) => (
              <div
                key={i}
                className="rounded-2xl p-6 border transition-all hover:-translate-y-0.5"
                style={{ background: "#fff", borderColor: "#e2ece9", boxShadow: "0 2px 10px rgba(0,0,0,0.03)" }}
              >
                <div className="text-3xl mb-4">{f.icon}</div>
                <h3 className="font-semibold text-base mb-2" style={{ fontFamily: "'Space Grotesk', sans-serif", color: "#17222b" }}>{f.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: "#5f7572" }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section
        style={{ padding: "80px 24px", background: "linear-gradient(135deg, #117c74, #0d635c)" }}
      >
        <div className="text-center" style={{ maxWidth: 600, margin: "0 auto" }}>
          <h2 className="text-3xl font-bold text-white mb-4" style={{ fontFamily: "'Space Grotesk', sans-serif", letterSpacing: "-0.5px" }}>
            Ready to find your people?
          </h2>
          <p className="mb-8" style={{ color: "rgba(255,255,255,0.8)", lineHeight: 1.6 }}>
            Join 1,200+ students who've found their perfect flatmate through RoomSync. Pilot open for NCU Gurugram and Delhi NCR colleges.
          </p>
          <Link to="/signup" style={{ textDecoration: "none" }}>
            <button
              className="px-8 py-4 rounded-xl text-base font-semibold transition-all"
              style={{ background: "#fff", color: "#117c74", height: 52 }}
            >
              Create Your Free Account
            </button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t px-8 py-8 flex items-center justify-between" style={{ background: "#fff", borderColor: "#e2ece9" }}>
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded flex items-center justify-center" style={{ background: "#117c74" }}>
            <span className="text-white font-bold text-xs">R</span>
          </div>
          <span className="font-semibold text-sm" style={{ fontFamily: "'Space Grotesk', sans-serif", color: "#117c74" }}>RoomSync</span>
        </div>
        <p className="text-sm" style={{ color: "#5f7572" }}>© 2026 RoomSync · Find Your People. Find Your Place.</p>
        <div className="flex gap-6 text-sm" style={{ color: "#5f7572" }}>
          <a href="#" style={{ textDecoration: "none", color: "inherit" }}>Privacy</a>
          <a href="#" style={{ textDecoration: "none", color: "inherit" }}>Terms</a>
          <a href="#" style={{ textDecoration: "none", color: "inherit" }}>Contact</a>
        </div>
      </footer>
    </div>
  );
}
