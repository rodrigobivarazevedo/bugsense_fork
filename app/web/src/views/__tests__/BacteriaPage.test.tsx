import React from "react";
import { render, screen } from "@testing-library/react";
import BacteriaPage from "../BacteriaPage";

const mockBacteria = {
  id: "test-bacteria",
  name: "Test Bacteria",
  scientificName: "Testus bacterius",
  image: "test-image.png",
  description: "A test bacteria for testing",
  type: "Test Type",
  shape: "Test Shape",
  transmission: ["Test transmission"],
  symptoms: ["Test symptom"],
  prevention: [{ icon: "test", text: "Test prevention" }],
  treatment: "Test treatment",
};

describe("BacteriaPage Component", () => {
  test("renders without crashing", () => {
    render(<BacteriaPage bacteria={mockBacteria} />);
    expect(screen.getByText("Test Bacteria")).toBeInTheDocument();
  });

  test("contains bacteria page content", () => {
    render(<BacteriaPage bacteria={mockBacteria} />);
    const bacteriaElement = screen.getByText("Test Bacteria");
    expect(bacteriaElement).toBeDefined();
  });

  test("has proper structure", () => {
    render(<BacteriaPage bacteria={mockBacteria} />);
    const container = screen.getByText("Test Bacteria").closest("div");
    expect(container).toBeInTheDocument();
  });
});
