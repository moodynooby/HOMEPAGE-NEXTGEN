import { act, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { ThemeContextProvider, useThemeContext } from "@/contexts/ThemeContext";

describe("ThemeContext", () => {
	let matchMediaListeners = [];
	let matchesDark = false;

	beforeEach(() => {
		localStorage.clear();
		document.documentElement.removeAttribute("data-theme");
		document.documentElement.removeAttribute("data-high-contrast");
		matchMediaListeners = [];
		matchesDark = false;

		window.matchMedia = vi.fn().mockImplementation((query) => ({
			matches: query.includes("dark") ? matchesDark : !matchesDark,
			media: query,
			onchange: null,
			addListener: vi.fn(),
			removeListener: vi.fn(),
			addEventListener: vi.fn((_type, listener) => {
				matchMediaListeners.push(listener);
			}),
			removeEventListener: vi.fn((_type, listener) => {
				matchMediaListeners = matchMediaListeners.filter((l) => l !== listener);
			}),
			dispatchEvent: vi.fn(),
		}));
	});

	afterEach(() => {
		vi.restoreAllMocks();
	});

	it("defaults to system mode and applies system preference to data-theme", () => {
		matchesDark = true;
		const { result } = renderHook(() => useThemeContext(), {
			wrapper: ThemeContextProvider,
		});

		expect(result.current.mode).toBe("system");
		expect(result.current.effectiveMode).toBe("dark");
		expect(document.documentElement.getAttribute("data-theme")).toBe("dark");
	});

	it("switches to light and dark explicitly and persists to localStorage", () => {
		const { result } = renderHook(() => useThemeContext(), {
			wrapper: ThemeContextProvider,
		});

		act(() => {
			result.current.setMode("dark");
		});

		expect(result.current.mode).toBe("dark");
		expect(result.current.effectiveMode).toBe("dark");
		expect(document.documentElement.getAttribute("data-theme")).toBe("dark");
		expect(localStorage.getItem("themeMode")).toBe("dark");

		act(() => {
			result.current.setMode("light");
		});

		expect(result.current.mode).toBe("light");
		expect(result.current.effectiveMode).toBe("light");
		expect(document.documentElement.getAttribute("data-theme")).toBe("light");
		expect(localStorage.getItem("themeMode")).toBe("light");
	});

	it("toggles high contrast mode with data-high-contrast set to true", () => {
		const { result } = renderHook(() => useThemeContext(), {
			wrapper: ThemeContextProvider,
		});

		expect(result.current.highContrast).toBe(false);
		expect(
			document.documentElement.getAttribute("data-high-contrast"),
		).toBeNull();

		act(() => {
			result.current.toggleHighContrast();
		});

		expect(result.current.highContrast).toBe(true);
		expect(document.documentElement.getAttribute("data-high-contrast")).toBe(
			"true",
		);
		expect(localStorage.getItem("highContrast")).toBe("true");

		act(() => {
			result.current.toggleHighContrast();
		});

		expect(result.current.highContrast).toBe(false);
		expect(
			document.documentElement.getAttribute("data-high-contrast"),
		).toBeNull();
		expect(localStorage.getItem("highContrast")).toBe("false");
	});

	it("updates effectiveMode when system preference changes in system mode", () => {
		matchesDark = false;
		const { result } = renderHook(() => useThemeContext(), {
			wrapper: ThemeContextProvider,
		});

		expect(result.current.effectiveMode).toBe("light");
		expect(document.documentElement.getAttribute("data-theme")).toBe("light");

		act(() => {
			for (const listener of matchMediaListeners) {
				listener({ matches: true });
			}
		});

		expect(result.current.effectiveMode).toBe("dark");
		expect(document.documentElement.getAttribute("data-theme")).toBe("dark");
	});
});
