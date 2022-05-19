
import { describe, it, expect } from 'vitest'
import { formatFullDate } from "./index";

describe("Filter Tests", () => {
  it("should return a string date", () => {
    const date = new Date();

    date.setMonth(0);
    date.setDate(1);
    date.setFullYear(2022);
    date.setHours(10);
    date.setMinutes(30);
    date.setSeconds(0);

    const result = formatFullDate(date);
    expect(result).toBe("2022-01-01 10:30:00");
  });
});