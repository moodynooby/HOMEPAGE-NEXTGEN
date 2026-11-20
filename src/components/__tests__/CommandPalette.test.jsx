import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";
import CommandPalette from "@/components/CommandPalette";
import { ThemeContextProvider } from "@/contexts/ThemeContext";

describe("CommandPalette", () => {
	it("renders children correctly", () => {
		render(
			<MemoryRouter>
				<ThemeContextProvider>
					<CommandPalette>
						<div data-testid="child-element">Child content</div>
					</CommandPalette>
				</ThemeContextProvider>
			</MemoryRouter>,
		);

		expect(screen.getByTestId("child-element")).toBeInTheDocument();
	});

	it("opens shortcuts modal on pressing '?'", async () => {
		render(
			<MemoryRouter>
				<ThemeContextProvider>
					<CommandPalette>
						<div data-testid="test-child">Child content</div>
					</CommandPalette>
				</ThemeContextProvider>
			</MemoryRouter>,
		);

		expect(screen.queryByText("Keyboard Shortcuts")).not.toBeInTheDocument();

		fireEvent.keyDown(window, { key: "?" });

		await waitFor(() => {
			expect(screen.getByText("Keyboard Shortcuts")).toBeInTheDocument();
		});
		expect(screen.getByText("Go to Projects")).toBeInTheDocument();
	});
});
