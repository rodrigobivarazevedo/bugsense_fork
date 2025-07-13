import { getSpeciesDisplayName } from "../utils/BacteriaSpeciesUtils";

describe("BacteriaSpeciesUtils", () => {
  test("getSpeciesDisplayName returns a string", () => {
    const speciesName = getSpeciesDisplayName("E.C");
    expect(typeof speciesName).toBe("string");
    expect(speciesName).toBe("Escherichia coli");
  });

  test("getSpeciesDisplayName handles unknown species", () => {
    const speciesName = getSpeciesDisplayName("UNKNOWN");
    expect(typeof speciesName).toBe("string");
    expect(speciesName).toBe("UNKNOWN");
  });

  test("getSpeciesDisplayName returns correct names for known species", () => {
    expect(getSpeciesDisplayName("E.F")).toBe("Enterococcus faecalis");
    expect(getSpeciesDisplayName("K.P")).toBe("Klebsiella pneumoniae");
    expect(getSpeciesDisplayName("S.A")).toBe("Staphylococcus aureus");
  });
});
