import { describe, expect, it } from "vitest";
import { normalizePhone, toWhatsAppPhone, buildWhatsAppLink } from "./whatsapp";

describe("normalizePhone", () => {
  it("strips spaces and dashes", () => {
    expect(normalizePhone("0754 221 908")).toBe("0754221908");
    expect(normalizePhone("0754-221-908")).toBe("0754221908");
  });

  it("folds a +255 international prefix back to local 0-prefixed form", () => {
    expect(normalizePhone("+255 754 221 908")).toBe("0754221908");
  });

  it("folds a bare 255 prefix (no plus) back to local form", () => {
    expect(normalizePhone("255754221908")).toBe("0754221908");
  });

  it("makes all common variants of the same number resolve identically", () => {
    const variants = [
      "0754221908",
      "0754 221 908",
      "0754-221-908",
      "+255754221908",
      "255 754 221 908",
    ];
    const normalized = new Set(variants.map(normalizePhone));
    expect(normalized.size).toBe(1);
  });

  it("leaves an already-local number unchanged", () => {
    expect(normalizePhone("0754221908")).toBe("0754221908");
  });
});

describe("toWhatsAppPhone", () => {
  it("converts a local 0-prefixed number to international format", () => {
    expect(toWhatsAppPhone("0754221908")).toBe("255754221908");
  });

  it("strips spaces and separators before converting", () => {
    expect(toWhatsAppPhone("0754 221 908")).toBe("255754221908");
  });

  it("leaves an already-international number alone", () => {
    expect(toWhatsAppPhone("255754221908")).toBe("255754221908");
  });

  it("strips a leading plus sign", () => {
    expect(toWhatsAppPhone("+255754221908")).toBe("255754221908");
  });
});

describe("buildWhatsAppLink", () => {
  it("builds a wa.me link with the normalized phone and encoded message", () => {
    const link = buildWhatsAppLink("0712345678", "Hello, you owe 1,000!");
    expect(link).toBe(
      "https://wa.me/255712345678?text=Hello%2C+you+owe+1%2C000%21"
    );
  });
});
