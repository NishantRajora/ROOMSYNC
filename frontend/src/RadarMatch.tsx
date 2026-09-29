import React, { useState } from "react";
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from "recharts";
import { Sparkles, CheckCircle2, AlertTriangle, ShieldCheck, HeartHandshake } from "lucide-react";

interface CandidateProfile {
  name: string;
  avatar: string;
  course: string;
  locality: string;
  overallScore: number;
  data: Array<{
    dimension: string;
    You: number;
    Candidate: number;
    fullMark: number;
  }>;
  strengths: string[];
  watchouts: string[];
}

const CANDIDATES: CandidateProfile[] = [
  {
    name: "Aarav Mehta",
    avatar: "AM",
    course: "B.Tech CSE (3rd Year, NCU)",
    locality: "Sector 23 (800m from campus)",
    overallScore: 92,
    data: [
      { dimension: "Sleep Cycle", You: 85, Candidate: 90, fullMark: 100 },
      { dimension: "Cleanliness", You: 80, Candidate: 85, fullMark: 100 },
      { dimension: "Social / Noise", You: 70, Candidate: 65, fullMark: 100 },
      { dimension: "Food Habits", You: 90, Candidate: 95, fullMark: 100 },
      { dimension: "Budget Flex", You: 85, Candidate: 80, fullMark: 100 },
    ],
    strengths: [
      "Both maintain night-owl schedule (focus after 10 PM)",
      "High cleanliness harmony (tidy desks and immediate dish cleaning)",
      "Shared vegetarian food preference and grocery split",
    ],
    watchouts: [
      "Slight divergence on weekend visitors: clarify study vs social weekends in advance.",
    ],
  },
  {
    name: "Tanya Kapoor",
    avatar: "TK",
    course: "BBA LLB (NCU Law School)",
    locality: "Sushant Lok (Near Metro)",
    overallScore: 84,
    data: [
      { dimension: "Sleep Cycle", You: 85, Candidate: 60, fullMark: 100 },
      { dimension: "Cleanliness", You: 80, Candidate: 95, fullMark: 100 },
      { dimension: "Social / Noise", You: 70, Candidate: 80, fullMark: 100 },
      { dimension: "Food Habits", You: 90, Candidate: 75, fullMark: 100 },
      { dimension: "Budget Flex", You: 85, Candidate: 90, fullMark: 100 },
    ],
    strengths: [
      "Strong budget alignment (both targeting ₹12k–₹16k bracket)",
      "Very responsible on utility bill settlements and lease paperwork",
    ],
    watchouts: [
      "Early bird vs Night owl: Tanya prefers mornings (up at 6:30 AM), so quiet zones are essential.",
    ],
  },
  {
    name: "Kabir Das",
    avatar: "KD",
    course: "B.Des (UI/UX Design, NCU)",
    locality: "DLF Phase 3 (Cyber City Hub)",
    overallScore: 78,
    data: [
      { dimension: "Sleep Cycle", You: 85, Candidate: 95, fullMark: 100 },
      { dimension: "Cleanliness", You: 80, Candidate: 60, fullMark: 100 },
      { dimension: "Social / Noise", You: 70, Candidate: 90, fullMark: 100 },
      { dimension: "Food Habits", You: 90, Candidate: 80, fullMark: 100 },
      { dimension: "Budget Flex", You: 85, Candidate: 70, fullMark: 100 },
    ],
    strengths: [
      "Similar creative night-owl project working hours",
      "Flexible on shared kitchen provisions and commute carpooling",
    ],
    watchouts: [
      "Different tolerance for common-room clutter: establish clear weekly cleaning pacts.",
    ],
  },
];

export interface RadarMatchProps {
  currentUser?: string;
  hideHeader?: boolean;
}

