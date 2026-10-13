import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { RoommatePact, PactFlatmate } from '../types';
import { computeSHA256 } from '../lib/crypto';
import {
  Scroll,
  PlusCircle,
  CheckCircle,
  FileCheck,
  Shield,
  Hash,
  Copy,
  Printer,
  ChevronRight,
  ChevronLeft,
  Users,
  Clock,
  Sparkles,
  Calendar,
} from 'lucide-react';

export const RoommatePactPage: React.FC = () => {
  const { currentUser, pacts, addPact, signPact, showToast } = useApp();

  const [isWizardOpen, setIsWizardOpen] = useState(false);
  const [selectedPact, setSelectedPact] = useState<RoommatePact | null>(pacts[0] || null);

  // Wizard Steps (1: Flatmates & Property, 2: Quiet Hours, 3: Chores, 4: Guests & Split)
  const [step, setStep] = useState<number>(1);

  // Step 1 Form
  const [pactTitle, setPactTitle] = useState('Sector 23 Flat Living Pact');
  const [address, setAddress] = useState('Plot 412, Block C, Sector 23, Gurugram');
  const [flatmates, setFlatmates] = useState<PactFlatmate[]>([
    {
      name: currentUser.fullName,
      email: currentUser.email,
      upi: currentUser.upiId,
      phone: currentUser.phone || '+91 98112 45678',
      signed: true,
      signedAt: new Date().toLocaleString('en-IN') + ' IST',
      signatureText: currentUser.fullName,
    },
    {
      name: 'Rohan Mehra',
      email: '22csu189@ncuindia.edu',
      upi: 'rohan.mehra@okaxis',
      phone: '+91 98765 43210',
      signed: false,
    },
  ]);

  // Step 2 Form
  const [weekdayQuiet, setWeekdayQuiet] = useState('11:00 PM – 07:30 AM');
  const [weekendQuiet, setWeekendQuiet] = useState('12:30 AM – 08:30 AM');
  const [quietRules, setQuietRules] = useState(
    'Headphones required in common spaces after 11 PM. Complete silence maintained during NCU semester exam weeks.'
  );

  // Step 3 Form
  const [cleaningSchedule, setCleaningSchedule] = useState('Alternate days living area sweep/mop; maid cleans daily at 10 AM.');
  const [kitchenRules, setKitchenRules] = useState('Dishes must be washed within 30 minutes. No overnight dirty pots in sink.');
  const [garbageSchedule, setGarbageSchedule] = useState('Rotational door duty every morning before 8:30 AM.');

  // Step 4 Form
  const [guestAllowed, setGuestAllowed] = useState(true);
  const [guestNoticeHours, setGuestNoticeHours] = useState(12);
  const [depositSplitRatio, setDepositSplitRatio] = useState('50:50 equal security deposit split (refundable upon vacating)');

  // Signature Pad state for existing pact
  const [signInput, setSignInput] = useState('');
  const [isSigning, setIsSigning] = useState(false);

  const handleNextStep = () => {
    if (step < 4) setStep(step + 1);
  };

  const handlePrevStep = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleAddFlatmate = () => {
    setFlatmates([
      ...flatmates,
      {
        name: '',
        email: '',
        upi: '',
        phone: '',
        signed: false,
      },
    ]);
  };

  const handleUpdateFlatmate = (index: number, field: keyof PactFlatmate, val: any) => {
    const updated = [...flatmates];
    updated[index] = { ...updated[index], [field]: val };
    setFlatmates(updated);
  };

  const handleGeneratePact = async () => {
    const docText = `ROOMMATE CO-LIVING PACT & CODE OF HARMONY
Property Address: ${address}
Generated: ${new Date().toLocaleDateString('en-IN')}

1. FLATMATES & RENT ALLOCATION
${flatmates.map((f, i) => `${i + 1}. ${f.name} (${f.email}, UPI: ${f.upi})`).join('\n')}

2. QUIET HOURS & STUDY CONDUCT
- Weekdays: ${weekdayQuiet}
- Weekends: ${weekendQuiet}
- Conduct: ${quietRules}

3. CHORES, HYGIENE & KITCHEN ETHICS
- Cleaning: ${cleaningSchedule}
- Kitchen: ${kitchenRules}
- Waste Management: ${garbageSchedule}

4. GUESTS, VISITORS & DEPOSIT ALLOCATION
- Overnight Guests: ${guestAllowed ? `Allowed with ${guestNoticeHours}h advance courtesy notice` : 'Not permitted without prior written consent'}
- Deposit Split: ${depositSplitRatio}
- Any damage caused individually shall be paid by the responsible flatmate.

DIGITAL SIGNATURE RECORDS:
${flatmates.map((f) => `- ${f.name}: ${f.signed ? `SIGNED [${f.signedAt}]` : 'PENDING'}`).join('\n')}
`;

    const sha256 = await computeSHA256(docText);

    const newPact: RoommatePact = {
      id: `pact_${Date.now()}`,
      title: pactTitle,
      address,
      flatmates,
      quietHours: {
        weekdays: weekdayQuiet,
        weekends: weekendQuiet,
        rules: quietRules,
      },
      choreSchedule: {
        cleaning: cleaningSchedule,
        kitchen: kitchenRules,
        garbage: garbageSchedule,
        frequency: 'Daily rotation',
      },
      guestPolicy: {
        overnightAllowed: guestAllowed,
        noticeHours: guestNoticeHours,
        partyConsent: 'Mutual flatmate consent required',
      },
      depositSplit: {
        ratio: depositSplitRatio,
        damageResponsibility: 'Individual responsibility',
      },
      documentText: docText,
      sha256Hash: sha256,
      createdAt: new Date().toISOString(),
      status: flatmates.every((f) => f.signed) ? 'fully_signed' : 'partially_signed',
    };

    addPact(newPact);
    setSelectedPact(newPact);
    setIsWizardOpen(false);
    setStep(1);
  };

  const handleSignSelectedPact = () => {
    if (!selectedPact || !signInput.trim()) return;
    signPact(selectedPact.id, currentUser.fullName, signInput.trim());
    setIsSigning(false);
    setSignInput('');
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-heading text-2xl font-bold text-[#222222] tracking-tight">
              Roommate Living Pact Wizard
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#ff385c]/10 text-[#ff385c] flex items-center gap-1">
              <Hash className="w-3 h-3" /> SHA-256 Tamper Evident
            </span>
          </div>
          <p className="text-xs text-[#6a6a6a] mt-1">
            Prevent flatmate disputes before they start: Quiet hours, chore rotation, guest norms, and digital signatures.
          </p>
        </div>
        <button
          onClick={() => setIsWizardOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#222222] hover:bg-black text-white text-xs font-semibold rounded-full transition-all shadow-xs cursor-pointer"
        >
          <PlusCircle className="w-4 h-4 text-[#ff385c]" />
          <span>Create New Roommate Pact</span>
        </button>
      </div>

      {/* Main Grid: Pact Selector & Detail */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Pact List / Selector (4 cols) */}
        <div className="lg:col-span-4 space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-[#6a6a6a] block px-1">
            Active Flat Agreements ({pacts.length})
          </span>
          {pacts.map((p) => {
            const isSelected = selectedPact?.id === p.id;
            return (
              <div
                key={p.id}
                onClick={() => setSelectedPact(p)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-white border-[#222222] shadow-md ring-2 ring-[#222222]/10'
                    : 'bg-white border-[#ebebeb] hover:border-[#222222]/40 shadow-subtle'
                }`}
              >
                <div className="flex items-start justify-between">
                  <h3 className="font-heading font-bold text-sm text-[#222222] line-clamp-1">
                    {p.title}
                  </h3>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      p.status === 'fully_signed'
                        ? 'bg-[#ecfdf5] text-[#065f46]'
                        : 'bg-[#fffbeb] text-[#92400e]'
                    }`}
                  >
                    {p.status === 'fully_signed' ? 'Fully Signed' : 'Signatures Pending'}
                  </span>
                </div>
                <p className="text-xs text-[#6a6a6a] mt-1 line-clamp-1">
                  {p.address}
                </p>
                <div className="mt-3 flex items-center justify-between text-[11px] text-[#6a6a6a] pt-2 border-t border-[#ebebeb]">
                  <span className="flex items-center gap-1">
                    <Users className="w-3.5 h-3.5 text-[#ff385c]" /> {p.flatmates.length} flatmates
                  </span>
                  <span className="font-mono-code text-[10px] text-[#ff385c]">
                    #{p.sha256Hash.slice(0, 8)}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Pact View / Signature Panel (8 cols) */}
        <div className="lg:col-span-8 bg-white rounded-3xl border border-[#ebebeb] p-6 shadow-subtle space-y-6">
          {selectedPact ? (
            <>
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#ebebeb]">
                <div>
                  <h2 className="font-heading text-xl font-bold text-[#222222]">
                    {selectedPact.title}
                  </h2>
                  <p className="text-xs text-[#6a6a6a] mt-0.5">
                    Property: {selectedPact.address}
                  </p>
                </div>
                <button
                  onClick={() => window.print()}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-[#f7f7f7] hover:bg-[#ebebeb] text-[#222222] rounded-xl border border-[#ebebeb] transition-colors cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5" /> Print / Save PDF
                </button>
              </div>

              {/* SHA-256 Cryptographic Hash Pill */}
              <div className="p-4 bg-[#f7f7f7] rounded-2xl border border-[#ebebeb] space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#6a6a6a] flex items-center gap-1">
                    <Hash className="w-3.5 h-3.5 text-[#ff385c]" />
                    Cryptographic SHA-256 Tamper Evidence
                  </span>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(selectedPact.sha256Hash);
                      showToast('SHA-256 digest copied to clipboard!');
                    }}
                    className="text-[11px] text-[#ff385c] hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <Copy className="w-3 h-3" /> Copy Hash
                  </button>
                </div>
                <div className="font-mono-code text-xs text-[#222222] bg-white p-2.5 rounded-xl border border-[#ebebeb] break-all select-all">
                  {selectedPact.sha256Hash}
                </div>
                <p className="text-[10px] text-[#6a6a6a]">
                  This mathematical fingerprint changes if a single comma is altered in the agreement text. (Future expansion: anchoring to public blockchain registry).
                </p>
              </div>

              {/* Formatted Document Text Preview */}
              <div className="p-5 bg-white rounded-2xl border border-[#ebebeb] shadow-inner text-xs font-mono-code leading-relaxed text-[#222222] whitespace-pre-wrap max-h-80 overflow-y-auto">
                {selectedPact.documentText}
              </div>

              {/* Flatmate Signatures Status */}
              <div className="space-y-3">
                <span className="text-xs font-bold uppercase tracking-wider text-[#6a6a6a] block">
                  Flatmate Digital Signatures
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {selectedPact.flatmates.map((f, i) => (
                    <div
                      key={i}
                      className={`p-3.5 rounded-xl border text-xs flex items-start justify-between ${
                        f.signed
                          ? 'bg-[#ecfdf5] border-[#a7f3d0] text-[#065f46]'
                          : 'bg-[#fffbeb] border-[#fde68a] text-[#92400e]'
                      }`}
                    >
                      <div>
                        <div className="font-bold">{f.name}</div>
                        <div className="text-[10px] opacity-80 mt-0.5">{f.email}</div>
                        {f.signed ? (
                          <div className="text-[10px] text-[#10b981] font-semibold mt-1">
                            ✓ Signed on {f.signedAt}
                          </div>
                        ) : (
                          <div className="text-[10px] text-[#f59e0b] font-semibold mt-1">
                            ⏳ Signature pending
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Digital Signing Action */}
              {selectedPact.flatmates.some(
                (f) => f.name.toLowerCase() === currentUser.fullName.toLowerCase() && !f.signed
              ) && (
                <div className="p-4 bg-[#f7f7f7] rounded-2xl border border-[#ebebeb] space-y-3">
                  <span className="text-xs font-bold text-[#222222] block">
                    Sign this pact as {currentUser.fullName}:
                  </span>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={signInput}
                      onChange={(e) => setSignInput(e.target.value)}
                      placeholder={`Type "${currentUser.fullName}" to digitally sign`}
                      className="flex-1 px-3 py-2 text-xs bg-white border border-[#ebebeb] rounded-xl focus:outline-none focus:border-[#222222]"
                    />
                    <button
                      onClick={handleSignSelectedPact}
                      disabled={!signInput.trim()}
                      className="px-5 py-2 bg-[#222222] hover:bg-black text-white text-xs font-semibold rounded-full transition-all disabled:opacity-50 cursor-pointer shadow-xs"
                    >
                      Submit Signature
                    </button>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-16 text-xs text-[#6a6a6a]">
              Select a Roommate Pact or click "Create New Roommate Pact" above.
            </div>
          )}
        </div>
      </div>

      {/* 4-Step Creation Wizard Modal */}
      {isWizardOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
          <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-[#ebebeb] overflow-hidden max-h-[90vh] flex flex-col">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-[#ebebeb] flex items-center justify-between">
              <div>
                <h3 className="font-heading text-lg font-bold text-[#222222]">
                  Roommate Pact Wizard
                </h3>
                <p className="text-xs text-[#6a6a6a]">
                  Step {step} of 4: {['Flatmates & Property', 'Quiet Hours', 'Chores Schedule', 'Guests & Deposit Split'][step - 1]}
                </p>
              </div>
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4].map((s) => (
                  <div
                    key={s}
                    className={`w-6 h-1.5 rounded-full transition-all ${
                      s <= step ? 'bg-[#222222]' : 'bg-[#ebebeb]'
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-4 flex-1">
              {/* Step 1: Flatmates & Property */}
              {step === 1 && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#6a6a6a] mb-1">
                      Pact Title
                    </label>
                    <input
                      type="text"
                      value={pactTitle}
                      onChange={(e) => setPactTitle(e.target.value)}
                      placeholder="e.g. Sector 23 Flat 412 Roommate Pact"
                      className="w-full px-3.5 py-2 text-xs bg-[#f7f7f7] border border-[#ebebeb] rounded-xl text-[#222222]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#6a6a6a] mb-1">
                      Property Address
                    </label>
                    <input
                      type="text"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="e.g. Plot 412, Block C, Sector 23, Gurugram"
                      className="w-full px-3.5 py-2 text-xs bg-[#f7f7f7] border border-[#ebebeb] rounded-xl text-[#222222]"
                    />
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-semibold uppercase tracking-wider text-[#6a6a6a]">
                        Flatmate Details & Signatories
                      </label>
                      <button
                        type="button"
                        onClick={handleAddFlatmate}
                        className="text-xs text-[#ff385c] font-semibold hover:underline cursor-pointer"
                      >
                        + Add Another Flatmate
                      </button>
                    </div>

                    {flatmates.map((f, i) => (
                      <div key={i} className="p-3 bg-[#f7f7f7] rounded-2xl border border-[#ebebeb] grid grid-cols-1 sm:grid-cols-3 gap-2">
                        <input
                          type="text"
                          value={f.name}
                          onChange={(e) => handleUpdateFlatmate(i, 'name', e.target.value)}
                          placeholder="Name"
                          className="px-2.5 py-1.5 text-xs bg-white border border-[#ebebeb] rounded-lg"
                        />
                        <input
                          type="email"
                          value={f.email}
                          onChange={(e) => handleUpdateFlatmate(i, 'email', e.target.value)}
                          placeholder="Email (@ncuindia.edu)"
                          className="px-2.5 py-1.5 text-xs bg-white border border-[#ebebeb] rounded-lg"
                        />
                        <input
                          type="text"
                          value={f.upi}
                          onChange={(e) => handleUpdateFlatmate(i, 'upi', e.target.value)}
                          placeholder="UPI ID for settlements"
                          className="px-2.5 py-1.5 text-xs bg-white border border-[#ebebeb] rounded-lg"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Step 2: Quiet Hours */}
              {step === 2 && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-[#6a6a6a] mb-1">
                        Weekday Quiet Hours
                      </label>
                      <input
                        type="text"
                        value={weekdayQuiet}
                        onChange={(e) => setWeekdayQuiet(e.target.value)}
                        placeholder="e.g. 11:00 PM – 07:30 AM"
                        className="w-full px-3.5 py-2 text-xs bg-[#f7f7f7] border border-[#ebebeb] rounded-xl text-[#222222]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-[#6a6a6a] mb-1">
                        Weekend Quiet Hours
                      </label>
                      <input
                        type="text"
                        value={weekendQuiet}
                        onChange={(e) => setWeekendQuiet(e.target.value)}
                        placeholder="e.g. 12:30 AM – 08:30 AM"
                        className="w-full px-3.5 py-2 text-xs bg-[#f7f7f7] border border-[#ebebeb] rounded-xl text-[#222222]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#6a6a6a] mb-1">
                      Music, Study & Exam Protocol
                    </label>
                    <textarea
                      rows={3}
                      value={quietRules}
                      onChange={(e) => setQuietRules(e.target.value)}
                      className="w-full px-3.5 py-2 text-xs bg-[#f7f7f7] border border-[#ebebeb] rounded-xl text-[#222222]"
                    />
                  </div>
                </div>
              )}

              {/* Step 3: Chores Schedule */}
              {step === 3 && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#6a6a6a] mb-1">
                      Living Area & Bathroom Cleaning Routine
                    </label>
                    <input
                      type="text"
                      value={cleaningSchedule}
                      onChange={(e) => setCleaningSchedule(e.target.value)}
                      className="w-full px-3.5 py-2 text-xs bg-[#f7f7f7] border border-[#ebebeb] rounded-xl text-[#222222]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#6a6a6a] mb-1">
                      Kitchen & Sink Hygiene Rule
                    </label>
                    <input
                      type="text"
                      value={kitchenRules}
                      onChange={(e) => setKitchenRules(e.target.value)}
                      className="w-full px-3.5 py-2 text-xs bg-[#f7f7f7] border border-[#ebebeb] rounded-xl text-[#222222]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#6a6a6a] mb-1">
                      Garbage & Disposal Duty
                    </label>
                    <input
                      type="text"
                      value={garbageSchedule}
                      onChange={(e) => setGarbageSchedule(e.target.value)}
                      className="w-full px-3.5 py-2 text-xs bg-[#f7f7f7] border border-[#ebebeb] rounded-xl text-[#222222]"
                    />
                  </div>
                </div>
              )}

              {/* Step 4: Guests & Split */}
              {step === 4 && (
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="guestCheck"
                      checked={guestAllowed}
                      onChange={(e) => setGuestAllowed(e.target.checked)}
                      className="accent-[#ff385c]"
                    />
                    <label htmlFor="guestCheck" className="text-xs font-semibold text-[#222222] cursor-pointer">
                      Overnight guests permitted with advance notice
                    </label>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#6a6a6a] mb-1">
                      Advance Notice Required (Hours)
                    </label>
                    <input
                      type="number"
                      value={guestNoticeHours}
                      onChange={(e) => setGuestNoticeHours(Number(e.target.value))}
                      className="w-full px-3.5 py-2 text-xs bg-[#f7f7f7] border border-[#ebebeb] rounded-xl text-[#222222]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#6a6a6a] mb-1">
                      Security Deposit & Damage Refund Split
                    </label>
                    <input
                      type="text"
                      value={depositSplitRatio}
                      onChange={(e) => setDepositSplitRatio(e.target.value)}
                      className="w-full px-3.5 py-2 text-xs bg-[#f7f7f7] border border-[#ebebeb] rounded-xl text-[#222222]"
                    />
                  </div>

                  <div className="p-3 bg-[#ecfdf5] border border-[#a7f3d0] rounded-xl text-xs text-[#065f46]">
                    Final step: Once you click "Generate Pact", RoomSync will compile the complete legal document and calculate its SHA-256 cryptographic hash.
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 border-t border-[#ebebeb] flex items-center justify-between">
              <button
                type="button"
                onClick={step === 1 ? () => setIsWizardOpen(false) : handlePrevStep}
                className="px-4 py-2 text-xs font-semibold text-[#6a6a6a] hover:bg-[#f7f7f7] rounded-full cursor-pointer"
              >
                {step === 1 ? 'Cancel' : 'Back'}
              </button>

              {step < 4 ? (
                <button
                  type="button"
                  onClick={handleNextStep}
                  className="px-5 py-2.5 bg-[#222222] hover:bg-black text-white text-xs font-semibold rounded-full transition-all cursor-pointer flex items-center gap-1.5 shadow-xs"
                >
                  Continue <ChevronRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleGeneratePact}
                  className="px-6 py-2.5 bg-[#222222] hover:bg-black text-white text-xs font-semibold rounded-full shadow-xs transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <Sparkles className="w-4 h-4 text-[#ff385c]" />
                  <span>Generate & Compute SHA-256</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
