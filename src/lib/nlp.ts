import { AgreementClauseAnalysis, AgreementAnalysisResult } from '../types';

interface ClauseRule {
  type: AgreementClauseAnalysis['clauseType'];
  title: string;
  triggerRegex: RegExp;
  riskLevel: 'high' | 'medium' | 'low';
  plainExplanation: string;
  fairerSuggestion: string;
  tags: string[];
}

const CLAUSE_RULES: ClauseRule[] = [
  {
    type: 'deposit',
    title: 'Predatory Security Deposit Forfeiture',
    triggerRegex: /(forfeit|non-refundable|deposit\s+shall\s+not\s+be\s+returned|retain\s+the\s+entire\s+security\s+deposit)/i,
    riskLevel: 'high',
    plainExplanation:
      'This clause allows the owner to seize your entire security deposit without accounting for fair wear-and-tear or actual damages. Under the Model Tenancy Act, deposits can only be adjusted against documented arrears or physical damage.',
    fairerSuggestion:
      'The Security Deposit shall be refunded in full via bank transfer within 7 days of peaceful handover, subject only to actual utility arrears or physical repairs beyond normal wear and tear with itemized bills provided.',
    tags: ['Security Deposit', 'Unlawful Forfeiture'],
  },
  {
    type: 'lockin',
    title: 'Unfair 11-Month Lock-in Period with Heavy Penalty',
    triggerRegex: /(lock-in\s+period\s+of\s+11\s+months|cannot\s+vacate\s+before\s+11\s+months|pay\s+rent\s+for\s+remaining\s+months)/i,
    riskLevel: 'high',
    plainExplanation:
      'Strict 11-month lock-in clauses trap college students. If your college plans, internship, or family situation changes, you could be coerced to pay rent for unused months.',
    fairerSuggestion:
      'Either party may terminate the tenancy by providing 30 days written notice after an initial 3-month orientation lock-in period without forfeiture of remaining rent.',
    tags: ['Lock-in Period', 'Student Mobility'],
  },
  {
    type: 'notice',
    title: 'Asymmetrical or One-Sided Notice Period',
    triggerRegex: /(owner\s+may\s+terminate\s+with\s+(?:7|10|15)\s+days|immediate\s+vacation|without\s+any\s+prior\s+notice)/i,
    riskLevel: 'high',
    plainExplanation:
      'The landlord reserves the right to evict you on very short notice (7-15 days), while requiring you to give 1 to 2 months notice. This leaves you vulnerable to sudden homelessness during exam weeks.',
    fairerSuggestion:
      'Both Landlord and Tenant agree to a mutual, reciprocal 30-day written notice period for vacating the premises.',
    tags: ['Notice Period', 'Asymmetric Terms'],
  },
  {
    type: 'escalation',
    title: 'Unreasonable Rent Escalation (>10%)',
    triggerRegex: /(escalat(?:e|ion)\s+by\s+(?:12|15|20)%|increase\s+by\s+(?:12|15|20)%|rent\s+increase\s+of\s+15%)/i,
    riskLevel: 'medium',
    plainExplanation:
      'An annual escalation of 12% to 20% is significantly higher than Gurugram market standards (typical student residential increments are 5% to 8%).',
    fairerSuggestion:
      'In the event of lease renewal upon mutual consent, the monthly rent shall be subject to a maximum escalation of 5% to 7% per annum.',
    tags: ['Rent Hike', 'Escalation'],
  },
  {
    type: 'entry',
    title: 'Landlord Entry Without 24-Hour Notice',
    triggerRegex: /(inspect\s+(?:at\s+any\s+time|without\s+notice)|right\s+to\s+enter\s+without\s+prior)/i,
    riskLevel: 'high',
    plainExplanation:
      'Violates your right to privacy. Landlords in India cannot enter rented premises unannounced without reasonable advance notification except during verifiable natural emergencies.',
    fairerSuggestion:
      'The Landlord or their designated representative may inspect the premises strictly with at least 24 hours prior written notice (via WhatsApp or email) at a mutually agreed reasonable daytime hour.',
    tags: ['Privacy', 'Unannounced Entry'],
  },
  {
    type: 'maintenance',
    title: 'Shifting Major Structural Repairs to Student Tenant',
    triggerRegex: /(all\s+repairs\s+(?:including\s+seepage|plumbing|electrical)\s+shall\s+be\s+borne\s+by\s+tenant|tenant\s+responsible\s+for\s+structural)/i,
    riskLevel: 'medium',
    plainExplanation:
      'Building seepage, external pipe ruptures, and structural roof defects are the legal responsibility of the property owner, not college students living on rent.',
    fairerSuggestion:
      'Minor day-to-day repairs (bulb replacement, minor tap washers under ₹500) shall be managed by the tenant. Major structural repairs, seepage, lift, and electrical wiring faults remain the exclusive financial responsibility of the Landlord.',
    tags: ['Maintenance', 'Hidden Costs'],
  },
  {
    type: 'arbitrary',
    title: 'Mandatory Full-Month Painting Deduction',
    triggerRegex: /(mandatory\s+deduction\s+of\s+one\s+month\s+rent\s+for\s+painting|painting\s+charges\s+deducted\s+regardless)/i,
    riskLevel: 'medium',
    plainExplanation:
      'Automatic 1-month rent deductions for repainting regardless of tenancy length is an unfair extraction tactic common in Delhi-NCR.',
    fairerSuggestion:
      'Painting deduction shall only be applicable if walls show unnatural physical destruction, pencil/nail marks beyond ordinary wear, verified with before-and-after photographic documentation.',
    tags: ['Painting Charges', 'Deposit Deduction'],
  },
];

