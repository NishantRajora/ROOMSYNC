import { AgreementAnalysisResult, AgreementClauseAnalysis } from '../types';
import { analyzeAgreementText } from './nlp';

const rawBaseUrl = import.meta.env.VITE_AI_BASE_URL || 'https://api.groq.com/openai/v1';
export const AI_BASE_URL = rawBaseUrl.replace(/\/+$/, '');
export const AI_API_KEY = (import.meta.env.VITE_AI_API_KEY || '').trim();
export const AI_MODEL = (import.meta.env.VITE_AI_MODEL || 'openai/gpt-oss-20b').trim();

export const isAIConfigured = Boolean(
  AI_API_KEY &&
  AI_API_KEY.length > 5 &&
  !AI_API_KEY.includes('your_api_key')
);

const VALID_CLAUSE_TYPES: AgreementClauseAnalysis['clauseType'][] = [
  'deposit',
  'lockin',
  'notice',
  'escalation',
  'entry',
  'maintenance',
  'arbitrary',
];

const SYSTEM_PROMPT = `You are a tenant advocacy legal advisor specializing in Indian residential rental agreements, student accommodations, and India's Model Tenancy Act (MTA).
Your task is to analyze the user-provided tenancy agreement or contract clauses, identify any unfair, illegal, or predatory terms, and provide fairer legal counter-drafting.

Carefully evaluate:
1. Security deposit forfeiture or unfair non-refundable clauses.
2. Unreasonable lock-in periods (e.g. 11 months without early exit clauses).
3. Asymmetric or short notice periods for eviction (e.g. 7-15 days notice by landlord vs 60 days by tenant).
4. Unreasonable rent escalation (>10% per annum).
5. Landlord entry without at least 24-hour advance written notice (breach of tenant privacy).
6. Shifting structural/major maintenance repairs onto the student/tenant.
7. Mandatory painting or deep cleaning deductions regardless of flat handover condition.
8. Arbitrary restrictions, penalties, or unfair deposit deductions.

Return ONLY a valid JSON object matching this exact structure:
{
  "overallRiskScore": <number between 0 and 100, where 0 is completely fair and 100 is severe predatory risk>,
  "riskCategory": <"Low Risk" | "Moderate Concern" | "Severe Predatory Clauses">,
  "summaryNote": <concise 2-sentence executive summary advising the student tenant>,
  "depositSafetyRating": <e.g. "High Safety (Standard MTA terms)" | "Caution Needed — Request amendments" | "High Forfeiture Risk — Negotiate before signing">,
  "clauses": [
    {
      "id": "clause-1",
      "title": "<short descriptive title of the clause or problem>",
      "originalClause": "<exact excerpt or sentence from the contract>",
      "clauseType": <"deposit" | "lockin" | "notice" | "escalation" | "entry" | "maintenance" | "arbitrary">,
      "riskLevel": <"high" | "medium" | "low">,
      "plainExplanation": "<plain-English breakdown of why this clause disadvantages the tenant>",
      "fairerSuggestion": "<balanced, professional replacement clause wording adhering to fair tenancy standards>",
      "isFlagged": <true if high or medium risk, false otherwise>
    }
  ]
}`;

function cleanJsonResponse(raw: string): string {
  let cleaned = raw.trim();
  if (cleaned.startsWith('```')) {
    cleaned = cleaned.replace(/^```(?:json)?\s*\n?/, '').replace(/\n?```\s*$/, '');
  }
  return cleaned.trim();
}

function normalizeClauseType(typeStr: unknown): AgreementClauseAnalysis['clauseType'] {
  if (typeof typeStr === 'string') {
    const lower = typeStr.toLowerCase().trim() as AgreementClauseAnalysis['clauseType'];
    if (VALID_CLAUSE_TYPES.includes(lower)) {
      return lower;
    }
    if (lower.includes('deposit') || lower.includes('money')) return 'deposit';
    if (lower.includes('lock') || lower.includes('term')) return 'lockin';
    if (lower.includes('notice') || lower.includes('vacat') || lower.includes('evict')) return 'notice';
    if (lower.includes('rent') || lower.includes('escalat') || lower.includes('hike')) return 'escalation';
    if (lower.includes('entry') || lower.includes('inspect') || lower.includes('privacy')) return 'entry';
    if (lower.includes('repair') || lower.includes('maint')) return 'maintenance';
  }
  return 'arbitrary';
}

