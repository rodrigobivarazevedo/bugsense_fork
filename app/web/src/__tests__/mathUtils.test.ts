const add = (a: number, b: number): number => a + b;
const multiply = (a: number, b: number): number => a * b;
const divide = (a: number, b: number): number => a / b;

describe("Math Utils", () => {
  test("add function works correctly", () => {
    expect(add(2, 3)).toBe(5);
    expect(add(0, 0)).toBe(0);
    expect(add(-1, 1)).toBe(0);
  });

  test("multiply function works correctly", () => {
    expect(multiply(2, 3)).toBe(6);
    expect(multiply(0, 5)).toBe(0);
    expect(multiply(-2, 3)).toBe(-6);
  });

  test("divide function works correctly", () => {
    expect(divide(6, 2)).toBe(3);
    expect(divide(0, 5)).toBe(0);
    expect(divide(10, 2)).toBe(5);
  });

  test("mathematical operations are consistent", () => {
    const result1 = add(2, 3);
    const result2 = multiply(result1, 2);
    expect(result2).toBe(10);
  });
});
