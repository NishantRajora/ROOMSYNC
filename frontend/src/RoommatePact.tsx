import React, { useState } from "react";
import { registerHash, verifyHash } from "./blockchain";
import { FileCheck, Shield, CheckCircle2, Copy, Sparkles, ArrowRight, ArrowLeft } from "lucide-react";

export interface RoommatePactProps {
  api: string;
  currentUser: string;
  onNotify: (msg: string) => void;
}

export const RoommatePact: React.FC<RoommatePactProps> = ({ api, currentUser, onNotify }) => {
  const [step, setStep] = useState(1);
  const [title, setTitle] = useState("Flat 204 Cohabitation Agreement");
  const [flatmates, setFlatmates] = useState("Priya Sharma, Aarav Mehta");
  const [quietHours, setQuietHours] = useState("11:00 PM – 7:00 AM");
  const [cleaningCycle, setCleaningCycle] = useState("Weekly rotation (Sunday deep clean)");
  const [guestPolicy, setGuestPolicy] = useState("24-hour advance WhatsApp notice for overnight guests");
  const [depositPolicy, setDepositPolicy] = useState("Equal refund after landlord inspection with zero arbitrary deductions");

  const [generatedPact, setGeneratedPact] = useState<{
    id: number;
    title: string;
    agreement_text: string;
    sha256_hash: string;
    tx_hash?: string;
    status: string;
  } | null>(null);

  const [isAnchoring, setIsAnchoring] = useState(false);
  const [isSigned, setIsSigned] = useState(false);

  const baseApi = api.replace(/\/api\/?$/, "") + "/api";

  const handleGeneratePact = async () => {
    try {
      const res = await fetch(`${baseApi}/pacts/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          flatmates,
          rules: {
            quiet_hours: quietHours,
            cleaning_cycle: cleaningCycle,
            guest_policy: guestPolicy,
            deposit_policy: depositPolicy,
          },
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setGeneratedPact(data);
        setStep(5); // Move to review & sign step
        onNotify("Living pact generated with SHA-256 fingerprint!");
      }
    } catch {
      onNotify("Error generating roommate pact.");
    }
  };

  const handleAnchorOnChain = async () => {
    if (!generatedPact?.sha256_hash) return;
    setIsAnchoring(true);
    try {
      onNotify("Connecting to MetaMask wallet for contract anchoring...");
      const receipt = await registerHash(generatedPact.sha256_hash);
      if (receipt) {
        setGeneratedPact((prev) => (prev ? { ...prev, tx_hash: receipt.hash, status: "anchored" } : null));
        onNotify("🎉 Roommate pact successfully anchored on blockchain!");
      }
    } catch (err: any) {
      console.error(err);
      onNotify(`Blockchain anchoring notice: ${err.message || "Please ensure MetaMask is connected to Localhost/Polygon."}`);
    } finally {
      setIsAnchoring(false);
    }
  };

  return (
    <section className="roommate-pact-section" style={{ marginTop: "12px" }}>
      <div style={{ marginBottom: "20px" }}>
        <p className="eyebrow mint-text">PREVENT CONFLICTS BEFORE MOVE-IN</p>
        <h2 style={{ fontFamily: "Space Grotesk", margin: "4px 0 8px" }}>Digital Roommate Pact Wizard</h2>
        <p style={{ color: "var(--muted)", margin: 0 }}>
          Define ground rules on quiet hours, chores, guests, and deposit splits. Generate an on-chain tamper-proof agreement.
        </p>
      </div>

      {step <= 4 && (
        <div style={{ background: "#fff", padding: "28px", borderRadius: "16px", border: "1px solid var(--line)" }}>
          {/* Step Indicator */}
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "24px", position: "relative" }}>
            {["Flatmates & Place", "Quiet Hours", "Chores & Cleanliness", "Guests & Deposit"].map((label, idx) => {
              const num = idx + 1;
              const isActive = step === num;
              const isDone = step > num;
              return (
                <div key={label} style={{ textAlign: "center", flex: 1 }}>
                  <div
                    style={{
                      width: "32px",
                      height: "32px",
                      borderRadius: "50%",
                      background: isDone ? "#38a169" : isActive ? "var(--teal)" : "#edf2f7",
                      color: isDone || isActive ? "#fff" : "var(--muted)",
                      display: "grid",
                      placeItems: "center",
                      margin: "0 auto 6px",
                      fontWeight: 700,
                      fontSize: "13px",
                    }}
                  >
                    {isDone ? <CheckCircle2 size={16} /> : num}
                  </div>
                  <span style={{ fontSize: "12px", color: isActive ? "var(--ink)" : "var(--muted)", fontWeight: isActive ? 600 : 400 }}>
                    {label}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Wizard Steps */}
          {step === 1 && (
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <label>
                Agreement Title
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Sector 23 Flatmate Agreement"
                />
              </label>
              <label>
                Flatmate Names
                <input
                  type="text"
                  value={flatmates}
                  onChange={(e) => setFlatmates(e.target.value)}
                  placeholder="e.g. Priya Sharma, Aarav Mehta"
                />
              </label>
            </div>
          )}

          {step === 2 && (
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <label>
                Daily Quiet Hours
                <select
                  value={quietHours}
                  onChange={(e) => setQuietHours(e.target.value)}
                  style={{ border: "1px solid #d5dfdb", borderRadius: "6px", padding: "10px", outline: "none" }}
                >
                  <option value="11:00 PM – 7:00 AM">11:00 PM – 7:00 AM (Standard Student Hours)</option>
                  <option value="10:00 PM – 6:00 AM">10:00 PM – 6:00 AM (Early Risers / Exam Prep)</option>
                  <option value="12:00 AM – 8:00 AM">12:00 AM – 8:00 AM (Night Owl / Late Project Coders)</option>
                </select>
              </label>
              <div style={{ background: "#f8fbf7", padding: "12px 16px", borderRadius: "10px", fontSize: "13px", color: "var(--muted)" }}>
                💡 <em>Clause norm:</em> Headphone usage mandatory for speakers, gaming, and calls after quiet hours begin.
              </div>
            </div>
          )}

          {step === 3 && (
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <label>
                Cleaning & Kitchen Duty Schedule
                <select
                  value={cleaningCycle}
                  onChange={(e) => setCleaningCycle(e.target.value)}
                  style={{ border: "1px solid #d5dfdb", borderRadius: "6px", padding: "10px", outline: "none" }}
                >
                  <option value="Weekly rotation (Sunday deep clean)">Weekly rotation (Sunday deep clean)</option>
                  <option value="Alternate days rotation">Alternate days rotation</option>
                  <option value="Shared daily maid cost split equally">Shared daily maid cost split equally</option>
                </select>
              </label>
              <div style={{ background: "#f8fbf7", padding: "12px 16px", borderRadius: "10px", fontSize: "13px", color: "var(--muted)" }}>
                💡 <em>Rule norm:</em> Sinks must be cleared of dishes within 6 hours. Cooked meals shared by consent.
              </div>
            </div>
          )}

          {step === 4 && (
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <label>
                Overnight Guest Policy
                <input
                  type="text"
                  value={guestPolicy}
                  onChange={(e) => setGuestPolicy(e.target.value)}
                  placeholder="e.g. 24h notice via WhatsApp"
                />
              </label>
              <label>
                Security Deposit Move-Out Split Rule
                <input
                  type="text"
                  value={depositPolicy}
                  onChange={(e) => setDepositPolicy(e.target.value)}
                  placeholder="e.g. Equal refund after landlord inspection"
                />
              </label>
            </div>
          )}

          {/* Wizard Navigation */}
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: "24px" }}>
            <button
              onClick={() => setStep((s) => Math.max(1, s - 1))}
              disabled={step === 1}
              style={{
                padding: "8px 16px",
                borderRadius: "8px",
                border: "1px solid var(--line)",
                background: "#fff",
                cursor: step === 1 ? "not-allowed" : "pointer",
                opacity: step === 1 ? 0.5 : 1,
                display: "flex",
                alignItems: "center",
                gap: "4px",
              }}
            >
              <ArrowLeft size={14} /> Back
            </button>

            {step < 4 ? (
              <button
                className="primary"
                onClick={() => setStep((s) => s + 1)}
                style={{ display: "flex", alignItems: "center", gap: "4px" }}
              >
                Next <ArrowRight size={14} />
              </button>
            ) : (
              <button
                className="primary"
                onClick={handleGeneratePact}
                style={{ display: "flex", alignItems: "center", gap: "6px" }}
              >
                <Sparkles size={15} /> Finalize & Generate Agreement
              </button>
            )}
          </div>
        </div>
      )}

      {/* Generated Agreement View */}
      {step === 5 && generatedPact && (
        <div style={{ background: "#fff", padding: "28px", borderRadius: "16px", border: "1px solid var(--line)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px", flexWrap: "wrap", gap: "10px" }}>
            <div>
              <span className="agreement-risk-badge low" style={{ marginBottom: "6px", display: "inline-flex" }}>
                ✓ Harmonized Consensus
              </span>
              <h3 style={{ margin: "4px 0" }}>{generatedPact.title}</h3>
            </div>
            <button
              onClick={() => {
                navigator.clipboard.writeText(generatedPact.agreement_text);
                onNotify("Full agreement copied to clipboard!");
              }}
              style={{ display: "flex", alignItems: "center", gap: "6px", padding: "8px 14px", border: "1px solid var(--line)", borderRadius: "8px", background: "#fff", cursor: "pointer" }}
            >
              <Copy size={14} /> Copy Agreement
            </button>
          </div>

          <pre
            style={{
              background: "#fafbfa",
              padding: "20px",
              borderRadius: "12px",
              border: "1px solid var(--line)",
              whiteSpace: "pre-wrap",
              fontSize: "13px",
              lineHeight: 1.6,
              fontFamily: "inherit",
              maxHeight: "340px",
              overflowY: "auto",
            }}
          >
            {generatedPact.agreement_text}
          </pre>

          <div style={{ marginTop: "18px", padding: "14px", background: "#f0fdf4", borderRadius: "10px", border: "1px solid #bbf7d0" }}>
            <strong style={{ fontSize: "12px", color: "#166534" }}>Cryptographic SHA-256 Fingerprint:</strong>
            <code style={{ display: "block", fontSize: "12px", marginTop: "4px", wordBreak: "break-all", color: "#14532d" }}>
              {generatedPact.sha256_hash}
            </code>
          </div>

          <div style={{ display: "flex", gap: "12px", marginTop: "24px", flexWrap: "wrap", alignItems: "center" }}>
            <button
              className="primary"
              onClick={() => {
                setIsSigned(true);
                onNotify("Digitally signed by Priya Sharma!");
              }}
              disabled={isSigned}
              style={{ display: "flex", alignItems: "center", gap: "6px", background: isSigned ? "#276749" : undefined }}
            >
              <CheckCircle2 size={16} /> {isSigned ? "Digitally Signed ✓" : "Sign as Priya Sharma"}
            </button>

            <button
              onClick={handleAnchorOnChain}
              disabled={isAnchoring || generatedPact.status === "anchored"}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
                padding: "10px 18px",
                borderRadius: "10px",
                border: "1px solid var(--teal)",
                background: generatedPact.status === "anchored" ? "#e6f6f4" : "#fff",
                color: "var(--teal)",
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              <Shield size={16} /> {generatedPact.status === "anchored" ? "Anchored on Blockchain ✓" : isAnchoring ? "Anchoring..." : "Anchor on Ethereum / Polygon"}
            </button>

            <button
              onClick={() => setStep(1)}
              style={{ padding: "10px 16px", borderRadius: "8px", border: "1px solid var(--line)", background: "#fff", cursor: "pointer", color: "var(--muted)" }}
            >
              Create Another Pact
            </button>
          </div>
        </div>
      )}
    </section>
  );
};
