import { useState } from "react";
import { Link } from "react-router-dom";
import { LISTINGS } from "../data/mockData";

const AMENITY_ICONS: Record<string, string> = {
  WiFi: "📶", AC: "❄️", "Power Backup": "⚡", CCTV: "📹",
  Parking: "🚗", Gym: "💪", "Washing Machine": "🧺",
  Refrigerator: "🧊", "Swimming Pool": "🏊", Concierge: "🔑", "Club Access": "🎯",
};

function TrustBadge({ score }: { score: number }) {
  const color = score >= 70 ? "#10b981" : score >= 40 ? "#f59e0b" : "#f43f5e";
  const bg = score >= 70 ? "#ecfdf5" : score >= 40 ? "#fffbeb" : "#fff1f2";
  const label = score >= 70 ? "Trusted" : score >= 40 ? "Caution" : "Risk";
  return (
    <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold" style={{ background: bg, color, border: `1px solid ${color}30` }}>
      <div className="w-1.5 h-1.5 rounded-full" style={{ background: color }} />
      {score} · {label}
    </div>
  );
}

export default function ListingDiscovery() {
  const [priceMax, setPriceMax] = useState(20000);
  const [bhk, setBhk] = useState("all");
  const [minTrust, setMinTrust] = useState(0);
  const [locality, setLocality] = useState("all");

  const filtered = LISTINGS.filter(l => {
    if (l.price > priceMax) return false;
    if (bhk !== "all" && l.bhk !== bhk) return false;
    if (l.trustScore < minTrust) return false;
    if (locality !== "all" && !l.locality.includes(locality)) return false;
    return true;
  });

  return (
    <div style={{ fontFamily: "'Inter', sans-serif" }}>
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-1" style={{ fontFamily: "'Space Grotesk', sans-serif", color: "#17222b", letterSpacing: "-0.5px" }}>
          Find Listings
        </h1>
        <p className="text-sm" style={{ color: "#5f7572" }}>{filtered.length} listings in Gurugram · Trust-scored & verified</p>
      </div>

      <div className="flex gap-6">
        {/* Filter sidebar */}
        <aside className="flex-shrink-0" style={{ width: 240 }}>
          <div className="rounded-2xl p-5 border sticky top-0" style={{ background: "#fff", borderColor: "#e2ece9" }}>
            <h3 className="font-semibold text-sm mb-4" style={{ fontFamily: "'Space Grotesk', sans-serif", color: "#17222b" }}>Filters</h3>

            {/* Price */}
            <div className="mb-5">
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-medium" style={{ color: "#17222b" }}>Max Monthly Rent</label>
                <span className="text-xs font-semibold" style={{ color: "#117c74" }}>₹{priceMax.toLocaleString()}</span>
              </div>
              <input
                type="range" min={3000} max={25000} step={500}
                value={priceMax}
                onChange={e => setPriceMax(+e.target.value)}
                className="w-full"
                style={{ accentColor: "#117c74" }}
              />
              <div className="flex justify-between text-xs mt-1" style={{ color: "#5f7572" }}>
                <span>₹3k</span><span>₹25k</span>
              </div>
            </div>

            {/* BHK */}
            <div className="mb-5">
              <label className="text-xs font-medium block mb-2" style={{ color: "#17222b" }}>Property Type</label>
              <div className="grid grid-cols-2 gap-1.5">
                {["all", "1RK", "1BHK", "2BHK", "3BHK"].map(b => (
                  <button
                    key={b}
                    onClick={() => setBhk(b)}
                    className="py-1.5 rounded-lg text-xs font-medium border transition-all"
                    style={{
                      borderColor: bhk === b ? "#117c74" : "#e2ece9",
                      background: bhk === b ? "#ecfdf5" : "#f6f9f8",
                      color: bhk === b ? "#117c74" : "#5f7572",
                    }}
                  >
                    {b === "all" ? "All" : b}
                  </button>
                ))}
              </div>
            </div>

            {/* Locality */}
            <div className="mb-5">
              <label className="text-xs font-medium block mb-2" style={{ color: "#17222b" }}>Locality</label>
              <select
                value={locality}
                onChange={e => setLocality(e.target.value)}
                className="w-full border rounded-xl px-3 py-2 text-xs outline-none"
                style={{ borderColor: "#e2ece9", color: "#17222b", fontFamily: "'Inter', sans-serif" }}
              >
                <option value="all">All areas</option>
                <option value="Sector 23">Sector 23</option>
                <option value="DLF Phase 3">DLF Phase 3</option>
                <option value="Sushant Lok">Sushant Lok</option>
                <option value="Palam Vihar">Palam Vihar</option>
                <option value="Golf Course">Golf Course Road</option>
              </select>
            </div>

            {/* Min Trust Score */}
            <div className="mb-5">
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-medium" style={{ color: "#17222b" }}>Min Trust Score</label>
                <span className="text-xs font-semibold" style={{ color: "#117c74" }}>{minTrust}+</span>
              </div>
              <input
                type="range" min={0} max={90} step={10}
                value={minTrust}
                onChange={e => setMinTrust(+e.target.value)}
                className="w-full"
                style={{ accentColor: "#117c74" }}
              />
              <div className="flex items-center gap-2 mt-2">
                {[{ v: 0, c: "#e2ece9", l: "Any" }, { v: 40, c: "#f59e0b", l: "40+" }, { v: 70, c: "#10b981", l: "70+" }].map(({ v, c, l }) => (
                  <button
                    key={v}
                    onClick={() => setMinTrust(v)}
                    className="flex-1 py-1 rounded-lg text-xs border transition-all"
                    style={{
                      borderColor: minTrust === v ? c : "#e2ece9",
                      color: minTrust === v ? c : "#5f7572",
                      background: minTrust === v ? `${c}15` : "#f6f9f8",
                    }}
                  >
                    {l}
                  </button>
                ))}
              </div>
            </div>

            {/* Amenities */}
            <div>
              <label className="text-xs font-medium block mb-2" style={{ color: "#17222b" }}>Must Have</label>
              <div className="space-y-1.5">
                {["WiFi", "Power Backup", "AC", "CCTV", "Parking"].map(a => (
                  <label key={a} className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" className="accent-mint" style={{ accentColor: "#117c74" }} />
                    <span className="text-xs" style={{ color: "#17222b" }}>{AMENITY_ICONS[a]} {a}</span>
                  </label>
                ))}
              </div>
            </div>

            <button
              onClick={() => { setPriceMax(20000); setBhk("all"); setMinTrust(0); setLocality("all"); }}
              className="w-full mt-4 py-2 rounded-xl text-xs border transition-all"
              style={{ borderColor: "#e2ece9", color: "#5f7572", background: "#f6f9f8" }}
            >
              Reset Filters
            </button>
          </div>
        </aside>

        {/* Listing grid */}
        <div className="flex-1">
          {filtered.length === 0 ? (
            <div className="rounded-2xl border p-12 text-center" style={{ background: "#fff", borderColor: "#e2ece9" }}>
              <div className="text-4xl mb-4">🔍</div>
              <div className="font-semibold mb-2" style={{ fontFamily: "'Space Grotesk', sans-serif", color: "#17222b" }}>No listings match your filters</div>
              <div className="text-sm" style={{ color: "#5f7572" }}>Try widening your price range or trust score threshold</div>
            </div>
          ) : (
            <div className="grid gap-5" style={{ gridTemplateColumns: "repeat(2, 1fr)" }}>
              {filtered.map(listing => (
                <Link key={listing.id} to={`/listings/${listing.id}`} style={{ textDecoration: "none" }}>
                  <div
                    className="rounded-2xl border overflow-hidden transition-all hover:-translate-y-1 cursor-pointer"
                    style={{ background: "#fff", borderColor: "#e2ece9", boxShadow: "0 2px 10px rgba(0,0,0,0.03)" }}
                  >
                    <div className="relative" style={{ height: 180 }}>
                      <img src={listing.photo} alt={listing.title} className="w-full h-full object-cover" />
                      <div className="absolute top-3 left-3">
                        <TrustBadge score={listing.trustScore} />
                      </div>
                      {listing.verified && (
                        <div className="absolute top-3 right-3 px-2 py-1 rounded-full text-xs font-medium" style={{ background: "#fef9c3", color: "#854d0e" }}>
                          🏅 Verified Landlord
                        </div>
                      )}
                    </div>
                    <div className="p-4">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="font-semibold text-sm mb-0.5" style={{ fontFamily: "'Space Grotesk', sans-serif", color: "#17222b" }}>{listing.title}</h3>
                          <div className="text-xs" style={{ color: "#5f7572" }}>📍 {listing.locality}</div>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <div className="text-lg font-bold" style={{ fontFamily: "'Space Grotesk', sans-serif", color: "#17222b" }}>
                            ₹{listing.price.toLocaleString()}
                          </div>
                          <div className="text-xs" style={{ color: "#5f7572" }}>/month</div>
                        </div>
                      </div>
                      <div className="text-xs mb-3" style={{ color: "#5f7572" }}>
                        Deposit: ₹{listing.deposit.toLocaleString()} · {listing.bhk}
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {listing.amenities.slice(0, 4).map(a => (
                          <span key={a} className="text-xs px-2 py-0.5 rounded-full" style={{ background: "#f6f9f8", color: "#5f7572", border: "1px solid #e2ece9" }}>
                            {AMENITY_ICONS[a]} {a}
                          </span>
                        ))}
                        {listing.amenities.length > 4 && (
                          <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: "#f6f9f8", color: "#5f7572", border: "1px solid #e2ece9" }}>
                            +{listing.amenities.length - 4}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
