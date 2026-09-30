import { useState } from "react";
import { useNavigate } from "react-router-dom";

const CHIPS = {
  food: ["Vegetarian", "Eggetarian", "Non-Vegetarian", "Vegan", "Jain"],
  study: ["Morning person", "Night owl", "Library person", "Study at home", "Flexible"],
  sharing: ["Open to guests", "Private space preferred", "Pet-friendly", "No pets", "Non-smoker"],
  localities: ["Sector 23", "DLF Phase 3", "Sushant Lok", "Palam Vihar", "MG Road", "Golf Course Road"],
};

type Prefs = { food: string[]; study: string[]; sharing: string[]; localities: string[] };

export default function Onboarding() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [data, setData] = useState({
    personality: 65,
    sleep: 23,
    cleanliness: 72,
    social: 45,
    budgetMin: 7000,
    budgetMax: 12000,
    deposit: 15000,
    prefs: { food: [] as string[], study: [] as string[], sharing: [] as string[], localities: [] as string[] } as Prefs,
  });

  const toggleChip = (cat: keyof Prefs, val: string) => {
    const arr = data.prefs[cat];
    setData({
      ...data,
      prefs: {
        ...data.prefs,
        [cat]: arr.includes(val) ? arr.filter(x => x !== val) : [...arr, val],
      },
    });
  };

  const stepTitles = ["Student Profile", "Lifestyle", "Preferences", "Budget & Location"];
  const pct = ((step + 1) / 4) * 100;

  const illustrations = [
    "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400&h=300&fit=crop&auto=format",
    "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=400&h=300&fit=crop&auto=format",
    "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&h=300&fit=crop&auto=format",
    "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400&h=300&fit=crop&auto=format",
  ];

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "#f6f9f8", fontFamily: "'Inter', sans-serif" }}>
      {/* Progress bar */}
      <div className="h-1.5 w-full" style={{ background: "#e2ece9" }}>
        <div
          className="h-full transition-all duration-500"
          style={{ width: `${pct}%`, background: "#117c74" }}
        />
      </div>

      {/* Header */}
      <div className="flex items-center justify-between px-8 py-5 border-b" style={{ borderColor: "#e2ece9", background: "#fff" }}>
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: "#117c74" }}>
            <span className="text-white font-bold text-xs" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>R</span>
          </div>
          <span className="font-bold" style={{ fontFamily: "'Space Grotesk', sans-serif", color: "#117c74" }}>RoomSync</span>
        </div>
        <div className="flex items-center gap-2">
          {stepTitles.map((t, i) => (
            <div key={i} className="flex items-center gap-2">
              <div
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all"
                style={{
                  background: i <= step ? "#ecfdf5" : "#f6f9f8",
                  color: i <= step ? "#117c74" : "#5f7572",
                  border: `1px solid ${i <= step ? "#117c74" : "#e2ece9"}`,
                }}
              >
                {i < step ? "✓" : `0${i + 1}`} {t}
              </div>
              {i < 3 && <div className="w-6 h-px" style={{ background: "#e2ece9" }} />}
            </div>
          ))}
        </div>
        <button
          onClick={() => navigate("/dashboard")}
          className="text-sm"
          style={{ color: "#5f7572", background: "none", border: "none", cursor: "pointer" }}
        >
          Skip for now
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 grid" style={{ gridTemplateColumns: "1fr 1fr" }}>
        {/* Left illustration */}
        <div
          className="flex flex-col items-center justify-center p-12"
          style={{ background: "linear-gradient(160deg, #ecfdf5 0%, #f6f9f8 100%)" }}
        >
          <img
            src={illustrations[step]}
            alt="Onboarding illustration"
            className="rounded-2xl mb-8 object-cover"
            style={{ width: 360, height: 240, border: "1px solid #e2ece9" }}
          />
          <h3
            className="text-xl font-bold mb-2 text-center"
            style={{ fontFamily: "'Space Grotesk', sans-serif", color: "#17222b" }}
          >
            Step {step + 1}: {stepTitles[step]}
          </h3>
          <p className="text-sm text-center" style={{ color: "#5f7572", maxWidth: 280, lineHeight: 1.6 }}>
            {[
              "Help us understand your personality type to find truly compatible flatmates.",
              "Your daily routine preferences help us avoid lifestyle clashes.",
              "Specific requirements ensure only the best fits reach your feed.",
              "Set your budget range and preferred localities in Gurugram.",
            ][step]}
          </p>

          {step > 0 && (
            <div className="mt-6 p-4 rounded-xl w-full" style={{ background: "rgba(17,124,116,0.08)", maxWidth: 300 }}>
              <div className="text-xs font-semibold mb-2" style={{ color: "#117c74" }}>Your answers so far</div>
              {step >= 1 && <div className="text-xs mb-1" style={{ color: "#5f7572" }}>🌙 Sleeps around {data.sleep > 21 ? "11 PM–midnight" : "10 PM"}</div>}
              {step >= 1 && <div className="text-xs mb-1" style={{ color: "#5f7572" }}>🧹 Cleanliness: {data.cleanliness}%</div>}
              {step >= 2 && data.prefs.food[0] && <div className="text-xs mb-1" style={{ color: "#5f7572" }}>🥗 {data.prefs.food.join(", ")}</div>}
              {step >= 3 && <div className="text-xs" style={{ color: "#5f7572" }}>💰 ₹{data.budgetMin.toLocaleString()} – ₹{data.budgetMax.toLocaleString()}</div>}
            </div>
          )}
        </div>

        {/* Right form */}
        <div className="flex flex-col justify-center p-12 overflow-y-auto" style={{ background: "#fff" }}>
          <div style={{ maxWidth: 440 }}>
            {step === 0 && (
              <>
                <h2 className="text-2xl font-bold mb-6" style={{ fontFamily: "'Space Grotesk', sans-serif", color: "#17222b" }}>
                  Tell us about yourself
                </h2>
                <SliderField
                  label="Introvert ← → Extrovert"
                  hint="How social are you at home?"
                  value={data.personality}
                  min={0} max={100}
                  onChange={v => setData({ ...data, personality: v })}
                  leftLabel="Introvert" rightLabel="Extrovert"
                />
                <SliderField
                  label="Study Intensity"
                  hint="How seriously do you take your studies?"
                  value={72}
                  min={0} max={100}
                  onChange={() => {}}
                  leftLabel="Casual" rightLabel="Intense"
                />
                <SliderField
                  label="Night Owl ← → Early Bird"
                  hint="When do you naturally feel most active?"
                  value={60}
                  min={0} max={100}
                  onChange={() => {}}
                  leftLabel="Night Owl" rightLabel="Early Bird"
                />
              </>
            )}

            {step === 1 && (
              <>
                <h2 className="text-2xl font-bold mb-6" style={{ fontFamily: "'Space Grotesk', sans-serif", color: "#17222b" }}>
                  Your daily lifestyle
                </h2>
                <div className="mb-6">
                  <label className="block text-sm font-medium mb-3" style={{ color: "#17222b" }}>Usual Bedtime</label>
                  <div className="grid grid-cols-4 gap-2">
                    {["9 PM", "10 PM", "11 PM", "12 AM", "1 AM", "2 AM", "3 AM", "4 AM"].map(t => (
                      <button
                        key={t}
                        onClick={() => setData({ ...data, sleep: parseInt(t) || 24 })}
                        className="py-2 rounded-xl text-xs font-medium border transition-all"
                        style={{
                          borderColor: (t === "11 PM") ? "#117c74" : "#e2ece9",
                          background: (t === "11 PM") ? "#ecfdf5" : "#f6f9f8",
                          color: (t === "11 PM") ? "#117c74" : "#5f7572",
                        }}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>
                <SliderField
                  label="Cleanliness Level"
                  value={data.cleanliness}
                  min={0} max={100}
                  onChange={v => setData({ ...data, cleanliness: v })}
                  leftLabel="Relaxed" rightLabel="Spotless"
                />
                <SliderField
                  label="Social at Home"
                  value={data.social}
                  min={0} max={100}
                  onChange={v => setData({ ...data, social: v })}
                  leftLabel="Private" rightLabel="Open door"
                />
              </>
            )}

            {step === 2 && (
              <>
                <h2 className="text-2xl font-bold mb-6" style={{ fontFamily: "'Space Grotesk', sans-serif", color: "#17222b" }}>
                  Your preferences
                </h2>
                {(["food", "study", "sharing"] as const).map(cat => (
                  <div key={cat} className="mb-5">
                    <label className="block text-sm font-semibold mb-2 capitalize" style={{ color: "#17222b" }}>
                      {cat === "food" ? "🥗 Food" : cat === "study" ? "📚 Study Style" : "🏠 Living Style"}
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {CHIPS[cat].map(chip => {
                        const active = data.prefs[cat].includes(chip);
                        return (
                          <button
                            key={chip}
                            onClick={() => toggleChip(cat, chip)}
                            className="px-3 py-1.5 rounded-full text-xs font-medium border transition-all"
                            style={{
                              borderColor: active ? "#117c74" : "#e2ece9",
                              background: active ? "#ecfdf5" : "#f6f9f8",
                              color: active ? "#117c74" : "#5f7572",
                            }}
                          >
                            {chip}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </>
            )}

            {step === 3 && (
              <>
                <h2 className="text-2xl font-bold mb-6" style={{ fontFamily: "'Space Grotesk', sans-serif", color: "#17222b" }}>
                  Budget & Location
                </h2>
                <div className="mb-6">
                  <label className="text-sm font-medium block mb-1" style={{ color: "#17222b" }}>Monthly Rent Range</label>
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-sm font-semibold" style={{ color: "#117c74" }}>₹{data.budgetMin.toLocaleString()}</span>
                    <div className="flex-1 h-1.5 rounded-full relative" style={{ background: "#e2ece9" }}>
                      <div className="absolute h-full rounded-full" style={{ background: "#117c74", left: "15%", right: "35%" }} />
                    </div>
                    <span className="text-sm font-semibold" style={{ color: "#117c74" }}>₹{data.budgetMax.toLocaleString()}</span>
                  </div>
                  <input
                    type="range" min={3000} max={25000} step={500}
                    value={data.budgetMin}
                    onChange={e => setData({ ...data, budgetMin: +e.target.value })}
                    className="w-full accent-mint mb-2"
                    style={{ accentColor: "#117c74" }}
                  />
                  <input
                    type="range" min={3000} max={25000} step={500}
                    value={data.budgetMax}
                    onChange={e => setData({ ...data, budgetMax: +e.target.value })}
                    className="w-full"
                    style={{ accentColor: "#117c74" }}
                  />
                </div>

                <div className="mb-6">
                  <label className="text-sm font-medium block mb-1" style={{ color: "#17222b" }}>Max Deposit</label>
                  <input
                    type="number" value={data.deposit}
                    onChange={e => setData({ ...data, deposit: +e.target.value })}
                    className="w-full border rounded-xl px-4 py-3 text-sm outline-none"
                    style={{ borderColor: "#e2ece9", fontFamily: "'Inter', sans-serif" }}
                    onFocus={e => (e.target.style.borderColor = "#117c74")}
                    onBlur={e => (e.target.style.borderColor = "#e2ece9")}
                  />
                </div>

                <div>
                  <label className="text-sm font-medium block mb-2" style={{ color: "#17222b" }}>Preferred Localities</label>
                  <div className="flex flex-wrap gap-2">
                    {CHIPS.localities.map(loc => {
                      const active = data.prefs.localities.includes(loc);
                      return (
                        <button
                          key={loc}
                          onClick={() => toggleChip("localities", loc)}
                          className="px-3 py-1.5 rounded-full text-xs font-medium border transition-all"
                          style={{
                            borderColor: active ? "#117c74" : "#e2ece9",
                            background: active ? "#ecfdf5" : "#f6f9f8",
                            color: active ? "#117c74" : "#5f7572",
                          }}
                        >
                          📍 {loc}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </>
            )}

            {/* Navigation */}
            <div className="flex items-center gap-3 mt-8">
              {step > 0 && (
                <button
                  onClick={() => setStep(step - 1)}
                  className="flex-1 py-3 rounded-xl border font-semibold text-sm transition-all"
                  style={{ borderColor: "#e2ece9", color: "#17222b", background: "#fff" }}
                >
                  ← Back
                </button>
              )}
              <button
                onClick={() => {
                  if (step < 3) setStep(step + 1);
                  else navigate("/dashboard");
                }}
                className="flex-1 py-3 rounded-xl font-semibold text-white text-sm transition-all"
                style={{ background: "#117c74" }}
                onMouseEnter={e => (e.currentTarget.style.background = "#0d635c")}
                onMouseLeave={e => (e.currentTarget.style.background = "#117c74")}
              >
                {step < 3 ? "Continue →" : "Finish & Go to Dashboard →"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function SliderField({ label, hint, value, min, max, onChange, leftLabel, rightLabel }: {
  label: string; hint?: string; value: number; min: number; max: number;
  onChange: (v: number) => void; leftLabel?: string; rightLabel?: string;
}) {
  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-1">
        <label className="text-sm font-medium" style={{ color: "#17222b" }}>{label}</label>
        <span className="text-sm font-semibold" style={{ color: "#117c74" }}>{value}%</span>
      </div>
      {hint && <p className="text-xs mb-2" style={{ color: "#5f7572" }}>{hint}</p>}
      <input
        type="range" min={min} max={max} value={value}
        onChange={e => onChange(+e.target.value)}
        className="w-full"
        style={{ accentColor: "#117c74" }}
      />
      {(leftLabel || rightLabel) && (
        <div className="flex justify-between mt-1">
          <span className="text-xs" style={{ color: "#5f7572" }}>{leftLabel}</span>
          <span className="text-xs" style={{ color: "#5f7572" }}>{rightLabel}</span>
        </div>
      )}
    </div>
  );
}
