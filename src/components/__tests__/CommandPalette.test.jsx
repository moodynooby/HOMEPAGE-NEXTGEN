import { render, screen, waitFor } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
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
		const user = userEvent.setup();

		render(
			<MemoryRouter>
				<ThemeContextProvider>
					<CommandPalette>
						<div data-testid="test-child">Child content</div>
					</CommandPalette>
				</ThemeContextProvider>
			</MemoryRouter>,
		);

		// The modal shouldn't be open initially
		expect(screen.queryByRole("presentation")).not.toBeInTheDocument();

		// Trigger '?' keydown on document body
		await user.keyboard("?");

		await waitFor(() => {
			expect(screen.getByRole("presentation")).toBeInTheDocument();
		});

		expect(screen.getByText("Keyboard Shortcuts")).toBeInTheDocument();
		expect(screen.getByText("Go to Projects")).toBeInTheDocument();
	});
});
