import {
  UserProfile,
  CompatibilityVector,
  CompatibilityResult,
  SleepSchedule,
  CleanlinessLevel,
  SocialHabit,
  FoodPreference,
} from '../types';

/**
 * Pure testable compatibility scoring engine between two users.
 * Calculates vectors on 5 dimensions: Sleep, Cleanliness, Social, Food, Budget
 */

export function computeSleepScore(s1: SleepSchedule, s2: SleepSchedule): { score: number; note?: string } {
  if (s1 === s2) return { score: 100, note: `Both follow ${s1.replace('_', ' ')} schedule` };
  if (s1 === 'flexible' || s2 === 'flexible') return { score: 85, note: 'Flexible sleeping hours match well' };
  return { score: 35, note: 'Opposite sleeping schedules (Early Bird vs Night Owl)' };
}

export function computeCleanlinessScore(c1: CleanlinessLevel, c2: CleanlinessLevel): { score: number; note?: string } {
  if (c1 === c2) return { score: 100, note: `Both align on ${c1.replace('_', ' ')} hygiene standards` };
  if (
    (c1 === 'neat_freak' && c2 === 'relaxed') ||
    (c1 === 'relaxed' && c2 === 'neat_freak')
  ) {
    return { score: 25, note: 'Major cleanliness gap: Neat freak vs relaxed habits' };
  }
  return { score: 75, note: 'Compatible cleanliness balance with light ground rules' };
}

export function computeSocialScore(s1: SocialHabit, s2: SocialHabit): { score: number; note?: string } {
  if (s1 === s2) return { score: 95, note: `Harmonious ${s1} energy levels and hosting expectations` };
  if (s1 === 'ambivert' || s2 === 'ambivert') return { score: 85, note: 'Balanced blend of quiet time and social flat vibe' };
  return { score: 45, note: 'Introvert vs Extrovert social preferences' };
}

export function computeFoodScore(f1: FoodPreference, f2: FoodPreference): { score: number; note?: string } {
  if (f1 === f2) return { score: 100, note: `Identical dietary lifestyle (${f1.replace('_', ' ')})` };
  if ((f1 === 'pure_veg' || f1 === 'jain') && f2 === 'non_veg') {
    return { score: 45, note: 'Separate cookware or non-veg fridge etiquette may be needed' };
  }
  if ((f2 === 'pure_veg' || f2 === 'jain') && f1 === 'non_veg') {
    return { score: 45, note: 'Separate cookware or non-veg fridge etiquette may be needed' };
  }
  return { score: 80, note: 'Dietary habits easily complement each other' };
}

export function computeBudgetScore(
  u1Min: number,
  u1Max: number,
  u2Min: number,
  u2Max: number
): { score: number; note?: string } {
  const overlapMin = Math.max(u1Min, u2Min);
  const overlapMax = Math.min(u1Max, u2Max);

  if (overlapMax >= overlapMin) {
    const overlapSize = overlapMax - overlapMin;
    const span1 = Math.max(u1Max - u1Min, 1);
    const span2 = Math.max(u2Max - u2Min, 1);
    const ratio = overlapSize / Math.max(span1, span2);
    const score = Math.round(75 + ratio * 25);
    return {
      score: Math.min(score, 100),
      note: `Shared rent budget sweet-spot around ₹${Math.round((overlapMin + overlapMax) / 2).toLocaleString('en-IN')}/mo`,
    };
  }

  const gap = overlapMin - overlapMax;
  if (gap <= 3000) {
    return { score: 60, note: `Minor ₹${gap.toLocaleString('en-IN')} budget variance` };
  }
  return { score: 25, note: `Significant budget gap of ₹${gap.toLocaleString('en-IN')}` };
}

export function computeVectorValues(user: UserProfile): CompatibilityVector {
  // Convert discrete habits into 0-100 dimensional coordinates for radar display
  const sleepVal = user.sleepSchedule === 'early_bird' ? 90 : user.sleepSchedule === 'night_owl' ? 30 : 60;
  const cleanVal = user.cleanliness === 'neat_freak' ? 95 : user.cleanliness === 'moderate' ? 65 : 35;
  const socialVal = user.socialHabits === 'extrovert' ? 90 : user.socialHabits === 'ambivert' ? 60 : 30;
  const foodVal = user.foodPreference === 'pure_veg' ? 20 : user.foodPreference === 'jain' ? 10 : user.foodPreference === 'eggetarian' ? 50 : 85;
  const budgetNorm = Math.min(100, Math.round(((user.budgetMax - 5000) / 25000) * 100));

  return {
    sleep: sleepVal,
    cleanliness: cleanVal,
    social: socialVal,
    food: foodVal,
    budget: Math.max(20, budgetNorm),
  };
}

export function computeCompatibility(user: UserProfile, candidate: UserProfile): CompatibilityResult {
  const sleep = computeSleepScore(user.sleepSchedule, candidate.sleepSchedule);
  const clean = computeCleanlinessScore(user.cleanliness, candidate.cleanliness);
  const social = computeSocialScore(user.socialHabits, candidate.socialHabits);
  const food = computeFoodScore(user.foodPreference, candidate.foodPreference);
  const budget = computeBudgetScore(user.budgetMin, user.budgetMax, candidate.budgetMin, candidate.budgetMax);

  // Weights: Sleep (25%), Cleanliness (25%), Social (20%), Budget (20%), Food (10%)
  const rawScore =
    sleep.score * 0.25 +
    clean.score * 0.25 +
    social.score * 0.20 +
    budget.score * 0.20 +
    food.score * 0.10;

  const overallScore = Math.min(100, Math.max(15, Math.round(rawScore)));

  const reasons: string[] = [];
  const differences: string[] = [];

  // Match reasons (green)
  if (sleep.score >= 80 && sleep.note) reasons.push(sleep.note);
  if (clean.score >= 80 && clean.note) reasons.push(clean.note);
  if (budget.score >= 75 && budget.note) reasons.push(budget.note);
  if (social.score >= 80 && social.note) reasons.push(social.note);
  if (food.score >= 80 && food.note) reasons.push(food.note);

  // Localities overlap check
  const commonLocalities = user.preferredLocalities.filter((loc) =>
    candidate.preferredLocalities.includes(loc)
  );
  if (commonLocalities.length > 0) {
    reasons.unshift(`Both target ${commonLocalities.slice(0, 2).join(' & ')} near NCU`);
  }

  // Differences (amber)
  if (sleep.score < 70 && sleep.note) differences.push(sleep.note);
  if (clean.score < 70 && clean.note) differences.push(clean.note);
  if (social.score < 70 && social.note) differences.push(social.note);
  if (food.score < 70 && food.note) differences.push(food.note);
  if (budget.score < 70 && budget.note) differences.push(budget.note);

  // Fallbacks if lists are empty
  if (reasons.length === 0) {
    reasons.push('Open to student flat-sharing in Gurgaon NCR');
  }
  if (differences.length === 0) {
    differences.push('Slightly varying college lecture timetables');
  }

  return {
    overallScore,
    vectorUser: computeVectorValues(user),
    vectorCandidate: computeVectorValues(candidate),
    reasons: reasons.slice(0, 3),
    differences: differences.slice(0, 2),
  };
}
