import { Link } from "react-router-dom";
import { MATCHES, LISTINGS } from "../data/mockData";

const QUICK_STATS = [
  { label: "Match Score Top", value: "92%", sub: "Priya Sharma", icon: "♡", color: "#117c74" },
  { label: "Listings Saved", value: "7", sub: "3 high trust score", icon: "🏠", color: "#117c74" },
  { label: "Profile Completion", value: "72%", sub: "Add budget to improve", icon: "⬡", color: "#f59e0b" },
  { label: "Unread Messages", value: "3", sub: "2 from matches", icon: "💬", color: "#117c74" },
];

export default function Dashboard() {
  const topMatches = MATCHES.slice(0, 3);
  const featuredListing = LISTINGS[0];

  return (
    <div style={{ fontFamily: "'Inter', sans-serif" }}>
      {/* Welcome */}
      <div
        className="rounded-2xl p-6 mb-6 flex items-center gap-6 border"
        style={{
          background: "linear-gradient(135deg, #117c74 0%, #0d635c 100%)",
          borderColor: "transparent",
        }}
      >
        <img
          src="https://images.unsplash.com/photo-1580489944761-15a19d654956?w=80&h=80&fit=crop&auto=format"
          alt="Profile"
          className="w-16 h-16 rounded-full object-cover border-3 border-white flex-shrink-0"
          style={{ border: "3px solid rgba(255,255,255,0.8)" }}
        />
        <div className="flex-1">
          <h1
            className="text-xl font-bold text-white mb-1"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            Welcome back, Arjun! 👋
          </h1>
          <p style={{ color: "rgba(255,255,255,0.8)", fontSize: 14 }}>
            You have <strong className="text-white">6 new matches</strong> and <strong className="text-white">3 unread messages</strong> today.
          </p>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <div
            className="px-4 py-2 rounded-xl text-sm font-medium"
            style={{ background: "#fef9c3", color: "#854d0e" }}
          >
            🏅 Verified Student
          </div>
        </div>
      </div>

      {/* Quick stats */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        {QUICK_STATS.map((s, i) => (
          <div
            key={i}
            className="rounded-2xl p-4 border transition-all hover:-translate-y-0.5"
            style={{ background: "#fff", borderColor: "#e2ece9", boxShadow: "0 2px 10px rgba(0,0,0,0.03)" }}
          >
            <div className="flex items-start justify-between mb-3">
              <span className="text-xl">{s.icon}</span>
              <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: "#f6f9f8", color: "#5f7572" }}>Today</span>
            </div>
            <div className="text-2xl font-bold mb-0.5" style={{ fontFamily: "'Space Grotesk', sans-serif", color: s.color }}>{s.value}</div>
            <div className="text-xs font-medium mb-0.5" style={{ color: "#17222b" }}>{s.label}</div>
            <div className="text-xs" style={{ color: "#5f7572" }}>{s.sub}</div>
          </div>
        ))}
      </div>

      <div className="grid gap-6" style={{ gridTemplateColumns: "1fr 360px" }}>
        {/* Main content */}
        <div>
          {/* Top matches */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold" style={{ fontFamily: "'Space Grotesk', sans-serif", color: "#17222b" }}>
                Top Matches for You
              </h2>
              <Link to="/matches" className="text-sm font-medium" style={{ color: "#117c74", textDecoration: "none" }}>View all →</Link>
            </div>
            <div className="grid grid-cols-3 gap-4">
              {topMatches.map(m => (
                <Link key={m.id} to="/matches" style={{ textDecoration: "none" }}>
                  <div
                    className="rounded-2xl p-4 border transition-all hover:-translate-y-1 cursor-pointer"
                    style={{ background: "#fff", borderColor: "#e2ece9", boxShadow: "0 2px 10px rgba(0,0,0,0.03)" }}
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <img src={m.photo} alt={m.name} className="w-10 h-10 rounded-full object-cover" />
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-semibold truncate" style={{ fontFamily: "'Space Grotesk', sans-serif", color: "#17222b" }}>{m.name}</div>
                        <div className="text-xs truncate" style={{ color: "#5f7572" }}>{m.college}</div>
                      </div>
                    </div>
                    {/* Score ring */}
                    <div className="flex items-center gap-3 mb-3">
                      <svg width="44" height="44" viewBox="0 0 44 44" className="flex-shrink-0">
                        <circle cx="22" cy="22" r="18" fill="none" stroke="#e2ece9" strokeWidth="3" />
                        <circle
                          cx="22" cy="22" r="18"
                          fill="none" stroke="#117c74" strokeWidth="3"
                          strokeDasharray={`${(m.score / 100) * 113.1} 113.1`}
                          strokeLinecap="round"
                          transform="rotate(-90 22 22)"
                        />
                        <text x="22" y="26" textAnchor="middle" fontSize="10" fontWeight="700" fill="#117c74" fontFamily="Space Grotesk, sans-serif">{m.score}%</text>
                      </svg>
                      <div className="text-xs" style={{ color: "#5f7572" }}>Compatibility</div>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {m.matchReasons.slice(0, 2).map((r, i) => (
                        <span key={i} className="text-xs px-2 py-0.5 rounded-full" style={{ background: "#ecfdf5", color: "#117c74" }}>{r.slice(0, 20)}</span>
                      ))}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Featured listing */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold" style={{ fontFamily: "'Space Grotesk', sans-serif", color: "#17222b" }}>
                Featured Listing Near You
              </h2>
              <Link to="/listings" className="text-sm font-medium" style={{ color: "#117c74", textDecoration: "none" }}>Browse all →</Link>
            </div>
            <Link to="/listings/1" style={{ textDecoration: "none" }}>
              <div
                className="rounded-2xl border overflow-hidden transition-all hover:-translate-y-0.5 cursor-pointer"
                style={{ background: "#fff", borderColor: "#e2ece9", boxShadow: "0 2px 10px rgba(0,0,0,0.03)" }}
              >
                <img src={featuredListing.photo} alt={featuredListing.title} className="w-full object-cover" style={{ height: 180 }} />
                <div className="p-5 flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold mb-1" style={{ fontFamily: "'Space Grotesk', sans-serif", color: "#17222b" }}>{featuredListing.title}</h3>
                    <div className="text-sm mb-2" style={{ color: "#5f7572" }}>📍 {featuredListing.locality}</div>
                    <div className="text-xl font-bold" style={{ fontFamily: "'Space Grotesk', sans-serif", color: "#17222b" }}>
                      ₹{featuredListing.price.toLocaleString()}<span className="text-sm font-normal text-gray-400">/mo</span>
                    </div>
                  </div>
                  <TrustBadge score={featuredListing.trustScore} />
                </div>
              </div>
            </Link>
          </div>
        </div>

        {/* Right sidebar */}
        <div className="space-y-4">
          {/* Profile completion nudge */}
          <div className="rounded-2xl p-5 border" style={{ background: "#fff", borderColor: "#e2ece9" }}>
            <h3 className="font-semibold mb-3 text-sm" style={{ fontFamily: "'Space Grotesk', sans-serif", color: "#17222b" }}>
              Complete Your Profile
            </h3>
            <div className="flex items-center gap-3 mb-4">
              <svg width="56" height="56" viewBox="0 0 56 56">
                <circle cx="28" cy="28" r="24" fill="none" stroke="#e2ece9" strokeWidth="4" />
                <circle
                  cx="28" cy="28" r="24"
                  fill="none" stroke="#117c74" strokeWidth="4"
                  strokeDasharray={`${0.72 * 150.8} 150.8`}
                  strokeLinecap="round"
                  transform="rotate(-90 28 28)"
                />
                <text x="28" y="33" textAnchor="middle" fontSize="12" fontWeight="700" fill="#117c74" fontFamily="Space Grotesk, sans-serif">72%</text>
              </svg>
              <div>
                <div className="text-sm font-semibold" style={{ color: "#17222b" }}>Almost there!</div>
                <div className="text-xs" style={{ color: "#5f7572" }}>Complete profile for better matches</div>
              </div>
            </div>
            {[
              { label: "Add budget preferences", done: false },
              { label: "Upload profile photo", done: true },
              { label: "Verify college email", done: true },
              { label: "Complete lifestyle quiz", done: false },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-2 mb-2">
                <div
                  className="w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 text-xs"
                  style={{ background: item.done ? "#ecfdf5" : "#f6f9f8", color: item.done ? "#117c74" : "#5f7572", border: `1px solid ${item.done ? "#117c74" : "#e2ece9"}` }}
                >
                  {item.done ? "✓" : ""}
                </div>
                <span className="text-xs" style={{ color: item.done ? "#5f7572" : "#17222b", textDecoration: item.done ? "line-through" : "none" }}>{item.label}</span>
              </div>
            ))}
            <Link to="/profile" style={{ textDecoration: "none" }}>
              <button
                className="w-full mt-3 py-2 rounded-xl text-sm font-medium border transition-all"
                style={{ borderColor: "#117c74", color: "#117c74", background: "#ecfdf5" }}
              >
                Finish Profile →
              </button>
            </Link>
          </div>

          {/* Quick actions */}
          <div className="rounded-2xl p-5 border" style={{ background: "#fff", borderColor: "#e2ece9" }}>
            <h3 className="font-semibold mb-3 text-sm" style={{ fontFamily: "'Space Grotesk', sans-serif", color: "#17222b" }}>Quick Actions</h3>
            <div className="space-y-2">
              {[
                { icon: "🛡", label: "Start SOS Visit Check-in", to: "/sos", color: "#fef9c3" },
                { icon: "📄", label: "Analyze an Agreement", to: "/agreement", color: "#ecfdf5" },
                { icon: "₹", label: "Split a Bill", to: "/bills", color: "#ecfdf5" },
                { icon: "📋", label: "Create Roommate Pact", to: "/pact", color: "#ecfdf5" },
              ].map((a, i) => (
                <Link key={i} to={a.to} style={{ textDecoration: "none" }}>
                  <div
                    className="flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all hover:translate-x-1"
                    style={{ background: a.color }}
                  >
                    <span className="text-lg">{a.icon}</span>
                    <span className="text-sm font-medium" style={{ color: "#17222b" }}>{a.label}</span>
                    <span className="ml-auto text-xs" style={{ color: "#5f7572" }}>→</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function TrustBadge({ score }: { score: number }) {
  const color = score >= 70 ? "#10b981" : score >= 40 ? "#f59e0b" : "#f43f5e";
  const bg = score >= 70 ? "#ecfdf5" : score >= 40 ? "#fffbeb" : "#fff1f2";
  return (
    <div
      className="flex flex-col items-center px-3 py-2 rounded-xl"
      style={{ background: bg, border: `1px solid ${color}20` }}
    >
      <div className="text-xs font-semibold mb-0.5" style={{ color }}>Trust Score</div>
      <div className="text-2xl font-bold" style={{ fontFamily: "'Space Grotesk', sans-serif", color }}>{score}</div>
      <div className="text-xs" style={{ color }}>/ 100</div>
    </div>
  );
}
