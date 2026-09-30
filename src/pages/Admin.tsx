import { useState } from "react";
import { LISTINGS, MATCHES, REVIEWS, EXPENSES, CONVERSATIONS } from "../data/mockData";

const TABLES = [
  { name: "accounts", count: 1247, icon: "👤" },
  { name: "listings", count: 384, icon: "🏠" },
  { name: "expenses", count: 2891, icon: "₹" },
  { name: "pacts", count: 156, icon: "📋" },
  { name: "conversations", count: 4502, icon: "💬" },
  { name: "reviews", count: 892, icon: "★" },
  { name: "visit_alerts", count: 73, icon: "🛡" },
  { name: "verifications", count: 1189, icon: "✓" },
];

const FLAGGED = [
  { id: "L-0034", title: "3BHK, Sushant Lok", reason: "Advance payment before visit requested", severity: "high", landlord: "Deepak Arora", date: "Sep 29, 2026" },
  { id: "L-0071", title: "1BHK, Golf Course Road", reason: "Photos matched stock image database", severity: "medium", landlord: "Raj Patel", date: "Sep 28, 2026" },
  { id: "L-0119", title: "2BHK, Sector 23", reason: "Price 40% below locality median — unusual", severity: "medium", landlord: "Unknown", date: "Sep 27, 2026" },
  { id: "L-0203", title: "Studio, DLF Phase 3", reason: "Multiple accounts sharing this landlord ID", severity: "high", landlord: "Sanjay M.", date: "Sep 26, 2026" },
];

const TABLE_DATA: Record<string, any[]> = {
  accounts: MATCHES.map(m => ({ id: `ACC-${m.id}`, name: m.name, college: m.college, year: m.year, verified: true })),
  listings: LISTINGS.map(l => ({ id: `LST-${l.id}`, title: l.title, price: `₹${l.price.toLocaleString()}`, trust: l.trustScore, locality: l.locality })),
  expenses: EXPENSES.map(e => ({ id: `EXP-${e.id}`, title: e.title, amount: `₹${e.amount.toLocaleString()}`, paidBy: e.paidBy, date: e.date })),
  reviews: REVIEWS.map(r => ({ id: `REV-${r.id}`, landlord: r.landlord, overall: r.overall, deposit: r.depositReturned ? "Yes" : "No", date: r.date })),
  conversations: CONVERSATIONS.map(c => ({ id: `MSG-${c.id}`, participants: c.name, messages: c.messages.length, last: c.time })),
};

