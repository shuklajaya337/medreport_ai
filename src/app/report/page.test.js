import { render, screen, fireEvent } from "@testing-library/react";
import ReportPage from "./page";

describe("Report Page", () => {
  test("renders the main heading", () => {
    render(<ReportPage />);
    expect(screen.getByText("Multi-Agent Clinical Intelligence")).toBeInTheDocument();
  });

  test("renders the report category dropdown with expected options", () => {
    render(<ReportPage />);
    expect(screen.getByText("CBC (Complete Blood Count)")).toBeInTheDocument();
    expect(screen.getByText("Thyroid (TSH, T3, T4)")).toBeInTheDocument();
  });

  test("fills the textarea when 'Load sample' is clicked", () => {
    render(<ReportPage />);
    const sampleButton = screen.getByText("Load sample General values");
    fireEvent.click(sampleButton);
    const textarea = screen.getByPlaceholderText(/Hemoglobin/i);
    expect(textarea.value.length).toBeGreaterThan(0);
  });

  test("switches language when Hindi button is clicked", () => {
    render(<ReportPage />);
    const hindiButton = screen.getByText("हिंदी");
    fireEvent.click(hindiButton);
    expect(hindiButton.className).toMatch(/bg-blue-600/);
  });
});