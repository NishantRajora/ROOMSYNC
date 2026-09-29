import React, { useState, useEffect } from "react";
import { Plus, QrCode, CheckCircle2, IndianRupee, ArrowRight, ShieldCheck, X, Share2, Receipt } from "lucide-react";

export interface ExpenseSplitterProps {
  api: string;
  currentUser: string;
  onNotify: (msg: string) => void;
}

interface Expense {
  id: number;
  group_id: string;
  title: string;
  amount: number;
  paid_by: string;
  category: string;
  split_with: string;
  upi_id: string;
  created_at: string;
}

interface Settlement {
  from_user: string;
  to_user: string;
  amount: number;
  upi_id: string;
  upi_link: string;
  qr_url: string;
}

export const ExpenseSplitter: React.FC<ExpenseSplitterProps> = ({ api, currentUser, onNotify }) => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [settlements, setSettlements] = useState<Settlement[]>([]);
  const [balances, setBalances] = useState<Record<string, number>>({});
  const [totalSpent, setTotalSpent] = useState<number>(0);
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [activeQr, setActiveQr] = useState<Settlement | null>(null);

  // Form state
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("Rent");
  const [paidBy, setPaidBy] = useState("Priya Sharma");
  const [splitWith, setSplitWith] = useState("Aarav Mehta, Tanya Kapoor, Kabir Das");
  const [upiId, setUpiId] = useState("priya.sharma@okaxis");

  const baseApi = api.replace(/\/api\/?$/, "") + "/api";

  const fetchExpensesAndBalances = async () => {
    try {
      const expRes = await fetch(`${baseApi}/expenses/?group_id=flat-ncu-23`);
      if (expRes.ok) {
        const data = await expRes.json();
        setExpenses(data.expenses || []);
      }

      const balRes = await fetch(`${baseApi}/expenses/balances/?group_id=flat-ncu-23`);
      if (balRes.ok) {
        const data = await balRes.json();
        setSettlements(data.settlements || []);
        setBalances(data.balances || {});
        setTotalSpent(data.total_expenses || 0);
      }
    } catch (err) {
      console.error("Failed to load expenses data", err);
    }
  };

  useEffect(() => {
    fetchExpensesAndBalances();
  }, [baseApi]);

  const handleAddExpense = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !amount || parseFloat(amount) <= 0) {
      onNotify("Please provide a valid title and positive amount.");
      return;
    }

    try {
      const res = await fetch(`${baseApi}/expenses/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          group_id: "flat-ncu-23",
          title: title.trim(),
          amount: parseFloat(amount),
          paid_by: paidBy.trim(),
          category,
          split_with: splitWith.trim(),
          upi_id: upiId.trim(),
        }),
      });

      if (res.ok) {
        onNotify(`Logged expense: ₹${parseFloat(amount).toLocaleString()} for ${title}`);
        setTitle("");
        setAmount("");
        setShowAddModal(false);
        fetchExpensesAndBalances();
      } else {
        const err = await res.json();
        onNotify(err.error || "Failed to add expense.");
      }
    } catch {
      onNotify("Network error adding expense.");
    }
  };

  const getCategoryColor = (cat: string) => {
    switch (cat.toLowerCase()) {
      case "rent": return "#117c74";
      case "electricity": return "#dd6b20";
      case "wifi": return "#3182ce";
      case "groceries": return "#38a169";
      default: return "#805ad5";
    }
  };

  return (
    <section className="expense-splitter-section" style={{ marginTop: "12px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "16px" }}>
        <div>
          <p className="eyebrow mint-text">SHARED APARTMENT FINANCES</p>
          <h2 style={{ fontFamily: "Space Grotesk", margin: "4px 0 8px" }}>Flatmate Bill & Expense Splitter</h2>
          <p style={{ color: "var(--muted)", margin: 0 }}>
            Track shared rent, electricity, WiFi, and groceries with zero friction. Instant UPI settlement via QR code.
          </p>
        </div>
        <button
          className="primary"
          onClick={() => setShowAddModal(true)}
          style={{ display: "flex", alignItems: "center", gap: "6px" }}
        >
          <Plus size={16} /> Log New Bill
        </button>
      </div>

      {/* Top Financial Stats Bar */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "16px", marginTop: "24px" }}>
        <div style={{ background: "#fff", padding: "18px 22px", borderRadius: "14px", border: "1px solid var(--line)" }}>
          <small style={{ color: "var(--muted)", textTransform: "uppercase", fontSize: "11px", fontWeight: 700 }}>Total Group Spending</small>
          <div style={{ fontSize: "26px", fontWeight: 700, fontFamily: "Space Grotesk", color: "var(--ink)", marginTop: "4px" }}>
            ₹{totalSpent.toLocaleString()}
          </div>
          <span style={{ fontSize: "12px", color: "var(--muted)" }}>Flat #204, Sector 23 Gurugram</span>
        </div>

        <div style={{ background: "#e8f5e8", padding: "18px 22px", borderRadius: "14px", border: "1px solid #c6f6d5" }}>
          <small style={{ color: "#22543d", textTransform: "uppercase", fontSize: "11px", fontWeight: 700 }}>You are owed</small>
          <div style={{ fontSize: "26px", fontWeight: 700, fontFamily: "Space Grotesk", color: "#276749", marginTop: "4px" }}>
            ₹{(balances["Priya Sharma"] && balances["Priya Sharma"] > 0 ? balances["Priya Sharma"] : 0).toLocaleString()}
          </div>
          <span style={{ fontSize: "12px", color: "#2f855a" }}>Ready for UPI collection</span>
        </div>

        <div style={{ background: "#fff", padding: "18px 22px", borderRadius: "14px", border: "1px solid var(--line)" }}>
          <small style={{ color: "var(--muted)", textTransform: "uppercase", fontSize: "11px", fontWeight: 700 }}>Active Flatmates</small>
          <div style={{ fontSize: "20px", fontWeight: 700, fontFamily: "Space Grotesk", color: "var(--teal)", marginTop: "4px" }}>
            4 Students
          </div>
          <span style={{ fontSize: "12px", color: "var(--muted)" }}>Priya, Aarav, Tanya, Kabir</span>
        </div>
      </div>

      {/* Settlements & UPI QR Pay Section */}
      <div style={{ marginTop: "28px", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "24px" }}>
        {/* Settlements Table */}
        <div style={{ background: "#fff", padding: "24px", borderRadius: "16px", border: "1px solid var(--line)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
            <div>
              <p className="eyebrow" style={{ margin: 0 }}>MINIMAL TRANSFERS</p>
              <h3 style={{ margin: "2px 0 0", fontSize: "18px" }}>Who Owes Whom</h3>
            </div>
            <span style={{ fontSize: "12px", background: "#edf2f7", padding: "3px 8px", borderRadius: "8px", color: "var(--muted)" }}>
              {settlements.length} Pending
            </span>
          </div>

          {settlements.length === 0 ? (
            <div style={{ textAlign: "center", padding: "30px", color: "var(--muted)" }}>
              <CheckCircle2 size={32} style={{ color: "#38a169", marginBottom: "8px" }} />
              <p style={{ margin: 0, fontWeight: 600 }}>All flatmate balances are settled!</p>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {settlements.map((s, idx) => (
                <div
                  key={idx}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "12px 14px",
                    background: "#fafbfa",
                    borderRadius: "10px",
                    border: "1px solid var(--line)",
                  }}
                >
                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "13px" }}>
                      <strong>{s.from_user}</strong>
                      <ArrowRight size={13} style={{ color: "var(--muted)" }} />
                      <strong style={{ color: "var(--teal)" }}>{s.to_user}</strong>
                    </div>
                    <small style={{ color: "var(--muted)", fontSize: "11px" }}>UPI: {s.upi_id}</small>
                  </div>

                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <span style={{ fontWeight: 700, fontSize: "15px", color: "var(--ink)" }}>
                      ₹{s.amount.toLocaleString()}
                    </span>
                    <button
                      onClick={() => setActiveQr(s)}
                      style={{
                        padding: "6px 10px",
                        borderRadius: "8px",
                        border: "1px solid #117c74",
                        background: "#e6f6f4",
                        color: "#117c74",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        gap: "4px",
                        fontSize: "12px",
                        fontWeight: 600,
                      }}
                      title="Scan UPI QR"
                    >
                      <QrCode size={13} /> Settle
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Bills Stream */}
        <div style={{ background: "#fff", padding: "24px", borderRadius: "16px", border: "1px solid var(--line)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
            <div>
              <p className="eyebrow" style={{ margin: 0 }}>EXPENSE AUDIT TRAIL</p>
              <h3 style={{ margin: "2px 0 0", fontSize: "18px" }}>Recent Shared Bills</h3>
            </div>
            <Receipt size={18} style={{ color: "var(--muted)" }} />
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "10px", maxHeight: "360px", overflowY: "auto" }}>
            {expenses.map((exp) => (
              <div
                key={exp.id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "10px 14px",
                  borderBottom: "1px solid #f0f2f0",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <span
                    style={{
                      width: "32px",
                      height: "32px",
                      borderRadius: "8px",
                      background: `${getCategoryColor(exp.category)}18`,
                      color: getCategoryColor(exp.category),
                      display: "grid",
                      placeItems: "center",
                      fontSize: "12px",
                      fontWeight: 700,
                    }}
                  >
                    {exp.category[0]}
                  </span>
                  <div>
                    <strong style={{ fontSize: "13px", display: "block" }}>{exp.title}</strong>
                    <small style={{ color: "var(--muted)", fontSize: "11px" }}>
                      Paid by {exp.paid_by} · {new Date(exp.created_at).toLocaleDateString()}
                    </small>
                  </div>
                </div>

                <div style={{ textAlign: "right" }}>
                  <div style={{ fontWeight: 700, fontSize: "14px", color: "var(--ink)" }}>
                    ₹{exp.amount.toLocaleString()}
                  </div>
                  <small style={{ color: "var(--muted)", fontSize: "10px" }}>{exp.category}</small>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Add Expense Modal */}
      {showAddModal && (
        <div className="modal-backdrop" onClick={() => setShowAddModal(false)}>
          <div
            className="profile-modal"
            style={{ width: "min(100%, 460px)" }}
            onClick={(e) => e.stopPropagation()}
          >
            <button className="modal-close" onClick={() => setShowAddModal(false)}>
              <X size={18} />
            </button>
            <div style={{ marginBottom: "18px" }}>
              <p className="eyebrow mint-text">LOG A NEW FLAT EXPENSE</p>
              <h2 style={{ margin: "2px 0 0" }}>Add Shared Bill</h2>
            </div>

            <form onSubmit={handleAddExpense} style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              <label>
                Expense Title
                <input
                  type="text"
                  placeholder="e.g. WiFi Bill, Electricity, Milk & Bread"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </label>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                <label>
                  Amount (₹ INR)
                  <input
                    type="number"
                    placeholder="1200"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    required
                    min="1"
                  />
                </label>

                <label>
                  Category
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    style={{ border: "1px solid #d5dfdb", borderRadius: "6px", padding: "10px", outline: "none" }}
                  >
                    <option value="Rent">Rent</option>
                    <option value="Electricity">Electricity</option>
                    <option value="WiFi">WiFi Internet</option>
                    <option value="Groceries">Groceries / Food</option>
                    <option value="Maid">Maid / Cook</option>
                    <option value="Repairs">Repairs & Maintenance</option>
                  </select>
                </label>
              </div>

              <label>
                Paid By
                <input
                  type="text"
                  value={paidBy}
                  onChange={(e) => setPaidBy(e.target.value)}
                  required
                />
              </label>

              <label>
                Receiver UPI ID (for settlements)
                <input
                  type="text"
                  placeholder="e.g. priya@oksbi"
                  value={upiId}
                  onChange={(e) => setUpiId(e.target.value)}
                  required
                />
              </label>

              <label>
                Split Equally Among
                <input
                  type="text"
                  value={splitWith}
                  onChange={(e) => setSplitWith(e.target.value)}
                  placeholder="Comma separated names"
                  required
                />
              </label>

              <button className="primary login-submit" type="submit" style={{ marginTop: "10px" }}>
                Record & Recalculate Splits
              </button>
            </form>
          </div>
        </div>
      )}

      {/* UPI QR Payment Modal */}
      {activeQr && (
        <div className="modal-backdrop" onClick={() => setActiveQr(null)}>
          <div
            className="profile-modal"
            style={{ width: "min(100%, 380px)", textAlign: "center" }}
            onClick={(e) => e.stopPropagation()}
          >
            <button className="modal-close" onClick={() => setActiveQr(null)}>
              <X size={18} />
            </button>

            <p className="eyebrow mint-text">1-CLICK UPI SETTLEMENT</p>
            <h3 style={{ margin: "4px 0 14px" }}>Pay {activeQr.to_user}</h3>

            <div style={{ background: "#f8fbf7", padding: "16px", borderRadius: "14px", border: "1px solid var(--line)", display: "inline-block", margin: "0 auto" }}>
              <img
                src={activeQr.qr_url}
                alt="UPI QR Code"
                style={{ width: "180px", height: "180px", display: "block", borderRadius: "8px" }}
              />
            </div>

            <div style={{ margin: "14px 0" }}>
              <div style={{ fontSize: "24px", fontWeight: 700, fontFamily: "Space Grotesk", color: "var(--ink)" }}>
                ₹{activeQr.amount.toLocaleString()}
              </div>
              <small style={{ color: "var(--muted)", display: "block", marginTop: "2px" }}>
                Scan via Google Pay, PhonePe, or Paytm
              </small>
              <code style={{ display: "inline-block", background: "#edf2f7", padding: "3px 8px", borderRadius: "6px", fontSize: "11px", marginTop: "6px" }}>
                {activeQr.upi_id}
              </code>
            </div>

            <div style={{ display: "flex", gap: "8px", justifyContent: "center" }}>
              <a
                href={activeQr.upi_link}
                className="primary"
                style={{ textDecoration: "none", padding: "9px 16px", borderRadius: "8px", fontSize: "13px", fontWeight: 600, display: "inline-flex", alignItems: "center", gap: "4px" }}
              >
                Open UPI App
              </a>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(activeQr.upi_id);
                  onNotify("UPI ID copied to clipboard!");
                }}
                style={{ padding: "9px 14px", borderRadius: "8px", border: "1px solid var(--line)", background: "#fff", cursor: "pointer", fontSize: "13px" }}
              >
                Copy ID
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