export const RadarMatch: React.FC<RadarMatchProps> = ({ currentUser, hideHeader = false }) => {
  const [selectedIdx, setSelectedIdx] = useState<number>(0);
  const current = CANDIDATES[selectedIdx];
  const userName = currentUser?.trim() ? currentUser.trim() : "You";

  return (
    <section className="radar-match-section" style={{ marginTop: hideHeader ? "0" : "12px" }}>
      {!hideHeader && (
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "16px", marginBottom: "20px" }}>
          <div>
            <p className="eyebrow mint-text">MULTI-DIMENSIONAL CO-LIVING ALIGNMENT</p>
            <h2 style={{ fontFamily: "Space Grotesk", margin: "4px 0 8px" }}>AI Compatibility Radar Chart</h2>
            <p style={{ color: "var(--muted)", margin: 0 }}>
              Visualizes 5 core personality & living dimensions to reveal synergy zones and potential friction points before signing.
            </p>
          </div>

          {/* Candidate Selector */}
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <span style={{ fontSize: "13px", color: "var(--muted)", fontWeight: 500 }}>Compare with:</span>
            <select
              value={selectedIdx}
              onChange={(e) => setSelectedIdx(Number(e.target.value))}
              style={{
                padding: "9px 14px",
                borderRadius: "10px",
                border: "1px solid var(--line)",
                background: "#fff",
                fontWeight: 600,
                color: "var(--ink)",
                outline: "none",
                cursor: "pointer",
              }}
            >
              {CANDIDATES.map((cand, idx) => (
                <option key={cand.name} value={idx}>
                  {cand.name} ({cand.overallScore}% Fit)
                </option>
              ))}
            </select>
          </div>
        </div>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))", gap: "24px" }}>
        {/* Radar Chart Display */}
        <div style={{ background: "#fff", padding: "24px", borderRadius: "16px", border: "1px solid var(--line)", minHeight: "380px", display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
            <div>
              <strong style={{ fontSize: "16px" }}>Compatibility Profile</strong>
              <small style={{ display: "block", color: "var(--muted)", fontSize: "12px" }}>
                You (Teal) vs. {current.name} (Coral)
              </small>
            </div>
            <div style={{ textAlign: "right" }}>
              <span style={{ fontSize: "22px", fontWeight: 700, fontFamily: "Space Grotesk", color: "var(--teal)" }}>
                {current.overallScore}%
              </span>
              <small style={{ display: "block", color: "var(--muted)", fontSize: "10px", textTransform: "uppercase" }}>
                Harmony Score
              </small>
            </div>
          </div>

          <div style={{ flex: 1, width: "100%", height: 320, minHeight: 320 }}>
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="80%" data={current.data}>
                <PolarGrid stroke="#e2e8f0" />
                <PolarAngleAxis dataKey="dimension" tick={{ fill: "#4a5568", fontSize: 12, fontWeight: 500 }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#cbd5e1" tick={false} />
                <Radar
                  name={`You (${userName})`}
                  dataKey="You"
                  stroke="#117c74"
                  fill="#117c74"
                  fillOpacity={0.4}
                />
                <Radar
                  name={current.name}
                  dataKey="Candidate"
                  stroke="#dd6b20"
                  fill="#dd6b20"
                  fillOpacity={0.35}
                />
                <Tooltip />
                <Legend />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Explainability & Harmony Analysis */}
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {/* Candidate Bio Header */}
          <div style={{ background: "#fff", padding: "20px 24px", borderRadius: "16px", border: "1px solid var(--line)", display: "flex", alignItems: "center", gap: "14px" }}>
            <div
              style={{
                width: "48px",
                height: "48px",
                borderRadius: "50%",
                background: "#dd6b20",
                color: "#fff",
                display: "grid",
                placeItems: "center",
                fontWeight: 700,
                fontSize: "16px",
                flexShrink: 0,
              }}
            >
              {current.avatar}
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: "17px" }}>{current.name}</h3>
              <span style={{ fontSize: "12px", color: "var(--muted)", display: "block" }}>{current.course}</span>
              <small style={{ fontSize: "11px", color: "var(--teal)", fontWeight: 600 }}>📍 {current.locality}</small>
            </div>
          </div>

          {/* Harmony Points */}
          <div style={{ background: "#f0fdf4", padding: "20px 24px", borderRadius: "16px", border: "1px solid #bbf7d0" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "10px", color: "#166534" }}>
              <HeartHandshake size={18} />
              <strong style={{ fontSize: "14px" }}>Why You Fit Together</strong>
            </div>
            <ul style={{ margin: 0, paddingLeft: "18px", display: "flex", flexDirection: "column", gap: "6px", fontSize: "13px", color: "#14532d" }}>
              {current.strengths.map((str, i) => (
                <li key={i}>{str}</li>
              ))}
            </ul>
          </div>

          {/* Watchout / Communication Points */}
          <div style={{ background: "#fffbeb", padding: "20px 24px", borderRadius: "16px", border: "1px solid #fde68a" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px", color: "#92400e" }}>
              <AlertTriangle size={18} />
              <strong style={{ fontSize: "14px" }}>Ground Rules to Discuss First</strong>
            </div>
            <ul style={{ margin: 0, paddingLeft: "18px", fontSize: "13px", color: "#78350f" }}>
              {current.watchouts.map((w, i) => (
                <li key={i}>{w}</li>
              ))}
            </ul>
          </div>

          {/* DPDP Privacy Badge */}
          <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "11px", color: "var(--muted)", padding: "0 4px" }}>
            <ShieldCheck size={14} style={{ color: "var(--teal)" }} />
            <span>Protected attributes (religion, caste, region) are strictly excluded from radar scoring.</span>
          </div>
        </div>
      </div>
    </section>
  );
};
