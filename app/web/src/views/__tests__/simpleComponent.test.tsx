import React from "react";
import { render, screen } from "@testing-library/react";

const SimpleComponent: React.FC = () => {
  return (
    <div>
      <h1>Simple Test Component</h1>
      <p>This is a simple test component</p>
    </div>
  );
};

describe("Simple Component", () => {
  test("renders without crashing", () => {
    render(<SimpleComponent />);
    expect(screen.getByText("Simple Test Component")).toBeInTheDocument();
  });

  test("contains expected content", () => {
    render(<SimpleComponent />);
    expect(
      screen.getByText("This is a simple test component")
    ).toBeInTheDocument();
  });

  test("has proper structure", () => {
    render(<SimpleComponent />);
    const heading = screen.getByText("Simple Test Component");
    expect(heading.tagName).toBe("H1");
  });
});
