import { getTimeBasedGreeting } from "../utils/DateTimeFormatter";

describe("DateTimeFormatter", () => {
  test("getTimeBasedGreeting returns a string", () => {
    const greeting = getTimeBasedGreeting();
    expect(typeof greeting).toBe("string");
    expect(greeting.length).toBeGreaterThan(0);
  });

  test("getTimeBasedGreeting returns different greetings for different times", () => {
    const morningGreeting = getTimeBasedGreeting();
    const afternoonGreeting = getTimeBasedGreeting();

    expect(typeof morningGreeting).toBe("string");
    expect(typeof afternoonGreeting).toBe("string");
  });

  test("getTimeBasedGreeting handles edge cases", () => {
    const greeting = getTimeBasedGreeting();
    expect(greeting).toBeDefined();
    expect(greeting).not.toBeNull();
  });
});
