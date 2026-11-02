import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import ThemeToggle from "@/components/ThemeToggle";
import { useThemeContext } from "@/contexts/ThemeContext";

vi.mock("@/contexts/ThemeContext", () => ({
	useThemeContext: vi.fn(),
}));

describe("ThemeToggle", () => {
	const mockSetThemeMode = vi.fn();
	const mockToggleHighContrast = vi.fn();

	beforeEach(() => {
		vi.clearAllMocks();
	});

	it("renders with light mode selected", () => {
		useThemeContext.mockReturnValue({
			mode: "light",
			setThemeMode: mockSetThemeMode,
			highContrast: false,
			toggleHighContrast: mockToggleHighContrast,
		});

		render(<ThemeToggle />);

		const lightButton = screen.getByLabelText("Use light theme");
		expect(lightButton).toHaveAttribute("aria-pressed", "true");
	});

	it("renders with dark mode selected", () => {
		useThemeContext.mockReturnValue({
			mode: "dark",
			setThemeMode: mockSetThemeMode,
			highContrast: false,
			toggleHighContrast: mockToggleHighContrast,
		});

		render(<ThemeToggle />);

		const darkButton = screen.getByLabelText("Use dark theme");
		expect(darkButton).toHaveAttribute("aria-pressed", "true");
	});

	it("calls setThemeMode when clicking a different mode", () => {
		useThemeContext.mockReturnValue({
			mode: "light",
			setThemeMode: mockSetThemeMode,
			highContrast: false,
			toggleHighContrast: mockToggleHighContrast,
		});

		render(<ThemeToggle />);

		const darkButton = screen.getByLabelText("Use dark theme");
		fireEvent.click(darkButton);

		expect(mockSetThemeMode).toHaveBeenCalledWith("dark");
	});

	it("opens settings menu and toggles high contrast", () => {
		useThemeContext.mockReturnValue({
			mode: "system",
			setThemeMode: mockSetThemeMode,
			highContrast: false,
			toggleHighContrast: mockToggleHighContrast,
		});

		render(<ThemeToggle />);

		// Open menu
		const settingsButton = screen.getByLabelText("Theme settings");
		fireEvent.click(settingsButton);

		// Check that High Contrast option exists
		const highContrastItem = screen.getByText("High Contrast");
		expect(highContrastItem).toBeInTheDocument();

		// Toggle
		fireEvent.click(highContrastItem);
		expect(mockToggleHighContrast).toHaveBeenCalledTimes(1);
	});
});
