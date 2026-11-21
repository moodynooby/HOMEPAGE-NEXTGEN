import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import ThemeToggle from "@/components/ThemeToggle";
import { useThemeContext } from "@/contexts/ThemeContext";

vi.mock("@/contexts/ThemeContext", () => ({
	useThemeContext: vi.fn(),
}));

describe("ThemeToggle", () => {
	const mockSetMode = vi.fn();
	const mockToggleHighContrast = vi.fn();

	beforeEach(() => {
		vi.clearAllMocks();
	});

	it("marks the active mode as pressed", () => {
		useThemeContext.mockReturnValue({
			mode: "light",
			setMode: mockSetMode,
			highContrast: false,
			toggleHighContrast: mockToggleHighContrast,
		});
		const { rerender } = render(<ThemeToggle />);

		expect(screen.getByLabelText("Use light theme")).toHaveAttribute(
			"aria-pressed",
			"true",
		);
		expect(screen.getByLabelText("Use dark theme")).toHaveAttribute(
			"aria-pressed",
			"false",
		);

		useThemeContext.mockReturnValue({
			mode: "dark",
			setMode: mockSetMode,
			highContrast: false,
			toggleHighContrast: mockToggleHighContrast,
		});
		rerender(<ThemeToggle />);

		expect(screen.getByLabelText("Use dark theme")).toHaveAttribute(
			"aria-pressed",
			"true",
		);
	});

	it("calls setMode when clicking a different mode", () => {
		useThemeContext.mockReturnValue({
			mode: "light",
			setMode: mockSetMode,
			highContrast: false,
			toggleHighContrast: mockToggleHighContrast,
		});

		render(<ThemeToggle />);
		fireEvent.click(screen.getByLabelText("Use dark theme"));

		expect(mockSetMode).toHaveBeenCalledWith("dark");
	});

	it("opens settings menu and toggles high contrast", () => {
		useThemeContext.mockReturnValue({
			mode: "system",
			setMode: mockSetMode,
			highContrast: false,
			toggleHighContrast: mockToggleHighContrast,
		});

		render(<ThemeToggle />);
		fireEvent.click(screen.getByLabelText("Theme settings"));
		fireEvent.click(screen.getByText("High Contrast"));

		expect(mockToggleHighContrast).toHaveBeenCalledTimes(1);
	});
});
