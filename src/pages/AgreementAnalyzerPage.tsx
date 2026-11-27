import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { analyzeAgreementText, SAMPLE_AGREEMENTS } from '../lib/nlp';
import { analyzeAgreementWithAI, isAIConfigured, AI_MODEL } from '../lib/aiAnalyzer';
import { AgreementAnalysisResult } from '../types';
import {
  FileText,
  CheckCircle,
  Copy,
  Check,
  ShieldCheck,
  BookOpen,
  Sparkles,
  Loader2,
  Zap,
  RotateCcw,
  ListFilter,
  FileCheck2,
} from 'lucide-react';

export const AgreementAnalyzerPage: React.FC = () => {
  const { showToast } = useApp();

  const [rawText, setRawText] = useState(SAMPLE_AGREEMENTS.predatory.text);
  const [selectedSampleKey, setSelectedSampleKey] = useState<'predatory' | 'balanced' | 'mixed' | 'custom'>('predatory');
  const [copiedClauseId, setCopiedClauseId] = useState<string | null>(null);
  const [copiedAll, setCopiedAll] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [lastAnalyzedText, setLastAnalyzedText] = useState(SAMPLE_AGREEMENTS.predatory.text);

  // Initialize with synchronous rule engine so there is zero initial delay or blank UI
  const [analysis, setAnalysis] = useState<AgreementAnalysisResult>(() =>
    ({ ...analyzeAgreementText(SAMPLE_AGREEMENTS.predatory.text), engineUsed: 'regex' })
  );

  const executeAnalysis = async (textToAnalyze: string, isManualTrigger = false) => {
    const trimmed = textToAnalyze.trim();
    if (!trimmed) {
      setAnalysis({
        overallRiskScore: 0,
        riskCategory: 'Low Risk',
        clauses: [],
        summaryNote: 'No text provided to analyze. Paste contract clauses or select a sample above.',
        depositSafetyRating: 'N/A',
      });
      return;
    }

    setIsAnalyzing(true);
    try {
      const result = await analyzeAgreementWithAI(trimmed);
      setAnalysis(result);
      setLastAnalyzedText(trimmed);

      if (isManualTrigger) {
        if (result.engineUsed === 'ai') {
          showToast(`Analyzed with AI (${result.modelName || AI_MODEL})!`);
        } else {
          showToast('Analyzed with built-in Model Tenancy Act rules.');
        }
      }
    } catch (err) {
      console.error('Analysis failed:', err);
      const fallback = analyzeAgreementText(trimmed);
      setAnalysis(fallback);
      showToast('AI analysis timed out, loaded rule-based analysis.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSelectSample = (key: 'predatory' | 'balanced' | 'mixed') => {
    setSelectedSampleKey(key);
    const newText = SAMPLE_AGREEMENTS[key].text;
    setRawText(newText);
    setAnalysis({ ...analyzeAgreementText(newText), engineUsed: 'regex' });
    setLastAnalyzedText(newText);
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setRawText(e.target.value);
    setSelectedSampleKey('custom');
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedClauseId(id);
    showToast('Fair clause wording copied to clipboard!');
    setTimeout(() => setCopiedClauseId(null), 2500);
  };

  const handleCopyAllFairClauses = () => {
    const flaggedClauses = analysis.clauses.filter((c) => c.isFlagged && c.fairerSuggestion);
    if (flaggedClauses.length === 0) {
      showToast('No flagged clauses found to copy.');
      return;
    }

    const compiledText = flaggedClauses
      .map(
        (c, idx) =>
          `Proposal ${idx + 1} (${c.title}):\nExisting: "${c.originalClause}"\nProposed Replacement: "${c.fairerSuggestion}"`
      )
      .join('\n\n---\n\n');

    navigator.clipboard.writeText(compiledText);
    setCopiedAll(true);
    showToast('All fair counter-proposals copied! Ready to send to landlord.');
    setTimeout(() => setCopiedAll(false), 2500);
  };

  const getRiskMeterColor = (score: number) => {
    if (score >= 60) return '#f43f5e';
    if (score >= 30) return '#f59e0b';
    return '#10b981';
  };

  const isTextModified = rawText.trim() !== lastAnalyzedText.trim();

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Title & Engine Status Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="font-heading text-2xl font-bold text-[#222222] tracking-tight">
              Rental Agreement Risk Analyzer
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#ff385c]/10 text-[#ff385c] flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" /> Model Tenancy Act (MTA) Guard
            </span>
          </div>
          <p className="text-xs text-[#6a6a6a] mt-1">
            Detect predatory clauses, unfair 11-month lock-ins, deposit forfeiture, and unannounced inspections before signing.
          </p>
        </div>

        {/* AI Engine Status Badge */}
        <div className="flex items-center gap-2">
          {isAIConfigured ? (
            <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 border border-emerald-200/80 rounded-full text-xs font-semibold text-emerald-800 shadow-sm">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="flex items-center gap-1 font-mono-code text-[11px]">
                <Sparkles className="w-3 h-3 text-emerald-600" />
                AI: {AI_MODEL}
              </span>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 border border-amber-200 rounded-full text-xs font-semibold text-amber-800 shadow-sm">
              <Zap className="w-3.5 h-3.5 text-amber-600" />
              <span>Offline Rule-Based Mode</span>
            </div>
          )}
        </div>
      </div>
      <p className="text-[11px] text-[#6a6a6a] leading-relaxed">
        Sample contracts use built-in rules. Choosing an AI scan sends the pasted text to the configured AI service.
      </p>

      {/* Sample Contract Selector Tabs */}
      <div className="bg-white p-3 rounded-2xl border border-[#ebebeb] shadow-subtle flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-bold text-[#6a6a6a] px-2 flex items-center gap-1.5">
            <BookOpen className="w-3.5 h-3.5 text-[#ff385c]" /> Preloaded Samples:
          </span>
          <button
            onClick={() => handleSelectSample('predatory')}
            disabled={isAnalyzing}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
              selectedSampleKey === 'predatory'
                ? 'bg-[#f43f5e] text-white shadow-subtle'
                : 'bg-[#f7f7f7] text-[#6a6a6a] hover:text-[#222222]'
            }`}
          >
            Predatory DLF 3 (High Risk)
          </button>
          <button
            onClick={() => handleSelectSample('balanced')}
            disabled={isAnalyzing}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
              selectedSampleKey === 'balanced'
                ? 'bg-[#10b981] text-white shadow-subtle'
                : 'bg-[#f7f7f7] text-[#6a6a6a] hover:text-[#222222]'
            }`}
          >
            Fair Sector 23 NCU (Safe)
          </button>
          <button
            onClick={() => handleSelectSample('mixed')}
            disabled={isAnalyzing}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
              selectedSampleKey === 'mixed'
                ? 'bg-[#f59e0b] text-white shadow-subtle'
                : 'bg-[#f7f7f7] text-[#6a6a6a] hover:text-[#222222]'
            }`}
          >
            Mixed Palam Vihar (Moderate)
          </button>
          {selectedSampleKey === 'custom' && (
            <span className="px-3 py-1 bg-[#222222] text-white rounded-full text-[11px] font-semibold">
              Custom Pasted Contract
            </span>
          )}
        </div>

        {/* Scan with AI Action Button */}
        <button
          onClick={() => executeAnalysis(rawText, true)}
          disabled={isAnalyzing || !rawText.trim()}
          className={`inline-flex items-center gap-2 px-5 py-2 rounded-xl text-xs font-bold shadow-sm transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${
            isTextModified
              ? 'bg-[#ff385c] hover:bg-[#d90b3e] text-white ring-2 ring-[#ff385c]/30 animate-pulse'
              : 'bg-[#222222] hover:bg-black text-white'
          }`}
        >
          {isAnalyzing ? (
            <>
              <Loader2 className="w-3.5 h-3.5 animate-spin text-white" />
              <span>Analyzing Contract...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-3.5 h-3.5 text-white" />
              <span>
                {isAIConfigured
                  ? isTextModified ? 'Scan Changes with AI' : 'Re-scan with AI'
                  : 'Analyze with Built-in Rules'}
              </span>
            </>
          )}
        </button>
      </div>

      {/* Main Two-Column Layout: Input / Risk Dashboard */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Raw Text Input (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-3xl border border-[#ebebeb] p-5 shadow-subtle flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold uppercase tracking-wider text-[#6a6a6a] flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-[#ff385c]" />
                Contract Text / Pasted Clauses
              </label>
              <div className="flex items-center gap-3">
                {rawText !== SAMPLE_AGREEMENTS.predatory.text && (
                  <button
                    onClick={() => handleSelectSample('predatory')}
                    className="text-xs text-[#6a6a6a] hover:text-[#222222] flex items-center gap-1 cursor-pointer"
                    title="Reset to default sample"
                  >
                    <RotateCcw className="w-3 h-3" /> Reset
                  </button>
                )}
                <button
                  onClick={() => {
                    setRawText('');
                    setSelectedSampleKey('custom');
                  }}
                  className="text-xs text-[#6a6a6a] hover:text-[#f43f5e] cursor-pointer"
                >
                  Clear
                </button>
              </div>
            </div>
            <textarea
              rows={18}
              value={rawText}
              onChange={handleTextChange}
              placeholder="Paste your rental agreement clauses or terms here..."
              className="w-full p-4 text-xs font-mono-code leading-relaxed bg-[#f7f7f7] border border-[#ebebeb] rounded-2xl focus:outline-none focus:border-[#222222] focus:bg-white text-[#222222] resize-none transition-colors"
            />
          </div>

          <div className="p-3.5 bg-[#f7f7f7] rounded-xl border border-[#ebebeb] text-[11px] text-[#6a6a6a] leading-relaxed flex items-start gap-2">
            <span className="text-base leading-none">💡</span>
            <div>
              <strong>Pro Tip:</strong> Under the Model Tenancy Act, landlords cannot withhold more than reasonable actual damages from security deposits. If your lease mandates full forfeiture, paste it above to generate fair counter-clauses.
            </div>
          </div>
        </div>

        {/* Right: Analysis Results & Meter (7 cols) */}
        <div className="lg:col-span-7 space-y-5">
          {/* Top Overall Risk Meter Card */}
          <div className="bg-white rounded-3xl border border-[#ebebeb] p-6 shadow-subtle relative overflow-hidden">
            {isAnalyzing && (
              <div className="absolute inset-0 bg-white/80 backdrop-blur-xs flex flex-col items-center justify-center gap-3 z-10 transition-all">
                <div className="p-3 bg-white rounded-2xl shadow-subtle border border-[#ebebeb] flex items-center gap-3">
                  <Loader2 className="w-5 h-5 text-[#ff385c] animate-spin" />
                  <span className="text-xs font-bold text-[#222222]">
                    {isAIConfigured
                      ? 'AI is scanning clauses against tenancy guidelines...'
                      : 'Built-in rules are checking clauses against tenancy guidelines...'}
                  </span>
                </div>
              </div>
            )}

            <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
              <div className="space-y-2 text-center sm:text-left flex-1">
                <div className="flex items-center gap-2 justify-center sm:justify-start flex-wrap">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#6a6a6a]">
                    Comprehensive Clause Health
                  </span>
                  {analysis.engineUsed === 'ai' && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      <Sparkles className="w-2.5 h-2.5" /> AI Evaluated ({analysis.modelName || AI_MODEL})
                    </span>
                  )}
                  {analysis.engineUsed !== 'ai' && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-50 text-amber-800 border border-amber-200">
                      <Zap className="w-2.5 h-2.5" /> Built-in Rules
                    </span>
                  )}
                </div>

                <h2 className="font-heading text-xl font-bold text-[#222222] flex items-center gap-2 justify-center sm:justify-start">
                  {analysis.riskCategory}
                </h2>

                <p className="text-xs text-[#6a6a6a] leading-relaxed">
                  {analysis.summaryNote}
                </p>

                <div className="pt-1 text-xs">
                  <span className="text-[#6a6a6a]">Deposit Safety Rating: </span>
                  <strong className="text-[#222222]">{analysis.depositSafetyRating}</strong>
                </div>
              </div>

              {/* Circular Risk Gauge */}
              <div className="relative w-28 h-28 shrink-0 flex items-center justify-center">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                  <circle
                    cx="18"
                    cy="18"
                    r="15"
                    className="stroke-[#ebebeb]"
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
                  <span className="font-heading text-2xl font-bold text-[#222222]">
                    {analysis.overallRiskScore}
                  </span>
                  <span className="text-[9px] uppercase tracking-wider font-semibold text-[#6a6a6a]">
                    Risk Index
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Clause-by-Clause Breakdown List */}
          <div className="space-y-4">
            <div className="flex items-center justify-between gap-2 flex-wrap">
              <h3 className="font-heading text-base font-bold text-[#222222] flex items-center gap-2">
                <ListFilter className="w-4 h-4 text-[#ff385c]" />
                Identified Clauses & Recommendations ({analysis.clauses.length})
              </h3>

              {analysis.clauses.some((c) => c.isFlagged && c.fairerSuggestion) && (
                <button
                  onClick={handleCopyAllFairClauses}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-[#f7f7f7] text-[#222222] rounded-xl border border-[#ebebeb] text-xs font-semibold shadow-2xs transition-colors cursor-pointer"
                  title="Copy all suggested counter-proposals to send to landlord"
                >
                  {copiedAll ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-[#10b981]" />
                      <span className="text-[#10b981]">All Copied!</span>
                    </>
                  ) : (
                    <>
                      <FileCheck2 className="w-3.5 h-3.5 text-[#ff385c]" />
                      <span>Copy All Fair Counter-Clauses</span>
                    </>
                  )}
                </button>
              )}
            </div>

            {analysis.clauses.length === 0 ? (
              <div className="bg-white rounded-2xl border border-[#ebebeb] p-8 text-center text-xs text-[#6a6a6a] space-y-2">
                <FileText className="w-8 h-8 text-[#ebebeb] mx-auto" />
                <p>No clauses detected. Paste an agreement on the left or select a sample contract to analyze.</p>
              </div>
            ) : (
              analysis.clauses.map((clause) => (
                <div
                  key={clause.id}
                  className={`rounded-2xl border p-5 shadow-subtle space-y-3 transition-all ${
                    clause.riskLevel === 'high'
                      ? 'bg-[#fef2f2]/60 border-[#fecdd3]'
                      : clause.riskLevel === 'medium'
                      ? 'bg-[#fffbeb]/60 border-[#fde68a]'
                      : 'bg-white border-[#ebebeb]'
                  }`}
                >
                  {/* Clause Header with Risk Badge */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2 flex-wrap">
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
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-black/5 text-[#6a6a6a] uppercase">
                        {clause.clauseType}
                      </span>
                      <h4 className="font-heading font-bold text-sm text-[#222222]">
                        {clause.title}
                      </h4>
                    </div>
                  </div>

                  {/* Original Clause Excerpt */}
                  {clause.originalClause && (
                    <div className="p-3 bg-white/80 rounded-xl border border-black/5 text-xs font-mono-code text-[#222222] leading-relaxed">
                      "{clause.originalClause}"
                    </div>
                  )}

                  {/* Plain-Language Explanation */}
                  <div className="text-xs text-[#6a6a6a] leading-relaxed">
                    <strong className="text-[#222222]">Plain English Impact: </strong>
                    {clause.plainExplanation}
                  </div>

                  {/* Fairer Replacement Clause Suggestion */}
                  {clause.isFlagged && clause.fairerSuggestion && (
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
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
