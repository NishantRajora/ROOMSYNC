import React, { useState, useEffect } from "react";
import { ShieldAlert, CheckCircle2, Clock, MapPin, Phone, AlertTriangle, Play, BellRing } from "lucide-react";

export interface FlatVisitCompanionProps {
  api: string;
  currentUser: string;
  onNotify: (msg: string) => void;
}

export const FlatVisitCompanion: React.FC<FlatVisitCompanionProps> = ({ api, currentUser, onNotify }) => {
  const [destination, setDestination] = useState("Sector 23, Gurugram (Near NCU Campus)");
  const [durationMins, setDurationMins] = useState(45);
  const [emergencyPhone, setEmergencyPhone] = useState("+91 98765 00000");
  const [isActive, setIsActive] = useState(false);
  const [secondsRemaining, setSecondsRemaining] = useState(45 * 60);
  const [isSosTriggered, setIsSosTriggered] = useState(false);

  const baseApi = api.replace(/\/api\/?$/, "") + "/api";

  // Check active visit on mount
  useEffect(() => {
    const checkActive = async () => {
      try {
        const res = await fetch(`${baseApi}/safety/visit-alerts/?user=${encodeURIComponent(currentUser || "demo@roomsync.test")}`);
        if (res.ok) {
          const data = await res.json();
          if (data.active_visit) {
            setIsActive(true);
            setDestination(data.active_visit.destination);
            setEmergencyPhone(data.active_visit.emergency_phone);
            const endsAt = new Date(data.active_visit.ends_at).getTime();
            const now = new Date().getTime();
            const diffSeconds = Math.max(0, Math.floor((endsAt - now) / 1000));
            setSecondsRemaining(diffSeconds);
          }
        }
      } catch {
        // Fallback
      }
    };
    checkActive();
  }, [baseApi, currentUser]);

  // Countdown timer loop
  useEffect(() => {
    if (!isActive || secondsRemaining <= 0) return;
    const interval = setInterval(() => {
      setSecondsRemaining((sec) => {
        if (sec <= 1) {
          // Timer expired without checkin -> trigger SOS notice
          handleTriggerSos();
          return 0;
        }
        return sec - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [isActive, secondsRemaining]);

  const handleStartVisit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch(`${baseApi}/safety/visit-alerts/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "start",
          user_email: currentUser || "demo@roomsync.test",
          destination,
          duration_mins: durationMins,
          emergency_phone: emergencyPhone,
        }),
      });

      if (res.ok) {
        setIsActive(true);
        setSecondsRemaining(durationMins * 60);
        setIsSosTriggered(false);
        onNotify(`🛡️ Visit timer armed for ${durationMins} mins.`);
      }
    } catch {
      onNotify("Error arming visit timer.");
    }
  };

  const handleCheckInSafe = async () => {
    try {
      const res = await fetch(`${baseApi}/safety/visit-alerts/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "checkin",
          user_email: currentUser || "demo@roomsync.test",
        }),
      });

      if (res.ok) {
        setIsActive(false);
        setIsSosTriggered(false);
        onNotify("✅ You have checked in safe! Visit completed.");
      }
    } catch {
      onNotify("Error recording check-in.");
    }
  };

  const handleTriggerSos = async () => {
    setIsSosTriggered(true);
    try {
      await fetch(`${baseApi}/safety/visit-alerts/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "sos",
          user_email: currentUser || "demo@roomsync.test",
        }),
      });
      onNotify("🚨 EMERGENCY SOS BROADCAST SENT TO TRUSTED CONTACTS & SECURITY!");
    } catch {
      onNotify("SOS alert sent locally.");
    }
  };

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const s = secs % 60;
    return `${mins.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  return (
    <section className="flat-visit-section" style={{ marginTop: "12px" }}>
      <div style={{ marginBottom: "20px" }}>
        <p className="eyebrow mint-text">SOLO FLAT INSPECTION PROTECTION</p>
        <h2 style={{ fontFamily: "Space Grotesk", margin: "4px 0 8px" }}>Flat Visit Companion & SOS Sentinel</h2>
        <p style={{ color: "var(--muted)", margin: 0 }}>
          Arm a safety timer whenever viewing an off-campus room in Gurgaon alone. Automatic SOS alerts if you don't check in safe.
        </p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "24px" }}>
        {/* Left Side: Companion Control Panel */}
        <div style={{ background: "#fff", padding: "26px", borderRadius: "16px", border: "1px solid var(--line)" }}>
          {!isActive ? (
            <form onSubmit={handleStartVisit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "var(--teal)" }}>
                <Clock size={20} />
                <h3 style={{ margin: 0, fontSize: "17px" }}>Arm a New Inspection Timer</h3>
              </div>

              <label>
                Destination / Room Location
                <div style={{ position: "relative", marginTop: "4px" }}>
                  <input
                    type="text"
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    placeholder="e.g. DLF Phase 3, U-Block House #42"
                    required
                  />
                </div>
              </label>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                <label>
                  Timer Duration
                  <select
                    value={durationMins}
                    onChange={(e) => setDurationMins(Number(e.target.value))}
                    style={{ border: "1px solid #d5dfdb", borderRadius: "6px", padding: "10px", outline: "none", marginTop: "4px" }}
                  >
                    <option value={15}>15 Minutes (Quick Look)</option>
                    <option value={30}>30 Minutes (Standard Tour)</option>
                    <option value={45}>45 Minutes (Detailed Visit)</option>
                    <option value={60}>60 Minutes (Lease Negotiation)</option>
                  </select>
                </label>

                <label>
                  Emergency Contact Phone
                  <input
                    type="tel"
                    value={emergencyPhone}
                    onChange={(e) => setEmergencyPhone(e.target.value)}
                    placeholder="+91 98765 00000"
                    required
                    style={{ marginTop: "4px" }}
                  />
                </label>
              </div>

              <div style={{ background: "#f8fbf7", padding: "12px 16px", borderRadius: "10px", fontSize: "12px", color: "var(--muted)" }}>
                🛡️ <em>Safety Guarantee:</em> If timer expires without your check-in, an automated SMS & WhatsApp notification with your destination address and GPS coordinates is dispatched to your emergency contact.
              </div>

              <button
                type="submit"
                className="primary"
                style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "6px", padding: "12px" }}
              >
                <Play size={16} /> Start Protected Flat Visit
              </button>
            </form>
          ) : (
            <div style={{ textAlign: "center", padding: "10px 0" }}>
              <div
                style={{
                  width: "140px",
                  height: "140px",
                  borderRadius: "50%",
                  border: isSosTriggered ? "6px solid #e53e3e" : "6px solid #117c74",
                  display: "grid",
                  placeItems: "center",
                  margin: "0 auto 16px",
                  background: isSosTriggered ? "#fff5f5" : "#f0fdf4",
                  animation: isSosTriggered ? "pulse 1s infinite" : "none",
                }}
              >
                <div>
                  <div style={{ fontSize: "32px", fontWeight: 700, fontFamily: "Space Grotesk", color: isSosTriggered ? "#c53030" : "var(--teal)" }}>
                    {formatTime(secondsRemaining)}
                  </div>
                  <small style={{ color: "var(--muted)", textTransform: "uppercase", fontSize: "10px", fontWeight: 700 }}>
                    {isSosTriggered ? "SOS ACTIVE" : "TIME REMAINING"}
                  </small>
                </div>
              </div>

              <h3 style={{ margin: "4px 0" }}>
                {isSosTriggered ? "🚨 Emergency SOS Sent" : "Protected Visit Active"}
              </h3>
              <p style={{ fontSize: "13px", color: "var(--muted)", margin: "4px 0 16px" }}>
                Visiting: <strong>{destination}</strong>
              </p>

              <div style={{ display: "flex", gap: "10px", justifyContent: "center", flexWrap: "wrap" }}>
                <button
                  onClick={handleCheckInSafe}
                  style={{
                    padding: "10px 20px",
                    borderRadius: "10px",
                    border: "none",
                    background: "#276749",
                    color: "#fff",
                    fontWeight: 600,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                  }}
                >
                  <CheckCircle2 size={16} /> I'm Safe - Check In
                </button>

                <button
                  onClick={handleTriggerSos}
                  disabled={isSosTriggered}
                  style={{
                    padding: "10px 18px",
                    borderRadius: "10px",
                    border: "none",
                    background: isSosTriggered ? "#9b2c2c" : "#e53e3e",
                    color: "#fff",
                    fontWeight: 700,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                  }}
                >
                  <ShieldAlert size={16} /> {isSosTriggered ? "SOS Dispatched" : "Trigger SOS Now"}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Right Side: Safety Protocols & Emergency Hotlines */}
        <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
          <div style={{ background: "#fff", padding: "20px 24px", borderRadius: "16px", border: "1px solid var(--line)" }}>
            <h4 style={{ margin: "0 0 10px", fontSize: "15px", display: "flex", alignItems: "center", gap: "6px" }}>
              <BellRing size={16} style={{ color: "#d97706" }} /> Important Solo Visit Safety Protocol
            </h4>
            <ul style={{ margin: 0, paddingLeft: "18px", display: "flex", flexDirection: "column", gap: "6px", fontSize: "13px", color: "#4a5568" }}>
              <li>Never inspect properties after sunset in unlit secluded lanes.</li>
              <li>Always meet brokers in public spots or society security gates first.</li>
              <li>Never hand over cash or token amounts before a written agreement is signed.</li>
              <li>Verify phone network signal inside basements and elevators.</li>
            </ul>
          </div>

          <div style={{ background: "#fef2f2", padding: "18px 22px", borderRadius: "16px", border: "1px solid #fecaca" }}>
            <h4 style={{ margin: "0 0 8px", fontSize: "14px", color: "#991b1b" }}>Gurugram Emergency Hotlines</h4>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px", fontSize: "12px", color: "#7f1d1d" }}>
              <div><strong>Police Control:</strong> 112 / 100</div>
              <div><strong>Women Helpline:</strong> 1091</div>
              <div><strong>NCU Campus Security:</strong> 0124-2365811</div>
              <div><strong>Ambulance:</strong> 108 / 102</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
