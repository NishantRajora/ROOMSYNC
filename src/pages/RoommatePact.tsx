import { useState } from "react";

const FLATMATES = [
  { name: "Arjun Mehta (You)", college: "NCU Gurugram" },
  { name: "Priya Sharma", college: "NCU Gurugram" },
  { name: "Ananya Verma", college: "NCU Gurugram" },
];

const SHA = "7f4a9b2c1e6d8f3a0b5c9e2f7a4d1b8c3e6f9a2b5c8d1e4f7a0b3c6d9e2f5";

export default function RoommatePact() {
  const [step, setStep] = useState(0);
  const [anchored, setAnchored] = useState(false);
  const [data, setData] = useState({
    property: "Flat 302, Green Palms Society, Sector 23, Gurugram",
    quietStart: "22:00",
    quietEnd: "07:00",
    guestPolicy: "max 2 nights/week",
    chores: {
      kitchen: "Weekly rotation",
      bathroom: "Bi-weekly rotation",
      common: "Monthly rotation",
    },
    depositSplit: { arjun: 33, priya: 33, ananya: 34 },
  });

  const steps = ["Flatmates & Property", "Quiet Hours", "Chores Schedule", "Guests & Deposit"];
  const pct = ((step + 1) / 4) * 100;

  return (
    <div style={{ fontFamily: "'Inter', sans-serif" }}>
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-1" style={{ fontFamily: "'Space Grotesk', sans-serif", color: "#17222b", letterSpacing: "-0.5px" }}>
          Roommate Living Pact
        </h1>
        <p className="text-sm" style={{ color: "#5f7572" }}>
          Create a legally-anchored agreement for your flat — no disputes, no he-said-she-said.
        </p>
      </div>

      {/* Progress */}
      <div className="flex items-center gap-2 mb-8">
        {steps.map((s, i) => (
          <div key={i} className="flex items-center gap-2">
            <div
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer"
              style={{
                background: i <= step ? "#ecfdf5" : "#f6f9f8",
                color: i <= step ? "#117c74" : "#5f7572",
                border: `1px solid ${i <= step ? "#117c74" : "#e2ece9"}`,
              }}
              onClick={() => { if (i <= step) setStep(i); }}
            >
              {i < step ? "✓" : `0${i + 1}`} {s}
            </div>
            {i < 3 && <div className="h-px w-6" style={{ background: i < step ? "#117c74" : "#e2ece9" }} />}
          </div>
        ))}
      </div>

      {step < 4 ? (
        <div className="grid gap-6" style={{ gridTemplateColumns: "1fr 1fr" }}>
          {/* Form */}
          <div className="rounded-2xl border p-6" style={{ background: "#fff", borderColor: "#e2ece9" }}>
            {step === 0 && (
              <>
                <h3 className="font-bold mb-5" style={{ fontFamily: "'Space Grotesk', sans-serif", color: "#17222b" }}>Flatmates & Property</h3>
                <div className="mb-5">
                  <label className="block text-sm font-medium mb-2" style={{ color: "#17222b" }}>Flatmates</label>
                  {FLATMATES.map((f, i) => (
                    <div key={i} className="flex items-center gap-3 p-3 rounded-xl mb-2" style={{ background: "#f6f9f8", border: "1px solid #e2ece9" }}>
                      <div className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm" style={{ background: "#117c74" }}>
                        {f.name.charAt(0)}
                      </div>
                      <div>
                        <div className="text-sm font-medium" style={{ color: "#17222b" }}>{f.name}</div>
                        <div className="text-xs" style={{ color: "#5f7572" }}>{f.college}</div>
                      </div>
                      <span className="ml-auto text-xs px-2 py-0.5 rounded-full" style={{ background: "#fef9c3", color: "#854d0e" }}>🏅 Verified</span>
                    </div>
                  ))}
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: "#17222b" }}>Property Address</label>
                  <textarea
                    value={data.property}
                    onChange={e => setData({ ...data, property: e.target.value })}
                    rows={2}
                    className="w-full border rounded-xl px-4 py-3 text-sm outline-none resize-none"
                    style={{ borderColor: "#e2ece9", fontFamily: "'Inter', sans-serif" }}
                    onFocus={e => (e.target.style.borderColor = "#117c74")}
                    onBlur={e => (e.target.style.borderColor = "#e2ece9")}
                  />
                </div>
              </>
            )}

            {step === 1 && (
              <>
                <h3 className="font-bold mb-5" style={{ fontFamily: "'Space Grotesk', sans-serif", color: "#17222b" }}>Quiet Hours</h3>
                <p className="text-sm mb-5" style={{ color: "#5f7572" }}>Set the daily quiet period when noise should be kept to a minimum.</p>
                <div className="grid grid-cols-2 gap-4 mb-5">
                  {[["Quiet Begins", "quietStart"], ["Quiet Ends", "quietEnd"]].map(([label, key]) => (
                    <div key={key}>
                      <label className="block text-sm font-medium mb-1.5" style={{ color: "#17222b" }}>{label}</label>
                      <input
                        type="time"
                        value={data[key as "quietStart" | "quietEnd"]}
                        onChange={e => setData({ ...data, [key]: e.target.value })}
                        className="w-full border rounded-xl px-4 py-3 text-sm outline-none"
                        style={{ borderColor: "#e2ece9", fontFamily: "monospace" }}
                        onFocus={e => (e.target.style.borderColor = "#117c74")}
                        onBlur={e => (e.target.style.borderColor = "#e2ece9")}
                      />
                    </div>
                  ))}
                </div>
                <div className="p-4 rounded-xl" style={{ background: "#f6f9f8", border: "1px solid #e2ece9" }}>
                  <div className="text-xs font-semibold mb-1" style={{ color: "#117c74" }}>Agreement preview</div>
                  <div className="text-sm" style={{ color: "#17222b" }}>
                    "Quiet hours shall be observed daily from <strong>{data.quietStart}</strong> to <strong>{data.quietEnd}</strong>. During this period, all flatmates agree to keep noise at a minimum."
                  </div>
                </div>
              </>
            )}

            {step === 2 && (
              <>
                <h3 className="font-bold mb-5" style={{ fontFamily: "'Space Grotesk', sans-serif", color: "#17222b" }}>Chores Schedule</h3>
                {Object.entries(data.chores).map(([area, schedule]) => (
                  <div key={area} className="mb-4">
                    <label className="block text-sm font-medium mb-2 capitalize" style={{ color: "#17222b" }}>
                      {area === "kitchen" ? "🍳 Kitchen Cleaning" : area === "bathroom" ? "🚿 Bathroom Cleaning" : "🏠 Common Areas"}
                    </label>
                    <div className="flex gap-2 flex-wrap">
                      {["Weekly rotation", "Bi-weekly rotation", "Monthly rotation", "Fixed assignment"].map(opt => (
                        <button
                          key={opt}
                          onClick={() => setData({ ...data, chores: { ...data.chores, [area]: opt } })}
                          className="px-3 py-1.5 rounded-full text-xs border transition-all"
                          style={{
                            borderColor: schedule === opt ? "#117c74" : "#e2ece9",
                            background: schedule === opt ? "#ecfdf5" : "#f6f9f8",
                            color: schedule === opt ? "#117c74" : "#5f7572",
                          }}
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </>
            )}

            {step === 3 && (
              <>
                <h3 className="font-bold mb-5" style={{ fontFamily: "'Space Grotesk', sans-serif", color: "#17222b" }}>Guests & Deposit Split</h3>
                <div className="mb-5">
                  <label className="block text-sm font-medium mb-2" style={{ color: "#17222b" }}>Guest Policy</label>
                  <div className="flex gap-2 flex-wrap">
                    {["max 2 nights/week", "max 5 nights/month", "no overnight guests", "no restrictions"].map(opt => (
                      <button
                        key={opt}
                        onClick={() => setData({ ...data, guestPolicy: opt })}
                        className="px-3 py-1.5 rounded-full text-xs border transition-all"
                        style={{
                          borderColor: data.guestPolicy === opt ? "#117c74" : "#e2ece9",
                          background: data.guestPolicy === opt ? "#ecfdf5" : "#f6f9f8",
                          color: data.guestPolicy === opt ? "#117c74" : "#5f7572",
                        }}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-3" style={{ color: "#17222b" }}>Security Deposit Split</label>
                  {[["arjun", "Arjun (You)"], ["priya", "Priya"], ["ananya", "Ananya"]].map(([key, name]) => (
                    <div key={key} className="flex items-center gap-3 mb-3">
                      <span className="text-sm w-28 flex-shrink-0" style={{ color: "#17222b" }}>{name}</span>
                      <div className="flex-1 h-1.5 rounded-full" style={{ background: "#e2ece9" }}>
                        <div className="h-full rounded-full" style={{ width: `${data.depositSplit[key as keyof typeof data.depositSplit]}%`, background: "#117c74" }} />
                      </div>
                      <span className="font-semibold text-sm w-10 text-right" style={{ color: "#117c74" }}>
                        {data.depositSplit[key as keyof typeof data.depositSplit]}%
                      </span>
                    </div>
                  ))}
                </div>
              </>
            )}

            <div className="flex gap-3 mt-6">
              {step > 0 && (
                <button onClick={() => setStep(step - 1)} className="flex-1 py-3 rounded-xl border text-sm font-semibold" style={{ borderColor: "#e2ece9", color: "#17222b" }}>← Back</button>
              )}
              <button
                onClick={() => { if (step < 3) setStep(step + 1); else setStep(4); }}
                className="flex-1 py-3 rounded-xl text-white font-semibold text-sm"
                style={{ background: "#117c74" }}
                onMouseEnter={e => (e.currentTarget.style.background = "#0d635c")}
                onMouseLeave={e => (e.currentTarget.style.background = "#117c74")}
              >
                {step < 3 ? "Continue →" : "Generate Pact →"}
              </button>
            </div>
          </div>

          {/* Preview */}
          <div className="rounded-2xl border p-6" style={{ background: "#f6f9f8", borderColor: "#e2ece9" }}>
            <h4 className="text-xs font-semibold uppercase tracking-widest mb-4" style={{ color: "#5f7572" }}>Pact Preview</h4>
            <div className="text-sm leading-relaxed space-y-3" style={{ color: "#17222b" }}>
              <p><strong>ROOMMATE LIVING PACT</strong></p>
              <p>This agreement is entered into by the flatmates of:</p>
              <p className="italic">{data.property}</p>
              <p>Flatmates: {FLATMATES.map(f => f.name).join(", ")}</p>
              {step >= 1 && <p>Quiet Hours: {data.quietStart} – {data.quietEnd} daily.</p>}
              {step >= 2 && <p>Kitchen cleaning: {data.chores.kitchen}. Bathroom: {data.chores.bathroom}.</p>}
              {step >= 3 && <p>Guest policy: {data.guestPolicy}. Deposit split: Equal thirds.</p>}
            </div>
          </div>
        </div>
      ) : (
        /* Final step: signatures + anchor */
        <div>
          <div className="grid gap-5 mb-5" style={{ gridTemplateColumns: "1fr 1fr" }}>
            {/* Document */}
            <div className="rounded-2xl border p-6" style={{ background: "#fff", borderColor: "#e2ece9", boxShadow: "0 4px 20px rgba(0,0,0,0.05)" }}>
              <div className="text-xs font-semibold uppercase tracking-widest mb-6 text-center" style={{ color: "#5f7572" }}>ROOMMATE LIVING PACT — SEPTEMBER 2026</div>
              <div className="text-sm leading-relaxed space-y-3 mb-8" style={{ color: "#17222b" }}>
                <p>This Roommate Living Pact ("Agreement") is entered into by the following verified residents of <em>{data.property}</em>.</p>
                <p><strong>Quiet Hours:</strong> {data.quietStart}–{data.quietEnd} daily. Noise shall be kept to a minimum during this period.</p>
                <p><strong>Chores:</strong> Kitchen ({data.chores.kitchen}), Bathroom ({data.chores.bathroom}), Common areas ({data.chores.common}).</p>
                <p><strong>Guest Policy:</strong> Overnight guests permitted {data.guestPolicy} with prior flatmate consent.</p>
                <p><strong>Security Deposit:</strong> Split equally (33.3% each).</p>
                <p>Any disputes shall be resolved by mutual discussion before seeking external mediation.</p>
              </div>

              {/* Signatures */}
              <div className="border-t pt-5" style={{ borderColor: "#e2ece9" }}>
                <div className="text-xs font-semibold mb-4" style={{ color: "#5f7572" }}>Digital Signatures</div>
                <div className="grid grid-cols-3 gap-4">
                  {FLATMATES.map((f, i) => (
                    <div key={i} className="text-center">
                      <div className="text-lg mb-1" style={{ fontFamily: "'Dancing Script', 'Brush Script MT', cursive", color: "#117c74" }}>
                        {f.name.split(" ")[0]} {f.name.split(" ")[1]?.[0]}.
                      </div>
                      <div className="h-px mb-1" style={{ background: "#e2ece9" }} />
                      <div className="text-xs" style={{ color: "#5f7572" }}>{f.name.split("(")[0].trim()}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Anchor panel */}
            <div className="rounded-2xl border p-6" style={{ background: "#fff", borderColor: "#e2ece9" }}>
              <h3 className="font-bold mb-4" style={{ fontFamily: "'Space Grotesk', sans-serif", color: "#17222b" }}>Generate & Anchor</h3>
              <p className="text-sm mb-5" style={{ color: "#5f7572", lineHeight: 1.6 }}>
                Click below to compute a SHA-256 hash of this document and anchor it on the Ethereum Sepolia testnet. Once anchored, any alteration to the pact will produce a different hash — making silent edits detectable.
              </p>

              {!anchored ? (
                <button
                  onClick={() => setAnchored(true)}
                  className="w-full py-3.5 rounded-xl font-semibold text-white text-sm transition-all mb-4"
                  style={{ background: "#117c74", height: 48 }}
                  onMouseEnter={e => (e.currentTarget.style.background = "#0d635c")}
                  onMouseLeave={e => (e.currentTarget.style.background = "#117c74")}
                >
                  ⛓ Generate & Anchor Pact
                </button>
              ) : (
                <div>
                  <div className="rounded-xl p-4 mb-4" style={{ background: "#ecfdf5", border: "1px solid #10b981" }}>
                    <div className="text-xs font-semibold mb-2" style={{ color: "#10b981" }}>✓ Anchored on Ethereum Sepolia</div>
                    <div className="text-xs mb-1" style={{ color: "#5f7572" }}>Block #8,429,017 · Sep 30, 2026 14:32 UTC</div>
                  </div>

                  <div className="mb-4">
                    <div className="text-xs font-semibold mb-2" style={{ color: "#17222b" }}>SHA-256 Document Hash</div>
                    <div
                      className="rounded-xl p-3 text-xs break-all border"
                      style={{
                        fontFamily: "'JetBrains Mono', monospace",
                        background: "#17222b",
                        color: "#10b981",
                        borderColor: "#2d3748",
                        letterSpacing: "0.5px",
                      }}
                    >
                      {SHA}
                    </div>
                  </div>

                  <a
                    href="#"
                    className="flex items-center gap-2 text-sm font-medium"
                    style={{ color: "#117c74", textDecoration: "none" }}
                  >
                    <span>🔗</span> View on Etherscan →
                  </a>
                </div>
              )}

              <div className="mt-4 p-3 rounded-xl text-xs" style={{ background: "#f6f9f8", color: "#5f7572", lineHeight: 1.6 }}>
                The hash proves the document existed in this exact form at this timestamp. Any party can independently verify integrity by re-hashing the downloaded PDF.
              </div>
            </div>
          </div>

          <button
            onClick={() => { setStep(0); setAnchored(false); }}
            className="px-5 py-2.5 rounded-xl border text-sm"
            style={{ borderColor: "#e2ece9", color: "#5f7572" }}
          >
            ← Start New Pact
          </button>
        </div>
      )}
    </div>
  );
}
