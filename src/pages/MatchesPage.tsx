import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { UserProfile, CompatibilityResult } from '../types';
import { computeCompatibility } from '../lib/scoring';
import { RadarChartModal } from '../components/matching/RadarChartModal';
import { VerifiedBadge } from '../components/common/VerifiedBadge';
import {
  Users,
  Sparkles,
  CheckCircle,
  AlertCircle,
  MessageSquare,
  Sliders,
  Compass,
  Heart,
  Moon,
  Sun,
  Utensils,
  Sparkle,
} from 'lucide-react';

export const MatchesPage: React.FC = () => {
  const { currentUser, candidates, openChatWith, showToast } = useApp();

  const [minScore, setMinScore] = useState<number>(50);
  const [selectedGender, setSelectedGender] = useState<string>('all');
  const [selectedLocality, setSelectedLocality] = useState<string>('all');

  // Modal State
  const [radarCandidate, setRadarCandidate] = useState<UserProfile | null>(null);
  const [radarCompat, setRadarCompat] = useState<CompatibilityResult | null>(null);

  // Compute live match scores for each candidate
  const evaluatedCandidates = candidates.map((cand) => {
    const result = computeCompatibility(currentUser, cand);
    return {
      candidate: cand,
      compat: result,
    };
  });

  const filtered = evaluatedCandidates.filter(({ candidate, compat }) => {
    if (compat.overallScore < minScore) return false;
    if (selectedGender !== 'all' && candidate.gender !== selectedGender) return false;
    if (
      selectedLocality !== 'all' &&
      !candidate.preferredLocalities.includes(selectedLocality)
    )
      return false;
    return true;
  });

  // Sort by highest score first
  filtered.sort((a, b) => b.compat.overallScore - a.compat.overallScore);

  const handleOpenRadar = (cand: UserProfile, comp: CompatibilityResult) => {
    setRadarCandidate(cand);
    setRadarCompat(comp);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-heading text-2xl font-bold text-[#17222b] tracking-tight">
              Smart Roommate Matching Engine
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#117c74]/10 text-[#117c74] flex items-center gap-1">
              <Sparkles className="w-3 h-3" /> 5D Vector Algorithmic
            </span>
          </div>
          <p className="text-xs text-[#5f7572] mt-1">
            Comparing your lifestyle vectors (Sleep, Cleanliness, Social, Food, Budget) with active verified flatmates.
          </p>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="bg-white p-4 rounded-2xl border border-[#e2ece9] shadow-2xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3">
          <span className="text-xs font-semibold text-[#5f7572] flex items-center gap-1">
            <Sliders className="w-3.5 h-3.5" /> Filters:
          </span>

          {/* Gender */}
          <select
            value={selectedGender}
            onChange={(e) => setSelectedGender(e.target.value)}
            className="px-3 py-1.5 text-xs bg-[#f6f9f8] border border-[#e2ece9] rounded-xl text-[#17222b] focus:outline-none focus:border-[#117c74]"
          >
            <option value="all">All Genders</option>
            <option value="male">Boys / Male</option>
            <option value="female">Girls / Female</option>
          </select>

          {/* Locality */}
          <select
            value={selectedLocality}
            onChange={(e) => setSelectedLocality(e.target.value)}
            className="px-3 py-1.5 text-xs bg-[#f6f9f8] border border-[#e2ece9] rounded-xl text-[#17222b] focus:outline-none focus:border-[#117c74]"
          >
            <option value="all">All Localities</option>
            <option value="Sector 23">Sector 23 (NCU)</option>
            <option value="DLF Phase 3">DLF Phase 3</option>
            <option value="Palam Vihar">Palam Vihar</option>
            <option value="Sushant Lok">Sushant Lok</option>
          </select>
        </div>

        {/* Min Match % Slider */}
        <div className="flex items-center gap-2 text-xs">
          <span className="text-[#5f7572]">Min Compatibility:</span>
          <span className="font-semibold text-[#117c74]">{minScore}%</span>
          <input
            type="range"
            min={40}
            max={90}
            step={5}
            value={minScore}
            onChange={(e) => setMinScore(Number(e.target.value))}
            className="accent-[#117c74] cursor-pointer w-24 sm:w-32"
          />
        </div>
      </div>

      {/* Candidates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map(({ candidate, compat }) => (
          <div
            key={candidate.id}
            className="bg-white rounded-3xl border border-[#e2ece9] p-5 shadow-2xs hover:shadow-md hover:-translate-y-1 transition-all duration-200 flex flex-col justify-between space-y-4"
          >
            {/* Card Header with Avatar & Score Ring */}
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <img
                  src={candidate.avatarUrl}
                  alt={candidate.fullName}
                  className="w-14 h-14 rounded-2xl object-cover border border-[#e2ece9] shadow-2xs"
                />
                <div>
                  <div className="flex items-center gap-1.5">
                    <h3 className="font-heading font-bold text-base text-[#17222b]">
                      {candidate.fullName}
                    </h3>
                  </div>
                  {candidate.isStudentVerified ? (
                    <div className="mt-0.5">
                      <VerifiedBadge college="Verified Student" size="sm" />
                    </div>
                  ) : (
                    <span className="text-[10px] text-[#5f7572]">General Student</span>
                  )}
                  <p className="text-[11px] text-[#5f7572] mt-0.5">
                    {candidate.courseYear}
                  </p>
                </div>
              </div>

              {/* Match Score Badge */}
              <div
                className={`flex flex-col items-center justify-center w-12 h-12 rounded-2xl font-heading font-bold text-sm shadow-2xs border ${
                  compat.overallScore >= 80
                    ? 'bg-[#ecfdf5] text-[#065f46] border-[#a7f3d0]'
                    : compat.overallScore >= 60
                    ? 'bg-[#fffbeb] text-[#92400e] border-[#fde68a]'
                    : 'bg-[#fef2f2] text-[#991b1b] border-[#fecdd3]'
                }`}
              >
                <span>{compat.overallScore}%</span>
                <span className="text-[9px] uppercase font-sans font-semibold tracking-wider -mt-1 opacity-70">
                  Match
                </span>
              </div>
            </div>

            {/* Quick Lifestyle Habits Chips */}
            <div className="flex flex-wrap gap-1.5 text-[11px]">
              <span className="px-2 py-0.5 bg-[#f6f9f8] text-[#5f7572] border border-[#e2ece9] rounded-lg">
                Budget: ₹{(candidate.budgetMin / 1000).toFixed(0)}k - ₹{(candidate.budgetMax / 1000).toFixed(0)}k
              </span>
              <span className="px-2 py-0.5 bg-[#f6f9f8] text-[#5f7572] border border-[#e2ece9] rounded-lg flex items-center gap-1">
                {candidate.sleepSchedule === 'early_bird' ? <Sun className="w-3 h-3 text-[#f59e0b]" /> : <Moon className="w-3 h-3 text-[#6366f1]" />}
                {candidate.sleepSchedule.replace('_', ' ')}
              </span>
              <span className="px-2 py-0.5 bg-[#f6f9f8] text-[#5f7572] border border-[#e2ece9] rounded-lg flex items-center gap-1">
                <Utensils className="w-3 h-3 text-[#10b981]" />
                {candidate.foodPreference.replace('_', ' ')}
              </span>
            </div>

            {/* Bio */}
            <p className="text-xs text-[#5f7572] line-clamp-2 leading-relaxed italic">
              "{candidate.bio}"
            </p>

            {/* Match Reasons (Green Chips) */}
            <div className="space-y-1.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#065f46]">
                Why you match
              </span>
              {compat.reasons.slice(0, 2).map((r, i) => (
                <div
                  key={i}
                  className="text-xs text-[#065f46] bg-[#ecfdf5] px-2.5 py-1 rounded-xl border border-[#a7f3d0] flex items-center gap-1.5"
                >
                  <CheckCircle className="w-3.5 h-3.5 text-[#10b981] shrink-0" />
                  <span className="truncate">{r}</span>
                </div>
              ))}
            </div>

            {/* Differences (Amber Chips) */}
            {compat.differences.length > 0 && (
              <div className="space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#92400e]">
                  Differences to note
                </span>
                {compat.differences.slice(0, 1).map((d, i) => (
                  <div
                    key={i}
                    className="text-xs text-[#92400e] bg-[#fffbeb] px-2.5 py-1 rounded-xl border border-[#fde68a] flex items-center gap-1.5"
                  >
                    <AlertCircle className="w-3.5 h-3.5 text-[#f59e0b] shrink-0" />
                    <span className="truncate">{d}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Actions */}
            <div className="pt-2 border-t border-[#e2ece9] flex items-center gap-2">
              <button
                onClick={() => handleOpenRadar(candidate, compat)}
                className="flex-1 py-2 px-3 bg-[#f6f9f8] hover:bg-[#e2ece9] text-[#17222b] text-xs font-semibold rounded-xl transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#117c74]" />
                Radar Chart
              </button>
              <button
                onClick={() =>
                  openChatWith({
                    id: candidate.id,
                    name: candidate.fullName,
                    avatarUrl: candidate.avatarUrl,
                  })
                }
                className="py-2 px-3.5 bg-[#117c74] hover:bg-[#0d635c] text-white text-xs font-semibold rounded-xl transition-all shadow-xs flex items-center gap-1 cursor-pointer"
                title="Message roommate candidate"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Chat</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16 bg-white rounded-2xl border border-[#e2ece9] p-6 space-y-3">
          <Users className="w-10 h-10 text-[#5f7572] mx-auto opacity-40" />
          <h3 className="font-heading font-bold text-base text-[#17222b]">
            No flatmates meet this compatibility threshold
          </h3>
          <p className="text-xs text-[#5f7572] max-w-sm mx-auto">
            Try adjusting your minimum compatibility slider or loosening locality filters to discover more students.
          </p>
        </div>
      )}

      {/* Radar Chart Modal */}
      <RadarChartModal
        candidate={radarCandidate}
        compatibility={radarCompat}
        onClose={() => {
          setRadarCandidate(null);
          setRadarCompat(null);
        }}
      />
    </div>
  );
};
