import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Expense } from '../types';
import { computeSettlements, generateUpiUrl } from '../lib/settlement';
import QRCode from 'qrcode';
import {
  Receipt,
  PlusCircle,
  CheckCircle,
  ArrowRight,
  QrCode,
  Check,
  X,
  CreditCard,
  ExternalLink,
  DollarSign,
  TrendingUp,
} from 'lucide-react';

export const BillSplitterPage: React.FC = () => {
  const { currentUser, expenses, addExpense, toggleSettleExpense, showToast } = useApp();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [settleModalData, setSettleModalData] = useState<{
    from: string;
    to: string;
    toUpi: string;
    amount: number;
    qrUrl: string;
    deepLink: string;
  } | null>(null);

  // Form State
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState<number>(1200);
  const [paidByName, setPaidByName] = useState(currentUser.fullName);
  const [paidByUpi, setPaidByUpi] = useState(currentUser.upiId);
  const [category, setCategory] = useState<Expense['category']>('WiFi');
  const [splitWith, setSplitWith] = useState<string[]>([
    currentUser.fullName,
    'Rohan Mehra',
    'Kabir Singhania',
  ]);




  const staticFlatmates = [
    { name: 'Rohan Mehra', upi: 'rohan.mehra@okaxis' },
    { name: 'Kabir Singhania', upi: 'kabir.singh@icici' },
  ];

  const flatmateOptions = [
    { name: currentUser.fullName, upi: currentUser.upiId },
    ...staticFlatmates.filter((f) => f.name !== currentUser.fullName),
  ];

  React.useEffect(() => {
    setPaidByName(currentUser.fullName);
    setPaidByUpi(currentUser.upiId);
    const newSplit = [currentUser.fullName, ...staticFlatmates.filter((f) => f.name !== currentUser.fullName).map((f) => f.name)];
    setSplitWith(newSplit);
  }, [currentUser]);

  const upiDirectory = flatmateOptions.reduce((acc, f) => {
    acc[f.name] = f.upi;
    return acc;
  }, {} as Record<string, string>);

  const { balances, settlements } = computeSettlements(expenses, upiDirectory);


  const handleOpenSettleModal = async (s: { from: string; to: string; toUpi: string; amount: number }) => {
    const upiLink = generateUpiUrl(
      s.toUpi,
      s.to,
      s.amount,
      `RoomSync settlement to ${s.to}`
    );
    try {
      const qrDataUrl = await QRCode.toDataURL(upiLink, {
        width: 260,
        margin: 1.5,
        color: {
          dark: '#117c74',
          light: '#ffffff',
        },
      });
      setSettleModalData({
        ...s,
        qrUrl: qrDataUrl,
        deepLink: upiLink,
      });
    } catch (err) {
      console.error('Failed to generate QR:', err);
    }
  };

  const handleAddExpenseSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || amount <= 0 || splitWith.length === 0) return;

    const newExp: Expense = {
      id: `exp_${Date.now()}`,
      title: title.trim(),
      amount,
      paidByName,
      paidByUpi: upiDirectory[paidByName] || paidByUpi,
      category,
      splitWithNames: splitWith,
      settled: false,
      createdAt: new Date().toISOString(),
    };

    addExpense(newExp);
    setIsAddModalOpen(false);
    setTitle('');
    setAmount(1000);
  };

  const toggleSplitMember = (name: string) => {
    if (splitWith.includes(name)) {
      if (splitWith.length > 1) {
        setSplitWith(splitWith.filter((n) => n !== name));
      }
    } else {
      setSplitWith([...splitWith, name]);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl font-bold text-[#17222b] tracking-tight">
            Flatmate Bill Splitter & UPI Settlements
          </h1>
          <p className="text-xs text-[#5f7572] mt-1">
            Track electricity, WiFi, and cook charges. Generates instant scan-to-pay UPI QR codes for zero awkwardness.
          </p>
        </div>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#117c74] hover:bg-[#0d635c] text-white text-xs font-semibold rounded-xl transition-all shadow-xs cursor-pointer"
        >
          <PlusCircle className="w-4 h-4" />
          Add Shared Expense
        </button>
      </div>

      {/* Balances & Settlement Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {balances.map((b) => (
          <div
            key={b.name}
            className="bg-white rounded-2xl border border-[#e2ece9] p-4 shadow-2xs space-y-2"
          >
            <div className="flex items-center justify-between">
              <span className="font-heading font-bold text-sm text-[#17222b]">
                {b.name}
              </span>
              <span
                className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                  b.net > 0
                    ? 'bg-[#ecfdf5] text-[#065f46]'
                    : b.net < 0
                    ? 'bg-[#fef2f2] text-[#991b1b]'
                    : 'bg-[#f6f9f8] text-[#5f7572]'
                }`}
              >
                {b.net > 0
                  ? `Gets back ₹${b.net.toLocaleString('en-IN')}`
                  : b.net < 0
                  ? `Owes ₹${Math.abs(b.net).toLocaleString('en-IN')}`
                  : 'Settled up'}
              </span>
            </div>
            <div className="flex items-center justify-between text-xs text-[#5f7572] pt-1">
              <span>Paid: ₹{b.totalPaid.toLocaleString('en-IN')}</span>
              <span>Share: ₹{b.totalOwed.toLocaleString('en-IN')}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Optimal Debt Settlement Cards ("Who owes whom") */}
      <div className="bg-white rounded-3xl border border-[#e2ece9] p-6 shadow-2xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-heading text-base font-bold text-[#17222b]">
              Recommended Minimal Settlements
            </h3>
            <p className="text-xs text-[#5f7572]">
              Optimized algorithm minimizes transactions needed to clear all debts.
            </p>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-xl bg-[#117c74]/10 text-[#117c74]">
            {settlements.length} Transfers Needed
          </span>
        </div>

        {settlements.length === 0 ? (
          <div className="p-6 text-center text-xs text-[#10b981] bg-[#ecfdf5] rounded-2xl border border-[#a7f3d0] font-medium flex items-center justify-center gap-2">
            <CheckCircle className="w-4 h-4" /> All expenses are currently even! No pending settlements.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {settlements.map((s, idx) => (
              <div
                key={idx}
                className="p-4 bg-[#f6f9f8] rounded-2xl border border-[#e2ece9] flex items-center justify-between gap-3"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-8 h-8 rounded-full bg-white border border-[#e2ece9] flex items-center justify-center text-xs font-bold text-[#17222b]">
                    {s.from.charAt(0)}
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-[#5f7572] shrink-0" />
                  <div className="w-8 h-8 rounded-full bg-[#117c74] text-white flex items-center justify-center text-xs font-bold shrink-0">
                    {s.to.charAt(0)}
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs font-bold text-[#17222b] truncate">
                      {s.from} &rarr; {s.to}
                    </div>
                    <div className="text-[10px] text-[#5f7572] font-mono-code truncate">
                      UPI: {s.toUpi}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span className="font-heading font-bold text-sm text-[#117c74]">
                    ₹{s.amount.toLocaleString('en-IN')}
                  </span>
                  <button
                    onClick={() => handleOpenSettleModal(s)}
                    className="px-3 py-1.5 bg-[#117c74] hover:bg-[#0d635c] text-white text-xs font-semibold rounded-xl shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <QrCode className="w-3.5 h-3.5" /> Settle Up
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Expenses History List */}
      <div className="bg-white rounded-3xl border border-[#e2ece9] p-6 shadow-2xs space-y-4">
        <h3 className="font-heading text-base font-bold text-[#17222b]">
          Recent Shared Expenses ({expenses.length})
        </h3>

        <div className="divide-y divide-[#e2ece9]">
          {expenses.map((exp) => (
            <div
              key={exp.id}
              className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
            >
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-[#f6f9f8] text-[#117c74] border border-[#e2ece9]">
                    {exp.category}
                  </span>
                  <h4 className="font-heading font-semibold text-sm text-[#17222b]">
                    {exp.title}
                  </h4>
                  {exp.settled && (
                    <span className="text-[10px] font-bold text-[#10b981] bg-[#ecfdf5] px-2 py-0.5 rounded-full border border-[#a7f3d0]">
                      Settled
                    </span>
                  )}
                </div>
                <p className="text-xs text-[#5f7572] mt-1">
                  Paid by <strong className="text-[#17222b]">{exp.paidByName}</strong> • Split with{' '}
                  {exp.splitWithNames.join(', ')} (₹{Math.round(exp.amount / exp.splitWithNames.length)}/each)
                </p>
              </div>

              <div className="flex items-center gap-4">
                <span className="font-heading font-bold text-base text-[#17222b]">
                  ₹{exp.amount.toLocaleString('en-IN')}
                </span>
                <button
                  onClick={() => toggleSettleExpense(exp.id)}
                  className={`text-xs px-2.5 py-1 rounded-xl font-medium transition-colors cursor-pointer ${
                    exp.settled
                      ? 'bg-[#ecfdf5] text-[#065f46] hover:bg-[#a7f3d0]'
                      : 'bg-[#f6f9f8] text-[#5f7572] hover:bg-[#e2ece9]'
                  }`}
                >
                  {exp.settled ? 'Mark Active' : 'Mark Settled'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Settle Up UPI QR Modal */}
      {settleModalData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
          <div className="relative w-full max-w-sm bg-white rounded-3xl shadow-2xl border border-[#e2ece9] overflow-hidden text-center p-6 space-y-4">
            <button
              onClick={() => setSettleModalData(null)}
              className="absolute top-4 right-4 p-1.5 text-[#5f7572] hover:text-[#17222b] rounded-full cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <div className="inline-flex p-3 rounded-2xl bg-[#117c74]/10 text-[#117c74] mb-2">
                <QrCode className="w-6 h-6" />
              </div>
              <h3 className="font-heading text-lg font-bold text-[#17222b]">
                Scan to Settle via UPI
              </h3>
              <p className="text-xs text-[#5f7572] mt-0.5">
                Pay <strong className="text-[#17222b]">{settleModalData.to}</strong>
              </p>
            </div>

            <div className="p-3 bg-[#f6f9f8] rounded-2xl border border-[#e2ece9] inline-block mx-auto shadow-inner">
              <img
                src={settleModalData.qrUrl}
                alt="UPI Settlement QR"
                className="w-56 h-56 rounded-xl mx-auto"
              />
            </div>

            <div>
              <div className="text-2xl font-heading font-bold text-[#117c74]">
                ₹{settleModalData.amount.toLocaleString('en-IN')}
              </div>
              <div className="text-xs font-mono-code text-[#5f7572] mt-0.5">
                {settleModalData.toUpi}
              </div>
            </div>

            <div className="pt-2 space-y-2">
              <a
                href={settleModalData.deepLink}
                className="w-full py-3 px-4 bg-[#117c74] hover:bg-[#0d635c] text-white font-semibold rounded-2xl text-xs transition-all shadow-md flex items-center justify-center gap-2"
              >
                <ExternalLink className="w-4 h-4" /> Open in UPI App (GPay / PhonePe / Paytm)
              </a>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(settleModalData.deepLink);
                  showToast('UPI payment string copied to clipboard!');
                }}
                className="w-full py-2 text-xs text-[#5f7572] hover:text-[#17222b] font-medium cursor-pointer"
              >
                Copy UPI Intent String
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Shared Expense Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
          <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-[#e2ece9] overflow-hidden p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#e2ece9]">
              <h3 className="font-heading text-lg font-bold text-[#17222b]">
                Add Shared Expense
              </h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1.5 text-[#5f7572] hover:text-[#17222b] rounded-full cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddExpenseSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#5f7572] mb-1">
                  Expense Description
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. DHBVN Electricity or Blinkit Groceries"
                  className="w-full px-3.5 py-2 text-xs bg-[#f6f9f8] border border-[#e2ece9] rounded-xl text-[#17222b]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#5f7572] mb-1">
                    Amount (INR)
                  </label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={amount}
                    onChange={(e) => setAmount(Number(e.target.value))}
                    className="w-full px-3.5 py-2 text-xs bg-[#f6f9f8] border border-[#e2ece9] rounded-xl text-[#17222b]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#5f7572] mb-1">
                    Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full px-3 py-2 text-xs bg-[#f6f9f8] border border-[#e2ece9] rounded-xl text-[#17222b]"
                  >
                    <option value="Rent">Rent</option>
                    <option value="Electricity">Electricity</option>
                    <option value="WiFi">WiFi</option>
                    <option value="Groceries">Groceries</option>
                    <option value="Maid & Cook">Maid & Cook</option>
                    <option value="Water/RO">Water / RO</option>
                    <option value="Misc">Misc</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#5f7572] mb-1">
                  Paid By
                </label>
                <select
                  value={paidByName}
                  onChange={(e) => setPaidByName(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-[#f6f9f8] border border-[#e2ece9] rounded-xl text-[#17222b]"
                >
                  {flatmateOptions.map((f) => (
                    <option key={f.name} value={f.name}>
                      {f.name} ({f.upi})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#5f7572] mb-1.5">
                  Split With Flatmates
                </label>
                <div className="space-y-1.5">
                  {flatmateOptions.map((f) => {
                    const isChecked = splitWith.includes(f.name);
                    return (
                      <label
                        key={f.name}
                        onClick={() => toggleSplitMember(f.name)}
                        className={`p-2.5 rounded-xl border text-xs flex items-center justify-between cursor-pointer transition-colors ${
                          isChecked
                            ? 'bg-[#ecfdf5] border-[#a7f3d0] text-[#065f46]'
                            : 'bg-[#f6f9f8] border-[#e2ece9] text-[#5f7572]'
                        }`}
                      >
                        <span className="font-semibold">{f.name}</span>
                        <span>{isChecked ? '✓ Split Included' : 'Excluded'}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-[#5f7572] hover:bg-[#f6f9f8] rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-[#117c74] hover:bg-[#0d635c] text-white text-xs font-semibold rounded-xl shadow-xs transition-all cursor-pointer"
                >
                  Add & Recalculate
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
