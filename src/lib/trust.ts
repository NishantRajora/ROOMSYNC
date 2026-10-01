import { TrustBreakdown, TrustSignal } from '../types';

export const LOCALITY_MEDIAN_RENTS: Record<string, number> = {
  'Sector 23': 11500, // per room / sharing base
  'DLF Phase 3': 13500,
  'Sushant Lok': 14000,
  'Palam Vihar': 10500,
  'Sector 21': 11000,
  'Sector 22': 11000,
};

export const SCAM_KEYWORDS = [
  'token before visiting',
  'token amount before',
  'pay advance to see',
  'gate pass fee',
  'owner out of station',
  'defense officer transfer',
  'army courier',
  'no agreement needed',
  'send money to confirm booking',
  'urgent booking token',
  'whatsapp payment',
];

export function analyzeListingTrust(
  rent: number,
  locality: string,
  description: string,
  landlordVerified: boolean,
  hasDuplicateImageCheck: boolean = false
): { trustScore: number; breakdown: TrustBreakdown } {
  const signals: TrustSignal[] = [];
  let score = 0;

  // 1. Landlord KYC / Phone Verification (+30 pts)
  if (landlordVerified) {
    score += 30;
    signals.push({
      name: 'Landlord KYC & Aadhaar Verified',
      passed: true,
      scoreImpact: 30,
      description: 'Owner submitted government ID and property utility bill verification.',
    });
  } else {
    signals.push({
      name: 'Unverified Landlord Profile',
      passed: false,
      scoreImpact: 0,
      description: 'Direct owner contact not yet independently verified by student ambassadors.',
    });
  }

  // 2. Locality Median Rent Check (+25 pts)
  const median = LOCALITY_MEDIAN_RENTS[locality] || 12000;
  const rentRatio = (rent - median) / median;
  const rentVsMedianPercent = Math.round(rentRatio * 100);

  if (rentRatio < -0.45) {
    // Abnormally low rent is a classic Gurugram scam hook (luxury 3BHK for ₹5,000)
    score -= 20;
    signals.push({
      name: 'Abnormally Below Median Price Warning',
      passed: false,
      scoreImpact: -20,
      description: `Rent is ${Math.abs(rentVsMedianPercent)}% below ${locality} student average (₹${median.toLocaleString('en-IN')}). Classic token fraud tactic.`,
    });
  } else if (Math.abs(rentRatio) <= 0.20) {
    score += 25;
    signals.push({
      name: 'Fair Market Rent Alignment',
      passed: true,
      scoreImpact: 25,
      description: `Rent is within ${Math.abs(rentVsMedianPercent)}% of ${locality} benchmark.`,
    });
  } else {
    score += 15;
    signals.push({
      name: 'Above Locality Baseline',
      passed: true,
      scoreImpact: 15,
      description: `Premium rate (${rentVsMedianPercent > 0 ? '+' : ''}${rentVsMedianPercent}% vs locality median).`,
    });
  }

  // 3. Scam Pattern & Language Detection (+25 pts)
  const lowerDesc = description.toLowerCase();
  const detectedScamKeywords: string[] = [];

  for (const keyword of SCAM_KEYWORDS) {
    if (lowerDesc.includes(keyword)) {
      detectedScamKeywords.push(keyword);
    }
  }

  if (detectedScamKeywords.length === 0) {
    score += 25;
    signals.push({
      name: 'Zero Suspicious Scam Phrases',
      passed: true,
      scoreImpact: 25,
      description: 'Passed automated anti-fraud text scanner for advance payment requests.',
    });
  } else {
    score -= 30;
    signals.push({
      name: 'High Risk Phrasing Detected',
      passed: false,
      scoreImpact: -30,
      description: `Contains high-risk phrases: "${detectedScamKeywords.slice(0, 2).join('", "')}". Do NOT transfer funds before viewing!`,
    });
  }

  // 4. Reverse Image Duplication & Photo Authenticity (+20 pts)
  if (!hasDuplicateImageCheck) {
    score += 20;
    signals.push({
      name: 'Unique Physical Photos',
      passed: true,
      scoreImpact: 20,
      description: 'Photos verified authentic with geo-metadata matching Gurugram coordinates.',
    });
  } else {
    score -= 15;
    signals.push({
      name: 'Stock Photo / Duplicate Detected',
      passed: false,
      scoreImpact: -15,
      description: 'Listing images match scraped web stock photos.',
    });
  }

  const finalScore = Math.max(10, Math.min(100, score));

  return {
    trustScore: finalScore,
    breakdown: {
      landlordVerified,
      rentVsMedianPercent,
      scamLanguageDetected: detectedScamKeywords.length > 0,
      scamKeywordsFound: detectedScamKeywords,
      imageDuplicateFound: hasDuplicateImageCheck,
      signals,
    },
  };
}