export function analyzeAgreementText(rawText: string): AgreementAnalysisResult {
  if (!rawText || rawText.trim().length === 0) {
    return {
      overallRiskScore: 0,
      riskCategory: 'Low Risk',
      clauses: [],
      summaryNote: 'No text provided to analyze. Paste your contract clauses or select a sample agreement.',
      depositSafetyRating: 'N/A',
    };
  }

  // Split into paragraphs / clauses
  const paragraphs = rawText
    .split(/\n\s*\n|\n(?=[0-9]+\.|\([a-z]\))/i)
    .map((p) => p.trim())
    .filter((p) => p.length > 20);

  const analyzedClauses: AgreementClauseAnalysis[] = [];
  let riskPoints = 0;

  for (let i = 0; i < paragraphs.length; i++) {
    const para = paragraphs[i];
    let matched = false;

    for (const rule of CLAUSE_RULES) {
      if (rule.triggerRegex.test(para)) {
        matched = true;
        const weight = rule.riskLevel === 'high' ? 25 : rule.riskLevel === 'medium' ? 15 : 5;
        riskPoints += weight;

        analyzedClauses.push({
          id: `clause-${i}-${rule.type}`,
          title: rule.title,
          originalClause: para,
          clauseType: rule.type,
          riskLevel: rule.riskLevel,
          plainExplanation: rule.plainExplanation,
          fairerSuggestion: rule.fairerSuggestion,
          isFlagged: true,
        });
        break; // Match first matching rule per clause
      }
    }

    if (!matched && (para.toLowerCase().includes('shall') || para.toLowerCase().includes('agree') || para.toLowerCase().includes('tenant'))) {
      analyzedClauses.push({
        id: `clause-${i}-standard`,
        title: `Clause ${i + 1}: Standard Provision`,
        originalClause: para,
        clauseType: 'arbitrary',
        riskLevel: 'low',
        plainExplanation: 'This clause appears within standard tenancy parameters without obvious predatory provisions.',
        fairerSuggestion: 'No amendment strictly necessary.',
        isFlagged: false,
      });
    }
  }

  const finalScore = Math.min(100, Math.max(8, riskPoints));
  let category: AgreementAnalysisResult['riskCategory'] = 'Low Risk';
  let depositRating = 'High Safety (Standard MTA terms)';

  if (finalScore >= 60) {
    category = 'Severe Predatory Clauses';
    depositRating = 'High Forfeiture Risk — Negotiate before signing';
  } else if (finalScore >= 30) {
    category = 'Moderate Concern';
    depositRating = 'Caution Needed — Request amendments';
  }

  const summaryNote =
    finalScore >= 60
      ? 'Alert: Multiple clauses heavily favor the landlord and risk complete loss of your security deposit. Do not sign without striking out flagged clauses.'
      : finalScore >= 30
      ? 'Notice: The agreement contains a few unbalanced conditions common in Gurugram, such as aggressive lock-in or unannounced entry.'
      : 'Good News: The agreement is largely balanced and aligns with fair student tenancy guidelines.';

  return {
    overallRiskScore: finalScore,
    riskCategory: category,
    clauses: analyzedClauses,
    summaryNote,
    depositSafetyRating: depositRating,
  };
}

