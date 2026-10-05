import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Review } from '../types';
import {
  Star,
  PlusCircle,
  CheckCircle,
  XCircle,
  Filter,
  ShieldCheck,
  Building,
  MapPin,
  Calendar,
  ThumbsUp,
  X,
  AlertTriangle,
} from 'lucide-react';
import { VerifiedBadge } from '../components/common/VerifiedBadge';

export const ReviewsPage: React.FC = () => {
  const { currentUser, reviews, addReview, showToast } = useApp();

  const [localityFilter, setLocalityFilter] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Review Form State
  const [landlordName, setLandlordName] = useState('');
  const [locality, setLocality] = useState('Sector 23');
  const [propertyAddress, setPropertyAddress] = useState('');
  const [depositReturned, setDepositReturned] = useState(true);
  const [depositComment, setDepositComment] = useState('Returned full amount within 3 business days via bank transfer.');
  const [maintenanceRating, setMaintenanceRating] = useState(4);
  const [powerWaterRating, setPowerWaterRating] = useState(5);
  const [overallRating, setOverallRating] = useState(4);
  const [reviewText, setReviewText] = useState('');

  const filteredReviews = reviews.filter((r) => {
    if (localityFilter !== 'All' && r.locality !== localityFilter) return false;
    return true;
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!landlordName.trim() || !reviewText.trim()) return;

    const newRev: Review = {
      id: `rev_${Date.now()}`,
      locality,
      propertyAddress: propertyAddress || `${locality}, Gurugram`,
      landlordName: landlordName.trim(),
      depositReturned,
      depositReturnComment: depositComment,
      maintenanceRating,
      powerWaterRating,
      overallRating,
      reviewText: reviewText.trim(),
      authorName: currentUser.fullName,
      authorCollege: currentUser.college || 'Verified College Student',
      authorVerified: currentUser.isStudentVerified,
      date: new Date().toISOString().split('T')[0],
    };

    addReview(newRev);
    setIsModalOpen(false);
    setLandlordName('');
    setReviewText('');
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-3.5 h-3.5 ${
              star <= rating ? 'text-[#f59e0b] fill-[#f59e0b]' : 'text-[#e2ece9]'
            }`}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl font-bold text-[#17222b] tracking-tight">
            Landlord & Locality Community Reviews
          </h1>
          <p className="text-xs text-[#5f7572] mt-1">
            Real student accounts of deposit return integrity, water backup, and maintenance in student zones.
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#117c74] hover:bg-[#0d635c] text-white text-xs font-semibold rounded-xl transition-all shadow-xs cursor-pointer"
        >
          <PlusCircle className="w-4 h-4" />
          Write a Landlord Review
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="bg-white p-3 rounded-2xl border border-[#e2ece9] shadow-2xs flex flex-wrap items-center gap-2">
        <span className="text-xs font-bold text-[#5f7572] px-2 flex items-center gap-1">
          <Filter className="w-3.5 h-3.5" /> Locality:
        </span>
        {['All', 'Sector 23', 'DLF Phase 3', 'Palam Vihar', 'Sushant Lok'].map((loc) => (
          <button
            key={loc}
            onClick={() => setLocalityFilter(loc)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              localityFilter === loc
                ? 'bg-[#117c74] text-white shadow-2xs'
                : 'bg-[#f6f9f8] text-[#5f7572] hover:text-[#17222b]'
            }`}
          >
            {loc}
          </button>
        ))}
      </div>

      {/* Reviews Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredReviews.map((rev) => (
          <div
            key={rev.id}
            className="bg-white rounded-3xl border border-[#e2ece9] p-6 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between space-y-4"
          >
            <div>
              {/* Header: Landlord name & Locality */}
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-heading font-bold text-base text-[#17222b]">
                      {rev.landlordName}
                    </h3>
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-[#f6f9f8] text-[#117c74] border border-[#e2ece9]">
                      {rev.locality}
                    </span>
                  </div>
                  <p className="text-xs text-[#5f7572] mt-0.5">
                    {rev.propertyAddress}
                  </p>
                </div>

                {renderStars(rev.overallRating)}
              </div>

              {/* Deposit Return Integrity Badge (Crucial Differentiator) */}
              <div
                className={`p-3 rounded-2xl border text-xs my-3 flex items-start gap-2.5 ${
                  rev.depositReturned
                    ? 'bg-[#ecfdf5] border-[#a7f3d0] text-[#065f46]'
                    : 'bg-[#fef2f2] border-[#fecdd3] text-[#991b1b]'
                }`}
              >
                {rev.depositReturned ? (
                  <CheckCircle className="w-4 h-4 text-[#10b981] shrink-0 mt-0.5" />
                ) : (
                  <XCircle className="w-4 h-4 text-[#f43f5e] shrink-0 mt-0.5" />
                )}
                <div>
                  <div className="font-bold">
                    Security Deposit Returned:{' '}
                    {rev.depositReturned ? 'YES (Honored)' : 'NO / Arbitrary Forfeiture'}
                  </div>
                  <div className="text-[11px] opacity-90 mt-0.5">
                    {rev.depositReturnComment}
                  </div>
                </div>
              </div>

              {/* Sub-ratings */}
              <div className="grid grid-cols-2 gap-2 text-xs text-[#5f7572] my-2">
                <div className="p-2 bg-[#f6f9f8] rounded-xl border border-[#e2ece9] flex items-center justify-between">
                  <span>Maintenance Fixes</span>
                  {renderStars(rev.maintenanceRating)}
                </div>
                <div className="p-2 bg-[#f6f9f8] rounded-xl border border-[#e2ece9] flex items-center justify-between">
                  <span>Power / Water Backup</span>
                  {renderStars(rev.powerWaterRating)}
                </div>
              </div>

              {/* Review Text */}
              <p className="text-xs text-[#17222b] leading-relaxed pt-2">
                "{rev.reviewText}"
              </p>
            </div>

            {/* Author Footer */}
            <div className="pt-3 border-t border-[#e2ece9] flex items-center justify-between text-xs text-[#5f7572]">
              <div className="flex items-center gap-1.5">
                <span className="font-medium text-[#17222b]">{rev.authorName}</span>
                {rev.authorVerified && <VerifiedBadge size="sm" />}
              </div>
              <span className="text-[11px]">{rev.date}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Add Review Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-[#e2ece9] overflow-hidden max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#e2ece9]">
              <h3 className="font-heading text-lg font-bold text-[#17222b]">
                Add Community Landlord Review
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 text-[#5f7572] hover:text-[#17222b] rounded-full cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#5f7572] mb-1">
                  Landlord / Building Name
                </label>
                <input
                  type="text"
                  required
                  value={landlordName}
                  onChange={(e) => setLandlordName(e.target.value)}
                  placeholder="e.g. Ramesh Chandra (Sector 23 Flat 310)"
                  className="w-full px-3.5 py-2 text-xs bg-[#f6f9f8] border border-[#e2ece9] rounded-xl text-[#17222b]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#5f7572] mb-1">
                    Locality
                  </label>
                  <select
                    value={locality}
                    onChange={(e) => setLocality(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-[#f6f9f8] border border-[#e2ece9] rounded-xl text-[#17222b]"
                  >
                    <option value="Sector 23">Sector 23 (NCU)</option>
                    <option value="DLF Phase 3">DLF Phase 3</option>
                    <option value="Palam Vihar">Palam Vihar</option>
                    <option value="Sushant Lok">Sushant Lok</option>
                    <option value="Sector 22">Sector 22</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#5f7572] mb-1">
                    Property Address / Plot
                  </label>
                  <input
                    type="text"
                    value={propertyAddress}
                    onChange={(e) => setPropertyAddress(e.target.value)}
                    placeholder="e.g. Block C, Plot 412"
                    className="w-full px-3 py-2 text-xs bg-[#f6f9f8] border border-[#e2ece9] rounded-xl text-[#17222b]"
                  />
                </div>
              </div>

              {/* Deposit Return Yes/No */}
              <div className="p-3.5 bg-[#f6f9f8] rounded-2xl border border-[#e2ece9] space-y-2">
                <label className="block text-xs font-bold text-[#17222b]">
                  Did the landlord return your security deposit fairly?
                </label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-1.5 text-xs cursor-pointer">
                    <input
                      type="radio"
                      name="depositRadio"
                      checked={depositReturned}
                      onChange={() => setDepositReturned(true)}
                      className="accent-[#10b981]"
                    />
                    <span className="font-semibold text-[#065f46]">Yes, returned without unfair cuts</span>
                  </label>
                  <label className="flex items-center gap-1.5 text-xs cursor-pointer">
                    <input
                      type="radio"
                      name="depositRadio"
                      checked={!depositReturned}
                      onChange={() => setDepositReturned(false)}
                      className="accent-[#f43f5e]"
                    />
                    <span className="font-semibold text-[#991b1b]">No / Unfairly deducted</span>
                  </label>
                </div>
                <input
                  type="text"
                  value={depositComment}
                  onChange={(e) => setDepositComment(e.target.value)}
                  placeholder="Detail deposit refund timeline or deductions..."
                  className="w-full px-3 py-1.5 text-xs bg-white border border-[#e2ece9] rounded-xl text-[#17222b]"
                />
              </div>

              {/* Star Ratings */}
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-[10px] font-semibold text-[#5f7572] uppercase mb-1">
                    Overall
                  </label>
                  <select
                    value={overallRating}
                    onChange={(e) => setOverallRating(Number(e.target.value))}
                    className="w-full px-2 py-1.5 text-xs bg-[#f6f9f8] border border-[#e2ece9] rounded-xl"
                  >
                    {[5, 4, 3, 2, 1].map((n) => (
                      <option key={n} value={n}>{n} Stars</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-semibold text-[#5f7572] uppercase mb-1">
                    Maintenance
                  </label>
                  <select
                    value={maintenanceRating}
                    onChange={(e) => setMaintenanceRating(Number(e.target.value))}
                    className="w-full px-2 py-1.5 text-xs bg-[#f6f9f8] border border-[#e2ece9] rounded-xl"
                  >
                    {[5, 4, 3, 2, 1].map((n) => (
                      <option key={n} value={n}>{n} Stars</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-semibold text-[#5f7572] uppercase mb-1">
                    Power & Water
                  </label>
                  <select
                    value={powerWaterRating}
                    onChange={(e) => setPowerWaterRating(Number(e.target.value))}
                    className="w-full px-2 py-1.5 text-xs bg-[#f6f9f8] border border-[#e2ece9] rounded-xl"
                  >
                    {[5, 4, 3, 2, 1].map((n) => (
                      <option key={n} value={n}>{n} Stars</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#5f7572] mb-1">
                  Review & Living Experience
                </label>
                <textarea
                  rows={4}
                  required
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                  placeholder="Share details regarding electricity unit charges, summer power backup, landlord visits, noise levels..."
                  className="w-full px-3.5 py-2 text-xs bg-[#f6f9f8] border border-[#e2ece9] rounded-xl text-[#17222b]"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-[#5f7572] hover:bg-[#f6f9f8] rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-[#117c74] hover:bg-[#0d635c] text-white text-xs font-semibold rounded-xl shadow-xs transition-all cursor-pointer"
                >
                  Publish Community Review
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
