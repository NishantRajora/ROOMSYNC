import { Expense, SettlementDebt } from '../types';

export interface UserBalance {
  name: string;
  totalPaid: number;
  totalOwed: number;
  net: number; // positive = owed money, negative = owes money
}

export function computeSettlements(
  expenses: Expense[],
  upiDirectory: Record<string, string>
): {
  balances: UserBalance[];
  settlements: SettlementDebt[];
} {
  const userMap: Record<string, { totalPaid: number; totalOwed: number }> = {};

  // Initialize
  for (const exp of expenses) {
    if (!userMap[exp.paidByName]) {
      userMap[exp.paidByName] = { totalPaid: 0, totalOwed: 0 };
    }
    for (const member of exp.splitWithNames) {
      if (!userMap[member]) {
        userMap[member] = { totalPaid: 0, totalOwed: 0 };
      }
    }

    if (!exp.settled) {
      userMap[exp.paidByName].totalPaid += exp.amount;
      const share = exp.amount / exp.splitWithNames.length;
      for (const member of exp.splitWithNames) {
        userMap[member].totalOwed += share;
      }
    }
  }

  const balances: UserBalance[] = Object.keys(userMap).map((name) => {
    const data = userMap[name];
    return {
      name,
      totalPaid: Math.round(data.totalPaid),
      totalOwed: Math.round(data.totalOwed),
      net: Math.round(data.totalPaid - data.totalOwed),
    };
  });

  // Calculate minimum cash transfers (debtor -> creditor)
  const debtors: { name: string; amount: number }[] = [];
  const creditors: { name: string; amount: number }[] = [];

  for (const b of balances) {
    if (b.net < -1) {
      debtors.push({ name: b.name, amount: -b.net });
    } else if (b.net > 1) {
      creditors.push({ name: b.name, amount: b.net });
    }
  }

  // Sort descending
  debtors.sort((a, b) => b.amount - a.amount);
  creditors.sort((a, b) => b.amount - a.amount);

  const settlements: SettlementDebt[] = [];
  let dIdx = 0;
  let cIdx = 0;

  while (dIdx < debtors.length && cIdx < creditors.length) {
    const debtor = debtors[dIdx];
    const creditor = creditors[cIdx];
    const settleAmount = Math.min(debtor.amount, creditor.amount);

    if (settleAmount > 0) {
      settlements.push({
        from: debtor.name,
        to: creditor.name,
        toUpi: upiDirectory[creditor.name] || `${creditor.name.toLowerCase().replace(/\s+/g, '')}@okaxis`,
        amount: Math.round(settleAmount),
      });

      debtor.amount -= settleAmount;
      creditor.amount -= settleAmount;
    }

    if (debtor.amount <= 1) dIdx++;
    if (creditor.amount <= 1) cIdx++;
  }

  return { balances, settlements };
}

export function generateUpiUrl(
  upiId: string,
  payeeName: string,
  amount: number,
  note: string = 'RoomSync Flatmate Settlement'
): string {
  const cleanUpi = encodeURIComponent(upiId.trim());
  const cleanName = encodeURIComponent(payeeName.trim());
  const cleanNote = encodeURIComponent(note.trim());
  return `upi://pay?pa=${cleanUpi}&pn=${cleanName}&am=${amount}&cu=INR&tn=${cleanNote}`;
}
