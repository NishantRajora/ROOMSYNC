import { useState } from "react";
import { REVIEWS } from "../data/mockData";

type Review = typeof REVIEWS[0];

export default function Reviews() {
  const [filter, setFilter] = useState("all");
  const [sortBy, setSortBy] = useState("rating");
  const [selected, setSelected] = useState<Review | null>(null);

  const filtered = REVIEWS.filter(r => {
    if (filter === "verified") return r.depositReturned;
    if (filter === "flagged") return !r.depositReturned;
    if (filter === "sector23") return r.locality.includes("Sector 23");
    if (filter === "dlf") return r.locality.includes("DLF");
    return true;
  }).sort((a, b) => {
    if (sortBy === "rating") return b.overall - a.overall;
    if (sortBy === "worst") return a.overall - b.overall;
    return 0;
  });

  return (
    <div style={{ fontFamily: "'Inter', sans-serif" }}>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold mb-1" style={{ fontFamily: "'Space Grotesk', sans-serif", color: "#17222b", letterSpacing: "-0.5px" }}>
            Landlord Reviews
          </h1>
          <p className="text-sm" style={{ color: "#5f7572" }}>{REVIEWS.length} verified reviews from students across Gurugram</p>
        </div>
        <button
          className="px-4 py-2.5 rounded-xl font-semibold text-white text-sm"
          style={{ background: "#117c74" }}
        >
          + Write a Review
        </button>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 mb-6 overflow-x-auto pb-1">
        {[
          { key: "all", label: "All Areas" },
          { key: "sector23", label: "Sector 23" },
          { key: "dlf", label: "DLF Phase 3" },
          { key: "verified", label: "✓ Deposit Returned" },
          { key: "flagged", label: "✕ Deposit Issues" },
        ].map(f => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            className="px-4 py-2 rounded-full text-sm font-medium border whitespace-nowrap transition-all"
            style={{
              borderColor: filter === f.key ? "#117c74" : "#e2ece9",
              background: filter === f.key ? "#ecfdf5" : "#fff",
              color: filter === f.key ? "#117c74" : "#5f7572",
            }}
          >
            {f.label}
          </button>
        ))}
        <select
          value={sortBy}
          onChange={e => setSortBy(e.target.value)}
          className="ml-auto border rounded-xl px-3 py-2 text-sm outline-none"
          style={{ borderColor: "#e2ece9", color: "#17222b", fontFamily: "'Inter', sans-serif" }}
        >
          <option value="rating">Highest rated first</option>
          <option value="worst">Lowest rated first</option>
        </select>
      </div>

      {/* Review cards */}
      <div className="grid gap-4" style={{ gridTemplateColumns: "repeat(2, 1fr)" }}>
        {filtered.map(review => (
          <ReviewCard key={review.id} review={review} onSelect={setSelected} />
        ))}
      </div>

      {/* Detail modal */}
      {selected && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center"
          style={{ background: "rgba(0,0,0,0.45)", backdropFilter: "blur(4px)" }}
          onClick={() => setSelected(null)}
        >
          <div
            className="rounded-2xl p-6 w-full"
            style={{ maxWidth: 520, background: "#fff", boxShadow: "0 20px 60px rgba(0,0,0,0.15)" }}
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-5">
              <div>
                <h3 className="font-bold" style={{ fontFamily: "'Space Grotesk', sans-serif", color: "#17222b" }}>{selected.landlord}</h3>
                <div className="text-sm" style={{ color: "#5f7572" }}>📍 {selected.locality}</div>
              </div>
              <button onClick={() => setSelected(null)} style={{ background: "none", border: "none", cursor: "pointer", color: "#5f7572" }}>✕</button>
            </div>

            <div className="grid grid-cols-3 gap-3 mb-5">
              {[
                { label: "Overall", val: selected.overall },
                { label: "Maintenance", val: selected.maintenance },
                { label: "Power & Water", val: selected.powerWater },
              ].map(m => (
                <div key={m.label} className="text-center rounded-xl p-3" style={{ background: "#f6f9f8" }}>
                  <div className="text-2xl font-bold mb-0.5" style={{ fontFamily: "'Space Grotesk', sans-serif", color: "#117c74" }}>{m.val}</div>
                  <div className="text-xs" style={{ color: "#5f7572" }}>{m.label}</div>
                </div>
              ))}
            </div>

            <div
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-semibold mb-4"
              style={{
                background: selected.depositReturned ? "#ecfdf5" : "#fff1f2",
                color: selected.depositReturned ? "#10b981" : "#f43f5e",
              }}
            >
              {selected.depositReturned ? "✓ Deposit Returned in Full" : "✕ Deposit Was Not Returned"}
            </div>

            <p className="text-sm leading-relaxed mb-4" style={{ color: "#17222b" }}>{selected.comment}</p>
            <div className="text-xs" style={{ color: "#5f7572" }}>
              — {selected.reviewer}, {selected.college} · {selected.date}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function ReviewCard({ review, onSelect }: { review: Review; onSelect: (r: Review) => void }) {
  const stars = (val: number) => Array.from({ length: 5 }).map((_, i) => (
    <span key={i} style={{ color: i < Math.round(val) ? "#eab308" : "#e2ece9", fontSize: 14 }}>★</span>
  ));

  return (
    <div
      className="rounded-2xl border p-5 cursor-pointer transition-all hover:-translate-y-0.5"
      style={{ background: "#fff", borderColor: "#e2ece9", boxShadow: "0 2px 10px rgba(0,0,0,0.03)" }}
      onClick={() => onSelect(review)}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <div className="font-semibold mb-0.5" style={{ fontFamily: "'Space Grotesk', sans-serif", color: "#17222b" }}>{review.landlord}</div>
          <div className="text-xs" style={{ color: "#5f7572" }}>📍 {review.locality}</div>
        </div>
        <div
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold flex-shrink-0"
          style={{
            background: review.depositReturned ? "#ecfdf5" : "#fff1f2",
            color: review.depositReturned ? "#10b981" : "#f43f5e",
          }}
        >
          {review.depositReturned ? "✓" : "✕"} Deposit {review.depositReturned ? "Returned" : "Not Returned"}
        </div>
      </div>

      {/* Ratings */}
      <div className="grid grid-cols-3 gap-3 mb-4">
        {[
          { label: "Overall", val: review.overall },
          { label: "Maintenance", val: review.maintenance },
          { label: "Power & Water", val: review.powerWater },
        ].map(m => (
          <div key={m.label}>
            <div className="text-xs mb-1" style={{ color: "#5f7572" }}>{m.label}</div>
            <div className="flex">{stars(m.val)}</div>
            <div className="text-xs font-semibold mt-0.5" style={{ color: "#17222b" }}>{m.val.toFixed(1)}</div>
          </div>
        ))}
      </div>

      <p className="text-sm leading-relaxed mb-3 line-clamp-3" style={{ color: "#5f7572" }}>{review.comment}</p>

      <div className="flex items-center justify-between text-xs" style={{ color: "#5f7572" }}>
        <span>— {review.reviewer}, {review.college}</span>
        <span>{review.date}</span>
      </div>
    </div>
  );
}
