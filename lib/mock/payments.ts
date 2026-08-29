export type MobilePayment = {
  id: string;
  provider: "M-Pesa" | "Tigo Pesa" | "Airtel Money";
  reference: string;
  payerName: string;
  payerPhone: string;
  amountTZS: number;
  date: string;
  status: "matched" | "unmatched";
  matchedTo?: string;
};

export const mobilePayments: MobilePayment[] = [
  { id: "1", provider: "M-Pesa", reference: "QG7X4K2P", payerName: "Halima Juma", payerPhone: "0754 221 908", amountTZS: 15000, date: "2026-08-28", status: "matched", matchedTo: "Halima Juma — credit tab" },
  { id: "2", provider: "Tigo Pesa", reference: "TP99213A", payerName: "Emmanuel Kessy", payerPhone: "0715 003 442", amountTZS: 8500, date: "2026-08-28", status: "matched", matchedTo: "Emmanuel Kessy — credit tab" },
  { id: "3", provider: "M-Pesa", reference: "QG7X88LT", payerName: "0688 214 903", payerPhone: "0688 214 903", amountTZS: 25000, date: "2026-08-27", status: "unmatched" },
  { id: "4", provider: "Airtel Money", reference: "AM4471XZ", payerName: "Neema Mushi", payerPhone: "0783 456 120", amountTZS: 12000, date: "2026-08-27", status: "matched", matchedTo: "Neema Mushi — credit tab" },
  { id: "5", provider: "M-Pesa", reference: "QG7Y02CV", payerName: "0621 998 004", payerPhone: "0621 998 004", amountTZS: 4000, date: "2026-08-26", status: "unmatched" },
  { id: "6", provider: "Tigo Pesa", reference: "TP99544B", payerName: "Baraka Mrema", payerPhone: "0713 220 811", amountTZS: 30000, date: "2026-08-26", status: "matched", matchedTo: "Baraka Mrema — credit tab" },
  { id: "7", provider: "M-Pesa", reference: "QG7Z11WQ", payerName: "Fatuma Ally", payerPhone: "0655 771 330", amountTZS: 6000, date: "2026-08-25", status: "matched", matchedTo: "Fatuma Ally — credit tab" },
];
