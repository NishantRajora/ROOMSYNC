import { useState } from "react";
import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer,
} from "recharts";
import { MATCHES } from "../data/mockData";

type Match = typeof MATCHES[0];

export default function MatchFeed() {
  const [selected, setSelected] = useState<Match | null>(null);

  return (
    <div style={{ fontFamily: "'Inter', sans-serif" }}>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold mb-1" style={{ fontFamily: "'Space Grotesk', sans-serif", color: "#17222b", letterSpacing: "-0.5px" }}>
            Your Matches
          </h1>
          <p className="text-sm" style={{ color: "#5f7572" }}>{MATCHES.length} students matched to your profile · Ranked by compatibility</p>
        </div>
        <div className="flex items-center gap-2">
          <select
            className="border rounded-xl px-3 py-2 text-sm outline-none"
            style={{ borderColor: "#e2ece9", color: "#17222b", fontFamily: "'Inter', sans-serif" }}
          >
            <option>Best match first</option>
            <option>Newest first</option>
            <option>Same college</option>
          </select>
        </div>
      </div>

      {/* Match grid */}
      <div className="grid gap-5" style={{ gridTemplateColumns: "repeat(3, 1fr)" }}>
        {MATCHES.map(match => (
          <MatchCard key={match.id} match={match} onOpen={setSelected} />
        ))}
      </div>

      {/* Radar modal */}
      {selected && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center"
          style={{ background: "rgba(0,0,0,0.45)", backdropFilter: "blur(4px)" }}
          onClick={() => setSelected(null)}
        >
          <div
            className="rounded-t-3xl overflow-hidden w-full"
            style={{ maxWidth: 760, background: "#fff", maxHeight: "90vh" }}
            onClick={e => e.stopPropagation()}
          >
            {/* Modal header */}
            <div
              className="flex items-center gap-4 px-6 py-5 border-b"
              style={{ borderColor: "#e2ece9" }}
            >
              <img src={selected.photo} alt={selected.name} className="w-12 h-12 rounded-full object-cover border-2" style={{ borderColor: "#117c74" }} />
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-lg" style={{ fontFamily: "'Space Grotesk', sans-serif", color: "#17222b" }}>{selected.name}</h3>
                  <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: "#fef9c3", color: "#854d0e" }}>🏅 Verified</span>
                </div>
                <div className="text-sm" style={{ color: "#5f7572" }}>{selected.year} · {selected.college}</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold" style={{ fontFamily: "'Space Grotesk', sans-serif", color: "#117c74" }}>{selected.score}%</div>
                <div className="text-xs" style={{ color: "#5f7572" }}>Compatible</div>
              </div>
              <button onClick={() => setSelected(null)} className="w-9 h-9 rounded-full flex items-center justify-center hover:bg-gray-100" style={{ color: "#5f7572" }}>✕</button>
            </div>

            <div className="overflow-y-auto" style={{ maxHeight: "calc(90vh - 90px)" }}>
              <div className="grid p-6 gap-6" style={{ gridTemplateColumns: "1fr 1fr" }}>
                {/* Radar chart */}
                <div>
                  <h4 className="font-semibold mb-4 text-sm" style={{ fontFamily: "'Space Grotesk', sans-serif", color: "#17222b" }}>
                    Compatibility Radar
                  </h4>
                  <div className="flex items-center gap-4 mb-3">
                    <div className="flex items-center gap-1.5 text-xs" style={{ color: "#117c74" }}>
                      <div className="w-3 h-3 rounded-full" style={{ background: "#117c74" }} /> You
                    </div>
                    <div className="flex items-center gap-1.5 text-xs" style={{ color: "#f43f5e" }}>
                      <div className="w-3 h-3 rounded-full" style={{ background: "#f43f5e" }} /> {selected.name.split(" ")[0]}
                    </div>
                  </div>
                  <div style={{ height: 260 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <RadarChart data={[
                        { axis: "Sleep", you: selected.radarData.you.sleep, them: selected.radarData.them.sleep },
                        { axis: "Cleanliness", you: selected.radarData.you.cleanliness, them: selected.radarData.them.cleanliness },
                        { axis: "Social", you: selected.radarData.you.social, them: selected.radarData.them.social },
                        { axis: "Food", you: selected.radarData.you.food, them: selected.radarData.them.food },
                        { axis: "Budget", you: selected.radarData.you.budget, them: selected.radarData.them.budget },
                      ]}>
                        <PolarGrid stroke="#e2ece9" />
                        <PolarAngleAxis dataKey="axis" tick={{ fontSize: 12, fill: "#5f7572", fontFamily: "Inter, sans-serif" }} />
                        <Radar name="You" dataKey="you" stroke="#117c74" fill="#117c74" fillOpacity={0.2} strokeWidth={2} />
                        <Radar name="Them" dataKey="them" stroke="#f43f5e" fill="#f43f5e" fillOpacity={0.15} strokeWidth={2} />
                      </RadarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Explanation */}
                <div>
                  <h4 className="font-semibold mb-4 text-sm" style={{ fontFamily: "'Space Grotesk', sans-serif", color: "#17222b" }}>
                    Why You Match
                  </h4>
                  <div className="space-y-2 mb-6">
                    {selected.matchReasons.map((r, i) => (
                      <div key={i} className="flex items-start gap-2 p-3 rounded-xl" style={{ background: "#ecfdf5" }}>
                        <span className="text-green-600 mt-0.5 flex-shrink-0">✓</span>
                        <span className="text-sm" style={{ color: "#17222b" }}>{r}</span>
                      </div>
                    ))}
                  </div>

                  {selected.differences.length > 0 && (
                    <>
                      <h4 className="font-semibold mb-3 text-sm" style={{ fontFamily: "'Space Grotesk', sans-serif", color: "#17222b" }}>
                        Worth Discussing
                      </h4>
                      <div className="space-y-2">
                        {selected.differences.map((d, i) => (
                          <div key={i} className="flex items-start gap-2 p-3 rounded-xl" style={{ background: "#fffbeb" }}>
                            <span className="mt-0.5 flex-shrink-0" style={{ color: "#f59e0b" }}>△</span>
                            <span className="text-sm" style={{ color: "#17222b" }}>{d}</span>
                          </div>
                        ))}
                      </div>
                    </>
                  )}

                  <div className="mt-4 p-3 rounded-xl" style={{ background: "#f6f9f8", border: "1px solid #e2ece9" }}>
                    <div className="text-xs font-semibold mb-1" style={{ color: "#5f7572" }}>Budget Range</div>
                    <div className="text-sm font-semibold" style={{ color: "#17222b" }}>{selected.budget}</div>
                    <div className="text-xs mt-0.5" style={{ color: "#5f7572" }}>Preferred: {selected.locality}</div>
                  </div>
                </div>
              </div>

              {/* Footer actions */}
              <div className="flex gap-3 px-6 pb-6">
                <button
                  className="flex-1 py-3 rounded-xl font-semibold text-white text-sm transition-all"
                  style={{ background: "#117c74" }}
                  onMouseEnter={e => (e.currentTarget.style.background = "#0d635c")}
                  onMouseLeave={e => (e.currentTarget.style.background = "#117c74")}
                >
                  💬 Connect with {selected.name.split(" ")[0]}
                </button>
                <button
                  className="px-6 py-3 rounded-xl border font-semibold text-sm transition-all"
                  style={{ borderColor: "#e2ece9", color: "#5f7572", background: "#fff" }}
                  onClick={() => setSelected(null)}
                >
                  Not now
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function MatchCard({ match, onOpen }: { match: Match; onOpen: (m: Match) => void }) {
  return (
    <div
      className="rounded-2xl border transition-all hover:-translate-y-1 cursor-pointer overflow-hidden"
      style={{ background: "#fff", borderColor: "#e2ece9", boxShadow: "0 2px 10px rgba(0,0,0,0.03)" }}
      onClick={() => onOpen(match)}
    >
      {/* Photo */}
      <div className="relative" style={{ height: 180 }}>
        <img src={match.photo} alt={match.name} className="w-full h-full object-cover" />
        <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium" style={{ background: "rgba(255,255,255,0.95)" }}>
          🏅 Verified Student
        </div>
        <div className="absolute top-3 right-3">
          <svg width="48" height="48" viewBox="0 0 48 48">
            <circle cx="24" cy="24" r="20" fill="rgba(255,255,255,0.95)" />
            <circle cx="24" cy="24" r="18" fill="none" stroke="#e2ece9" strokeWidth="3" />
            <circle
              cx="24" cy="24" r="18"
              fill="none" stroke="#117c74" strokeWidth="3"
              strokeDasharray={`${(match.score / 100) * 113.1} 113.1`}
              strokeLinecap="round"
              transform="rotate(-90 24 24)"
            />
            <text x="24" y="28.5" textAnchor="middle" fontSize="11" fontWeight="700" fill="#117c74" fontFamily="Space Grotesk, sans-serif">{match.score}%</text>
          </svg>
        </div>
      </div>

      {/* Info */}
      <div className="p-4">
        <div className="mb-3">
          <div className="font-semibold mb-0.5" style={{ fontFamily: "'Space Grotesk', sans-serif", color: "#17222b" }}>{match.name}</div>
          <div className="text-xs" style={{ color: "#5f7572" }}>{match.year}</div>
          <div className="text-xs font-medium mt-0.5" style={{ color: "#117c74" }}>{match.college}</div>
        </div>

        {/* Match reasons */}
        <div className="flex flex-wrap gap-1 mb-3">
          {match.matchReasons.map((r, i) => (
            <span key={i} className="text-xs px-2 py-0.5 rounded-full" style={{ background: "#ecfdf5", color: "#117c74" }}>
              ✓ {r.length > 22 ? r.slice(0, 22) + "…" : r}
            </span>
          ))}
        </div>

        {/* Differences */}
        {match.differences.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-4">
            {match.differences.slice(0, 1).map((d, i) => (
              <span key={i} className="text-xs px-2 py-0.5 rounded-full" style={{ background: "#fffbeb", color: "#92400e" }}>
                △ {d.length > 24 ? d.slice(0, 24) + "…" : d}
              </span>
            ))}
          </div>
        )}

        <div className="flex items-center gap-2 text-xs mb-4" style={{ color: "#5f7572" }}>
          <span>💰 {match.budget}</span>
          <span>·</span>
          <span>📍 {match.locality.split(",")[0]}</span>
        </div>

        <button
          className="w-full py-2.5 rounded-xl font-semibold text-white text-sm transition-all"
          style={{ background: "#117c74" }}
          onMouseEnter={e => (e.currentTarget.style.background = "#0d635c")}
          onMouseLeave={e => (e.currentTarget.style.background = "#117c74")}
          onClick={e => { e.stopPropagation(); onOpen(match); }}
        >
          View Compatibility →
        </button>
      </div>
    </div>
  );
}
