import { useState } from "react";
import { AGREEMENT_CLAUSES } from "../data/mockData";

const RISK_COLORS = {
  high: { bg: "#fff1f2", border: "#f43f5e", text: "#f43f5e", label: "High Risk" },
  medium: { bg: "#fffbeb", border: "#f59e0b", text: "#f59e0b", label: "Medium Risk" },
  low: { bg: "#ecfdf5", border: "#10b981", text: "#10b981", label: "Low Risk" },
};

const SAMPLE_TEXT = `RENTAL AGREEMENT

This Rental Agreement ("Agreement") is made and executed at Gurugram on September 30, 2026, between:

LANDLORD: Suresh Kumar Malhotra, residing at H-204, Green Palms Society, Sector 23, Gurugram.

TENANT: Nishant Rajora, pursuing studies at The NorthCap University, Gurugram.

1. PROPERTY: The landlord agrees to let and the tenant agrees to take on rent the residential premises at Flat 302, Green Palms Society, Sector 23, Gurugram.

2. TERM: The tenancy shall commence from October 1, 2026 and continue for a period of eleven (11) months.

3. RENT: The monthly rent is Rs. 9,500/- payable on or before the 5th of each month.

4. SECURITY DEPOSIT: The tenant shall pay Rs. 18,000/- as security deposit. The entire security deposit shall be forfeited without deduction if the tenant vacates before completing 11 months.

5. LOCK-IN PERIOD: The tenant shall not vacate the property for a minimum period of 11 months and shall be liable to pay full remaining rent upon early exit without landlord consent.

6. RENT ESCALATION: The landlord reserves the right to revise rent annually at their sole discretion without cap.

7. MAINTENANCE: The tenant shall bear all maintenance and repair costs regardless of cause or amount.

8. NOTICE PERIOD: Either party shall give 30 days notice in writing before termination of the agreement.

9. GUESTS: Overnight guests are permitted with prior intimation to landlord, not exceeding 3 consecutive nights per month.

10. SUB-LETTING: The tenant shall not sub-let the premises or any part thereof without prior written consent of the landlord.`;

