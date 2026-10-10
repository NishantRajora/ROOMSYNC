export type SleepSchedule = 'early_bird' | 'night_owl' | 'flexible';
export type CleanlinessLevel = 'relaxed' | 'moderate' | 'neat_freak';
export type SocialHabit = 'introvert' | 'ambivert' | 'extrovert';
export type FoodPreference = 'pure_veg' | 'jain' | 'eggetarian' | 'non_veg' | 'vegan';
export type StudyHabit = 'deep_silence' | 'ambient_music' | 'group_study';

export interface UserProfile {
  id: string;
  fullName: string;
  email: string;
  userType?: 'student' | 'professional' | 'freelancer' | 'other';
  college?: string;
  collegeEmail?: string;
  isStudentVerified: boolean;
  isProfessionalVerified?: boolean;
  workEmail?: string;
  company?: string;
  profileCompletion: number;
  gender: 'male' | 'female' | 'non_binary' | 'prefer_not_to_say';
  courseYear?: string;
  budgetMin: number;
  budgetMax: number;
  sleepSchedule: SleepSchedule;
  cleanliness: CleanlinessLevel;
  socialHabits: SocialHabit;
  foodPreference: FoodPreference;
  studyHabits: StudyHabit;
  studySchedule?: string;
  cleanlinessRating?: number; // 1-5 scale
  noiseTolerance?: string;
  smokingDrinkingTolerance?: string;
  roomSharingPreference?: 'private' | 'shared' | 'any';
  dealbreakers?: string[];
  bedtime?: string;
  wakeTime?: string;
  preferredLocalities: string[];
  bio: string;
  avatarUrl: string;
  upiId: string;
  phone?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface UserAccount {
  id: string;
  email: string;
  password?: string;
  profile: UserProfile;
  createdAt: string;
  lastLoginAt?: string;
}

export interface CompatibilityVector {
  sleep: number; // 0 - 100
  cleanliness: number;
  social: number;
  food: number;
  budget: number;
}

export interface CompatibilityResult {
  overallScore: number;
  vectorUser: CompatibilityVector;
  vectorCandidate: CompatibilityVector;
  reasons: string[];
  differences: string[];
}

export interface TrustSignal {
  name: string;
  passed: boolean;
  scoreImpact: number;
  description: string;
}

export interface TrustBreakdown {
  landlordVerified: boolean;
  rentVsMedianPercent: number; // e.g. -5 means 5% below median
  scamLanguageDetected: boolean;
  scamKeywordsFound: string[];
  imageDuplicateFound: boolean;
  signals: TrustSignal[];
}

export interface Listing {
  id: string;
  ownerId: string;
  title: string;
  locality: string;
  fullAddress: string;
  rent: number;
  deposit: number;
  bedrooms: number;
  bathrooms: number;
  furnishing: 'Fully Furnished' | 'Semi-Furnished' | 'Unfurnished';
  roomType: 'Private Room' | 'Shared Room' | 'Full Flat (2BHK)' | 'Full Flat (3BHK)';
  amenities: string[];
  photos: string[];
  description: string;
  trustScore: number; // 0-100
  trustBreakdown: TrustBreakdown;
  landlordName: string;
  landlordContact: string;
  landlordVerified: boolean;
  localityMedianRent: number;
  distanceToNCU: string;
  availableFrom: string;
  genderPreference: 'Boys' | 'Girls' | 'Any';
  createdAt: string;
  // Additional fields for extended listing details
  propertyType?: 'Flat' | 'PG' | 'Independent Floor' | 'Shared Room';
  bhkOrRoomType?: string; // e.g. '1RK', '1BHK', '2BHK', '3BHK', 'Single', 'Double'
  totalVacancies?: number;
  floorNumber?: number;
  totalFloors?: number;
  hasLift?: boolean;
  areaSqFt?: number;
  // House rules & policies
  genderAllowed?: 'Boys' | 'Girls' | 'Any';
  foodRules?: 'Veg Only' | 'Non-Veg Allowed' | 'Jain';
  occupantsCount?: number;
  occupantsDetails?: string; // e.g. '2 boys, B.Tech CSE 3rd year'
  guestPolicy?: string;
  smokingPolicy?: string;
  drinkingPolicy?: string;
  petsPolicy?: string;
  curfewTime?: string;
  cookingAllowed?: boolean;
  quietHours?: string;
  // Map location coordinates
  locationLat?: number;
  locationLng?: number;
}

export interface AgreementClauseAnalysis {
  id: string;
  title: string;
  originalClause: string;
  clauseType: 'deposit' | 'lockin' | 'notice' | 'escalation' | 'entry' | 'maintenance' | 'arbitrary';
  riskLevel: 'low' | 'medium' | 'high';
  plainExplanation: string;
  fairerSuggestion: string;
  isFlagged: boolean;
}

export interface AgreementAnalysisResult {
  overallRiskScore: number; // 0 (safest) to 100 (most predatory)
  riskCategory: 'Low Risk' | 'Moderate Concern' | 'Severe Predatory Clauses';
  clauses: AgreementClauseAnalysis[];
  summaryNote: string;
  depositSafetyRating: string;
}

export interface PactFlatmate {
  name: string;
  email: string;
  upi: string;
  phone: string;
  signed: boolean;
  signedAt?: string;
  signatureText?: string;
}

export interface RoommatePact {
  id: string;
  title: string;
  address: string;
  flatmates: PactFlatmate[];
  quietHours: {
    weekdays: string;
    weekends: string;
    rules: string;
  };
  choreSchedule: {
    cleaning: string;
    kitchen: string;
    garbage: string;
    frequency: string;
  };
  guestPolicy: {
    overnightAllowed: boolean;
    noticeHours: number;
    partyConsent: string;
  };
  depositSplit: {
    ratio: string;
    damageResponsibility: string;
  };
  documentText: string;
  sha256Hash: string;
  createdAt: string;
  status: 'draft' | 'partially_signed' | 'fully_signed';
}

export interface SafetyLocality {
  id: string;
  name: string;
  coordinates: [number, number]; // lat, lng
  riskLevel: 'low' | 'medium' | 'high';
  safetyScore: number; // 0-100
  nightSafetyScore: number;
  streetLightingScore: number;
  nearestPoliceStation: string;
  distanceToNCUKm: number;
  ncuCommuteTime: string;
  studentDensity: 'Very High' | 'High' | 'Moderate';
  highlights: string[];
  cautionNotes?: string[];
  transitPoints: string[];
  medianRent2BHK: number;
}

export interface Expense {
  id: string;
  title: string;
  amount: number;
  paidByName: string;
  paidByUpi: string;
  category: 'Rent' | 'Electricity' | 'Groceries' | 'WiFi' | 'Maid & Cook' | 'Water/RO' | 'Misc';
  splitWithNames: string[];
  settled: boolean;
  createdAt: string;
}

export interface SettlementDebt {
  from: string;
  to: string;
  toUpi: string;
  amount: number;
}

export interface Review {
  id: string;
  locality: string;
  propertyAddress: string;
  landlordName: string;
  depositReturned: boolean;
  depositReturnComment: string;
  maintenanceRating: number; // 1-5
  powerWaterRating: number; // 1-5
  overallRating: number; // 1-5
  reviewText: string;
  authorName: string;
  authorCollege: string;
  authorVerified: boolean;
  date: string;
}

export interface ChatMessage {
  id: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  recipientId?: string;
  recipientName?: string;
  recipientAvatar?: string;
  text: string;
  timestamp: string;
  isSelf: boolean;
}

export interface VisitAlert {
  id: string;
  destination: string;
  durationMinutes: number;
  remainingSeconds: number;
  emergencyContactName: string;
  emergencyContactPhone: string;
  startTime: string;
  status: 'active' | 'safe' | 'alert_triggered';
}
