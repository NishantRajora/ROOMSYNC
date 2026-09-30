import { useState } from "react";

const CONSENT_LOG = [
  { action: "College email verified", time: "Sep 30, 2026 14:32", icon: "🏅" },
  { action: "Profile photo uploaded", time: "Sep 28, 2026 11:15", icon: "📷" },
  { action: "Location data shared for Safety Map", time: "Sep 27, 2026 09:42", icon: "🗺" },
  { action: "Roommate Pact anchored on-chain", time: "Sep 25, 2026 18:00", icon: "⛓" },
  { action: "Agreement NLP analysis requested", time: "Sep 24, 2026 16:20", icon: "📄" },
  { action: "Signed up to RoomSync", time: "Sep 20, 2026 10:00", icon: "✅" },
];

export default function Profile() {
  const [form, setForm] = useState({
    name: "Nishant Rajora",
    email: "nishntrajora100@gmail.com",
    collegeEmail: "23csu220@ncuindia.edu",
    phone: "+91 98765 43210",
    college: "The NorthCap University",
    year: "3rd Year, B.Tech CSE",
    bio: "Looking for a clean, peaceful 2BHK near NCU. Night owl, vegetarian, love coding. Let's be flatmates!",
  });
  const [saved, setSaved] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [privacyOpen, setPrivacyOpen] = useState(false);

  const save = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div style={{ fontFamily: "'Inter', sans-serif" }}>
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-1" style={{ fontFamily: "'Space Grotesk', sans-serif", color: "#17222b", letterSpacing: "-0.5px" }}>
          Profile & Privacy
        </h1>
        <p className="text-sm" style={{ color: "#5f7572" }}>Manage your identity, preferences, and data</p>
      </div>

      <div className="grid gap-5" style={{ gridTemplateColumns: "1fr 360px" }}>
        {/* Left: Edit profile */}
        <div className="space-y-5">
          {/* Avatar & verification */}
          <div className="rounded-2xl border p-6 flex items-center gap-5" style={{ background: "#fff", borderColor: "#e2ece9" }}>
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&h=100&fit=crop&auto=format"
                alt="Profile"
                className="w-20 h-20 rounded-full object-cover border-2"
                style={{ borderColor: "#117c74" }}
              />
              <button
                className="absolute bottom-0 right-0 w-7 h-7 rounded-full flex items-center justify-center border-2 border-white text-sm"
                style={{ background: "#117c74", color: "#fff" }}
              >
                +
              </button>
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-bold" style={{ fontFamily: "'Space Grotesk', sans-serif", color: "#17222b" }}>{form.name}</h3>
                <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: "#fef9c3", color: "#854d0e", border: "1px solid #eab308" }}>🏅 Verified Student</span>
              </div>
              <div className="text-sm" style={{ color: "#5f7572" }}>{form.college} · {form.year}</div>
              <div className="text-xs mt-1" style={{ color: "#117c74" }}>{form.collegeEmail}</div>
            </div>
            <div className="text-center">
              <svg width="52" height="52" viewBox="0 0 52 52">
                <circle cx="26" cy="26" r="22" fill="none" stroke="#e2ece9" strokeWidth="4" />
                <circle cx="26" cy="26" r="22" fill="none" stroke="#117c74" strokeWidth="4"
                  strokeDasharray={`${0.72 * 138.2} 138.2`}
                  strokeLinecap="round" transform="rotate(-90 26 26)" />
                <text x="26" y="31" textAnchor="middle" fontSize="11" fontWeight="700" fill="#117c74" fontFamily="Space Grotesk, sans-serif">72%</text>
              </svg>
              <div className="text-xs mt-1" style={{ color: "#5f7572" }}>Profile</div>
            </div>
          </div>

          {/* Form fields */}
          <div className="rounded-2xl border p-6" style={{ background: "#fff", borderColor: "#e2ece9" }}>
            <h3 className="font-semibold mb-5" style={{ fontFamily: "'Space Grotesk', sans-serif", color: "#17222b" }}>Personal Information</h3>
            <div className="grid grid-cols-2 gap-4">
              {[
                { key: "name", label: "Full Name", type: "text" },
                { key: "phone", label: "Phone Number", type: "tel" },
                { key: "email", label: "Personal Email", type: "email" },
                { key: "college", label: "College", type: "text" },
                { key: "year", label: "Year & Programme", type: "text" },
              ].map(f => (
                <div key={f.key} className={f.key === "college" || f.key === "year" ? "col-span-1" : ""}>
                  <label className="block text-sm font-medium mb-1.5" style={{ color: "#17222b" }}>{f.label}</label>
                  <input
                    type={f.type}
                    value={form[f.key as keyof typeof form]}
                    onChange={e => setForm({ ...form, [f.key]: e.target.value })}
                    className="w-full border rounded-xl px-4 py-2.5 text-sm outline-none"
                    style={{ borderColor: "#e2ece9", fontFamily: "'Inter', sans-serif" }}
                    onFocus={e => (e.target.style.borderColor = "#117c74")}
                    onBlur={e => (e.target.style.borderColor = "#e2ece9")}
                  />
                </div>
              ))}
            </div>

            <div className="mt-4 col-span-2">
              <label className="block text-sm font-medium mb-1.5" style={{ color: "#17222b" }}>Bio</label>
              <textarea
                value={form.bio}
                onChange={e => setForm({ ...form, bio: e.target.value })}
                rows={3}
                className="w-full border rounded-xl px-4 py-2.5 text-sm outline-none resize-none"
                style={{ borderColor: "#e2ece9", fontFamily: "'Inter', sans-serif" }}
                onFocus={e => (e.target.style.borderColor = "#117c74")}
                onBlur={e => (e.target.style.borderColor = "#e2ece9")}
              />
              <div className="text-xs text-right mt-1" style={{ color: "#5f7572" }}>{form.bio.length}/200</div>
            </div>

            <div className="flex items-center gap-3 mt-4">
              <button
                onClick={save}
                className="px-6 py-2.5 rounded-xl font-semibold text-white text-sm transition-all"
                style={{ background: saved ? "#10b981" : "#117c74" }}
                onMouseEnter={e => { if (!saved) e.currentTarget.style.background = "#0d635c"; }}
                onMouseLeave={e => { if (!saved) e.currentTarget.style.background = "#117c74"; }}
              >
                {saved ? "✓ Saved!" : "Save Changes"}
              </button>
              <button className="px-4 py-2.5 rounded-xl border text-sm" style={{ borderColor: "#e2ece9", color: "#5f7572" }}>
                Cancel
              </button>
            </div>
          </div>

          {/* Consent log */}
          <div className="rounded-2xl border p-6" style={{ background: "#fff", borderColor: "#e2ece9" }}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold" style={{ fontFamily: "'Space Grotesk', sans-serif", color: "#17222b" }}>Data Activity Log</h3>
              <button
                onClick={() => setPrivacyOpen(!privacyOpen)}
                className="text-sm"
                style={{ color: "#117c74", background: "none", border: "none", cursor: "pointer" }}
              >
                {privacyOpen ? "Hide" : "Show all"}
              </button>
            </div>
            <div className="space-y-3">
              {(privacyOpen ? CONSENT_LOG : CONSENT_LOG.slice(0, 3)).map((item, i) => (
                <div key={i} className="flex items-center gap-3">
                  <span className="text-lg">{item.icon}</span>
                  <div className="flex-1">
                    <div className="text-sm" style={{ color: "#17222b" }}>{item.action}</div>
                    <div className="text-xs" style={{ color: "#5f7572" }}>{item.time}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right panel */}
        <div className="space-y-4">
          {/* Privacy settings */}
          <div className="rounded-2xl border p-5" style={{ background: "#fff", borderColor: "#e2ece9" }}>
            <h3 className="font-semibold mb-4" style={{ fontFamily: "'Space Grotesk', sans-serif", color: "#17222b" }}>Privacy Settings</h3>
            {[
              { label: "Show profile in match feed", on: true },
              { label: "Show college name publicly", on: true },
              { label: "Allow messages from matches only", on: true },
              { label: "Participate in Safety Map data", on: false },
              { label: "Receive email notifications", on: true },
            ].map((item, i) => (
              <div key={i} className="flex items-center justify-between py-2.5 border-b last:border-b-0" style={{ borderColor: "#f6f9f8" }}>
                <span className="text-sm" style={{ color: "#17222b" }}>{item.label}</span>
                <div
                  className="relative cursor-pointer"
                  style={{ width: 40, height: 24 }}
                  onClick={() => { }}
                >
                  <div
                    className="absolute inset-0 rounded-full transition-all"
                    style={{ background: item.on ? "#117c74" : "#e2ece9" }}
                  />
                  <div
                    className="absolute top-1 rounded-full transition-all"
                    style={{ width: 16, height: 16, background: "#fff", left: item.on ? 20 : 4 }}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Data portability */}
          <div className="rounded-2xl border p-5" style={{ background: "#fff", borderColor: "#e2ece9" }}>
            <h3 className="font-semibold mb-3" style={{ fontFamily: "'Space Grotesk', sans-serif", color: "#17222b" }}>Your Data</h3>
            <p className="text-xs mb-4 leading-relaxed" style={{ color: "#5f7572" }}>
              Under the DPDP Act 2023, you have the right to access and download all data RoomSync holds about you.
            </p>
            <button
              className="w-full py-2.5 rounded-xl border font-medium text-sm mb-2 transition-all hover:bg-gray-50"
              style={{ borderColor: "#117c74", color: "#117c74" }}
            >
              📥 Export My Data (JSON)
            </button>
          </div>

          {/* Danger zone */}
          <div className="rounded-2xl border p-5" style={{ background: "#fff", borderColor: "#f43f5e" }}>
            <h3 className="font-semibold mb-2" style={{ fontFamily: "'Space Grotesk', sans-serif", color: "#f43f5e" }}>
              ⚠️ Danger Zone
            </h3>
            <p className="text-xs mb-4 leading-relaxed" style={{ color: "#5f7572" }}>
              Deleting your account is permanent and irreversible. All your matches, messages, and pacts will be removed.
            </p>
            <button
              onClick={() => setDeleteModal(true)}
              className="w-full py-2.5 rounded-xl font-semibold text-sm transition-all"
              style={{ background: "#fff1f2", color: "#f43f5e", border: "1px solid #f43f5e" }}
            >
              Delete My Account
            </button>
          </div>
        </div>
      </div>

      {/* Delete confirmation modal */}
      {deleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: "rgba(0,0,0,0.45)", backdropFilter: "blur(4px)" }}>
          <div className="rounded-2xl p-6 w-full" style={{ maxWidth: 420, background: "#fff", boxShadow: "0 20px 60px rgba(0,0,0,0.15)" }}>
            <div className="text-3xl mb-4 text-center">⚠️</div>
            <h3 className="font-bold text-center mb-3" style={{ fontFamily: "'Space Grotesk', sans-serif", color: "#17222b" }}>
              Delete your account?
            </h3>
            <p className="text-sm text-center mb-6" style={{ color: "#5f7572" }}>
              This action cannot be undone. All your data, matches, messages, and pacts will be permanently deleted.
            </p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteModal(false)} className="flex-1 py-3 rounded-xl border text-sm font-medium" style={{ borderColor: "#e2ece9", color: "#5f7572" }}>
                Cancel
              </button>
              <button className="flex-1 py-3 rounded-xl font-semibold text-white text-sm" style={{ background: "#f43f5e" }}>
                Yes, Delete Account
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
