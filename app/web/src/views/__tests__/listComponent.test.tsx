import React from "react";
import { render, screen } from "@testing-library/react";

const ListComponent: React.FC = () => {
  const items = ["Apple", "Banana", "Orange"];

  return (
    <div>
      <h2>Fruit List</h2>
      <ul>
        {items.map((item, index) => (
          <li key={index}>{item}</li>
        ))}
      </ul>
    </div>
  );
};

describe("List Component", () => {
  test("renders without crashing", () => {
    render(<ListComponent />);
    expect(screen.getByText("Fruit List")).toBeInTheDocument();
  });

  test("contains list items", () => {
    render(<ListComponent />);
    expect(screen.getByText("Apple")).toBeInTheDocument();
    expect(screen.getByText("Banana")).toBeInTheDocument();
    expect(screen.getByText("Orange")).toBeInTheDocument();
  });

  test("has proper list structure", () => {
    render(<ListComponent />);
    const list = screen.getByText("Apple").closest("ul");
    expect(list).toBeInTheDocument();
  });
});
