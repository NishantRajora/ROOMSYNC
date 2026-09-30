import { useState, useEffect } from "react";

type Phase = "setup" | "active" | "safe" | "alert";

export default function SOSVisit() {
  const [phase, setPhase] = useState<Phase>("setup");
  const [duration, setDuration] = useState(45);
  const [destination, setDestination] = useState("");
  const [contact, setContact] = useState("");
  const [secondsLeft, setSecondsLeft] = useState(0);

  useEffect(() => {
    if (phase !== "active") return;
    if (secondsLeft <= 0) {
      setPhase("alert");
      return;
    }
    const t = setTimeout(() => setSecondsLeft(s => s - 1), 1000);
    return () => clearTimeout(t);
  }, [phase, secondsLeft]);

  const startVisit = () => {
    setSecondsLeft(duration * 60);
    setPhase("active");
  };

  const pct = secondsLeft / (duration * 60);
  const mins = Math.floor(secondsLeft / 60);
  const secs = secondsLeft % 60;
  const circumference = 2 * Math.PI * 90;

  return (
    <div style={{ fontFamily: "'Inter', sans-serif" }}>
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-1" style={{ fontFamily: "'Space Grotesk', sans-serif", color: "#17222b", letterSpacing: "-0.5px" }}>
          SOS Flat Visit Companion
        </h1>
        <p className="text-sm" style={{ color: "#5f7572" }}>Stay safe during solo property visits — we'll alert your emergency contact if you don't check in.</p>
      </div>

      {phase === "setup" && (
        <div className="grid gap-6" style={{ gridTemplateColumns: "1fr 1fr" }}>
          <div>
            <div className="rounded-2xl border p-6 mb-4" style={{ background: "#fff", borderColor: "#e2ece9" }}>
              <h3 className="font-bold mb-5" style={{ fontFamily: "'Space Grotesk', sans-serif", color: "#17222b" }}>Visit Details</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1.5" style={{ color: "#17222b" }}>Destination Address</label>
                  <input
                    value={destination}
                    onChange={e => setDestination(e.target.value)}
                    placeholder="Flat 302, Green Palms, Sector 23, Gurugram"
                    className="w-full border rounded-xl px-4 py-3 text-sm outline-none"
                    style={{ borderColor: "#e2ece9", fontFamily: "'Inter', sans-serif" }}
                    onFocus={e => (e.target.style.borderColor = "#117c74")}
                    onBlur={e => (e.target.style.borderColor = "#e2ece9")}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-3" style={{ color: "#17222b" }}>Planned Duration</label>
                  <div className="grid grid-cols-3 gap-3">
                    {[30, 45, 60].map(d => (
                      <button
                        key={d}
                        onClick={() => setDuration(d)}
                        className="py-3 rounded-xl font-semibold text-sm border transition-all"
                        style={{
                          borderColor: duration === d ? "#117c74" : "#e2ece9",
                          background: duration === d ? "#ecfdf5" : "#f6f9f8",
                          color: duration === d ? "#117c74" : "#5f7572",
                        }}
                      >
                        {d} min
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1.5" style={{ color: "#17222b" }}>Emergency Contact</label>
                  <input
                    value={contact}
                    onChange={e => setContact(e.target.value)}
                    placeholder="+91 98765 43210 (parent / friend)"
                    className="w-full border rounded-xl px-4 py-3 text-sm outline-none"
                    style={{ borderColor: "#e2ece9", fontFamily: "'Inter', sans-serif" }}
                    onFocus={e => (e.target.style.borderColor = "#117c74")}
                    onBlur={e => (e.target.style.borderColor = "#e2ece9")}
                  />
                </div>
              </div>
            </div>

            <button
              onClick={startVisit}
              className="w-full py-4 rounded-xl font-bold text-white text-base transition-all"
              style={{ background: "#117c74", height: 56 }}
              onMouseEnter={e => (e.currentTarget.style.background = "#0d635c")}
              onMouseLeave={e => (e.currentTarget.style.background = "#117c74")}
            >
              🛡 Start SOS Check-in
            </button>
          </div>

          {/* How it works */}
          <div className="rounded-2xl border p-6" style={{ background: "#fff", borderColor: "#e2ece9" }}>
            <h3 className="font-bold mb-5" style={{ fontFamily: "'Space Grotesk', sans-serif", color: "#17222b" }}>How it works</h3>
            <div className="space-y-4">
              {[
                { icon: "📍", title: "Set your destination", desc: "Enter the flat address you're visiting" },
                { icon: "⏱", title: "Choose a duration", desc: "30, 45 or 60 minutes — enough to look around" },
                { icon: "📱", title: "Add emergency contact", desc: "A trusted person who'll be alerted if you miss check-in" },
                { icon: "✅", title: "Tap 'I'm Safe' when done", desc: "If you don't tap in time, your contact gets an automated alert" },
              ].map((s, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0" style={{ background: "#f6f9f8" }}>{s.icon}</div>
                  <div>
                    <div className="text-sm font-semibold mb-0.5" style={{ color: "#17222b" }}>{s.title}</div>
                    <div className="text-xs" style={{ color: "#5f7572" }}>{s.desc}</div>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-5 p-3 rounded-xl text-xs" style={{ background: "#fef9c3", color: "#92400e" }}>
              ⚠️ This tool is a personal safety aid. In an emergency, always call 112 (police) or 100 (emergency).
            </div>
          </div>
        </div>
      )}

      {phase === "active" && (
        <div className="flex flex-col items-center py-10">
          <div className="text-sm font-medium mb-2 px-4 py-1.5 rounded-full" style={{ background: "#ecfdf5", color: "#117c74" }}>
            🛡 Check-in Active — Visit in progress
          </div>
          <div className="text-xs mb-8" style={{ color: "#5f7572" }}>📍 {destination || "Flat 302, Green Palms, Sector 23"}</div>

          {/* Timer ring */}
          <div className="relative mb-8">
            <svg width="240" height="240" viewBox="0 0 240 240">
              <circle cx="120" cy="120" r="90" fill="none" stroke="#e2ece9" strokeWidth="10" />
              <circle
                cx="120" cy="120" r="90"
                fill="none"
                stroke={pct > 0.3 ? "#117c74" : "#f43f5e"}
                strokeWidth="10"
                strokeDasharray={`${pct * circumference} ${circumference}`}
                strokeLinecap="round"
                transform="rotate(-90 120 120)"
                style={{ transition: "stroke-dasharray 0.5s linear" }}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <div
                className="text-5xl font-bold"
                style={{ fontFamily: "'Space Grotesk', sans-serif", color: pct > 0.3 ? "#17222b" : "#f43f5e" }}
              >
                {String(mins).padStart(2, "0")}:{String(secs).padStart(2, "0")}
              </div>
              <div className="text-sm mt-1" style={{ color: "#5f7572" }}>remaining</div>
            </div>
          </div>

          <button
            onClick={() => setPhase("safe")}
            className="px-10 py-4 rounded-2xl font-bold text-white text-lg mb-4 transition-all hover:scale-105"
            style={{ background: "#117c74", minWidth: 240 }}
          >
            ✓ I'm Safe — Check In
          </button>
          <button
            onClick={() => setPhase("setup")}
            className="text-sm"
            style={{ color: "#5f7572", background: "none", border: "none", cursor: "pointer" }}
          >
            Cancel visit
          </button>

          {pct < 0.3 && (
            <div className="mt-6 flex items-center gap-2 px-4 py-3 rounded-xl" style={{ background: "#fff1f2", border: "1px solid #f43f5e" }}>
              <span className="text-xl">⚠️</span>
              <span className="text-sm" style={{ color: "#f43f5e" }}>Less than 30% time left — tap I'm Safe soon!</span>
            </div>
          )}
        </div>
      )}

      {phase === "safe" && (
        <div className="flex flex-col items-center py-16">
          <div className="w-24 h-24 rounded-full flex items-center justify-center text-5xl mb-6" style={{ background: "#ecfdf5", border: "3px solid #10b981" }}>
            ✓
          </div>
          <h2 className="text-2xl font-bold mb-3" style={{ fontFamily: "'Space Grotesk', sans-serif", color: "#17222b" }}>
            You're safe!
          </h2>
          <p className="text-sm mb-8" style={{ color: "#5f7572" }}>
            Check-in recorded at {new Date().toLocaleTimeString()}. Your emergency contact has been notified you're safe.
          </p>
          <button
            onClick={() => setPhase("setup")}
            className="px-6 py-3 rounded-xl font-semibold text-white text-sm"
            style={{ background: "#117c74" }}
          >
            Start New Visit
          </button>
        </div>
      )}

      {phase === "alert" && (
        <div className="flex flex-col items-center py-12">
          <div
            className="w-28 h-28 rounded-full flex items-center justify-center text-5xl mb-6"
            style={{
              background: "#fff1f2",
              border: "3px solid #f43f5e",
              animation: "pulse 1s ease-in-out infinite",
            }}
          >
            ⚠️
          </div>
          <h2 className="text-2xl font-bold mb-3" style={{ fontFamily: "'Space Grotesk', sans-serif", color: "#f43f5e" }}>
            Check-in missed!
          </h2>
          <p className="text-sm mb-2" style={{ color: "#5f7572" }}>
            You didn't check in within {duration} minutes.
          </p>
          <div className="px-4 py-3 rounded-xl mb-8 text-sm" style={{ background: "#fff1f2", color: "#f43f5e", border: "1px solid #f43f5e" }}>
            🚨 Alert sent to {contact || "+91 98765 43210"} — {new Date().toLocaleTimeString()}
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => setPhase("safe")}
              className="px-6 py-3 rounded-xl font-semibold text-white text-sm"
              style={{ background: "#10b981" }}
            >
              I'm Safe — Cancel Alert
            </button>
            <button
              onClick={() => setPhase("setup")}
              className="px-6 py-3 rounded-xl border text-sm"
              style={{ borderColor: "#e2ece9", color: "#5f7572" }}
            >
              End Session
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
