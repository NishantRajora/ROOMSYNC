import { RoommatePact } from '../types';

export type PactDocumentContent = Pick<
  RoommatePact,
  'address' | 'createdAt' | 'flatmates' | 'quietHours' | 'choreSchedule' | 'guestPolicy' | 'depositSplit'
>;

export const buildPactDocumentText = (pact: PactDocumentContent): string => `ROOMMATE CO-LIVING PACT & CODE OF HARMONY
Property Address: ${pact.address}
Generated: ${new Date(pact.createdAt).toLocaleDateString('en-IN')}

1. FLATMATES & RENT ALLOCATION
${pact.flatmates.map((f, i) => `${i + 1}. ${f.name} (${f.email}, UPI: ${f.upi})`).join('\n')}

2. QUIET HOURS & STUDY CONDUCT
- Weekdays: ${pact.quietHours.weekdays}
- Weekends: ${pact.quietHours.weekends}
- Conduct: ${pact.quietHours.rules}

3. CHORES, HYGIENE & KITCHEN ETHICS
- Cleaning: ${pact.choreSchedule.cleaning}
- Kitchen: ${pact.choreSchedule.kitchen}
- Waste Management: ${pact.choreSchedule.garbage}

4. GUESTS, VISITORS & DEPOSIT ALLOCATION
- Overnight Guests: ${pact.guestPolicy.overnightAllowed ? `Allowed with ${pact.guestPolicy.noticeHours}h advance courtesy notice` : 'Not permitted without prior written consent'}
- Deposit Split: ${pact.depositSplit.ratio}
- Any damage caused individually shall be paid by the responsible flatmate.

DIGITAL SIGNATURE RECORDS:
${pact.flatmates.map((f) => `- ${f.name}: ${f.signed ? `SIGNED [${f.signedAt}]` : 'PENDING'}`).join('\n')}
`;
