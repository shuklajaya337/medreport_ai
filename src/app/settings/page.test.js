import { render, screen, fireEvent } from "@testing-library/react";
import Settings from "./page";

describe("Settings Form", () => {
  test("shows error when name is empty on submit", () => {
    render(<Settings />);
    const submitButton = screen.getByText("Save Settings");
    fireEvent.click(submitButton);
    expect(screen.getByText("Name is required")).toBeInTheDocument();
  });

  test("shows error for invalid email format", () => {
    render(<Settings />);
    const emailInput = screen.getByLabelText("Email");
    fireEvent.change(emailInput, { target: { value: "notanemail" } });
    fireEvent.click(screen.getByText("Save Settings"));
    expect(
      screen.getByText("Please enter a valid email address")
    ).toBeInTheDocument();
  });

  test("saves successfully with valid inputs", () => {
    render(<Settings />);
    fireEvent.change(screen.getByLabelText("Name"), {
      target: { value: "Priya" },
    });
    fireEvent.change(screen.getByLabelText("Email"), {
      target: { value: "priya@example.com" },
    });
    fireEvent.click(screen.getByText("Save Settings"));
    expect(screen.getByText("✓ Settings saved successfully")).toBeInTheDocument();
  });
});