function normalizeRiskCategory(score: number, cat?: unknown): AgreementAnalysisResult['riskCategory'] {
  if (typeof cat === 'string') {
    if (cat === 'Severe Predatory Clauses' || cat.toLowerCase().includes('predatory') || cat.toLowerCase().includes('severe')) {
      return 'Severe Predatory Clauses';
    }
    if (cat === 'Moderate Concern' || cat.toLowerCase().includes('moderate') || cat.toLowerCase().includes('caution')) {
      return 'Moderate Concern';
    }
    if (cat === 'Low Risk' || cat.toLowerCase().includes('low') || cat.toLowerCase().includes('safe')) {
      return 'Low Risk';
    }
  }

  if (score >= 60) return 'Severe Predatory Clauses';
  if (score >= 30) return 'Moderate Concern';
  return 'Low Risk';
}

export async function analyzeAgreementWithAI(contractText: string): Promise<AgreementAnalysisResult> {
  const trimmed = contractText?.trim() || '';

  if (!trimmed) {
    return {
      overallRiskScore: 0,
      riskCategory: 'Low Risk',
      clauses: [],
      summaryNote: 'No contract text provided. Paste agreement clauses or choose a pre-loaded sample above.',
      depositSafetyRating: 'N/A',
      engineUsed: isAIConfigured ? 'ai' : 'regex',
      modelName: AI_MODEL,
    };
  }

  if (!isAIConfigured) {
    const fallback = analyzeAgreementText(trimmed);
    return {
      ...fallback,
      engineUsed: 'regex',
    };
  }

  const endpoint = `${AI_BASE_URL}/chat/completions`;
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 35000); // 35s timeout

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${AI_API_KEY}`,
      },
      body: JSON.stringify({
        model: AI_MODEL,
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: trimmed },
        ],
        response_format: { type: 'json_object' },
        temperature: 0.1,
      }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errText = await response.text().catch(() => '');
      throw new Error(`AI API returned HTTP ${response.status}: ${errText}`);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;

    if (!content) {
      throw new Error('AI API returned empty response content.');
    }

    const parsed = JSON.parse(cleanJsonResponse(content));

    const rawScore = Number(parsed.overallRiskScore);
    const score = isNaN(rawScore) ? 35 : Math.max(0, Math.min(100, Math.round(rawScore)));
    const riskCategory = normalizeRiskCategory(score, parsed.riskCategory);

    const clauses: AgreementClauseAnalysis[] = Array.isArray(parsed.clauses)
      ? parsed.clauses.map((c: any, index: number) => {
          const rawRisk = String(c.riskLevel || '').toLowerCase();
          const riskLevel: 'low' | 'medium' | 'high' =
            rawRisk === 'high' ? 'high' : rawRisk === 'medium' ? 'medium' : 'low';

          return {
            id: String(c.id || `clause-${index + 1}`),
            title: String(c.title || `Clause ${index + 1}`),
            originalClause: String(c.originalClause || ''),
            clauseType: normalizeClauseType(c.clauseType),
            riskLevel,
            plainExplanation: String(c.plainExplanation || 'No plain-language explanation provided.'),
            fairerSuggestion: String(c.fairerSuggestion || 'Negotiate standard mutual terms.'),
            isFlagged: typeof c.isFlagged === 'boolean' ? c.isFlagged : riskLevel !== 'low',
          };
        })
      : [];

    return {
      overallRiskScore: score,
      riskCategory,
      clauses,
      summaryNote: String(parsed.summaryNote || 'Contract analysis complete.'),
      depositSafetyRating: String(parsed.depositSafetyRating || (score > 50 ? 'Caution Advised' : 'Fair Standards')),
      engineUsed: 'ai',
      modelName: AI_MODEL,
    };
  } catch (error) {
    clearTimeout(timeoutId);
    console.warn('AI Agreement Analysis encountered an error, using built-in rule engine:', error);

    const fallbackResult = analyzeAgreementText(trimmed);
    return {
      ...fallbackResult,
      engineUsed: 'regex',
      modelName: undefined,
    };
  }
}
