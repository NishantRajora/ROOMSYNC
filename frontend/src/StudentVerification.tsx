import React, { useState } from "react";
import { GraduationCap, ShieldCheck, CheckCircle2, ArrowRight, Sparkles, X } from "lucide-react";

export interface StudentVerificationProps {
  api: string;
  currentUserEmail: string;
  isVerified: boolean;
  onVerified: (email: string, campus: string) => void;
  onNotify: (msg: string) => void;
  onClose?: () => void;
}

export const StudentVerification: React.FC<StudentVerificationProps> = ({
  api,
  currentUserEmail,
  isVerified,
  onVerified,
  onNotify,
  onClose,
}) => {
  const [step, setStep] = useState<"input" | "otp" | "success">(isVerified ? "success" : "input");
  const [email, setEmail] = useState(currentUserEmail.includes("@") ? currentUserEmail : "student@ncuindia.edu");
  const [otp, setOtp] = useState("");
  const [demoOtp, setDemoOtp] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [campus, setCampus] = useState("The NorthCap University (NCU)");

  const baseApi = api.replace(/\/api\/?$/, "") + "/api";

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setIsLoading(true);
    try {
      const res = await fetch(`${baseApi}/auth/student-otp/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() }),
      });

      const data = await res.json();
      if (res.ok) {
        setDemoOtp(data.demo_otp);
        setStep("otp");
        onNotify(`Verification code dispatched to ${email}`);
      } else {
        onNotify(data.error || "Please use a valid .edu or .ac.in email address.");
      }
    } catch {
      onNotify("Error sending verification code.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otp.trim()) return;

    setIsLoading(true);
    try {
      const res = await fetch(`${baseApi}/auth/student-verify/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), otp: otp.trim() }),
      });

      const data = await res.json();
      if (res.ok) {
        setCampus(data.campus);
        setStep("success");
        onVerified(email, data.campus);
        onNotify("🎉 Verified NCU Student badge unlocked!");
      } else {
        onNotify(data.error || "Invalid OTP code.");
      }
    } catch {
      onNotify("Error verifying code.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ background: "#fff", padding: "26px", borderRadius: "16px", border: "1px solid var(--line)" }}>
      {onClose && (
        <button
          onClick={onClose}
          style={{ float: "right", background: "none", border: "none", cursor: "pointer", color: "var(--muted)" }}
        >
          <X size={18} />
        </button>
      )}

      <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "16px" }}>
        <div
          style={{
            width: "38px",
            height: "38px",
            borderRadius: "10px",
            background: "#fef3c7",
            color: "#d97706",
            display: "grid",
            placeItems: "center",
          }}
        >
          <GraduationCap size={20} />
        </div>
        <div>
          <p className="eyebrow" style={{ margin: 0, color: "#b45309" }}>CAMPUS AUTHENTICITY</p>
          <h3 style={{ margin: "2px 0 0", fontSize: "17px" }}>University Email Verification</h3>
        </div>
      </div>

      {step === "input" && (
        <form onSubmit={handleSendOtp} style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          <p style={{ fontSize: "13px", color: "var(--muted)", margin: 0 }}>
            Verify your official <strong>@ncuindia.edu</strong> or <strong>.ac.in</strong> email to get a verified student trust badge and filter out commercial brokers.
          </p>
          <label style={{ fontSize: "12px", fontWeight: 600, color: "var(--ink)", display: "flex", flexDirection: "column", gap: "6px" }}>
            College Email Address
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. 21cs042@ncuindia.edu"
              required
              style={{ padding: "10px", borderRadius: "8px", border: "1px solid var(--line)", outline: "none" }}
            />
          </label>
          <button
            type="submit"
            className="primary"
            disabled={isLoading}
            style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "6px", marginTop: "4px" }}
          >
            {isLoading ? "Sending Code..." : "Send Verification Code"} <ArrowRight size={15} />
          </button>
        </form>
      )}

      {step === "otp" && (
        <form onSubmit={handleVerifyOtp} style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          <p style={{ fontSize: "13px", color: "var(--muted)", margin: 0 }}>
            Enter the 6-digit verification code sent to <strong>{email}</strong>:
          </p>

          {demoOtp && (
            <div style={{ background: "#fefce8", padding: "8px 12px", borderRadius: "8px", border: "1px solid #fde047", fontSize: "12px", color: "#854d0e" }}>
              💡 <em>Demo OTP:</em> <strong>{demoOtp}</strong> (or enter <strong>123456</strong>)
            </div>
          )}

          <label style={{ fontSize: "12px", fontWeight: 600, color: "var(--ink)", display: "flex", flexDirection: "column", gap: "6px" }}>
            6-Digit Verification Code
            <input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="123456"
              maxLength={6}
              autoFocus
              required
              style={{ padding: "10px", borderRadius: "8px", border: "1px solid var(--line)", textAlign: "center", letterSpacing: "4px", fontSize: "18px", fontWeight: 700 }}
            />
          </label>

          <div style={{ display: "flex", gap: "10px" }}>
            <button
              type="button"
              onClick={() => setStep("input")}
              style={{ flex: 1, padding: "10px", borderRadius: "8px", border: "1px solid var(--line)", background: "#fff", cursor: "pointer" }}
            >
              Change Email
            </button>
            <button
              type="submit"
              className="primary"
              disabled={isLoading}
              style={{ flex: 1 }}
            >
              {isLoading ? "Verifying..." : "Verify & Unlock Badge"}
            </button>
          </div>
        </form>
      )}

      {step === "success" && (
        <div style={{ textAlign: "center", padding: "14px 0" }}>
          <div
            style={{
              width: "54px",
              height: "54px",
              borderRadius: "50%",
              background: "#fef3c7",
              color: "#b45309",
              display: "grid",
              placeItems: "center",
              margin: "0 auto 12px",
            }}
          >
            <Sparkles size={28} />
          </div>
          <span
            style={{
              background: "#fef3c7",
              color: "#92400e",
              padding: "6px 14px",
              borderRadius: "20px",
              fontSize: "13px",
              fontWeight: 700,
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              border: "1px solid #fde68a",
            }}
          >
            <CheckCircle2 size={15} style={{ color: "#16a34a" }} /> Verified NCU Student
          </span>
          <p style={{ margin: "10px 0 2px", fontSize: "14px", fontWeight: 600 }}>{campus}</p>
          <small style={{ color: "var(--muted)", fontSize: "12px" }}>Verified via {email}</small>
        </div>
      )}
    </div>
  );
};
