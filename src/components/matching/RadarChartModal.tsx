import React from 'react';
import { UserProfile, CompatibilityResult } from '../../types';
import { useApp } from '../../context/AppContext';
import {
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Legend,
  Tooltip,
} from 'recharts';
import { X, MessageSquare, Check, Sparkles, AlertCircle, ShieldCheck } from 'lucide-react';
import { VerifiedBadge } from '../common/VerifiedBadge';

interface RadarChartModalProps {
  candidate: UserProfile | null;
  compatibility: CompatibilityResult | null;
  onClose: () => void;
}

export const RadarChartModal: React.FC<RadarChartModalProps> = ({
  candidate,
  compatibility,
  onClose,
}) => {
  const { currentUser, openChatWith, showToast } = useApp();

  if (!candidate || !compatibility) return null;

  const chartData = [
    {
      subject: 'Sleep',
      You: compatibility.vectorUser.sleep,
      Them: compatibility.vectorCandidate.sleep,
      fullMark: 100,
    },
    {
      subject: 'Cleanliness',
      You: compatibility.vectorUser.cleanliness,
      Them: compatibility.vectorCandidate.cleanliness,
      fullMark: 100,
    },
    {
      subject: 'Social Vibe',
      You: compatibility.vectorUser.social,
      Them: compatibility.vectorCandidate.social,
      fullMark: 100,
    },
    {
      subject: 'Diet/Food',
      You: compatibility.vectorUser.food,
      Them: compatibility.vectorCandidate.food,
      fullMark: 100,
    },
    {
      subject: 'Budget Align',
      You: compatibility.vectorUser.budget,
      Them: compatibility.vectorCandidate.budget,
      fullMark: 100,
    },
  ];

  const handleStartChat = () => {
    openChatWith({
      id: candidate.id,
      name: candidate.fullName,
      avatarUrl: candidate.avatarUrl,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-[#e2ece9] overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#e2ece9] bg-gradient-to-r from-[#117c74]/10 via-transparent to-[#f43f5e]/10">
          <div className="flex items-center gap-3">
            <img
              src={candidate.avatarUrl}
              alt={candidate.fullName}
              className="w-12 h-12 rounded-2xl object-cover border-2 border-white shadow-xs"
            />
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-heading text-lg font-bold text-[#17222b]">
                  {candidate.fullName}
                </h3>
                {candidate.isStudentVerified && <VerifiedBadge size="sm" />}
              </div>
              <p className="text-xs text-[#5f7572]">
                {candidate.courseYear} • {candidate.college}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-[#5f7572] hover:text-[#17222b] hover:bg-black/5 rounded-full transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Top Score Banner */}
          <div className="flex items-center justify-between p-4 bg-[#f6f9f8] rounded-2xl border border-[#e2ece9]">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-[#5f7572]">
                Overall Compatibility Index
              </span>
              <p className="text-xs text-[#5f7572] mt-0.5">
                Calculated across 5 lifestyle & financial dimensions
              </p>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-12 h-12 rounded-2xl bg-[#117c74] text-white flex items-center justify-center font-heading text-xl font-bold shadow-xs">
                {compatibility.overallScore}%
              </div>
            </div>
          </div>

          {/* Dual Overlay Radar Chart */}
          <div className="bg-white rounded-2xl p-4 border border-[#e2ece9]">
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-[#5f7572] flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#117c74]" />
                5-Dimension Compatibility Radar
              </h4>
              <div className="flex items-center gap-4 text-xs font-medium">
                <span className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-[#117c74]" />
                  You ({currentUser.fullName.split(' ')[0]})
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-[#f43f5e]" />
                  {candidate.fullName.split(' ')[0]}
                </span>
              </div>
            </div>

            <div className="w-full h-72">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="75%" data={chartData}>
                  <PolarGrid stroke="#e2ece9" />
                  <PolarAngleAxis
                    dataKey="subject"
                    tick={{ fill: '#17222b', fontSize: 12, fontWeight: 500 }}
                  />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#cbd5e1" tick={false} />
                  <Radar
                    name={`You (${currentUser.fullName.split(' ')[0]})`}
                    dataKey="You"
                    stroke="#117c74"
                    fill="#117c74"
                    fillOpacity={0.35}
                    strokeWidth={2}
                  />
                  <Radar
                    name={candidate.fullName.split(' ')[0]}
                    dataKey="Them"
                    stroke="#f43f5e"
                    fill="#f43f5e"
                    fillOpacity={0.35}
                    strokeWidth={2}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#ffffff',
                      borderRadius: '12px',
                      border: '1px solid #e2ece9',
                      fontSize: '12px',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                    }}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Match Reasons & Differences */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Green Chips */}
            <div className="p-4 bg-[#ecfdf5] border border-[#a7f3d0] rounded-2xl space-y-2">
              <div className="flex items-center gap-1.5 text-xs font-bold text-[#065f46] uppercase tracking-wider">
                <Check className="w-4 h-4 text-[#10b981]" />
                Strong Compatibility Reasons
              </div>
              <div className="space-y-1.5">
                {compatibility.reasons.map((reason, idx) => (
                  <div
                    key={idx}
                    className="text-xs text-[#065f46] bg-white/70 px-2.5 py-1.5 rounded-xl border border-[#a7f3d0]/60 leading-relaxed font-medium"
                  >
                    • {reason}
                  </div>
                ))}
              </div>
            </div>

            {/* Amber Chips */}
            <div className="p-4 bg-[#fffbeb] border border-[#fde68a] rounded-2xl space-y-2">
              <div className="flex items-center gap-1.5 text-xs font-bold text-[#92400e] uppercase tracking-wider">
                <AlertCircle className="w-4 h-4 text-[#f59e0b]" />
                Lifestyle Variances & Notes
              </div>
              <div className="space-y-1.5">
                {compatibility.differences.map((diff, idx) => (
                  <div
                    key={idx}
                    className="text-xs text-[#92400e] bg-white/70 px-2.5 py-1.5 rounded-xl border border-[#fde68a]/60 leading-relaxed font-medium"
                  >
                    • {diff}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Bio & Details */}
          <div className="p-4 bg-[#f6f9f8] rounded-2xl border border-[#e2ece9] text-xs text-[#17222b] space-y-2">
            <span className="font-semibold text-[#5f7572] uppercase tracking-wider block">
              Candidate Bio & Habits
            </span>
            <p className="leading-relaxed text-[#17222b]">{candidate.bio}</p>
            <div className="pt-2 flex flex-wrap gap-2">
              <span className="px-2.5 py-1 bg-white border border-[#e2ece9] rounded-lg">
                Budget: ₹{candidate.budgetMin.toLocaleString('en-IN')} - ₹{candidate.budgetMax.toLocaleString('en-IN')}/mo
              </span>
              <span className="px-2.5 py-1 bg-white border border-[#e2ece9] rounded-lg">
                Sleep: {candidate.sleepSchedule.replace('_', ' ')}
              </span>
              <span className="px-2.5 py-1 bg-white border border-[#e2ece9] rounded-lg">
                Diet: {candidate.foodPreference.replace('_', ' ')}
              </span>
              <span className="px-2.5 py-1 bg-white border border-[#e2ece9] rounded-lg">
                Hygiene: {candidate.cleanliness.replace('_', ' ')}
              </span>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-[#e2ece9] bg-white">
          <button
            onClick={() => {
              showToast(`Saved ${candidate.fullName} to your priority shortlist!`);
              onClose();
            }}
            className="px-4 py-2.5 text-xs font-semibold text-[#5f7572] hover:text-[#17222b] hover:bg-[#f6f9f8] rounded-xl border border-[#e2ece9] transition-colors cursor-pointer"
          >
            Save to Shortlist
          </button>
          <button
            onClick={handleStartChat}
            className="px-5 py-2.5 text-xs font-semibold text-white bg-[#117c74] hover:bg-[#0d635c] rounded-xl shadow-xs transition-all flex items-center gap-2 cursor-pointer"
          >
            <MessageSquare className="w-4 h-4" />
            Connect & Message
          </button>
        </div>
      </div>
    </div>
  );
};
