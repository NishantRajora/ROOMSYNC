import { useState } from "react";
import { EXPENSES, SETTLEMENT } from "../data/mockData";

const GROUP_MEMBERS = [
  { name: "You", photo: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=40&h=40&fit=crop&auto=format" },
  { name: "Priya Sharma", photo: "https://images.unsplash.com/photo-1494790108755-2616b612b67c?w=40&h=40&fit=crop&auto=format" },
  { name: "Ananya Verma", photo: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=40&h=40&fit=crop&auto=format" },
];

export default function BillSplitter() {
  const [settleOpen, setSettleOpen] = useState(false);
  const [selectedSettlement, setSelectedSettlement] = useState(SETTLEMENT[0]);
  const [addOpen, setAddOpen] = useState(false);

  const total = EXPENSES.reduce((s, e) => s + e.amount, 0);

  return (
    <div style={{ fontFamily: "'Inter', sans-serif" }}>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold mb-1" style={{ fontFamily: "'Space Grotesk', sans-serif", color: "#17222b", letterSpacing: "-0.5px" }}>
            Bill Splitter
          </h1>
          <p className="text-sm" style={{ color: "#5f7572" }}>Sector 23 Flat · 3 flatmates</p>
        </div>
        <button
          onClick={() => setAddOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-white text-sm transition-all"
          style={{ background: "#117c74" }}
          onMouseEnter={e => (e.currentTarget.style.background = "#0d635c")}
          onMouseLeave={e => (e.currentTarget.style.background = "#117c74")}
        >
          + Add Expense
        </button>
      </div>

      {/* Group members */}
      <div className="rounded-2xl border p-4 mb-5 flex items-center gap-4" style={{ background: "#fff", borderColor: "#e2ece9" }}>
        <div className="flex -space-x-2">
          {GROUP_MEMBERS.map((m, i) => (
            <img key={i} src={m.photo} alt={m.name} className="w-9 h-9 rounded-full border-2 border-white object-cover" />
          ))}
        </div>
        <div>
          <div className="text-sm font-semibold" style={{ color: "#17222b" }}>Sector 23 Flatmates</div>
          <div className="text-xs" style={{ color: "#5f7572" }}>{GROUP_MEMBERS.map(m => m.name).join(", ")}</div>
        </div>
        <div className="ml-auto text-right">
          <div className="text-sm font-semibold" style={{ color: "#17222b" }}>September 2026</div>
          <div className="text-xs" style={{ color: "#5f7572" }}>Total: ₹{total.toLocaleString()}</div>
        </div>
      </div>

      <div className="grid gap-5" style={{ gridTemplateColumns: "1fr 340px" }}>
        {/* Expense list */}
        <div>
          <h3 className="font-semibold mb-4 text-sm" style={{ fontFamily: "'Space Grotesk', sans-serif", color: "#17222b" }}>
            Expenses this month
          </h3>
          <div className="space-y-3">
            {EXPENSES.map(exp => (
              <div
                key={exp.id}
                className="rounded-2xl border p-4 flex items-center gap-4 transition-all hover:-translate-y-0.5"
                style={{ background: "#fff", borderColor: "#e2ece9", boxShadow: "0 2px 10px rgba(0,0,0,0.02)" }}
              >
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
                  style={{ background: "#f6f9f8" }}
                >
                  {exp.category}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-sm mb-0.5" style={{ color: "#17222b" }}>{exp.title}</div>
                  <div className="text-xs" style={{ color: "#5f7572" }}>
                    Paid by <strong style={{ color: "#17222b" }}>{exp.paidBy}</strong> · Split with {exp.splitWith.length} people · {exp.date}
                  </div>
                </div>
                <div className="flex -space-x-2 flex-shrink-0 mr-3">
                  {exp.splitWith.slice(0, 3).map((name, i) => (
                    <div
                      key={i}
                      className="w-7 h-7 rounded-full flex items-center justify-center border-2 border-white text-xs font-bold"
                      style={{ background: "#117c74", color: "#fff" }}
                    >
                      {name.charAt(0)}
                    </div>
                  ))}
                </div>
                <div className="text-right flex-shrink-0">
                  <div className="font-bold" style={{ fontFamily: "'Space Grotesk', sans-serif", color: "#17222b" }}>
                    ₹{exp.amount.toLocaleString()}
                  </div>
                  <div className="text-xs" style={{ color: "#5f7572" }}>
                    ÷{exp.splitWith.length} = ₹{Math.round(exp.amount / exp.splitWith.length).toLocaleString()} each
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Settlement panel */}
        <div className="space-y-4">
          {/* Summary card */}
          <div className="rounded-2xl border p-5" style={{ background: "#fff", borderColor: "#e2ece9" }}>
            <h3 className="font-semibold mb-4 text-sm" style={{ fontFamily: "'Space Grotesk', sans-serif", color: "#17222b" }}>
              Who Owes Whom
            </h3>
            <div className="space-y-3">
              {SETTLEMENT.map((s, i) => (
                <div key={i} className="rounded-xl p-3" style={{ background: s.from === "You" ? "#fff1f2" : "#ecfdf5" }}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-sm font-semibold" style={{ color: s.from === "You" ? "#f43f5e" : "#10b981" }}>
                      {s.from} → {s.to}
                    </div>
                    <div className="text-sm font-bold" style={{ fontFamily: "'Space Grotesk', sans-serif", color: s.from === "You" ? "#f43f5e" : "#10b981" }}>
                      ₹{s.amount.toLocaleString()}
                    </div>
                  </div>
                  <button
                    onClick={() => { setSelectedSettlement(s); setSettleOpen(true); }}
                    className="w-full py-2 rounded-lg text-xs font-semibold transition-all"
                    style={{
                      background: s.from === "You" ? "#f43f5e" : "#117c74",
                      color: "#fff",
                    }}
                  >
                    Settle Up with UPI
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Stats */}
          <div className="rounded-2xl border p-5" style={{ background: "#fff", borderColor: "#e2ece9" }}>
            <h3 className="font-semibold mb-4 text-sm" style={{ fontFamily: "'Space Grotesk', sans-serif", color: "#17222b" }}>Monthly Summary</h3>
            <div className="space-y-3">
              {[
                { label: "Total Expenses", value: `₹${total.toLocaleString()}`, color: "#17222b" },
                { label: "Your Share", value: `₹${Math.round(total / 3).toLocaleString()}`, color: "#117c74" },
                { label: "You Paid", value: `₹${EXPENSES.filter(e => e.paidBy === "You").reduce((s, e) => s + e.amount, 0).toLocaleString()}`, color: "#117c74" },
              ].map((stat, i) => (
                <div key={i} className="flex items-center justify-between">
                  <span className="text-sm" style={{ color: "#5f7572" }}>{stat.label}</span>
                  <span className="font-bold text-sm" style={{ fontFamily: "'Space Grotesk', sans-serif", color: stat.color }}>{stat.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Settle Up modal with UPI QR */}
      {settleOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center"
          style={{ background: "rgba(0,0,0,0.45)", backdropFilter: "blur(4px)" }}
          onClick={() => setSettleOpen(false)}
        >
          <div
            className="rounded-2xl p-6 text-center w-full"
            style={{ maxWidth: 380, background: "#fff", boxShadow: "0 20px 60px rgba(0,0,0,0.15)" }}
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-bold" style={{ fontFamily: "'Space Grotesk', sans-serif", color: "#17222b" }}>Settle Up</h3>
              <button onClick={() => setSettleOpen(false)} style={{ background: "none", border: "none", cursor: "pointer", color: "#5f7572" }}>✕</button>
            </div>

            <div className="text-sm mb-1" style={{ color: "#5f7572" }}>
              You owe <strong style={{ color: "#17222b" }}>{selectedSettlement.to}</strong>
            </div>
            <div className="text-3xl font-bold mb-5" style={{ fontFamily: "'Space Grotesk', sans-serif", color: "#17222b" }}>
              ₹{selectedSettlement.amount.toLocaleString()}
            </div>

            {/* QR code mock */}
            <div
              className="rounded-2xl p-5 mb-4 mx-auto"
              style={{ background: "#f6f9f8", border: "2px solid #e2ece9", width: 200, height: 200, display: "flex", alignItems: "center", justifyContent: "center" }}
            >
              <div style={{ textAlign: "center" }}>
                {/* QR pattern mock */}
                <div style={{ display: "grid", gridTemplateColumns: "repeat(8,16px)", gap: 2 }}>
                  {Array.from({ length: 64 }).map((_, i) => (
                    <div
                      key={i}
                      style={{
                        width: 14, height: 14,
                        background: Math.random() > 0.4 ? "#17222b" : "#fff",
                        borderRadius: 2,
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>

            <div className="text-xs mb-1" style={{ color: "#5f7572" }}>Scan with GPay, PhonePe, or Paytm</div>

            <div
              className="flex items-center justify-between px-4 py-2.5 rounded-xl mb-4 border"
              style={{ background: "#f6f9f8", borderColor: "#e2ece9" }}
            >
              <code className="text-sm" style={{ fontFamily: "monospace", color: "#17222b" }}>
                {selectedSettlement.upiId}
              </code>
              <button
                className="text-xs font-semibold"
                style={{ color: "#117c74", background: "none", border: "none", cursor: "pointer" }}
                onClick={() => navigator.clipboard?.writeText(selectedSettlement.upiId)}
              >
                Copy
              </button>
            </div>

            <button
              onClick={() => setSettleOpen(false)}
              className="w-full py-3 rounded-xl font-semibold text-white text-sm"
              style={{ background: "#117c74" }}
            >
              Mark as Paid
            </button>
          </div>
        </div>
      )}

      {/* Add expense modal */}
      {addOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: "rgba(0,0,0,0.45)", backdropFilter: "blur(4px)" }}>
          <div className="rounded-2xl p-6 w-full" style={{ maxWidth: 420, background: "#fff", boxShadow: "0 20px 60px rgba(0,0,0,0.15)" }}>
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-bold" style={{ fontFamily: "'Space Grotesk', sans-serif", color: "#17222b" }}>Add Expense</h3>
              <button onClick={() => setAddOpen(false)} style={{ background: "none", border: "none", cursor: "pointer", color: "#5f7572" }}>✕</button>
            </div>
            <div className="space-y-4">
              {[
                { label: "Title", placeholder: "e.g. Electricity Bill", type: "text" },
                { label: "Amount (₹)", placeholder: "0", type: "number" },
              ].map(f => (
                <div key={f.label}>
                  <label className="block text-sm font-medium mb-1.5" style={{ color: "#17222b" }}>{f.label}</label>
                  <input
                    type={f.type} placeholder={f.placeholder}
                    className="w-full border rounded-xl px-4 py-3 text-sm outline-none"
                    style={{ borderColor: "#e2ece9", fontFamily: "'Inter', sans-serif" }}
                    onFocus={e => (e.target.style.borderColor = "#117c74")}
                    onBlur={e => (e.target.style.borderColor = "#e2ece9")}
                  />
                </div>
              ))}
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: "#17222b" }}>Category</label>
                <div className="flex gap-2 flex-wrap">
                  {["🏠 Rent", "⚡ Utility", "🛒 Groceries", "📶 Internet", "💧 Water"].map(c => (
                    <button key={c} className="px-3 py-1.5 rounded-full text-xs border" style={{ borderColor: "#e2ece9", color: "#5f7572" }}>{c}</button>
                  ))}
                </div>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setAddOpen(false)}
                  className="flex-1 py-3 rounded-xl font-semibold text-white text-sm"
                  style={{ background: "#117c74" }}
                >
                  Add Expense
                </button>
                <button onClick={() => setAddOpen(false)} className="px-4 py-3 rounded-xl border text-sm" style={{ borderColor: "#e2ece9", color: "#5f7572" }}>
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
