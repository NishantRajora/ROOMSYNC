import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { LISTINGS, REVIEWS } from "../data/mockData";

const AMENITY_ICONS: Record<string, string> = {
  WiFi: "📶", AC: "❄️", "Power Backup": "⚡", CCTV: "📹",
  Parking: "🚗", Gym: "💪", "Washing Machine": "🧺",
  Refrigerator: "🧊", "Swimming Pool": "🏊", Concierge: "🔑", "Club Access": "🎯",
};

function StatusIcon({ status }: { status: string }) {
  if (status === "pass") return <span style={{ color: "#10b981", fontSize: 16 }}>✓</span>;
  if (status === "warn") return <span style={{ color: "#f59e0b", fontSize: 16 }}>△</span>;
  return <span style={{ color: "#f43f5e", fontSize: 16 }}>✕</span>;
}

export default function ListingDetail() {
  const { id } = useParams();
  const listing = LISTINGS.find(l => l.id === Number(id)) ?? LISTINGS[0];
  const [activePhoto, setActivePhoto] = useState(0);
  const [contactOpen, setContactOpen] = useState(false);

  const photos = [
    listing.photo,
    "https://images.unsplash.com/photo-1484154218962-a197022b5858?w=700&h=400&fit=crop&auto=format",
    "https://images.unsplash.com/photo-1507089947368-19c1da9775ae?w=700&h=400&fit=crop&auto=format",
  ];

  const color = listing.trustScore >= 70 ? "#10b981" : listing.trustScore >= 40 ? "#f59e0b" : "#f43f5e";
  const bg = listing.trustScore >= 70 ? "#ecfdf5" : listing.trustScore >= 40 ? "#fffbeb" : "#fff1f2";
  const landlordReviews = REVIEWS.filter(r => r.landlord === listing.landlord || Math.random() > 0.5).slice(0, 2);

  return (
    <div style={{ fontFamily: "'Inter', sans-serif" }}>
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm mb-5" style={{ color: "#5f7572" }}>
        <Link to="/listings" style={{ color: "#117c74", textDecoration: "none" }}>Listings</Link>
        <span>›</span>
        <span>{listing.locality}</span>
        <span>›</span>
        <span style={{ color: "#17222b" }}>{listing.title}</span>
      </div>

      <div className="grid gap-6" style={{ gridTemplateColumns: "1fr 340px" }}>
        {/* Main content */}
        <div>
          {/* Photo gallery */}
          <div className="rounded-2xl overflow-hidden mb-5 border" style={{ borderColor: "#e2ece9" }}>
            <img src={photos[activePhoto]} alt={listing.title} className="w-full object-cover" style={{ height: 380 }} />
          </div>
          <div className="flex gap-3 mb-6">
            {photos.map((p, i) => (
              <button
                key={i}
                onClick={() => setActivePhoto(i)}
                className="rounded-xl overflow-hidden border-2 transition-all"
                style={{ borderColor: activePhoto === i ? "#117c74" : "transparent", width: 100, height: 68 }}
              >
                <img src={p} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>

          {/* Title & details */}
          <div className="mb-6">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h1 className="text-2xl font-bold mb-1" style={{ fontFamily: "'Space Grotesk', sans-serif", color: "#17222b", letterSpacing: "-0.5px" }}>
                  {listing.title}
                </h1>
                <div className="flex items-center gap-3 text-sm" style={{ color: "#5f7572" }}>
                  <span>📍 {listing.locality}</span>
                  <span>·</span>
                  <span>{listing.bhk}</span>
                  <span>·</span>
                  <span>{listing.area}</span>
                  <span>·</span>
                  <span>Floor {listing.floor}</span>
                </div>
              </div>
              {listing.verified && (
                <span className="px-3 py-1.5 rounded-full text-xs font-semibold" style={{ background: "#fef9c3", color: "#854d0e", border: "1px solid #eab308" }}>
                  🏅 Verified Landlord
                </span>
              )}
            </div>
            <p className="text-sm leading-relaxed" style={{ color: "#5f7572" }}>{listing.description}</p>
          </div>

          {/* Amenities */}
          <div className="mb-6">
            <h3 className="font-semibold mb-3" style={{ fontFamily: "'Space Grotesk', sans-serif", color: "#17222b" }}>Amenities</h3>
            <div className="flex flex-wrap gap-2">
              {listing.amenities.map(a => (
                <div key={a} className="flex items-center gap-2 px-3 py-2 rounded-xl border text-sm" style={{ background: "#f6f9f8", borderColor: "#e2ece9", color: "#17222b" }}>
                  <span>{AMENITY_ICONS[a]}</span> {a}
                </div>
              ))}
            </div>
          </div>

          {/* Trust Score Breakdown */}
          <div className="rounded-2xl border p-5 mb-6" style={{ background: "#fff", borderColor: "#e2ece9" }}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold" style={{ fontFamily: "'Space Grotesk', sans-serif", color: "#17222b" }}>Trust Score Breakdown</h3>
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl" style={{ background: bg }}>
                <span className="text-2xl font-bold" style={{ fontFamily: "'Space Grotesk', sans-serif", color }}>{listing.trustScore}</span>
                <div>
                  <div className="text-xs font-semibold" style={{ color }}>/ 100</div>
                  <div className="text-xs" style={{ color }}>Trust Score</div>
                </div>
              </div>
            </div>
            <div className="space-y-3">
              {listing.trustBreakdown.map((item, i) => (
                <div key={i} className="flex items-start gap-3 p-3 rounded-xl" style={{
                  background: item.status === "pass" ? "#ecfdf5" : item.status === "warn" ? "#fffbeb" : "#fff1f2"
                }}>
                  <StatusIcon status={item.status} />
                  <div>
                    <div className="text-sm font-medium" style={{ color: "#17222b" }}>{item.signal}</div>
                    <div className="text-xs mt-0.5" style={{ color: "#5f7572" }}>{item.note}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Safety mini-map */}
          <div className="rounded-2xl border overflow-hidden mb-6" style={{ borderColor: "#e2ece9" }}>
            <div className="relative" style={{ height: 200, background: "#e8f5e9" }}>
              <img
                src="https://images.unsplash.com/photo-1524661135-423995f22d0b?w=700&h=200&fit=crop&auto=format"
                alt="Area map"
                className="w-full h-full object-cover opacity-60"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="rounded-xl px-4 py-3 text-center" style={{ background: "rgba(255,255,255,0.95)" }}>
                  <div className="text-2xl mb-1">📍</div>
                  <div className="text-sm font-semibold" style={{ color: "#17222b" }}>{listing.locality}</div>
                  <div className="text-xs mt-0.5" style={{ color: "#5f7572" }}>Area risk score: <span style={{ color: "#10b981", fontWeight: 700 }}>Low</span></div>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between px-4 py-3 border-t" style={{ borderColor: "#e2ece9" }}>
              <div className="text-sm" style={{ color: "#5f7572" }}>Click for full safety analysis</div>
              <Link to="/safety-map" style={{ textDecoration: "none" }}>
                <button className="text-sm font-medium" style={{ color: "#117c74", background: "none", border: "none", cursor: "pointer" }}>
                  View Safety Map →
                </button>
              </Link>
            </div>
          </div>

          {/* Reviews */}
          <div>
            <h3 className="font-semibold mb-4" style={{ fontFamily: "'Space Grotesk', sans-serif", color: "#17222b" }}>Landlord Reviews</h3>
            <div className="space-y-4">
              {REVIEWS.slice(0, 2).map(r => (
                <div key={r.id} className="rounded-2xl border p-4" style={{ background: "#fff", borderColor: "#e2ece9" }}>
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="font-medium text-sm" style={{ color: "#17222b" }}>{r.reviewer}</div>
                      <div className="text-xs" style={{ color: "#5f7572" }}>{r.college} · {r.date}</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <span key={i} style={{ color: i < Math.round(r.overall) ? "#eab308" : "#e2ece9", fontSize: 14 }}>★</span>
                        ))}
                      </div>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${r.depositReturned ? "" : ""}`}
                        style={{
                          background: r.depositReturned ? "#ecfdf5" : "#fff1f2",
                          color: r.depositReturned ? "#10b981" : "#f43f5e",
                        }}>
                        {r.depositReturned ? "✓ Deposit Returned" : "✕ Deposit Not Returned"}
                      </span>
                    </div>
                  </div>
                  <p className="text-sm leading-relaxed" style={{ color: "#5f7572" }}>{r.comment}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right sticky panel */}
        <div>
          <div className="sticky top-4 space-y-4">
            {/* Price */}
            <div className="rounded-2xl border p-5" style={{ background: "#fff", borderColor: "#e2ece9" }}>
              <div className="text-3xl font-bold mb-1" style={{ fontFamily: "'Space Grotesk', sans-serif", color: "#17222b" }}>
                ₹{listing.price.toLocaleString()}
                <span className="text-base font-normal" style={{ color: "#5f7572" }}>/month</span>
              </div>
              <div className="text-sm mb-4" style={{ color: "#5f7572" }}>
                Deposit: ₹{listing.deposit.toLocaleString()} · {listing.bhk} · {listing.area}
              </div>

              <button
                onClick={() => setContactOpen(true)}
                className="w-full py-3.5 rounded-xl font-semibold text-white text-sm transition-all mb-3"
                style={{ background: "#117c74", height: 48 }}
                onMouseEnter={e => (e.currentTarget.style.background = "#0d635c")}
                onMouseLeave={e => (e.currentTarget.style.background = "#117c74")}
              >
                Contact Owner
              </button>

              <Link to="/sos" style={{ textDecoration: "none" }}>
                <button
                  className="w-full py-3.5 rounded-xl font-semibold text-sm transition-all border"
                  style={{ borderColor: "#f43f5e", color: "#f43f5e", background: "#fff1f2", height: 48 }}
                >
                  🛡 Start SOS Visit Check-in
                </button>
              </Link>
            </div>

            {/* Landlord card */}
            <div className="rounded-2xl border p-4" style={{ background: "#fff", borderColor: "#e2ece9" }}>
              <h4 className="font-semibold text-sm mb-3" style={{ fontFamily: "'Space Grotesk', sans-serif", color: "#17222b" }}>About the Landlord</h4>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold" style={{ background: "#117c74" }}>
                  {listing.landlord.charAt(0)}
                </div>
                <div>
                  <div className="text-sm font-medium" style={{ color: "#17222b" }}>{listing.landlord}</div>
                  <div className="text-xs" style={{ color: "#5f7572" }}>
                    {listing.verified ? "✓ Documents verified" : "⚠ Not yet verified"}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contact modal */}
      {contactOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: "rgba(0,0,0,0.45)", backdropFilter: "blur(4px)" }}>
          <div className="rounded-2xl p-6 w-full" style={{ maxWidth: 440, background: "#fff", boxShadow: "0 20px 60px rgba(0,0,0,0.15)" }}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold" style={{ fontFamily: "'Space Grotesk', sans-serif", color: "#17222b" }}>Contact Owner</h3>
              <button onClick={() => setContactOpen(false)} style={{ background: "none", border: "none", cursor: "pointer", color: "#5f7572" }}>✕</button>
            </div>
            <textarea
              placeholder="Hi, I'm a student at NCU Gurugram looking for a flat. Can I schedule a visit?"
              rows={4}
              className="w-full border rounded-xl p-3 text-sm outline-none resize-none mb-4"
              style={{ borderColor: "#e2ece9", fontFamily: "'Inter', sans-serif" }}
              onFocus={e => (e.target.style.borderColor = "#117c74")}
              onBlur={e => (e.target.style.borderColor = "#e2ece9")}
            />
            <div className="flex gap-3">
              <button
                className="flex-1 py-3 rounded-xl font-semibold text-white text-sm"
                style={{ background: "#117c74" }}
                onClick={() => setContactOpen(false)}
              >
                Send Message
              </button>
              <button
                className="px-4 py-3 rounded-xl border text-sm"
                style={{ borderColor: "#e2ece9", color: "#5f7572" }}
                onClick={() => setContactOpen(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