export default function Admin() {
  const [activeTable, setActiveTable] = useState("listings");
  const [searchQ, setSearchQ] = useState("");
  const [view, setView] = useState<"table" | "flagged">("table");

  const rows = TABLE_DATA[activeTable] ?? [];
  const cols = rows[0] ? Object.keys(rows[0]) : [];
  const filtered = rows.filter(r => JSON.stringify(r).toLowerCase().includes(searchQ.toLowerCase()));

  return (
    <div style={{ fontFamily: "'Inter', sans-serif" }}>
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="text-xs font-semibold uppercase tracking-widest mb-1" style={{ color: "#f43f5e" }}>Admin Access</div>
          <h1 className="text-2xl font-bold mb-1" style={{ fontFamily: "'Space Grotesk', sans-serif", color: "#17222b", letterSpacing: "-0.5px" }}>
            Database Inspector
          </h1>
          <p className="text-sm" style={{ color: "#5f7572" }}>Development & moderation dashboard — not visible to regular users</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setView("table")}
            className="px-4 py-2 rounded-xl border text-sm font-medium transition-all"
            style={{
              borderColor: view === "table" ? "#117c74" : "#e2ece9",
              background: view === "table" ? "#ecfdf5" : "#fff",
              color: view === "table" ? "#117c74" : "#5f7572",
            }}
          >
            🗄 Data Tables
          </button>
          <button
            onClick={() => setView("flagged")}
            className="px-4 py-2 rounded-xl border text-sm font-medium transition-all relative"
            style={{
              borderColor: view === "flagged" ? "#f43f5e" : "#e2ece9",
              background: view === "flagged" ? "#fff1f2" : "#fff",
              color: view === "flagged" ? "#f43f5e" : "#5f7572",
            }}
          >
            🚨 Moderation Queue
            <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full text-xs font-bold flex items-center justify-center text-white" style={{ background: "#f43f5e" }}>
              {FLAGGED.length}
            </span>
          </button>
        </div>
      </div>

      {view === "table" ? (
        <div className="grid gap-5" style={{ gridTemplateColumns: "220px 1fr" }}>
          {/* Table list */}
          <aside>
            <div className="rounded-2xl border overflow-hidden" style={{ borderColor: "#e2ece9" }}>
              <div className="px-4 py-3 border-b" style={{ borderColor: "#e2ece9", background: "#f6f9f8" }}>
                <span className="text-xs font-semibold" style={{ color: "#17222b" }}>Database Tables</span>
              </div>
              {TABLES.map(t => (
                <div
                  key={t.name}
                  className="flex items-center gap-3 px-4 py-3 border-b last:border-b-0 cursor-pointer transition-all"
                  style={{
                    borderColor: "#f6f9f8",
                    background: activeTable === t.name ? "#ecfdf5" : "transparent",
                  }}
                  onClick={() => setActiveTable(t.name)}
                  onMouseEnter={e => { if (activeTable !== t.name) (e.currentTarget as HTMLElement).style.background = "#f6f9f8"; }}
                  onMouseLeave={e => { if (activeTable !== t.name) (e.currentTarget as HTMLElement).style.background = "transparent"; }}
                >
                  <span className="text-base">{t.icon}</span>
                  <div className="flex-1 min-w-0">
                    <code className="text-xs font-semibold" style={{ color: activeTable === t.name ? "#117c74" : "#17222b", fontFamily: "monospace" }}>
                      {t.name}
                    </code>
                  </div>
                  <span className="text-xs" style={{ color: "#5f7572" }}>{t.count.toLocaleString()}</span>
                </div>
              ))}
            </div>

            {/* Stats */}
            <div className="mt-4 rounded-2xl border p-4" style={{ background: "#fff", borderColor: "#e2ece9" }}>
              <div className="text-xs font-semibold mb-3" style={{ color: "#17222b" }}>Platform Stats</div>
              {[
                { label: "Total Users", val: "1,247" },
                { label: "Active Listings", val: "384" },
                { label: "Pacts Created", val: "156" },
                { label: "Avg Trust Score", val: "71.4" },
              ].map(s => (
                <div key={s.label} className="flex justify-between text-xs mb-2">
                  <span style={{ color: "#5f7572" }}>{s.label}</span>
                  <span className="font-semibold" style={{ color: "#17222b" }}>{s.val}</span>
                </div>
              ))}
            </div>
          </aside>

          {/* Table view */}
          <div>
            <div className="rounded-2xl border overflow-hidden" style={{ borderColor: "#e2ece9" }}>
              <div className="flex items-center gap-3 px-4 py-3 border-b" style={{ borderColor: "#e2ece9", background: "#f6f9f8" }}>
                <code className="text-sm font-semibold" style={{ fontFamily: "monospace", color: "#17222b" }}>
                  {activeTable}
                </code>
                <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: "#e2ece9", color: "#5f7572" }}>
                  {filtered.length} rows
                </span>
                <input
                  value={searchQ}
                  onChange={e => setSearchQ(e.target.value)}
                  placeholder="Search rows..."
                  className="ml-auto border rounded-xl px-3 py-1.5 text-xs outline-none"
                  style={{ borderColor: "#e2ece9", fontFamily: "'Inter', sans-serif", width: 200 }}
                  onFocus={e => (e.target.style.borderColor = "#117c74")}
                  onBlur={e => (e.target.style.borderColor = "#e2ece9")}
                />
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-xs" style={{ borderCollapse: "collapse" }}>
                  <thead>
                    <tr style={{ background: "#f6f9f8", borderBottom: "1px solid #e2ece9" }}>
                      {cols.map(col => (
                        <th key={col} className="text-left px-4 py-3 font-semibold" style={{ color: "#5f7572", fontFamily: "monospace" }}>
                          {col}
                        </th>
                      ))}
                      <th className="text-left px-4 py-3 font-semibold" style={{ color: "#5f7572" }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.slice(0, 10).map((row, i) => (
                      <tr key={i} className="border-b hover:bg-gray-50" style={{ borderColor: "#f6f9f8" }}>
                        {cols.map(col => (
                          <td key={col} className="px-4 py-3" style={{ color: "#17222b" }}>
                            {col === "id" ? (
                              <code style={{ fontFamily: "monospace", color: "#117c74" }}>{row[col]}</code>
                            ) : col === "trust" ? (
                              <span className="px-2 py-0.5 rounded-full font-semibold" style={{
                                background: row[col] >= 70 ? "#ecfdf5" : row[col] >= 40 ? "#fffbeb" : "#fff1f2",
                                color: row[col] >= 70 ? "#10b981" : row[col] >= 40 ? "#f59e0b" : "#f43f5e",
                              }}>{row[col]}</span>
                            ) : col === "verified" ? (
                              <span style={{ color: row[col] ? "#10b981" : "#f43f5e" }}>{row[col] ? "✓" : "✕"}</span>
                            ) : col === "deposit" ? (
                              <span style={{ color: row[col] === "Yes" ? "#10b981" : "#f43f5e" }}>{row[col]}</span>
                            ) : (
                              <span className="truncate block" style={{ maxWidth: 160 }}>{String(row[col])}</span>
                            )}
                          </td>
                        ))}
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <button className="text-xs" style={{ color: "#117c74" }}>Edit</button>
                            <button className="text-xs" style={{ color: "#f43f5e" }}>Delete</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {filtered.length > 10 && (
                <div className="px-4 py-3 border-t text-xs" style={{ borderColor: "#e2ece9", color: "#5f7572" }}>
                  Showing 10 of {filtered.length} rows
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        /* Flagged listings moderation queue */
        <div>
          <div className="rounded-2xl border overflow-hidden" style={{ borderColor: "#e2ece9" }}>
            <div className="px-5 py-4 border-b" style={{ borderColor: "#e2ece9", background: "#fff1f2" }}>
              <h3 className="font-semibold" style={{ fontFamily: "'Space Grotesk', sans-serif", color: "#f43f5e" }}>
                🚨 Flagged Listings — Moderation Queue
              </h3>
              <p className="text-xs mt-1" style={{ color: "#5f7572" }}>
                {FLAGGED.length} listings require review before being shown to users
              </p>
            </div>
            {FLAGGED.map((item, i) => (
              <div key={i} className="flex items-start gap-4 px-5 py-4 border-b last:border-b-0" style={{ borderColor: "#f6f9f8" }}>
                <div
                  className="px-2 py-0.5 rounded-full text-xs font-semibold flex-shrink-0"
                  style={{
                    background: item.severity === "high" ? "#fff1f2" : "#fffbeb",
                    color: item.severity === "high" ? "#f43f5e" : "#f59e0b",
                  }}
                >
                  {item.severity === "high" ? "🔴 High" : "🟡 Medium"}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-0.5">
                    <code className="text-xs" style={{ fontFamily: "monospace", color: "#5f7572" }}>{item.id}</code>
                    <span className="font-semibold text-sm" style={{ color: "#17222b" }}>{item.title}</span>
                  </div>
                  <div className="text-xs mb-1" style={{ color: "#5f7572" }}>Landlord: {item.landlord} · Flagged: {item.date}</div>
                  <div className="text-xs" style={{ color: item.severity === "high" ? "#f43f5e" : "#92400e" }}>
                    ⚠ {item.reason}
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <button
                    className="px-3 py-1.5 rounded-lg text-xs font-medium border"
                    style={{ borderColor: "#10b981", color: "#10b981", background: "#ecfdf5" }}
                  >
                    Approve
                  </button>
                  <button
                    className="px-3 py-1.5 rounded-lg text-xs font-medium border"
                    style={{ borderColor: "#f43f5e", color: "#f43f5e", background: "#fff1f2" }}
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
