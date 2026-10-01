import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { analyzeAgreementText, SAMPLE_AGREEMENTS } from '../lib/nlp';
import {
  FileText,
  AlertTriangle,
  CheckCircle,
  Copy,
  Check,
  ShieldAlert,
  ShieldCheck,
  BookOpen,
  ArrowRight,
  Sparkles,
} from 'lucide-react';

export const AgreementAnalyzerPage: React.FC = () => {
  const { showToast } = useApp();

  const [rawText, setRawText] = useState(SAMPLE_AGREEMENTS.predatory.text);
  const [selectedSampleKey, setSelectedSampleKey] = useState<'predatory' | 'balanced' | 'mixed'>('predatory');
  const [copiedClauseId, setCopiedClauseId] = useState<string | null>(null);

  const analysis = analyzeAgreementText(rawText);

  const handleSelectSample = (key: 'predatory' | 'balanced' | 'mixed') => {
    setSelectedSampleKey(key);
    setRawText(SAMPLE_AGREEMENTS[key].text);
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedClauseId(id);
    showToast('Fair clause wording copied to clipboard!');
    setTimeout(() => setCopiedClauseId(null), 2500);
  };

  const getRiskMeterColor = (score: number) => {
    if (score >= 60) return '#f43f5e';
    if (score >= 30) return '#f59e0b';
    return '#10b981';
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-heading text-2xl font-bold text-[#17222b] tracking-tight">
              Rental Agreement Risk Analyzer
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#117c74]/10 text-[#117c74] flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" /> Model Tenancy Act (MTA) Guard
            </span>
          </div>
          <p className="text-xs text-[#5f7572] mt-1">
            Detect predatory clauses, unfair 11-month lock-ins, deposit forfeiture, and unannounced inspections before signing.
          </p>
        </div>
      </div>

      {/* Sample Contract Selector Tabs */}
      <div className="bg-white p-3 rounded-2xl border border-[#e2ece9] shadow-2xs flex flex-wrap items-center gap-2">
        <span className="text-xs font-bold text-[#5f7572] px-2 flex items-center gap-1.5">
          <BookOpen className="w-3.5 h-3.5 text-[#117c74]" /> Test Preloaded Contracts:
        </span>
        <button
          onClick={() => handleSelectSample('predatory')}
          className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
            selectedSampleKey === 'predatory'
              ? 'bg-[#f43f5e] text-white shadow-2xs'
              : 'bg-[#f6f9f8] text-[#5f7572] hover:text-[#17222b]'
          }`}
        >
          Predatory DLF 3 Contract (High Risk)
        </button>
        <button
          onClick={() => handleSelectSample('balanced')}
          className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
            selectedSampleKey === 'balanced'
              ? 'bg-[#10b981] text-white shadow-2xs'
              : 'bg-[#f6f9f8] text-[#5f7572] hover:text-[#17222b]'
          }`}
        >
          Fair Sector 23 NCU Flat Contract (Safe)
        </button>
        <button
          onClick={() => handleSelectSample('mixed')}
          className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
            selectedSampleKey === 'mixed'
              ? 'bg-[#f59e0b] text-white shadow-2xs'
              : 'bg-[#f6f9f8] text-[#5f7572] hover:text-[#17222b]'
          }`}
        >
          Mixed Palam Vihar Contract (Moderate)
        </button>
      </div>

      {/* Main Two-Column Layout: Input / Risk Dashboard */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Raw Text Input (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-3xl border border-[#e2ece9] p-5 shadow-2xs flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold uppercase tracking-wider text-[#5f7572] flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-[#117c74]" />
                Contract Text / Pasted Clauses
              </label>
              <button
                onClick={() => setRawText('')}
                className="text-xs text-[#5f7572] hover:text-[#f43f5e] cursor-pointer"
              >
                Clear
              </button>
            </div>
            <textarea
              rows={18}
              value={rawText}
              onChange={(e) => setRawText(e.target.value)}
              placeholder="Paste your rental agreement clauses here..."
              className="w-full p-4 text-xs font-mono-code leading-relaxed bg-[#f6f9f8] border border-[#e2ece9] rounded-2xl focus:outline-none focus:border-[#117c74] text-[#17222b] resize-none"
            />
          </div>

          <div className="p-3 bg-[#f6f9f8] rounded-xl border border-[#e2ece9] text-[11px] text-[#5f7572] leading-relaxed">
            💡 <strong>Pro Tip:</strong> Look closely at Clause 1 (Security Deposit) and Clause 2 (Lock-in Period). Landlords often draft these to withhold ₹20,000+ when college semesters finish.
          </div>
        </div>

        {/* Right: Analysis Results & Meter (7 cols) */}
        <div className="lg:col-span-7 space-y-5">
          {/* Top Overall Risk Meter Card */}
          <div className="bg-white rounded-3xl border border-[#e2ece9] p-6 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="space-y-1.5 text-center sm:text-left flex-1">
              <span className="text-xs font-bold uppercase tracking-wider text-[#5f7572]">
                Comprehensive Clause Health
              </span>
              <h2 className="font-heading text-xl font-bold text-[#17222b] flex items-center gap-2">
                {analysis.riskCategory}
              </h2>
              <p className="text-xs text-[#5f7572] leading-relaxed">
                {analysis.summaryNote}
              </p>
              <div className="pt-1 text-xs">
                <span className="text-[#5f7572]">Deposit Safety Rating: </span>
                <strong className="text-[#17222b]">{analysis.depositSafetyRating}</strong>
              </div>
            </div>

            {/* Circular Gauge */}
            <div className="relative w-28 h-28 shrink-0 flex items-center justify-center">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                <circle
                  cx="18"
                  cy="18"
                  r="15"
                  className="stroke-[#e2ece9]"
                  strokeWidth="3.5"
                  fill="none"
                />
                <circle
                  cx="18"
                  cy="18"
                  r="15"
                  stroke={getRiskMeterColor(analysis.overallRiskScore)}
                  strokeWidth="3.5"
                  strokeDasharray={`${analysis.overallRiskScore}, 100`}
                  strokeLinecap="round"
                  fill="none"
                  className="transition-all duration-700"
                />
              </svg>
              <div className="absolute flex flex-col items-center justify-center">
                <span className="font-heading text-2xl font-bold text-[#17222b]">
                  {analysis.overallRiskScore}
                </span>
                <span className="text-[9px] uppercase tracking-wider font-semibold text-[#5f7572]">
                  Risk Index
                </span>
              </div>
            </div>
          </div>

          {/* Clause-by-Clause Breakdown List */}
          <div className="space-y-4">
            <h3 className="font-heading text-base font-bold text-[#17222b] flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#117c74]" />
              Identified Clauses & Recommendations ({analysis.clauses.length})
            </h3>

            {analysis.clauses.map((clause) => (
              <div
                key={clause.id}
                className={`rounded-2xl border p-5 shadow-2xs space-y-3 transition-all ${
                  clause.riskLevel === 'high'
                    ? 'bg-[#fef2f2]/60 border-[#fecdd3]'
                    : clause.riskLevel === 'medium'
                    ? 'bg-[#fffbeb]/60 border-[#fde68a]'
                    : 'bg-white border-[#e2ece9]'
                }`}
              >
                {/* Clause Header with Risk Badge */}
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          clause.riskLevel === 'high'
                            ? 'bg-[#f43f5e] text-white'
                            : clause.riskLevel === 'medium'
                            ? 'bg-[#f59e0b] text-white'
                            : 'bg-[#10b981] text-white'
                        }`}
                      >
                        {clause.riskLevel} Risk
                      </span>
                      <h4 className="font-heading font-bold text-sm text-[#17222b]">
                        {clause.title}
                      </h4>
                    </div>
                  </div>
                </div>

                {/* Original Clause Excerpt */}
                <div className="p-3 bg-white/80 rounded-xl border border-black/5 text-xs font-mono-code text-[#17222b] leading-relaxed">
                  "{clause.originalClause}"
                </div>

                {/* Plain-Language Explanation */}
                <div className="text-xs text-[#5f7572] leading-relaxed">
                  <strong className="text-[#17222b]">Plain English Impact: </strong>
                  {clause.plainExplanation}
                </div>

                {/* Fairer Replacement Clause Suggestion */}
                {clause.isFlagged && (
                  <div className="p-3.5 bg-[#ecfdf5] border border-[#a7f3d0] rounded-xl space-y-2">
                    <div className="flex items-center justify-between text-xs font-bold text-[#065f46]">
                      <span className="flex items-center gap-1">
                        <CheckCircle className="w-3.5 h-3.5 text-[#10b981]" />
                        Suggested Fairer Wording (Ask Landlord to Replace):
                      </span>
                      <button
                        onClick={() => handleCopy(clause.id, clause.fairerSuggestion)}
                        className="inline-flex items-center gap-1 px-2.5 py-1 bg-white hover:bg-[#a7f3d0] text-[#065f46] rounded-lg border border-[#a7f3d0] transition-colors cursor-pointer"
                        title="Copy fairer text"
                      >
                        {copiedClauseId === clause.id ? (
                          <>
                            <Check className="w-3 h-3 text-[#10b981]" /> Copied!
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3" /> Copy
                          </>
                        )}
                      </button>
                    </div>
                    <p className="text-xs font-mono-code text-[#065f46] leading-relaxed">
                      "{clause.fairerSuggestion}"
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