export default function AgreementAnalyzer() {
  const [uploaded, setUploaded] = useState(false);
  const [selected, setSelected] = useState<typeof AGREEMENT_CLAUSES[0] | null>(AGREEMENT_CLAUSES[0]);

  const highCount = AGREEMENT_CLAUSES.filter(c => c.risk === "high").length;
  const medCount = AGREEMENT_CLAUSES.filter(c => c.risk === "medium").length;
  const lowCount = AGREEMENT_CLAUSES.filter(c => c.risk === "low").length;
  const riskScore = Math.round((highCount * 2 + medCount * 1) / AGREEMENT_CLAUSES.length * 50);

  if (!uploaded) {
    return (
      <div style={{ fontFamily: "'Inter', sans-serif" }}>
        <div className="mb-6">
          <h1 className="text-2xl font-bold mb-1" style={{ fontFamily: "'Space Grotesk', sans-serif", color: "#17222b", letterSpacing: "-0.5px" }}>
            Agreement NLP Analyzer
          </h1>
          <p className="text-sm" style={{ color: "#5f7572" }}>Upload your 11-month rental agreement — we'll flag risky clauses in seconds.</p>
        </div>

        <div className="rounded-2xl border p-12 text-center mb-6" style={{ background: "#fff", borderColor: "#e2ece9", borderStyle: "dashed" }}>
          <div className="text-5xl mb-4">📄</div>
          <h3 className="font-semibold text-lg mb-2" style={{ fontFamily: "'Space Grotesk', sans-serif", color: "#17222b" }}>
            Drop your agreement here
          </h3>
          <p className="text-sm mb-6" style={{ color: "#5f7572" }}>Supports PDF, DOCX, or plain text. Max 10MB.</p>
          <div className="flex gap-3 justify-center">
            <button
              onClick={() => setUploaded(true)}
              className="px-6 py-3 rounded-xl font-semibold text-white text-sm"
              style={{ background: "#117c74" }}
              onMouseEnter={e => (e.currentTarget.style.background = "#0d635c")}
              onMouseLeave={e => (e.currentTarget.style.background = "#117c74")}
            >
              Upload Agreement
            </button>
            <button
              onClick={() => setUploaded(true)}
              className="px-6 py-3 rounded-xl border font-medium text-sm"
              style={{ borderColor: "#e2ece9", color: "#5f7572" }}
            >
              Try Sample Agreement
            </button>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          {[
            { icon: "⚡", title: "Instant Analysis", desc: "AI scans the document and flags risky clauses in under 10 seconds" },
            { icon: "📚", title: "MTA 2021 Reference", desc: "Clauses checked against the Model Tenancy Act, 2021" },
            { icon: "✍️", title: "Suggested Rewrites", desc: "Every flagged clause gets a fairer suggested wording you can propose" },
          ].map((f, i) => (
            <div key={i} className="rounded-2xl border p-4" style={{ background: "#fff", borderColor: "#e2ece9" }}>
              <div className="text-2xl mb-3">{f.icon}</div>
              <div className="font-semibold text-sm mb-1" style={{ fontFamily: "'Space Grotesk', sans-serif", color: "#17222b" }}>{f.title}</div>
              <div className="text-xs leading-relaxed" style={{ color: "#5f7572" }}>{f.desc}</div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div style={{ fontFamily: "'Inter', sans-serif" }}>
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className="text-2xl font-bold mb-1" style={{ fontFamily: "'Space Grotesk', sans-serif", color: "#17222b", letterSpacing: "-0.5px" }}>
            Agreement Analysis
          </h1>
          <p className="text-sm" style={{ color: "#5f7572" }}>Rental_Agreement_Sector23.pdf · Analyzed {AGREEMENT_CLAUSES.length} clauses</p>
        </div>
        <button
          onClick={() => setUploaded(false)}
          className="px-4 py-2 rounded-xl border text-sm"
          style={{ borderColor: "#e2ece9", color: "#5f7572" }}
        >
          Upload New →
        </button>
      </div>

      {/* Overall risk meter */}
      <div className="rounded-2xl border p-5 mb-5" style={{ background: "#fff", borderColor: "#e2ece9" }}>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-semibold mb-1" style={{ fontFamily: "'Space Grotesk', sans-serif", color: "#17222b" }}>Overall Contract Risk</h3>
            <div className="flex items-center gap-4 text-xs">
              <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full" style={{ background: "#f43f5e" }} /> {highCount} High Risk</span>
              <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full" style={{ background: "#f59e0b" }} /> {medCount} Medium Risk</span>
              <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full" style={{ background: "#10b981" }} /> {lowCount} Low Risk</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right">
              <div className="text-3xl font-bold" style={{ fontFamily: "'Space Grotesk', sans-serif", color: "#f59e0b" }}>{riskScore}</div>
              <div className="text-xs" style={{ color: "#5f7572" }}>Risk Score</div>
            </div>
            <svg width="60" height="60" viewBox="0 0 60 60">
              <circle cx="30" cy="30" r="26" fill="none" stroke="#e2ece9" strokeWidth="5" />
              <circle cx="30" cy="30" r="26" fill="none" stroke="#f59e0b" strokeWidth="5"
                strokeDasharray={`${(riskScore / 100) * 163.4} 163.4`}
                strokeLinecap="round" transform="rotate(-90 30 30)" />
            </svg>
          </div>
        </div>
        <div className="h-2.5 rounded-full overflow-hidden" style={{ background: "#e2ece9" }}>
          <div className="flex h-full">
            <div style={{ width: `${(highCount / AGREEMENT_CLAUSES.length) * 100}%`, background: "#f43f5e" }} />
            <div style={{ width: `${(medCount / AGREEMENT_CLAUSES.length) * 100}%`, background: "#f59e0b" }} />
            <div style={{ width: `${(lowCount / AGREEMENT_CLAUSES.length) * 100}%`, background: "#10b981" }} />
          </div>
        </div>
      </div>

      {/* Split view */}
      <div className="grid gap-5" style={{ gridTemplateColumns: "1fr 1fr" }}>
        {/* Left: document with highlights */}
        <div className="rounded-2xl border overflow-hidden" style={{ borderColor: "#e2ece9" }}>
          <div className="px-4 py-3 border-b flex items-center justify-between" style={{ borderColor: "#e2ece9", background: "#f6f9f8" }}>
            <span className="text-xs font-semibold" style={{ color: "#17222b" }}>📄 Rental_Agreement_Sector23.pdf</span>
          </div>
          <div className="p-5 overflow-y-auto text-xs leading-relaxed" style={{ maxHeight: 560, fontFamily: "'Inter', sans-serif", color: "#17222b" }}>
            {SAMPLE_TEXT.split("\n\n").map((para, i) => {
              const matchedClause = AGREEMENT_CLAUSES.find(c => para.includes(c.excerpt.slice(0, 30)));
              if (matchedClause) {
                const colors = RISK_COLORS[matchedClause.risk as keyof typeof RISK_COLORS];
                return (
                  <div
                    key={i}
                    className="mb-3 p-2 rounded-lg border-l-2 cursor-pointer transition-all"
                    style={{
                      background: colors.bg,
                      borderLeftColor: colors.border,
                      outline: selected?.id === matchedClause.id ? `2px solid ${colors.border}` : "none",
                    }}
                    onClick={() => setSelected(matchedClause)}
                  >
                    {para}
                  </div>
                );
              }
              return <p key={i} className="mb-3">{para}</p>;
            })}
          </div>
        </div>

        {/* Right: flagged clauses */}
        <div className="space-y-4">
          {/* Selected clause detail */}
          {selected && (
            <div
              className="rounded-2xl border p-5"
              style={{
                background: RISK_COLORS[selected.risk as keyof typeof RISK_COLORS].bg,
                borderColor: RISK_COLORS[selected.risk as keyof typeof RISK_COLORS].border,
              }}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="font-semibold text-sm" style={{ fontFamily: "'Space Grotesk', sans-serif", color: "#17222b" }}>{selected.type}</span>
                <span
                  className="text-xs px-2.5 py-1 rounded-full font-semibold"
                  style={{
                    background: RISK_COLORS[selected.risk as keyof typeof RISK_COLORS].border,
                    color: "#fff",
                  }}
                >
                  {RISK_COLORS[selected.risk as keyof typeof RISK_COLORS].label}
                </span>
              </div>
              <div className="text-xs mb-3 italic p-3 rounded-lg" style={{ background: "rgba(0,0,0,0.05)", color: "#5f7572", fontFamily: "monospace" }}>
                "{selected.excerpt}"
              </div>
              <div className="text-xs mb-3 leading-relaxed" style={{ color: "#17222b" }}>
                <strong>Why it's risky:</strong> {selected.explanation}
              </div>
              <div className="p-3 rounded-xl text-xs leading-relaxed" style={{ background: "#ecfdf5", border: "1px solid #10b981" }}>
                <strong style={{ color: "#10b981" }}>✓ Suggested fair wording:</strong>
                <div className="mt-1" style={{ color: "#17222b" }}>{selected.suggestion}</div>
              </div>
            </div>
          )}

          {/* Clause list */}
          <div className="rounded-2xl border overflow-hidden" style={{ borderColor: "#e2ece9" }}>
            <div className="px-4 py-3 border-b" style={{ borderColor: "#e2ece9", background: "#f6f9f8" }}>
              <span className="text-xs font-semibold" style={{ color: "#17222b" }}>All Flagged Clauses ({AGREEMENT_CLAUSES.length})</span>
            </div>
            <div className="overflow-y-auto" style={{ maxHeight: 320 }}>
              {AGREEMENT_CLAUSES.map(clause => {
                const colors = RISK_COLORS[clause.risk as keyof typeof RISK_COLORS];
                return (
                  <div
                    key={clause.id}
                    className="flex items-start gap-3 px-4 py-3 border-b cursor-pointer transition-all hover:bg-gray-50"
                    style={{ borderColor: "#f0f0f0", background: selected?.id === clause.id ? colors.bg : "transparent" }}
                    onClick={() => setSelected(clause)}
                  >
                    <div className="w-2 h-2 rounded-full mt-1.5 flex-shrink-0" style={{ background: colors.border }} />
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-semibold mb-0.5" style={{ color: "#17222b" }}>{clause.type}</div>
                      <div className="text-xs truncate" style={{ color: "#5f7572" }}>{clause.explanation.slice(0, 60)}…</div>
                    </div>
                    <span className="text-xs px-2 py-0.5 rounded-full flex-shrink-0" style={{ background: colors.bg, color: colors.text, border: `1px solid ${colors.border}40` }}>
                      {colors.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
