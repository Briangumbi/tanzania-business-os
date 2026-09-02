/**
 * Canonicalizes a phone number for storage/matching: strips everything but
 * digits and folds a 255-country-code prefix back to the local 0-prefixed
 * form, so "0754221908", "0754 221 908", "+255 754 221 908", and
 * "255754221908" all resolve to the same customer instead of silently
 * creating duplicates.
 */
export function normalizePhone(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  if (digits.startsWith("255") && digits.length === 12) return `0${digits.slice(3)}`;
  return digits;
}

/** Normalizes a local Tanzanian number (e.g. "0754 221 908") to wa.me's expected
 * digits-only international format ("255754221908"). Best-effort for other formats. */
export function toWhatsAppPhone(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  if (digits.startsWith("255")) return digits;
  if (digits.startsWith("0")) return `255${digits.slice(1)}`;
  return digits;
}

export function buildWhatsAppLink(phone: string, message: string): string {
  const params = new URLSearchParams({ text: message });
  return `https://wa.me/${toWhatsAppPhone(phone)}?${params.toString()}`;
}
