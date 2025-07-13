const capitalize = (str: string): string =>
  str.charAt(0).toUpperCase() + str.slice(1);
const reverse = (str: string): string => str.split("").reverse().join("");
const countWords = (str: string): number => {
  const trimmed = str.trim();
  return trimmed === '' ? 0 : trimmed.split(/\s+/).length;
};

describe("String Utils", () => {
  test("capitalize function works correctly", () => {
    expect(capitalize("hello")).toBe("Hello");
    expect(capitalize("world")).toBe("World");
    expect(capitalize("")).toBe("");
  });

  test("reverse function works correctly", () => {
    expect(reverse("hello")).toBe("olleh");
    expect(reverse("123")).toBe("321");
    expect(reverse("")).toBe("");
  });

  test("countWords function works correctly", () => {
    expect(countWords("hello world")).toBe(2);
    expect(countWords("one")).toBe(1);
    expect(countWords("")).toBe(0);
  });

  test("string operations are consistent", () => {
    const original = "test string";
    const capitalized = capitalize(original);
    const reversed = reverse(capitalized);

    expect(capitalized).toBe("Test string");
    expect(reversed).toBe("gnirts tseT");
  });
});
