import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Verify() {
  const navigate = useNavigate();
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [timer, setTimer] = useState(59);
  const [verified, setVerified] = useState(false);
  const [error, setError] = useState(false);
  const refs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (timer > 0 && !verified) {
      const t = setTimeout(() => setTimer(timer - 1), 1000);
      return () => clearTimeout(t);
    }
  }, [timer, verified]);

  const handleDigit = (i: number, val: string) => {
    if (!/^\d?$/.test(val)) return;
    const next = [...otp];
    next[i] = val;
    setOtp(next);
    setError(false);
    if (val && i < 5) refs.current[i + 1]?.focus();
  };

  const handleKey = (i: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[i] && i > 0) refs.current[i - 1]?.focus();
  };

  const handleVerify = () => {
    const code = otp.join("");
    if (code === "123456" || code.length === 6) {
      setVerified(true);
      setTimeout(() => navigate("/onboarding"), 2500);
    } else {
      setError(true);
      setOtp(["", "", "", "", "", ""]);
      refs.current[0]?.focus();
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center"
      style={{ background: "#f6f9f8", fontFamily: "'Inter', sans-serif" }}
    >
      <div
        className="rounded-2xl border p-10 text-center"
        style={{ background: "#fff", borderColor: "#e2ece9", maxWidth: 460, width: "100%", boxShadow: "0 4px 24px rgba(0,0,0,0.06)" }}
      >
        {!verified ? (
          <>
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 text-3xl"
              style={{ background: "#ecfdf5" }}
            >
              📧
            </div>
            <h2
              className="text-2xl font-bold mb-2"
              style={{ fontFamily: "'Space Grotesk', sans-serif", color: "#17222b", letterSpacing: "-0.5px" }}
            >
              Verify your college email
            </h2>
            <p className="text-sm mb-2" style={{ color: "#5f7572" }}>
              We sent a 6-digit code to
            </p>
            <p className="font-semibold text-sm mb-8" style={{ color: "#117c74" }}>
              arjun.mehta@ncuindia.edu
            </p>

            {/* OTP inputs */}
            <div className="flex justify-center gap-3 mb-6">
              {otp.map((digit, i) => (
                <input
                  key={i}
                  ref={el => { refs.current[i] = el; }}
                  value={digit}
                  onChange={e => handleDigit(i, e.target.value)}
                  onKeyDown={e => handleKey(i, e)}
                  maxLength={1}
                  className="w-12 h-14 text-center text-xl font-bold rounded-xl border-2 outline-none transition-all"
                  style={{
                    borderColor: error ? "#f43f5e" : digit ? "#117c74" : "#e2ece9",
                    color: "#17222b",
                    fontFamily: "'Space Grotesk', sans-serif",
                    background: error ? "#fff5f5" : digit ? "#ecfdf5" : "#f6f9f8",
                  }}
                  inputMode="numeric"
                />
              ))}
            </div>

            {error && (
              <p className="text-sm mb-4" style={{ color: "#f43f5e" }}>
                ✕ Incorrect code — try again or resend
              </p>
            )}

            <button
              onClick={handleVerify}
              disabled={otp.join("").length < 6}
              className="w-full py-3.5 rounded-xl font-semibold text-white text-sm transition-all mb-4"
              style={{
                background: otp.join("").length === 6 ? "#117c74" : "#b0c9c5",
                height: 48,
                cursor: otp.join("").length === 6 ? "pointer" : "not-allowed",
              }}
            >
              Verify & Get Badge
            </button>

            <div className="text-sm" style={{ color: "#5f7572" }}>
              {timer > 0 ? (
                <>Resend code in <strong style={{ color: "#17222b" }}>0:{timer.toString().padStart(2, "0")}</strong></>
              ) : (
                <button
                  onClick={() => setTimer(59)}
                  style={{ color: "#117c74", fontWeight: 600, background: "none", border: "none", cursor: "pointer" }}
                >
                  Resend code
                </button>
              )}
            </div>

            <p className="text-xs mt-4" style={{ color: "#5f7572" }}>
              Tip: enter <code style={{ fontFamily: "monospace", background: "#f0f0f0", padding: "1px 4px", borderRadius: 4 }}>123456</code> to demo the verified state
            </p>
          </>
        ) : (
          /* Success state */
          <div className="py-4">
            <div
              className="w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 text-5xl"
              style={{
                background: "linear-gradient(135deg, #fef9c3, #fef08a)",
                border: "3px solid #eab308",
                animation: "pulse 0.6s ease-out",
              }}
            >
              🏅
            </div>
            <div
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full mb-6 font-semibold text-sm"
              style={{ background: "#fef9c3", color: "#854d0e", border: "1px solid #eab308" }}
            >
              <span>⭐</span> Verified Student Badge Unlocked!
            </div>
            <h2
              className="text-2xl font-bold mb-3"
              style={{ fontFamily: "'Space Grotesk', sans-serif", color: "#17222b" }}
            >
              You're verified!
            </h2>
            <p className="text-sm mb-6" style={{ color: "#5f7572" }}>
              Your <strong>@ncuindia.edu</strong> email is confirmed. Your gold Verified Student badge is now active on your profile, matches, and listings.
            </p>
            <div className="flex items-center justify-center gap-2 text-sm" style={{ color: "#5f7572" }}>
              <span
                className="w-4 h-4 rounded-full border-2 border-t-transparent animate-spin"
                style={{ borderColor: "#117c74", borderTopColor: "transparent" }}
              />
              Redirecting to onboarding...
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
