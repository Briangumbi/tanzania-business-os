import { describe, expect, it } from "vitest";
import { toWhatsAppPhone, buildWhatsAppLink } from "./whatsapp";

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
