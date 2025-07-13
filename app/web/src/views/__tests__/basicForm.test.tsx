import React from "react";
import { render, screen } from "@testing-library/react";

const BasicForm: React.FC = () => {
  return (
    <form>
      <label htmlFor="name">Name:</label>
      <input type="text" id="name" name="name" />
      <button type="submit">Submit</button>
    </form>
  );
};

describe("Basic Form Component", () => {
  test("renders without crashing", () => {
    render(<BasicForm />);
    expect(screen.getByText("Name:")).toBeInTheDocument();
  });

  test("contains form elements", () => {
    render(<BasicForm />);
    expect(screen.getByLabelText("Name:")).toBeInTheDocument();
    expect(screen.getByText("Submit")).toBeInTheDocument();
  });

  test("has proper form structure", () => {
    render(<BasicForm />);
    const form = screen.getByText("Name:").closest("form");
    expect(form).toBeInTheDocument();
  });
});
