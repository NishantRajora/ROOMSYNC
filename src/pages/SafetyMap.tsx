import { useState } from "react";
import { AREA_RISK } from "../data/mockData";

type Layer = "Crime" | "Transit" | "Campus Distance";
type Area = keyof typeof AREA_RISK;

const LAYERS: Layer[] = ["Crime", "Transit", "Campus Distance"];

const AREA_COORDS: Record<Area, { top: string; left: string }> = {
  "Sector 23": { top: "35%", left: "30%" },
  "DLF Phase 3": { top: "50%", left: "55%" },
  "Sushant Lok": { top: "60%", left: "45%" },
  "Palam Vihar": { top: "70%", left: "25%" },
};

function getRiskColor(score: number) {
  if (score < 35) return "#10b981";
  if (score < 55) return "#f59e0b";
  return "#f43f5e";
}

function getRiskLabel(score: number) {
  if (score < 35) return "Low Risk";
  if (score < 55) return "Moderate Risk";
  return "High Risk";
}

export default function SafetyMap() {
  const [activeLayer, setActiveLayer] = useState<Layer>("Crime");
  const [hoveredArea, setHoveredArea] = useState<Area | null>("Sector 23");

  const areaData = hoveredArea ? AREA_RISK[hoveredArea] : null;

  return (
    <div style={{ fontFamily: "'Inter', sans-serif" }}>
      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className="text-2xl font-bold mb-1" style={{ fontFamily: "'Space Grotesk', sans-serif", color: "#17222b", letterSpacing: "-0.5px" }}>
            Safety Map
          </h1>
          <p className="text-sm" style={{ color: "#5f7572" }}>Gurugram area risk analysis · Click any area for breakdown</p>
        </div>
        {/* Layer toggles */}
        <div className="flex items-center gap-2">
          {LAYERS.map(layer => (
            <button
              key={layer}
              onClick={() => setActiveLayer(layer)}
              className="px-4 py-2 rounded-full text-sm font-medium border transition-all"
              style={{
                borderColor: activeLayer === layer ? "#117c74" : "#e2ece9",
                background: activeLayer === layer ? "#ecfdf5" : "#fff",
                color: activeLayer === layer ? "#117c74" : "#5f7572",
              }}
            >
              {layer === "Crime" ? "🚨" : layer === "Transit" ? "🚌" : "🎓"} {layer}
            </button>
          ))}
        </div>
      </div>

      <div className="flex gap-5" style={{ height: 620 }}>
        {/* Map panel */}
        <div
          className="flex-1 rounded-2xl border relative overflow-hidden"
          style={{ borderColor: "#e2ece9", background: "#e8f4f0" }}
        >
          {/* Fake map background */}
          <img
            src="https://images.unsplash.com/photo-1524661135-423995f22d0b?w=1000&h=700&fit=crop&auto=format"
            alt="Gurugram map"
            className="w-full h-full object-cover opacity-30"
          />

          {/* Grid overlay */}
          <div className="absolute inset-0" style={{
            backgroundImage: `
              linear-gradient(rgba(17,124,116,0.08) 1px, transparent 1px),
              linear-gradient(90deg, rgba(17,124,116,0.08) 1px, transparent 1px)
            `,
            backgroundSize: "40px 40px",
          }} />

          {/* Heatmap blobs */}
          {(Object.entries(AREA_RISK) as [Area, typeof AREA_RISK[Area]][]).map(([area, data]) => {
            const risk = activeLayer === "Crime" ? data.crime : activeLayer === "Transit" ? 100 - data.transit : data.campusDist * 10;
            const normalized = Math.min(100, risk);
            const color = getRiskColor(normalized);
            return (
              <div
                key={area}
                className="absolute cursor-pointer transition-all"
                style={{
                  top: AREA_COORDS[area].top,
                  left: AREA_COORDS[area].left,
                  transform: "translate(-50%, -50%)",
                  width: 120, height: 80,
                  borderRadius: "50%",
                  background: `radial-gradient(ellipse at center, ${color}55, ${color}22, transparent)`,
                  border: `2px solid ${color}88`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
                onClick={() => setHoveredArea(area)}
                onMouseEnter={() => setHoveredArea(area)}
              >
                <div
                  className="rounded-lg px-2 py-1 text-xs font-semibold text-white shadow-md text-center"
                  style={{ background: color, fontSize: 11 }}
                >
                  {area.split(",")[0]}
                </div>
              </div>
            );
          })}

          {/* Legend */}
          <div className="absolute bottom-4 left-4 rounded-xl p-3" style={{ background: "rgba(255,255,255,0.95)", border: "1px solid #e2ece9" }}>
            <div className="text-xs font-semibold mb-2" style={{ color: "#17222b" }}>Risk Level</div>
            {[["Low", "#10b981"], ["Moderate", "#f59e0b"], ["High", "#f43f5e"]].map(([l, c]) => (
              <div key={l} className="flex items-center gap-2 mb-1">
                <div className="w-3 h-3 rounded-full" style={{ background: c as string }} />
                <span className="text-xs" style={{ color: "#5f7572" }}>{l}</span>
              </div>
            ))}
          </div>

          {/* Active layer indicator */}
          <div className="absolute top-4 left-4 px-3 py-1.5 rounded-full text-xs font-medium" style={{ background: "#117c74", color: "#fff" }}>
            Showing: {activeLayer}
          </div>
        </div>

        {/* Right panel */}
        <div className="flex-shrink-0" style={{ width: 300 }}>
          {areaData ? (
            <div className="rounded-2xl border p-5 h-full overflow-y-auto" style={{ background: "#fff", borderColor: "#e2ece9" }}>
              <h3 className="font-bold mb-1" style={{ fontFamily: "'Space Grotesk', sans-serif", color: "#17222b" }}>
                {hoveredArea}
              </h3>
              <p className="text-xs mb-5" style={{ color: "#5f7572" }}>Area risk breakdown</p>

              {/* Overall risk */}
              <div className="rounded-xl p-4 mb-5" style={{ background: `${getRiskColor(areaData.overall)}15`, border: `1px solid ${getRiskColor(areaData.overall)}30` }}>
                <div className="text-xs font-semibold mb-1" style={{ color: getRiskColor(areaData.overall) }}>
                  Overall Risk Score
                </div>
                <div className="text-3xl font-bold mb-0.5" style={{ fontFamily: "'Space Grotesk', sans-serif", color: getRiskColor(areaData.overall) }}>
                  {areaData.overall}
                </div>
                <div className="text-xs" style={{ color: getRiskColor(areaData.overall) }}>
                  {getRiskLabel(areaData.overall)}
                </div>
              </div>

              {/* Breakdown metrics */}
              <div className="space-y-4 mb-5">
                <Metric label="🚨 Crime Index" value={areaData.crime} invert />
                <Metric label="🚌 Transit Score" value={areaData.transit} />
                <Metric label="🎓 Campus Distance" value={`${areaData.campusDist} km`} raw />
              </div>

              <div className="p-3 rounded-xl text-xs leading-relaxed" style={{ background: "#f6f9f8", color: "#5f7572" }}>
                {areaData.breakdown}
              </div>

              <div className="mt-4 grid grid-cols-3 gap-2">
                {(Object.keys(AREA_RISK) as Area[]).map(a => (
                  <button
                    key={a}
                    onClick={() => setHoveredArea(a)}
                    className="py-2 rounded-xl text-xs border transition-all"
                    style={{
                      borderColor: hoveredArea === a ? "#117c74" : "#e2ece9",
                      background: hoveredArea === a ? "#ecfdf5" : "#f6f9f8",
                      color: hoveredArea === a ? "#117c74" : "#5f7572",
                      fontWeight: hoveredArea === a ? 600 : 400,
                    }}
                  >
                    {a.split(",")[0]}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="rounded-2xl border p-5 flex items-center justify-center h-full" style={{ background: "#fff", borderColor: "#e2ece9" }}>
              <div className="text-center">
                <div className="text-3xl mb-3">🗺</div>
                <div className="text-sm" style={{ color: "#5f7572" }}>Click an area on the map to see its safety breakdown</div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function Metric({ label, value, invert, raw }: { label: string; value: number | string; invert?: boolean; raw?: boolean }) {
  const numVal = typeof value === "number" ? value : null;
  const displayVal = typeof value === "string" ? value : value + "%";
  const color = raw ? "#117c74" : numVal !== null
    ? (invert ? (numVal < 35 ? "#10b981" : numVal < 60 ? "#f59e0b" : "#f43f5e") : (numVal > 65 ? "#10b981" : numVal > 40 ? "#f59e0b" : "#f43f5e"))
    : "#117c74";

  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-xs font-medium" style={{ color: "#17222b" }}>{label}</span>
        <span className="text-xs font-bold" style={{ color }}>{displayVal}</span>
      </div>
      {numVal !== null && (
        <div className="h-1.5 rounded-full" style={{ background: "#e2ece9" }}>
          <div
            className="h-full rounded-full transition-all"
            style={{ width: `${numVal}%`, background: color }}
          />
        </div>
      )}
    </div>
  );
}
