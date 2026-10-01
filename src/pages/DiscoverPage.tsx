import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Listing } from '../types';
import { analyzeListingTrust } from '../lib/trust';
import {
  ShieldCheck,
  ShieldAlert,
  MapPin,
  Home,
  CheckCircle,
  Filter,
  PlusCircle,
  Eye,
  X,
  Phone,
  Calendar,
  AlertTriangle,
  Info,
} from 'lucide-react';
import { VerifiedBadge } from '../components/common/VerifiedBadge';

export const DiscoverPage: React.FC = () => {
  const { listings, addListing, openChatWith, showToast } = useApp();

  const [localityFilter, setLocalityFilter] = useState<string>('All');
  const [maxBudget, setMaxBudget] = useState<number>(25000);
  const [verifiedOnly, setVerifiedOnly] = useState<boolean>(false);
  const [selectedListingDetail, setSelectedListingDetail] = useState<Listing | null>(null);
  const [trustBreakdownListing, setTrustBreakdownListing] = useState<Listing | null>(null);

  // New Listing Form State
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newLocality, setNewLocality] = useState('Sector 23');
  const [newAddress, setNewAddress] = useState('');
  const [newRent, setNewRent] = useState(12000);
  const [newDeposit, setNewDeposit] = useState(24000);
  const [newDescription, setNewDescription] = useState('');
  const [newLandlordName, setNewLandlordName] = useState('');
  const [newContact, setNewContact] = useState('');
  const [newIsVerified, setNewIsVerified] = useState(true);

  const filteredListings = listings.filter((item) => {
    if (localityFilter !== 'All' && item.locality !== localityFilter) return false;
    if (item.rent > maxBudget) return false;
    if (verifiedOnly && !item.landlordVerified) return false;
    return true;
  });

  const handleCreateListing = (e: React.FormEvent) => {
    e.preventDefault();
    const trustResult = analyzeListingTrust(
      newRent,
      newLocality,
      newDescription,
      newIsVerified
    );

    const created: Listing = {
      id: `list_${Date.now()}`,
      ownerId: 'usr_me_001',
      title: newTitle,
      locality: newLocality,
      fullAddress: newAddress || `${newLocality}, Gurugram`,
      rent: newRent,
      deposit: newDeposit,
      bedrooms: 2,
      bathrooms: 2,
      furnishing: 'Fully Furnished',
      roomType: 'Private Room',
      amenities: ['High Speed WiFi', 'Geyser', 'RO Water', 'Inverter Backup'],
      photos: [
        'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80',
      ],
      description: newDescription,
      trustScore: trustResult.trustScore,
      trustBreakdown: trustResult.breakdown,
      landlordName: newLandlordName || 'Student Sublet',
      landlordContact: newContact || '+91 98112 45678',
      landlordVerified: newIsVerified,
      localityMedianRent: 12000,
      distanceToNCU: '1.2 km from NCU Gate',
      availableFrom: 'Immediate',
      genderPreference: 'Any',
      createdAt: new Date().toISOString(),
    };

    addListing(created);
    setIsCreateModalOpen(false);
    // Reset form
    setNewTitle('');
    setNewDescription('');
  };

  const getScoreBadgeClass = (score: number) => {
    if (score >= 80) return 'bg-[#ecfdf5] text-[#065f46] border-[#a7f3d0]';
    if (score >= 50) return 'bg-[#fffbeb] text-[#92400e] border-[#fde68a]';
    return 'bg-[#fef2f2] text-[#991b1b] border-[#fecdd3]';
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Page Title & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl font-bold text-[#17222b] tracking-tight">
            Trust-Verified Student Listings
          </h1>
          <p className="text-xs text-[#5f7572] mt-1">
            Curated student flats and rooms near The NorthCap University with transparent scam & price verification.
          </p>
        </div>
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#117c74] hover:bg-[#0d635c] text-white text-xs font-semibold rounded-xl transition-all shadow-xs cursor-pointer"
        >
          <PlusCircle className="w-4 h-4" />
          List a Room / Flat
        </button>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-[#e2ece9] shadow-2xs flex flex-wrap items-center justify-between gap-4">
        {/* Locality pills */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold text-[#5f7572] mr-1 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" /> Locality:
          </span>
          {['All', 'Sector 23', 'DLF Phase 3', 'Palam Vihar', 'Sushant Lok'].map((loc) => (
            <button
              key={loc}
              onClick={() => setLocalityFilter(loc)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                localityFilter === loc
                  ? 'bg-[#117c74] text-white shadow-2xs'
                  : 'bg-[#f6f9f8] text-[#5f7572] hover:text-[#17222b] hover:bg-[#e2ece9]'
              }`}
            >
              {loc}
            </button>
          ))}
        </div>

        {/* Budget Slider & Verified Checkbox */}
        <div className="flex items-center gap-6 text-xs">
          <div className="flex items-center gap-2">
            <span className="text-[#5f7572]">Max Rent:</span>
            <span className="font-semibold text-[#17222b]">
              ₹{maxBudget.toLocaleString('en-IN')}
            </span>
            <input
              type="range"
              min={6000}
              max={30000}
              step={1000}
              value={maxBudget}
              onChange={(e) => setMaxBudget(Number(e.target.value))}
              className="accent-[#117c74] cursor-pointer w-24 sm:w-32"
            />
          </div>

          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={verifiedOnly}
              onChange={(e) => setVerifiedOnly(e.target.checked)}
              className="accent-[#117c74] rounded-sm cursor-pointer"
            />
            <span className="text-[#17222b] font-medium">Verified Landlords Only</span>
          </label>
        </div>
      </div>

      {/* Listing Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredListings.map((listing) => (
          <div
            key={listing.id}
            className="group bg-white rounded-2xl border border-[#e2ece9] overflow-hidden shadow-2xs hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 flex flex-col"
          >
            {/* Image Preview with Badges */}
            <div className="relative h-48 w-full bg-neutral-100 overflow-hidden">
              <img
                src={listing.photos[0]}
                alt={listing.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

              {/* Trust Score Pill */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setTrustBreakdownListing(listing);
                }}
                className={`absolute top-3 left-3 px-2.5 py-1 rounded-full text-xs font-bold border shadow-xs flex items-center gap-1.5 transition-transform hover:scale-105 cursor-pointer ${getScoreBadgeClass(
                  listing.trustScore
                )}`}
                title="Click to view Trust Breakdown"
              >
                {listing.trustScore >= 80 ? (
                  <ShieldCheck className="w-3.5 h-3.5 text-[#10b981]" />
                ) : (
                  <ShieldAlert className="w-3.5 h-3.5 text-[#f43f5e]" />
                )}
                <span>Trust Score: {listing.trustScore}/100</span>
                <Info className="w-3 h-3 opacity-60" />
              </button>

              {/* Price Banner */}
              <div className="absolute bottom-3 left-3 text-white">
                <div className="text-xl font-heading font-bold">
                  ₹{listing.rent.toLocaleString('en-IN')}
                  <span className="text-xs font-normal text-white/80"> / month</span>
                </div>
                <div className="text-[11px] text-white/80 flex items-center gap-1">
                  <MapPin className="w-3 h-3" /> {listing.distanceToNCU}
                </div>
              </div>
            </div>

            {/* Content Details */}
            <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
              <div>
                <div className="flex items-center justify-between text-xs text-[#5f7572] mb-1">
                  <span className="font-semibold text-[#117c74]">{listing.locality}</span>
                  <span>{listing.roomType}</span>
                </div>

                <h3 className="font-heading font-bold text-sm text-[#17222b] line-clamp-1 group-hover:text-[#117c74] transition-colors">
                  {listing.title}
                </h3>

                <p className="text-xs text-[#5f7572] mt-1.5 line-clamp-2 leading-relaxed">
                  {listing.description}
                </p>

                {/* Amenities preview */}
                <div className="flex flex-wrap gap-1.5 mt-3">
                  {listing.amenities.slice(0, 3).map((amenity, i) => (
                    <span
                      key={i}
                      className="text-[10px] px-2 py-0.5 bg-[#f6f9f8] text-[#5f7572] border border-[#e2ece9] rounded-md"
                    >
                      {amenity}
                    </span>
                  ))}
                  {listing.amenities.length > 3 && (
                    <span className="text-[10px] px-1.5 py-0.5 text-[#5f7572]">
                      +{listing.amenities.length - 3} more
                    </span>
                  )}
                </div>
              </div>

              {/* Card Footer */}
              <div className="pt-3 border-t border-[#e2ece9] flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-[#117c74]/10 text-[#117c74] flex items-center justify-center font-bold text-xs">
                    {listing.landlordName.charAt(0)}
                  </div>
                  <div>
                    <div className="font-medium text-[#17222b] text-[11px] line-clamp-1">
                      {listing.landlordName}
                    </div>
                    {listing.landlordVerified ? (
                      <span className="text-[10px] text-[#10b981] flex items-center gap-0.5">
                        <CheckCircle className="w-2.5 h-2.5" /> ID Verified
                      </span>
                    ) : (
                      <span className="text-[10px] text-[#f59e0b]">Unverified ID</span>
                    )}
                  </div>
                </div>

                <button
                  onClick={() => setSelectedListingDetail(listing)}
                  className="px-3 py-1.5 bg-[#f6f9f8] hover:bg-[#117c74] hover:text-white text-[#17222b] rounded-xl font-medium transition-colors cursor-pointer"
                >
                  View Details
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredListings.length === 0 && (
        <div className="text-center py-16 bg-white rounded-2xl border border-[#e2ece9] p-6 space-y-3">
          <Home className="w-10 h-10 text-[#5f7572] mx-auto opacity-40" />
          <h3 className="font-heading font-bold text-base text-[#17222b]">
            No listings match your filter criteria
          </h3>
          <p className="text-xs text-[#5f7572] max-w-sm mx-auto">
            Try adjusting your maximum rent slider or select 'All' localities to view available options around NCU.
          </p>
        </div>
      )}

      {/* Trust Breakdown Panel / Modal */}
      {trustBreakdownListing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-[#e2ece9] overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#e2ece9] bg-gradient-to-r from-[#117c74]/10 to-transparent">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-[#117c74]/10 text-[#117c74]">
                  <ShieldCheck className="w-5 h-5 text-[#117c74]" />
                </div>
                <div>
                  <h3 className="font-heading text-lg font-bold text-[#17222b]">
                    Trust Score Breakdown
                  </h3>
                  <p className="text-xs text-[#5f7572]">
                    Transparent anti-fraud scoring for {trustBreakdownListing.locality}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setTrustBreakdownListing(null)}
                className="p-1.5 text-[#5f7572] hover:text-[#17222b] rounded-full cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="flex items-center justify-between p-4 bg-[#f6f9f8] rounded-2xl border border-[#e2ece9]">
                <div>
                  <div className="text-xs font-semibold uppercase tracking-wider text-[#5f7572]">
                    Overall Verified Score
                  </div>
                  <div className="text-xs text-[#5f7572] mt-0.5">
                    {trustBreakdownListing.trustScore >= 80
                      ? 'Low risk verified student property'
                      : trustBreakdownListing.trustScore >= 50
                      ? 'Moderate risk — proceed with standard checks'
                      : 'Severe fraud warnings detected'}
                  </div>
                </div>
                <div
                  className={`text-2xl font-heading font-bold px-3.5 py-1.5 rounded-2xl border ${getScoreBadgeClass(
                    trustBreakdownListing.trustScore
                  )}`}
                >
                  {trustBreakdownListing.trustScore}/100
                </div>
              </div>

              {/* Signals Checklist */}
              <div className="space-y-2.5">
                <span className="text-xs font-bold uppercase tracking-wider text-[#5f7572] block">
                  Verification Signals & Checks
                </span>
                {trustBreakdownListing.trustBreakdown.signals.map((sig, idx) => (
                  <div
                    key={idx}
                    className={`p-3 rounded-xl border text-xs flex items-start gap-2.5 ${
                      sig.passed
                        ? 'bg-[#ecfdf5] border-[#a7f3d0] text-[#065f46]'
                        : 'bg-[#fef2f2] border-[#fecdd3] text-[#991b1b]'
                    }`}
                  >
                    {sig.passed ? (
                      <CheckCircle className="w-4 h-4 text-[#10b981] shrink-0 mt-0.5" />
                    ) : (
                      <AlertTriangle className="w-4 h-4 text-[#f43f5e] shrink-0 mt-0.5" />
                    )}
                    <div>
                      <div className="font-bold">{sig.name}</div>
                      <div className="text-[11px] opacity-90 mt-0.5 leading-relaxed">
                        {sig.description}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-3 bg-[#fffbeb] border border-[#fde68a] rounded-xl text-xs text-[#92400e] leading-relaxed">
                <strong>RoomSync Safety Rule:</strong> Never transfer "advance booking tokens" or "gate pass charges" via UPI before physically visiting the flat and verifying key possession with the landlord.
              </div>
            </div>

            <div className="px-6 py-3 border-t border-[#e2ece9] bg-white flex justify-end">
              <button
                onClick={() => setTrustBreakdownListing(null)}
                className="px-4 py-2 bg-[#117c74] text-white text-xs font-semibold rounded-xl cursor-pointer"
              >
                Close Breakdown
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Listing Detail Modal */}
      {selectedListingDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
          <div className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl border border-[#e2ece9] overflow-hidden max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#e2ece9]">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold px-2.5 py-1 bg-[#117c74]/10 text-[#117c74] rounded-lg">
                  {selectedListingDetail.locality}
                </span>
                <span className="text-xs text-[#5f7572]">
                  {selectedListingDetail.roomType}
                </span>
              </div>
              <button
                onClick={() => setSelectedListingDetail(null)}
                className="p-1.5 text-[#5f7572] hover:text-[#17222b] rounded-full cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-6">
              {/* Photo Gallery preview */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 h-64 rounded-2xl overflow-hidden">
                <img
                  src={selectedListingDetail.photos[0]}
                  alt="Flat main"
                  className="w-full h-full object-cover"
                />
                {selectedListingDetail.photos[1] ? (
                  <img
                    src={selectedListingDetail.photos[1]}
                    alt="Flat interior"
                    className="w-full h-full object-cover hidden md:block"
                  />
                ) : (
                  <div className="bg-[#f6f9f8] flex items-center justify-center text-xs text-[#5f7572] hidden md:flex">
                    Photo verified by NCU Ambassador
                  </div>
                )}
              </div>

              {/* Title & Price Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#e2ece9]">
                <div>
                  <h2 className="font-heading text-xl font-bold text-[#17222b]">
                    {selectedListingDetail.title}
                  </h2>
                  <p className="text-xs text-[#5f7572] mt-1 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-[#117c74]" />
                    {selectedListingDetail.fullAddress} • {selectedListingDetail.distanceToNCU}
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-heading font-bold text-[#117c74]">
                    ₹{selectedListingDetail.rent.toLocaleString('en-IN')}
                    <span className="text-xs font-normal text-[#5f7572]"> / mo</span>
                  </div>
                  <div className="text-xs text-[#5f7572]">
                    Deposit: ₹{selectedListingDetail.deposit.toLocaleString('en-IN')}
                  </div>
                </div>
              </div>

              {/* Trust & Verification Banner */}
              <div className="flex items-center justify-between p-4 bg-[#f6f9f8] rounded-2xl border border-[#e2ece9]">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm ${getScoreBadgeClass(
                      selectedListingDetail.trustScore
                    )}`}
                  >
                    {selectedListingDetail.trustScore}
                  </div>
                  <div>
                    <div className="text-xs font-bold text-[#17222b]">
                      Verified Trust Rating
                    </div>
                    <div className="text-[11px] text-[#5f7572]">
                      Landlord ID: {selectedListingDetail.landlordVerified ? 'Verified' : 'Unverified'} • Rent within market bounds
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => {
                    const l = selectedListingDetail;
                    setSelectedListingDetail(null);
                    setTrustBreakdownListing(l);
                  }}
                  className="text-xs font-semibold text-[#117c74] hover:underline cursor-pointer"
                >
                  View Score Signals &rarr;
                </button>
              </div>

              {/* Description */}
              <div className="space-y-2 text-xs leading-relaxed text-[#17222b]">
                <span className="font-bold text-[#5f7572] uppercase tracking-wider block">
                  Property Overview
                </span>
                <p>{selectedListingDetail.description}</p>
              </div>

              {/* Amenities */}
              <div className="space-y-2">
                <span className="font-bold text-xs text-[#5f7572] uppercase tracking-wider block">
                  Included Amenities
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {selectedListingDetail.amenities.map((amenity, i) => (
                    <div
                      key={i}
                      className="p-2.5 bg-[#f6f9f8] rounded-xl border border-[#e2ece9] text-xs text-[#17222b] flex items-center gap-2"
                    >
                      <CheckCircle className="w-3.5 h-3.5 text-[#117c74]" />
                      <span>{amenity}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Landlord Contact Info */}
              <div className="p-4 bg-white rounded-2xl border border-[#e2ece9] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#117c74]/10 text-[#117c74] flex items-center justify-center font-bold">
                    {selectedListingDetail.landlordName.charAt(0)}
                  </div>
                  <div>
                    <div className="font-semibold text-xs text-[#17222b]">
                      {selectedListingDetail.landlordName}
                    </div>
                    <div className="text-xs text-[#5f7572] flex items-center gap-1 mt-0.5">
                      <Phone className="w-3 h-3" /> {selectedListingDetail.landlordContact}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      openChatWith({
                        id: selectedListingDetail.ownerId,
                        name: selectedListingDetail.landlordName,
                      });
                      setSelectedListingDetail(null);
                    }}
                    className="px-4 py-2 bg-[#117c74] hover:bg-[#0d635c] text-white text-xs font-semibold rounded-xl transition-all cursor-pointer"
                  >
                    Direct Chat
                  </button>
                  <a
                    href={`tel:${selectedListingDetail.landlordContact}`}
                    className="px-4 py-2 bg-[#f6f9f8] hover:bg-[#e2ece9] text-[#17222b] text-xs font-semibold rounded-xl transition-all"
                  >
                    Call Landlord
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Create Listing Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
          <div className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-[#e2ece9] overflow-hidden max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#e2ece9]">
              <h3 className="font-heading text-lg font-bold text-[#17222b]">
                Post a Housing Listing (NCU Pilot)
              </h3>
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="p-1.5 text-[#5f7572] hover:text-[#17222b] rounded-full cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateListing} className="p-6 overflow-y-auto space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#5f7572] mb-1">
                  Listing Title
                </label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Furnished 2BHK Room with Balcony near NCU Gate 2"
                  className="w-full px-3.5 py-2.5 text-xs bg-[#f6f9f8] border border-[#e2ece9] rounded-xl focus:outline-none focus:border-[#117c74] text-[#17222b]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#5f7572] mb-1">
                    Locality
                  </label>
                  <select
                    value={newLocality}
                    onChange={(e) => setNewLocality(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-[#f6f9f8] border border-[#e2ece9] rounded-xl focus:outline-none focus:border-[#117c74] text-[#17222b]"
                  >
                    <option value="Sector 23">Sector 23 (Campus Zone)</option>
                    <option value="DLF Phase 3">DLF Phase 3</option>
                    <option value="Palam Vihar">Palam Vihar</option>
                    <option value="Sushant Lok">Sushant Lok</option>
                    <option value="Sector 22">Sector 22</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#5f7572] mb-1">
                    Specific Address / Sector Plot
                  </label>
                  <input
                    type="text"
                    required
                    value={newAddress}
                    onChange={(e) => setNewAddress(e.target.value)}
                    placeholder="e.g. Block C, Plot 215, Sector 23"
                    className="w-full px-3 py-2 text-xs bg-[#f6f9f8] border border-[#e2ece9] rounded-xl focus:outline-none focus:border-[#117c74] text-[#17222b]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#5f7572] mb-1">
                    Monthly Rent (INR)
                  </label>
                  <input
                    type="number"
                    required
                    value={newRent}
                    onChange={(e) => setNewRent(Number(e.target.value))}
                    className="w-full px-3 py-2 text-xs bg-[#f6f9f8] border border-[#e2ece9] rounded-xl focus:outline-none focus:border-[#117c74] text-[#17222b]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#5f7572] mb-1">
                    Security Deposit (INR)
                  </label>
                  <input
                    type="number"
                    required
                    value={newDeposit}
                    onChange={(e) => setNewDeposit(Number(e.target.value))}
                    className="w-full px-3 py-2 text-xs bg-[#f6f9f8] border border-[#e2ece9] rounded-xl focus:outline-none focus:border-[#117c74] text-[#17222b]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#5f7572] mb-1">
                  Description & Student Guidelines
                </label>
                <textarea
                  rows={3}
                  required
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  placeholder="Detail room features, AC/WiFi, walking distance to NCU, etc."
                  className="w-full px-3.5 py-2 text-xs bg-[#f6f9f8] border border-[#e2ece9] rounded-xl focus:outline-none focus:border-[#117c74] text-[#17222b]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#5f7572] mb-1">
                    Landlord / Subletter Name
                  </label>
                  <input
                    type="text"
                    required
                    value={newLandlordName}
                    onChange={(e) => setNewLandlordName(e.target.value)}
                    placeholder="e.g. Ramesh Chandra"
                    className="w-full px-3 py-2 text-xs bg-[#f6f9f8] border border-[#e2ece9] rounded-xl focus:outline-none focus:border-[#117c74] text-[#17222b]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#5f7572] mb-1">
                    Phone / WhatsApp Contact
                  </label>
                  <input
                    type="text"
                    required
                    value={newContact}
                    onChange={(e) => setNewContact(e.target.value)}
                    placeholder="+91 98XXX XXXXX"
                    className="w-full px-3 py-2 text-xs bg-[#f6f9f8] border border-[#e2ece9] rounded-xl focus:outline-none focus:border-[#117c74] text-[#17222b]"
                  />
                </div>
              </div>

              <label className="flex items-center gap-2 text-xs font-medium cursor-pointer pt-2">
                <input
                  type="checkbox"
                  checked={newIsVerified}
                  onChange={(e) => setNewIsVerified(e.target.checked)}
                  className="accent-[#117c74] rounded-sm"
                />
                <span>Owner has provided Aadhaar KYC & verified utility bill</span>
              </label>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-[#5f7572] hover:bg-[#f6f9f8] rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-[#117c74] hover:bg-[#0d635c] text-white text-xs font-semibold rounded-xl shadow-xs transition-all cursor-pointer"
                >
                  Compute Trust Score & Publish
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