// Pre-loaded realistic sample contracts
export const SAMPLE_AGREEMENTS = {
  predatory: {
    title: 'Predatory DLF Phase 3 U-Block Tenancy Agreement',
    description: 'High-risk contract loaded with unfair lock-ins, deposit forfeiture, and sudden eviction rules.',
    text: `1. PREMISES & SECURITY DEPOSIT: The Tenant agrees to deposit ₹35,000 as Security Deposit. In the event the tenant leaves before 11 months or fails to find a replacement, the entire security deposit shall be forfeited and non-refundable.

2. LOCK-IN PERIOD: There shall be a strict lock-in period of 11 months. Tenant cannot vacate before 11 months. If tenant leaves early, tenant shall remain liable to pay rent for the remaining months.

3. NOTICE PERIOD: The owner reserves the right to terminate tenancy with 7 days notice without assigning reason, whereas the tenant must provide 60 days prior written notice.

4. ANNUAL ESCALATION: If renewed, monthly rent shall escalate by 15% to 20% per annum at the sole discretion of the lessor.

5. INSPECTION & ACCESS: The Owner or manager reserves the right to inspect premises at any time without notice to check hygiene and conduct random flat inspections.

6. PAINTING & CLEANING: Upon vacating, a mandatory deduction of one month rent for painting and deep cleaning shall be deducted regardless of flat condition.

7. STRUCTURAL REPAIRS: All repairs including plumbing, seepage, and electrical wiring shall be borne by tenant at their sole cost.`,
  },
  balanced: {
    title: 'Fair NCU Student Tenancy Agreement (Sector 23)',
    description: 'Model agreement compliant with fair student living guidelines and reciprocal terms.',
    text: `1. PREMISES & SECURITY DEPOSIT: The Tenant has paid a refundable security deposit of ₹22,000. The deposit shall be refunded within 7 days of vacating after adjusting unpaid electricity/utility bills and itemized damages, if any.

2. TERM & NOTICE PERIOD: The lease shall be for 11 months. Either party may terminate this agreement by serving thirty (30) days written notice in advance or paying one month rent in lieu thereof.

3. INSPECTION & PRIVACY: The Landlord may inspect the premises during reasonable daylight hours with a minimum of 24 hours prior written notice to the Tenant.

4. MAINTENANCE OBLIGATIONS: Day-to-day minor consumables (LED lights, tap washers under ₹300) shall be handled by the Tenant. All major structural repairs, roof seepage, and pump motors remain the Landlord's responsibility.

5. RENT ESCALATION: Any mutually agreed lease extension after 11 months shall be subject to a maximum 5% escalation.`,
  },
  mixed: {
    title: 'Standard Palam Vihar Flat Agreement (Mixed Risk)',
    description: 'Typical mixed agreement with moderate ambiguity around painting and maintenance costs.',
    text: `1. RENT & DEPOSIT: Monthly rent of ₹14,000 per room with two months security deposit. Security deposit refundable within 30 days after handing over peaceful possession.

2. LOCK-IN: The tenant agrees to an initial lock-in period of 6 months. Leaving before 6 months may result in half month rent deduction from deposit.

3. MAINTENANCE & UTILITIES: Electricity and water shall be paid directly by tenant as per meter. All minor and medium repairs inside flat shall be borne by tenant.

4. PAINTING EXPENSES: Painting charges will be deducted from deposit if walls show excessive dirt.`,
  },
};
