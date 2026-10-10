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
  Navigation,
  ExternalLink,
  Users,
  Utensils,
  Clock,
  Sparkles,
  Layers,
  Building,
  Trash2,
} from 'lucide-react';
import { VerifiedBadge } from '../components/common/VerifiedBadge';

const LOCALITY_COORDINATES: Record<string, { lat: number; lng: number }> = {
  'Sector 23': { lat: 28.5135, lng: 77.0422 },
  'DLF Phase 3': { lat: 28.4945, lng: 77.0912 },
  'Palam Vihar': { lat: 28.5195, lng: 77.0545 },
  'Sushant Lok': { lat: 28.4682, lng: 77.0789 },
  'Sector 22': { lat: 28.5085, lng: 77.0315 },
};

export const DiscoverPage: React.FC = () => {
  const { listings, addListing, deleteListing, openChatWith, showToast } = useApp();

  const [localityFilter, setLocalityFilter] = useState<string>('All');
  const [propertyTypeFilter, setPropertyTypeFilter] = useState<string>('All');
  const [genderFilter, setGenderFilter] = useState<string>('All');
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

  // Property Details
  const [newPropertyType, setNewPropertyType] = useState<'Flat' | 'PG' | 'Independent Floor' | 'Shared Room'>('Flat');
  const [newBhkRoom, setNewBhkRoom] = useState('2BHK');
  const [newVacancies, setNewVacancies] = useState(1);
  const [newFurnishing, setNewFurnishing] = useState<'Fully Furnished' | 'Semi-Furnished' | 'Unfurnished'>('Fully Furnished');
  const [newFloorNumber, setNewFloorNumber] = useState(2);
  const [newTotalFloors, setNewTotalFloors] = useState(4);
  const [newHasLift, setNewHasLift] = useState(true);
  const [newAreaSqFt, setNewAreaSqFt] = useState(650);

  // Flatmate & House Rules
  const [newGenderAllowed, setNewGenderAllowed] = useState<'Boys' | 'Girls' | 'Any'>('Any');
  const [newFoodRules, setNewFoodRules] = useState<'Veg Only' | 'Non-Veg Allowed' | 'Jain'>('Veg Only');
  const [newOccupantsCount, setNewOccupantsCount] = useState(1);
  const [newOccupantsDetails, setNewOccupantsDetails] = useState('');
  const [newGuestPolicy, setNewGuestPolicy] = useState('Daytime only');
  const [newSmokingPolicy, setNewSmokingPolicy] = useState('No Smoking');
  const [newDrinkingPolicy, setNewDrinkingPolicy] = useState('No Alcohol');
  const [newPetsPolicy, setNewPetsPolicy] = useState('No Pets');
  const [newCurfewTime, setNewCurfewTime] = useState('No Curfew');
  const [newCookingAllowed, setNewCookingAllowed] = useState(true);
  const [newQuietHours, setNewQuietHours] = useState('11:00 PM - 7:00 AM');

  // Map Coordinates
  const [newLat, setNewLat] = useState(28.5135);
  const [newLng, setNewLng] = useState(77.0422);
  const [isLocating, setIsLocating] = useState(false);

  const handleLocalitySelect = (locality: string) => {
    setNewLocality(locality);
    const coords = LOCALITY_COORDINATES[locality];
    if (coords) {
      setNewLat(coords.lat);
      setNewLng(coords.lng);
    }
  };

  const handleGetGPSLocation = () => {
    if (!navigator.geolocation) {
      showToast('Geolocation is not supported by your browser');
      return;
    }
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setNewLat(Number(pos.coords.latitude.toFixed(4)));
        setNewLng(Number(pos.coords.longitude.toFixed(4)));
        setIsLocating(false);
        showToast('GPS coordinates captured successfully!');
      },
      (err) => {
        setIsLocating(false);
        showToast('Could not fetch GPS location: ' + err.message);
      },
      { timeout: 8000 }
    );
  };

  const filteredListings = listings.filter((item) => {
    if (localityFilter !== 'All' && item.locality !== localityFilter) return false;
    if (item.rent > maxBudget) return false;
    if (verifiedOnly && !item.landlordVerified) return false;
    if (propertyTypeFilter !== 'All' && item.propertyType && item.propertyType !== propertyTypeFilter) return false;
    if (genderFilter !== 'All' && item.genderAllowed && item.genderAllowed !== genderFilter) return false;
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

    const lat = newLat || LOCALITY_COORDINATES[newLocality]?.lat || 28.5135;
    const lng = newLng || LOCALITY_COORDINATES[newLocality]?.lng || 77.0422;

    const created: Listing = {
      id: `list_${Date.now()}`,
      ownerId: 'usr_me_001',
      title: newTitle,
      locality: newLocality,
      fullAddress: newAddress || `${newLocality}, Gurugram`,
      rent: newRent,
      deposit: newDeposit,
      bedrooms: newBhkRoom.includes('1') ? 1 : newBhkRoom.includes('2') ? 2 : newBhkRoom.includes('3') ? 3 : 2,
      bathrooms: 2,
      furnishing: newFurnishing,
      roomType: newPropertyType === 'Shared Room' ? 'Shared Room' : 'Private Room',
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
      genderPreference: newGenderAllowed,
      createdAt: new Date().toISOString(),
      // Extended Property Details
      propertyType: newPropertyType,
      bhkOrRoomType: newBhkRoom,
      totalVacancies: newVacancies,
      floorNumber: newFloorNumber,
      totalFloors: newTotalFloors,
      hasLift: newHasLift,
      areaSqFt: newAreaSqFt,
      // Flatmate & House Rules
      genderAllowed: newGenderAllowed,
      foodRules: newFoodRules,
      occupantsCount: newOccupantsCount,
      occupantsDetails: newOccupantsDetails,
      guestPolicy: newGuestPolicy,
      smokingPolicy: newSmokingPolicy,
      drinkingPolicy: newDrinkingPolicy,
      petsPolicy: newPetsPolicy,
      curfewTime: newCurfewTime,
      cookingAllowed: newCookingAllowed,
      quietHours: newQuietHours,
      // GPS Coordinates
      locationLat: lat,
      locationLng: lng,
    };

    addListing(created);
    setIsCreateModalOpen(false);
    showToast('Listing published with verified trust score!');
    // Reset form
    setNewTitle('');
    setNewDescription('');
    setNewAddress('');
    setNewOccupantsDetails('');
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
            Curated student flats, PGs, and rooms with transparent scam detection & price verification.
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
      <div className="bg-white p-4 rounded-2xl border border-[#e2ece9] shadow-2xs space-y-3">
        {/* Top Row: Locality pills, Rent Slider, Verified Checkbox */}
        <div className="flex flex-wrap items-center justify-between gap-4">
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

        {/* Secondary Row: Property Type & Gender Filters */}
        <div className="flex flex-wrap items-center gap-3 pt-2.5 border-t border-[#e2ece9] text-xs">
          <div className="flex items-center gap-1.5">
            <span className="text-[#5f7572] font-medium">Type:</span>
            <select
              value={propertyTypeFilter}
              onChange={(e) => setPropertyTypeFilter(e.target.value)}
              className="px-2.5 py-1 bg-[#f6f9f8] border border-[#e2ece9] rounded-lg text-xs text-[#17222b] focus:outline-none"
            >
              <option value="All">All Types</option>
              <option value="Flat">Flat</option>
              <option value="PG">PG</option>
              <option value="Independent Floor">Independent Floor</option>
              <option value="Shared Room">Shared Room</option>
            </select>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-[#5f7572] font-medium">Gender Allowed:</span>
            <select
              value={genderFilter}
              onChange={(e) => setGenderFilter(e.target.value)}
              className="px-2.5 py-1 bg-[#f6f9f8] border border-[#e2ece9] rounded-lg text-xs text-[#17222b] focus:outline-none"
            >
              <option value="All">Any Gender</option>
              <option value="Boys">Boys Only</option>
              <option value="Girls">Girls Only</option>
              <option value="Any">Co-ed / Any</option>
            </select>
          </div>

          {(localityFilter !== 'All' || propertyTypeFilter !== 'All' || genderFilter !== 'All' || verifiedOnly) && (
            <button
              onClick={() => {
                setLocalityFilter('All');
                setPropertyTypeFilter('All');
                setGenderFilter('All');
                setVerifiedOnly(false);
              }}
              className="text-[#117c74] hover:underline font-semibold ml-auto cursor-pointer"
            >
              Reset Filters
            </button>
          )}
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
                  <span className="font-semibold text-[#117c74] flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-[#117c74]" /> {listing.locality}
                  </span>
                  <span className="px-2 py-0.5 rounded-md bg-[#117c74]/10 text-[#117c74] text-[10px] font-semibold">
                    {listing.bhkOrRoomType || listing.roomType}
                  </span>
                </div>

                <h3 className="font-heading font-bold text-sm text-[#17222b] line-clamp-1 group-hover:text-[#117c74] transition-colors">
                  {listing.title}
                </h3>

                <p className="text-xs text-[#5f7572] mt-1.5 line-clamp-2 leading-relaxed">
                  {listing.description}
                </p>

                {/* Property Spec Tags */}
                <div className="flex flex-wrap gap-1.5 mt-2.5">
                  {listing.propertyType && (
                    <span className="text-[10px] px-2 py-0.5 bg-[#f6f9f8] text-[#17222b] font-medium border border-[#e2ece9] rounded-md">
                      {listing.propertyType}
                    </span>
                  )}
                  {listing.totalVacancies !== undefined && (
                    <span className="text-[10px] px-2 py-0.5 bg-emerald-50 text-emerald-700 font-semibold border border-emerald-200 rounded-md">
                      {listing.totalVacancies} Vacanc{listing.totalVacancies > 1 ? 'ies' : 'y'}
                    </span>
                  )}
                  {listing.genderAllowed && (
                    <span className="text-[10px] px-2 py-0.5 bg-blue-50 text-blue-700 font-medium border border-blue-200 rounded-md">
                      {listing.genderAllowed}
                    </span>
                  )}
                  {listing.floorNumber !== undefined && (
                    <span className="text-[10px] px-2 py-0.5 bg-slate-50 text-slate-600 border border-slate-200 rounded-md">
                      Fl {listing.floorNumber}/{listing.totalFloors || '?'} {listing.hasLift ? '• Lift' : ''}
                    </span>
                  )}
                  {listing.areaSqFt && (
                    <span className="text-[10px] px-2 py-0.5 bg-slate-50 text-slate-600 border border-slate-200 rounded-md">
                      {listing.areaSqFt} sq ft
                    </span>
                  )}
                </div>

                {/* Amenities preview */}
                <div className="flex flex-wrap gap-1.5 mt-2.5">
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

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => setSelectedListingDetail(listing)}
                    className="px-3 py-1.5 bg-[#f6f9f8] hover:bg-[#117c74] hover:text-white text-[#17222b] rounded-xl font-medium transition-colors cursor-pointer"
                  >
                    View Details
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (window.confirm(`Are you sure you want to remove "${listing.title}"?`)) {
                        deleteListing(listing.id);
                      }
                    }}
                    className="p-1.5 text-[#5f7572] hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors cursor-pointer"
                    title="Remove listing"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredListings.length === 0 && (
        <div className="text-center py-16 bg-white rounded-2xl border border-[#e2ece9] p-8 space-y-4 max-w-lg mx-auto">
          <div className="w-14 h-14 bg-[#117c74]/10 rounded-2xl flex items-center justify-center mx-auto text-[#117c74]">
            <Home className="w-7 h-7" />
          </div>
          <div>
            <h3 className="font-heading font-bold text-base text-[#17222b]">
              {listings.length === 0 ? 'No Housing Listings Yet' : 'No listings match your filter criteria'}
            </h3>
            <p className="text-xs text-[#5f7572] mt-1.5 leading-relaxed">
              {listings.length === 0
                ? 'All dummy mock listings have been removed. Post a verified room, flat, or PG near the NCU campus to get started!'
                : 'Try adjusting your filters, property type, or maximum rent slider to view available housing options.'}
            </p>
          </div>
          {listings.length === 0 && (
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#117c74] hover:bg-[#0d635c] text-white text-xs font-semibold rounded-xl shadow-xs transition-all cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" />
              Post a Room / Flat
            </button>
          )}
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
                    Photo verified by Student Ambassador
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

              {/* Property Architecture & Space Grid */}
              <div className="space-y-2">
                <span className="font-bold text-xs text-[#5f7572] uppercase tracking-wider flex items-center gap-1.5">
                  <Building className="w-3.5 h-3.5 text-[#117c74]" /> Property Details & Architecture
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-xs">
                  <div className="p-3 bg-[#f6f9f8] rounded-xl border border-[#e2ece9]">
                    <span className="text-[10px] text-[#5f7572] block">Property Type</span>
                    <span className="font-semibold text-[#17222b]">
                      {selectedListingDetail.propertyType || 'Apartment / Flat'}
                    </span>
                  </div>
                  <div className="p-3 bg-[#f6f9f8] rounded-xl border border-[#e2ece9]">
                    <span className="text-[10px] text-[#5f7572] block">BHK / Room Layout</span>
                    <span className="font-semibold text-[#17222b]">
                      {selectedListingDetail.bhkOrRoomType || selectedListingDetail.roomType}
                    </span>
                  </div>
                  <div className="p-3 bg-[#f6f9f8] rounded-xl border border-[#e2ece9]">
                    <span className="text-[10px] text-[#5f7572] block">Open Vacancies</span>
                    <span className="font-semibold text-emerald-700">
                      {selectedListingDetail.totalVacancies ?? 1} Bed / Room Open
                    </span>
                  </div>
                  <div className="p-3 bg-[#f6f9f8] rounded-xl border border-[#e2ece9]">
                    <span className="text-[10px] text-[#5f7572] block">Furnishing Level</span>
                    <span className="font-semibold text-[#17222b]">
                      {selectedListingDetail.furnishing}
                    </span>
                  </div>
                  <div className="p-3 bg-[#f6f9f8] rounded-xl border border-[#e2ece9]">
                    <span className="text-[10px] text-[#5f7572] block">Floor Details</span>
                    <span className="font-semibold text-[#17222b]">
                      Floor {selectedListingDetail.floorNumber ?? 1} of {selectedListingDetail.totalFloors ?? 4}
                      {selectedListingDetail.hasLift ? ' • Lift' : ' • No Lift'}
                    </span>
                  </div>
                  <div className="p-3 bg-[#f6f9f8] rounded-xl border border-[#e2ece9]">
                    <span className="text-[10px] text-[#5f7572] block">Area (Sq Ft)</span>
                    <span className="font-semibold text-[#17222b]">
                      {selectedListingDetail.areaSqFt ? `${selectedListingDetail.areaSqFt} sq ft` : 'Spacious Layout'}
                      {selectedListingDetail.areaSqFt ? ` (₹${Math.round(selectedListingDetail.rent / selectedListingDetail.areaSqFt)}/sqft)` : ''}
                    </span>
                  </div>
                </div>
              </div>

              {/* Flatmate Matching & House Rules */}
              <div className="space-y-2">
                <span className="font-bold text-xs text-[#5f7572] uppercase tracking-wider flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-[#117c74]" /> Flatmate Preferences & House Rules
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-xs">
                  <div className="p-3 bg-[#f6f9f8] rounded-xl border border-[#e2ece9]">
                    <span className="text-[10px] text-[#5f7572] block">Gender Allowed</span>
                    <span className="font-semibold text-[#17222b]">
                      {selectedListingDetail.genderAllowed || selectedListingDetail.genderPreference || 'Any'}
                    </span>
                  </div>
                  <div className="p-3 bg-[#f6f9f8] rounded-xl border border-[#e2ece9]">
                    <span className="text-[10px] text-[#5f7572] block">Food Policy</span>
                    <span className="font-semibold text-[#17222b]">
                      {selectedListingDetail.foodRules || 'Veg Only'}
                    </span>
                  </div>
                  <div className="p-3 bg-[#f6f9f8] rounded-xl border border-[#e2ece9]">
                    <span className="text-[10px] text-[#5f7572] block">Curfew / Gate Closing</span>
                    <span className="font-semibold text-[#17222b]">
                      {selectedListingDetail.curfewTime || 'No Curfew'}
                    </span>
                  </div>
                  <div className="p-3 bg-[#f6f9f8] rounded-xl border border-[#e2ece9]">
                    <span className="text-[10px] text-[#5f7572] block">Kitchen Access</span>
                    <span className="font-semibold text-[#17222b]">
                      {selectedListingDetail.cookingAllowed !== false ? 'Cooking Permitted' : 'No Self Cooking'}
                    </span>
                  </div>
                  <div className="p-3 bg-[#f6f9f8] rounded-xl border border-[#e2ece9]">
                    <span className="text-[10px] text-[#5f7572] block">Guests & Visitors</span>
                    <span className="font-semibold text-[#17222b]">
                      {selectedListingDetail.guestPolicy || 'Daytime allowed'}
                    </span>
                  </div>
                  <div className="p-3 bg-[#f6f9f8] rounded-xl border border-[#e2ece9]">
                    <span className="text-[10px] text-[#5f7572] block">Quiet Hours</span>
                    <span className="font-semibold text-[#17222b]">
                      {selectedListingDetail.quietHours || '11:00 PM - 7:00 AM'}
                    </span>
                  </div>
                  <div className="p-3 bg-[#f6f9f8] rounded-xl border border-[#e2ece9]">
                    <span className="text-[10px] text-[#5f7572] block">Smoking Policy</span>
                    <span className="font-semibold text-[#17222b]">
                      {selectedListingDetail.smokingPolicy || 'No Smoking'}
                    </span>
                  </div>
                  <div className="p-3 bg-[#f6f9f8] rounded-xl border border-[#e2ece9]">
                    <span className="text-[10px] text-[#5f7572] block">Alcohol Policy</span>
                    <span className="font-semibold text-[#17222b]">
                      {selectedListingDetail.drinkingPolicy || 'No Alcohol'}
                    </span>
                  </div>
                  <div className="p-3 bg-[#f6f9f8] rounded-xl border border-[#e2ece9]">
                    <span className="text-[10px] text-[#5f7572] block">Pets Policy</span>
                    <span className="font-semibold text-[#17222b]">
                      {selectedListingDetail.petsPolicy || 'No Pets'}
                    </span>
                  </div>
                </div>

                {/* Current Occupants note */}
                {(selectedListingDetail.occupantsCount !== undefined || selectedListingDetail.occupantsDetails) && (
                  <div className="p-3 bg-blue-50/60 border border-blue-200/70 rounded-xl text-xs text-blue-900 flex items-start gap-2">
                    <Users className="w-4 h-4 text-blue-700 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-semibold">Current Occupants: </span>
                      <span>
                        {selectedListingDetail.occupantsCount ?? 1} currently residing here
                        {selectedListingDetail.occupantsDetails ? ` • ${selectedListingDetail.occupantsDetails}` : ''}
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Exact Map Pin Coordinates Card */}
              <div className="p-4 bg-[#f6f9f8] rounded-2xl border border-[#e2ece9] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div>
                  <div className="font-bold text-[#17222b] flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 text-[#117c74]" />
                    <span>Exact Map Pin Coordinates</span>
                  </div>
                  <div className="text-[11px] text-[#5f7572] mt-0.5 font-mono">
                    Lat: {selectedListingDetail.locationLat ?? 28.5135}° N • Lng: {selectedListingDetail.locationLng ?? 77.0422}° E
                  </div>
                  <div className="text-[11px] text-[#5f7572]">
                    Locality: {selectedListingDetail.locality} ({selectedListingDetail.distanceToNCU})
                  </div>
                </div>

                <a
                  href={`https://www.google.com/maps?q=${selectedListingDetail.locationLat ?? 28.5135},${selectedListingDetail.locationLng ?? 77.0422}`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-white hover:bg-[#117c74] hover:text-white text-[#17222b] font-semibold rounded-xl border border-[#e2ece9] transition-colors cursor-pointer shrink-0"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Open in Google Maps</span>
                </a>
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
                      if (window.confirm(`Are you sure you want to remove "${selectedListingDetail.title}"?`)) {
                        deleteListing(selectedListingDetail.id);
                        setSelectedListingDetail(null);
                      }
                    }}
                    className="px-3.5 py-2 bg-red-50 hover:bg-red-100 text-red-600 text-xs font-semibold rounded-xl transition-all cursor-pointer flex items-center gap-1.5"
                    title="Remove this listing"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Remove</span>
                  </button>
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
          <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-[#e2ece9] overflow-hidden max-h-[92vh] flex flex-col">
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#e2ece9] bg-gradient-to-r from-[#117c74]/10 to-transparent">
              <div>
                <h3 className="font-heading text-lg font-bold text-[#17222b]">
                  Post a Housing Listing (NCU Pilot)
                </h3>
                <p className="text-xs text-[#5f7572]">
                  Add verified property details, house rules, and GPS pin coordinates for student matching.
                </p>
              </div>
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="p-1.5 text-[#5f7572] hover:text-[#17222b] rounded-full cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateListing} className="p-6 overflow-y-auto space-y-6">
              {/* SECTION 1: BASIC INFORMATION & PRICING */}
              <div className="space-y-3.5">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#117c74] border-b border-[#e2ece9] pb-1.5">
                  <Home className="w-4 h-4 text-[#117c74]" />
                  <span>1. Basic Details & Pricing</span>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#5f7572] mb-1">
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
                    <label className="block text-xs font-semibold text-[#5f7572] mb-1">
                      Locality
                    </label>
                    <select
                      value={newLocality}
                      onChange={(e) => handleLocalitySelect(e.target.value)}
                      className="w-full px-3 py-2 text-xs bg-[#f6f9f8] border border-[#e2ece9] rounded-xl focus:outline-none focus:border-[#117c74] text-[#17222b]"
                    >
                      <option value="Sector 23">Sector 23 (Campus Zone)</option>
                      <option value="DLF Phase 3">DLF Phase 3</option>
                      <option value="Palam Vihar">Palam Vihar</option>
                      <option value="Sushant Lok">Sushant Lok</option>
                      <option value="Sector 22">Sector 22 (Near Gate 1)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#5f7572] mb-1">
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
                    <label className="block text-xs font-semibold text-[#5f7572] mb-1">
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
                    <label className="block text-xs font-semibold text-[#5f7572] mb-1">
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
                  <label className="block text-xs font-semibold text-[#5f7572] mb-1">
                    Detail room features, AC/WiFi, walking distance to campus, etc.
                  </label>
                  <textarea
                    rows={3}
                    required
                    value={newDescription}
                    onChange={(e) => setNewDescription(e.target.value)}
                    placeholder="Detail room features, AC/WiFi, walking distance to campus, study desks, power backup, etc."
                    className="w-full px-3.5 py-2 text-xs bg-[#f6f9f8] border border-[#e2ece9] rounded-xl focus:outline-none focus:border-[#117c74] text-[#17222b]"
                  />
                </div>
              </div>

              {/* SECTION 2: PROPERTY DETAILS (FOR SEARCH FILTERS) */}
              <div className="space-y-3.5 pt-2">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#117c74] border-b border-[#e2ece9] pb-1.5">
                  <Building className="w-4 h-4 text-[#117c74]" />
                  <span>2. Property Details & Space (Search Filters)</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-[#5f7572] mb-1">
                      ★ Property Type
                    </label>
                    <select
                      value={newPropertyType}
                      onChange={(e) => setNewPropertyType(e.target.value as any)}
                      className="w-full px-3 py-2 text-xs bg-[#f6f9f8] border border-[#e2ece9] rounded-xl focus:outline-none focus:border-[#117c74] text-[#17222b]"
                    >
                      <option value="Flat">Flat</option>
                      <option value="PG">PG</option>
                      <option value="Independent Floor">Independent Floor</option>
                      <option value="Shared Room">Shared Room</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#5f7572] mb-1">
                      ★ BHK or Room Type
                    </label>
                    <select
                      value={newBhkRoom}
                      onChange={(e) => setNewBhkRoom(e.target.value)}
                      className="w-full px-3 py-2 text-xs bg-[#f6f9f8] border border-[#e2ece9] rounded-xl focus:outline-none focus:border-[#117c74] text-[#17222b]"
                    >
                      <option value="1RK">1RK Studio</option>
                      <option value="1BHK">1BHK</option>
                      <option value="2BHK">2BHK</option>
                      <option value="3BHK">3BHK</option>
                      <option value="Single Sharing">Single Sharing Room</option>
                      <option value="Double Sharing">Double Sharing Room</option>
                      <option value="Triple Sharing">Triple Sharing Room</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#5f7572] mb-1">
                      ★ Total Vacancies Open
                    </label>
                    <input
                      type="number"
                      min={1}
                      max={10}
                      required
                      value={newVacancies}
                      onChange={(e) => setNewVacancies(Number(e.target.value))}
                      className="w-full px-3 py-2 text-xs bg-[#f6f9f8] border border-[#e2ece9] rounded-xl focus:outline-none focus:border-[#117c74] text-[#17222b]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-[#5f7572] mb-1">
                      Furnishing
                    </label>
                    <select
                      value={newFurnishing}
                      onChange={(e) => setNewFurnishing(e.target.value as any)}
                      className="w-full px-3 py-2 text-xs bg-[#f6f9f8] border border-[#e2ece9] rounded-xl focus:outline-none focus:border-[#117c74] text-[#17222b]"
                    >
                      <option value="Fully Furnished">Fully Furnished</option>
                      <option value="Semi-Furnished">Semi-Furnished</option>
                      <option value="Unfurnished">Unfurnished</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#5f7572] mb-1">
                      Floor Number & Total
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        min={0}
                        max={30}
                        value={newFloorNumber}
                        onChange={(e) => setNewFloorNumber(Number(e.target.value))}
                        title="Floor Number"
                        placeholder="Floor"
                        className="w-1/2 px-2.5 py-2 text-xs bg-[#f6f9f8] border border-[#e2ece9] rounded-xl text-[#17222b]"
                      />
                      <span className="text-xs text-[#5f7572]">of</span>
                      <input
                        type="number"
                        min={1}
                        max={30}
                        value={newTotalFloors}
                        onChange={(e) => setNewTotalFloors(Number(e.target.value))}
                        title="Total Floors"
                        placeholder="Total"
                        className="w-1/2 px-2.5 py-2 text-xs bg-[#f6f9f8] border border-[#e2ece9] rounded-xl text-[#17222b]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#5f7572] mb-1">
                      Area in Sq Ft
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        min={50}
                        step={10}
                        value={newAreaSqFt}
                        onChange={(e) => setNewAreaSqFt(Number(e.target.value))}
                        className="w-full px-3 py-2 text-xs bg-[#f6f9f8] border border-[#e2ece9] rounded-xl text-[#17222b]"
                      />
                      <span className="absolute right-2.5 top-2 text-[10px] text-[#5f7572]">
                        ~₹{Math.round(newRent / (newAreaSqFt || 1))}/sqft
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <label className="flex items-center gap-2 text-xs font-medium cursor-pointer">
                    <input
                      type="checkbox"
                      checked={newHasLift}
                      onChange={(e) => setNewHasLift(e.target.checked)}
                      className="accent-[#117c74] rounded-sm"
                    />
                    <span className="text-[#17222b]">Elevator / Lift Available in Building</span>
                  </label>
                </div>
              </div>

              {/* SECTION 3: FLATMATE AND HOUSE RULES */}
              <div className="space-y-3.5 pt-2">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#117c74] border-b border-[#e2ece9] pb-1.5">
                  <Users className="w-4 h-4 text-[#117c74]" />
                  <span>3. Flatmate Matching & House Rules</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-[#5f7572] mb-1">
                      ★ Gender Allowed
                    </label>
                    <select
                      value={newGenderAllowed}
                      onChange={(e) => setNewGenderAllowed(e.target.value as any)}
                      className="w-full px-3 py-2 text-xs bg-[#f6f9f8] border border-[#e2ece9] rounded-xl focus:outline-none focus:border-[#117c74] text-[#17222b]"
                    >
                      <option value="Boys">Boys Only</option>
                      <option value="Girls">Girls Only</option>
                      <option value="Any">Any / Co-ed</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#5f7572] mb-1">
                      ★ Food Rules
                    </label>
                    <select
                      value={newFoodRules}
                      onChange={(e) => setNewFoodRules(e.target.value as any)}
                      className="w-full px-3 py-2 text-xs bg-[#f6f9f8] border border-[#e2ece9] rounded-xl focus:outline-none focus:border-[#117c74] text-[#17222b]"
                    >
                      <option value="Veg Only">Veg Only</option>
                      <option value="Non-Veg Allowed">Non-Veg Allowed</option>
                      <option value="Jain">Strict Jain Food</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-[#5f7572] mb-1">
                      Current Occupants (Count)
                    </label>
                    <input
                      type="number"
                      min={0}
                      max={15}
                      value={newOccupantsCount}
                      onChange={(e) => setNewOccupantsCount(Number(e.target.value))}
                      className="w-full px-3 py-2 text-xs bg-[#f6f9f8] border border-[#e2ece9] rounded-xl text-[#17222b]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#5f7572] mb-1">
                      Occupant Details (Gender & Course - Optional)
                    </label>
                    <input
                      type="text"
                      value={newOccupantsDetails}
                      onChange={(e) => setNewOccupantsDetails(e.target.value)}
                      placeholder="e.g. 2 B.Tech CSE 3rd year boys"
                      className="w-full px-3 py-2 text-xs bg-[#f6f9f8] border border-[#e2ece9] rounded-xl text-[#17222b]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-[#5f7572] mb-1">
                      Guests Policy
                    </label>
                    <select
                      value={newGuestPolicy}
                      onChange={(e) => setNewGuestPolicy(e.target.value)}
                      className="w-full px-3 py-2 text-xs bg-[#f6f9f8] border border-[#e2ece9] rounded-xl text-[#17222b]"
                    >
                      <option value="Daytime only">Daytime only</option>
                      <option value="Overnight allowed">Overnight allowed</option>
                      <option value="No guests">No guests</option>
                      <option value="With prior notice">With prior notice</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#5f7572] mb-1">
                      Smoking Policy
                    </label>
                    <select
                      value={newSmokingPolicy}
                      onChange={(e) => setNewSmokingPolicy(e.target.value)}
                      className="w-full px-3 py-2 text-xs bg-[#f6f9f8] border border-[#e2ece9] rounded-xl text-[#17222b]"
                    >
                      <option value="No Smoking">No Smoking</option>
                      <option value="Balcony only">Balcony only</option>
                      <option value="Allowed">Allowed</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#5f7572] mb-1">
                      Drinking & Alcohol
                    </label>
                    <select
                      value={newDrinkingPolicy}
                      onChange={(e) => setNewDrinkingPolicy(e.target.value)}
                      className="w-full px-3 py-2 text-xs bg-[#f6f9f8] border border-[#e2ece9] rounded-xl text-[#17222b]"
                    >
                      <option value="No Alcohol">No Alcohol</option>
                      <option value="Allowed inside room">Allowed inside room</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-[#5f7572] mb-1">
                      Pets Policy
                    </label>
                    <select
                      value={newPetsPolicy}
                      onChange={(e) => setNewPetsPolicy(e.target.value)}
                      className="w-full px-3 py-2 text-xs bg-[#f6f9f8] border border-[#e2ece9] rounded-xl text-[#17222b]"
                    >
                      <option value="No Pets">No Pets</option>
                      <option value="Pets Allowed">Pets Allowed</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#5f7572] mb-1">
                      Curfew / Gate Closing Time
                    </label>
                    <select
                      value={newCurfewTime}
                      onChange={(e) => setNewCurfewTime(e.target.value)}
                      className="w-full px-3 py-2 text-xs bg-[#f6f9f8] border border-[#e2ece9] rounded-xl text-[#17222b]"
                    >
                      <option value="No Curfew">No Curfew</option>
                      <option value="10:30 PM">10:30 PM</option>
                      <option value="11:00 PM">11:00 PM</option>
                      <option value="12:00 AM">12:00 AM</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#5f7572] mb-1">
                      Quiet Hours
                    </label>
                    <select
                      value={newQuietHours}
                      onChange={(e) => setNewQuietHours(e.target.value)}
                      className="w-full px-3 py-2 text-xs bg-[#f6f9f8] border border-[#e2ece9] rounded-xl text-[#17222b]"
                    >
                      <option value="11:00 PM - 7:00 AM">11:00 PM - 7:00 AM</option>
                      <option value="10:00 PM - 6:00 AM">10:00 PM - 6:00 AM</option>
                      <option value="Flexible">Flexible</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="flex items-center gap-2 text-xs font-medium cursor-pointer">
                    <input
                      type="checkbox"
                      checked={newCookingAllowed}
                      onChange={(e) => setNewCookingAllowed(e.target.checked)}
                      className="accent-[#117c74] rounded-sm"
                    />
                    <span className="text-[#17222b]">Cooking allowed with modular kitchen access</span>
                  </label>
                </div>
              </div>

              {/* SECTION 4: MAP PIN LOCATION (LAT / LONG) */}
              <div className="space-y-3.5 pt-2">
                <div className="flex items-center justify-between border-b border-[#e2ece9] pb-1.5">
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#117c74]">
                    <MapPin className="w-4 h-4 text-[#117c74]" />
                    <span>4. Map Pin Location (Lat/Long Coordinates)</span>
                  </div>
                  <span className="text-[10px] text-[#5f7572]">Accurate Campus Distance</span>
                </div>

                <div className="p-3 bg-[#f6f9f8] rounded-2xl border border-[#e2ece9] space-y-3">
                  <div className="text-[11px] text-[#5f7572] leading-relaxed">
                    Set precise latitude & longitude coordinates so prospective flatmates can see the exact walk time from NCU Gate 1 and Gate 2.
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-semibold text-[#5f7572] mb-1">
                        Latitude (°N)
                      </label>
                      <input
                        type="number"
                        step="0.0001"
                        required
                        value={newLat}
                        onChange={(e) => setNewLat(Number(e.target.value))}
                        className="w-full px-3 py-2 text-xs bg-white border border-[#e2ece9] rounded-xl text-[#17222b] font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-[#5f7572] mb-1">
                        Longitude (°E)
                      </label>
                      <input
                        type="number"
                        step="0.0001"
                        required
                        value={newLng}
                        onChange={(e) => setNewLng(Number(e.target.value))}
                        className="w-full px-3 py-2 text-xs bg-white border border-[#e2ece9] rounded-xl text-[#17222b] font-mono"
                      />
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-2 pt-1 text-xs">
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleLocalitySelect(newLocality)}
                        className="px-3 py-1.5 bg-white hover:bg-[#e2ece9] text-[#17222b] font-medium rounded-xl border border-[#e2ece9] cursor-pointer transition-colors"
                      >
                        📍 Auto-fill from {newLocality}
                      </button>

                      <button
                        type="button"
                        onClick={handleGetGPSLocation}
                        disabled={isLocating}
                        className="px-3 py-1.5 bg-[#117c74]/10 hover:bg-[#117c74]/20 text-[#117c74] font-semibold rounded-xl cursor-pointer transition-colors flex items-center gap-1.5"
                      >
                        <Navigation className={`w-3.5 h-3.5 ${isLocating ? 'animate-spin' : ''}`} />
                        <span>{isLocating ? 'Acquiring GPS...' : 'Use My Current Location'}</span>
                      </button>
                    </div>

                    <a
                      href={`https://www.google.com/maps?q=${newLat},${newLng}`}
                      target="_blank"
                      rel="noreferrer"
                      className="text-[#117c74] hover:underline text-[11px] font-medium flex items-center gap-1"
                    >
                      <ExternalLink className="w-3 h-3" />
                      Preview Pin on Map
                    </a>
                  </div>
                </div>
              </div>

              {/* SECTION 5: LANDLORD / SUBLETTER INFO & KYC */}
              <div className="space-y-3.5 pt-2">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#117c74] border-b border-[#e2ece9] pb-1.5">
                  <ShieldCheck className="w-4 h-4 text-[#117c74]" />
                  <span>5. Landlord / Subletter Verification</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-[#5f7572] mb-1">
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
                    <label className="block text-xs font-semibold text-[#5f7572] mb-1">
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

                <label className="flex items-center gap-2 text-xs font-medium cursor-pointer pt-1">
                  <input
                    type="checkbox"
                    checked={newIsVerified}
                    onChange={(e) => setNewIsVerified(e.target.checked)}
                    className="accent-[#117c74] rounded-sm"
                  />
                  <span>Owner has provided Aadhaar KYC & verified utility bill</span>
                </label>

                <div className="p-3 bg-[#ecfdf5] border border-[#a7f3d0] rounded-xl text-[11px] text-[#065f46] leading-relaxed">
                  <strong>RoomSync Trust Algorithm:</strong> Submitting this listing runs our real-time audit comparing rent against the locality benchmark, scanning for scam flags, and weighting KYC status to assign an anti-fraud Trust Score (0-100).
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-[#e2ece9] flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-[#5f7572] hover:bg-[#f6f9f8] rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-[#117c74] hover:bg-[#0d635c] text-white text-xs font-semibold rounded-xl shadow-xs transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Compute Trust Score & Publish Listing</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
