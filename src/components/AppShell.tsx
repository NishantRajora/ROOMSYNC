import { useState } from "react";
import { Link, useLocation, Outlet } from "react-router-dom";

const NAV = [
  { path: "/dashboard", icon: "⬡", label: "Dashboard" },
  { path: "/matches", icon: "♡", label: "Discover Matches" },
  { path: "/listings", icon: "🏠", label: "Find Listings" },
  { path: "/bills", icon: "₹", label: "Bill Splitter" },
  { path: "/pact", icon: "📋", label: "Roommate Pact" },
  { path: "/safety-map", icon: "🗺", label: "Safety Map" },
  { path: "/agreement", icon: "📄", label: "Agreement Analyzer" },
  { path: "/reviews", icon: "★", label: "Reviews" },
  { path: "/sos", icon: "🛡", label: "SOS Visit" },
  { path: "/messages", icon: "💬", label: "Messages" },
];

export default function AppShell() {
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [chatMsg, setChatMsg] = useState("");

  const notifs = [
    { text: "Priya Sharma sent you a message", time: "2m ago", dot: true },
    { text: "New match: Ananya Verma (87%)", time: "1h ago", dot: true },
    { text: "Safety alert: SOS visit timer expired", time: "3h ago", dot: false },
    { text: "Agreement analysis ready", time: "1d ago", dot: false },
  ];

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: "#f6f9f8", fontFamily: "'Inter', sans-serif" }}>
      {/* Sidebar */}
      <aside
        className="flex flex-col flex-shrink-0 border-r transition-all duration-300"
        style={{
          width: collapsed ? 64 : 240,
          background: "#ffffff",
          borderColor: "#e2ece9",
        }}
      >
        {/* Logo */}
        <div className="flex items-center gap-3 px-4 py-5 border-b" style={{ borderColor: "#e2ece9", minHeight: 72 }}>
          <div className="flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: "#117c74" }}>
            <span className="text-white font-bold text-sm" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>R</span>
          </div>
          {!collapsed && (
            <span className="font-bold text-lg" style={{ fontFamily: "'Space Grotesk', sans-serif", color: "#117c74" }}>
              RoomSync
            </span>
          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="ml-auto text-sm"
            style={{ color: "#5f7572" }}
          >
            {collapsed ? "›" : "‹"}
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 py-4 overflow-y-auto">
          {NAV.map((item) => {
            const active = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className="flex items-center gap-3 mx-2 mb-1 rounded-lg transition-all"
                style={{
                  padding: collapsed ? "10px 14px" : "10px 14px",
                  background: active ? "#ecfdf5" : "transparent",
                  color: active ? "#117c74" : "#5f7572",
                  fontWeight: active ? 600 : 400,
                  fontSize: 14,
                  textDecoration: "none",
                }}
                onMouseEnter={(e) => {
                  if (!active) (e.currentTarget as HTMLElement).style.background = "#f6f9f8";
                }}
                onMouseLeave={(e) => {
                  if (!active) (e.currentTarget as HTMLElement).style.background = "transparent";
                }}
              >
                <span className="text-base flex-shrink-0">{item.icon}</span>
                {!collapsed && <span>{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        {/* Admin + Profile */}
        <div className="border-t py-3" style={{ borderColor: "#e2ece9" }}>
          <Link
            to="/admin"
            className="flex items-center gap-3 mx-2 mb-1 rounded-lg transition-all"
            style={{ padding: "10px 14px", color: "#5f7572", fontSize: 14, textDecoration: "none" }}
            onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = "#f6f9f8")}
            onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = "transparent")}
          >
            <span>⚙</span>
            {!collapsed && <span>Admin</span>}
          </Link>
          <Link
            to="/profile"
            className="flex items-center gap-3 mx-2 rounded-lg transition-all"
            style={{ padding: "10px 14px", color: "#5f7572", fontSize: 14, textDecoration: "none" }}
            onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = "#f6f9f8")}
            onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = "transparent")}
          >
            <span>👤</span>
            {!collapsed && <span>Profile</span>}
          </Link>
        </div>
      </aside>

      {/* Main */}
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        {/* Topbar */}
        <header
          className="flex items-center gap-4 px-6 border-b flex-shrink-0"
          style={{ height: 72, background: "#ffffff", borderColor: "#e2ece9" }}
        >
          <div className="flex-1">
            <div className="text-sm font-medium" style={{ color: "#17222b", fontFamily: "'Space Grotesk', sans-serif" }}>
              {NAV.find(n => n.path === location.pathname)?.label ?? "RoomSync"}
            </div>
            <div className="text-xs mt-0.5" style={{ color: "#5f7572" }}>NCU Gurugram · Sector 23</div>
          </div>

          {/* Profile completion ring */}
          <Link to="/profile" style={{ textDecoration: "none" }}>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg" style={{ background: "#f6f9f8", cursor: "pointer" }}>
              <svg width="28" height="28" viewBox="0 0 28 28">
                <circle cx="14" cy="14" r="12" fill="none" stroke="#e2ece9" strokeWidth="2.5" />
                <circle
                  cx="14" cy="14" r="12"
                  fill="none" stroke="#117c74" strokeWidth="2.5"
                  strokeDasharray={`${0.72 * 75.4} 75.4`}
                  strokeLinecap="round"
                  transform="rotate(-90 14 14)"
                />
                <text x="14" y="17.5" textAnchor="middle" fontSize="7" fontWeight="700" fill="#117c74" fontFamily="Space Grotesk, sans-serif">72%</text>
              </svg>
              <div>
                <div className="text-xs font-semibold" style={{ color: "#17222b" }}>Profile</div>
                <div className="text-xs" style={{ color: "#5f7572" }}>72% complete</div>
              </div>
            </div>
          </Link>

          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => setNotifOpen(!notifOpen)}
              className="relative w-10 h-10 rounded-lg flex items-center justify-center transition-all"
              style={{ background: notifOpen ? "#ecfdf5" : "#f6f9f8", border: "1px solid #e2ece9" }}
            >
              <span style={{ fontSize: 18 }}>🔔</span>
              <span
                className="absolute top-1 right-1 w-2 h-2 rounded-full"
                style={{ background: "#f43f5e" }}
              />
            </button>
            {notifOpen && (
              <div
                className="absolute right-0 top-12 rounded-xl shadow-lg z-50 overflow-hidden"
                style={{ width: 320, background: "#fff", border: "1px solid #e2ece9" }}
              >
                <div className="px-4 py-3 border-b" style={{ borderColor: "#e2ece9" }}>
                  <span className="font-semibold text-sm" style={{ fontFamily: "'Space Grotesk', sans-serif", color: "#17222b" }}>Notifications</span>
                </div>
                {notifs.map((n, i) => (
                  <div key={i} className="flex items-start gap-3 px-4 py-3 border-b last:border-b-0 hover:bg-gray-50 cursor-pointer" style={{ borderColor: "#f0f0f0" }}>
                    {n.dot && <span className="mt-1.5 w-2 h-2 rounded-full flex-shrink-0" style={{ background: "#117c74" }} />}
                    {!n.dot && <span className="mt-1.5 w-2 h-2 rounded-full flex-shrink-0" style={{ background: "transparent" }} />}
                    <div>
                      <div className="text-sm" style={{ color: "#17222b" }}>{n.text}</div>
                      <div className="text-xs mt-0.5" style={{ color: "#5f7572" }}>{n.time}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Avatar */}
          <Link to="/profile">
            <div className="w-10 h-10 rounded-full overflow-hidden border-2" style={{ borderColor: "#117c74", cursor: "pointer" }}>
              <img src="https://images.unsplash.com/photo-1580489944761-15a19d654956?w=80&h=80&fit=crop&auto=format" alt="Profile" className="w-full h-full object-cover" />
            </div>
          </Link>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto" style={{ padding: 24 }}>
          <div style={{ maxWidth: 1200, margin: "0 auto" }}>
            <Outlet />
          </div>
        </main>
      </div>

      {/* Floating chat widget */}
      <div className="fixed bottom-6 right-6 z-40">
        {chatOpen && (
          <div
            className="mb-3 rounded-2xl shadow-2xl overflow-hidden flex flex-col"
            style={{ width: 360, height: 480, background: "#fff", border: "1px solid #e2ece9" }}
          >
            <div className="flex items-center gap-3 px-4 py-3 border-b" style={{ background: "#117c74", borderColor: "#0d635c" }}>
              <img
                src="https://images.unsplash.com/photo-1494790108755-2616b612b67c?w=40&h=40&fit=crop&auto=format"
                alt="Priya"
                className="w-8 h-8 rounded-full object-cover border-2 border-white"
              />
              <div>
                <div className="text-sm font-semibold text-white" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>Priya Sharma</div>
                <div className="text-xs" style={{ color: "rgba(255,255,255,0.75)" }}>NCU Gurugram · Online</div>
              </div>
              <button onClick={() => setChatOpen(false)} className="ml-auto text-white opacity-75 hover:opacity-100">✕</button>
            </div>
            <div className="flex-1 overflow-y-auto px-4 py-3 space-y-2" style={{ background: "#f6f9f8" }}>
              {[
                { from: "them", text: "Hey! Saw your profile match (92%) 😊", time: "10:30" },
                { from: "you", text: "Hi Priya! Yes, interested in Sector 23 area", time: "10:32" },
                { from: "them", text: "The 2BHK near NCU looks perfect. Shall we schedule a visit?", time: "10:35" },
              ].map((m, i) => (
                <div key={i} className={`flex ${m.from === "you" ? "justify-end" : "justify-start"}`}>
                  <div
                    className="rounded-2xl px-3 py-2 text-sm max-w-[80%]"
                    style={{
                      background: m.from === "you" ? "#117c74" : "#fff",
                      color: m.from === "you" ? "#fff" : "#17222b",
                      borderBottomRightRadius: m.from === "you" ? 4 : 16,
                      borderBottomLeftRadius: m.from === "them" ? 4 : 16,
                    }}
                  >
                    {m.text}
                  </div>
                </div>
              ))}
            </div>
            <div className="flex items-center gap-2 px-3 py-3 border-t" style={{ borderColor: "#e2ece9" }}>
              <input
                value={chatMsg}
                onChange={e => setChatMsg(e.target.value)}
                placeholder="Type a message..."
                className="flex-1 rounded-xl border px-3 py-2 text-sm outline-none"
                style={{ borderColor: "#e2ece9", background: "#f6f9f8", fontFamily: "'Inter', sans-serif" }}
                onKeyDown={e => e.key === "Enter" && setChatMsg("")}
              />
              <button
                onClick={() => setChatMsg("")}
                className="w-9 h-9 rounded-xl flex items-center justify-center"
                style={{ background: "#117c74" }}
              >
                <span className="text-white text-sm">↑</span>
              </button>
            </div>
          </div>
        )}
        <button
          onClick={() => setChatOpen(!chatOpen)}
          className="w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-transform hover:scale-105"
          style={{ background: "#117c74" }}
        >
          <span className="text-2xl">{chatOpen ? "✕" : "💬"}</span>
          {!chatOpen && (
            <span
              className="absolute -top-1 -right-1 w-5 h-5 rounded-full text-xs font-bold flex items-center justify-center text-white"
              style={{ background: "#f43f5e" }}
            >2</span>
          )}
        </button>
      </div>
    </div>
  );
}
