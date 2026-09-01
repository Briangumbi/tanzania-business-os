import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";
import { formatTZS, formatDate, formatRelativeDay } from "./currency";

describe("formatTZS", () => {
  it("formats whole numbers with thousands separators and a TSh suffix", () => {
    expect(formatTZS(125000)).toBe("125,000 TSh");
  });

  it("rounds fractional amounts", () => {
    expect(formatTZS(999.6)).toBe("1,000 TSh");
  });

  it("handles zero", () => {
    expect(formatTZS(0)).toBe("0 TSh");
  });
});

describe("formatDate", () => {
  it("formats an ISO date as 'D Mon YYYY'", () => {
    expect(formatDate("2026-09-01")).toBe("1 Sept 2026");
  });
});

describe("formatRelativeDay", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-09-01T12:00:00Z"));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("labels today, yesterday, and tomorrow", () => {
    expect(formatRelativeDay("2026-09-01")).toBe("Today");
    expect(formatRelativeDay("2026-08-31")).toBe("Yesterday");
    expect(formatRelativeDay("2026-09-02")).toBe("Tomorrow");
  });

  it("labels near future/past days relatively", () => {
    expect(formatRelativeDay("2026-09-05")).toBe("In 4 days");
    expect(formatRelativeDay("2026-08-27")).toBe("5 days ago");
  });

  it("falls back to an absolute date outside the near window", () => {
    expect(formatRelativeDay("2026-08-01")).toBe("1 Aug 2026");
  });
});
