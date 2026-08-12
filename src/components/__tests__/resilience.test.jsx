import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import ErrorBoundary from "@/components/ErrorBoundary";
import RouteLoader from "@/components/RouteLoader";

function ThrowingChild() {
	throw new Error("test render failure");
}

describe("resilience UI", () => {
	it("renders an accessible loading status", () => {
		render(<RouteLoader />);

		expect(
			screen.getByRole("status", { name: "Loading page" }),
		).toBeInTheDocument();
		expect(screen.getByText("Loading page…")).toBeInTheDocument();
	});

	it("shows recovery actions after a render failure", () => {
		const consoleError = vi
			.spyOn(console, "error")
			.mockImplementation(() => {});

		render(
			<ErrorBoundary>
				<ThrowingChild />
			</ErrorBoundary>,
		);

		expect(
			screen.getByText("Something went wrong while loading this page."),
		).toBeInTheDocument();
		expect(
			screen.getByRole("button", { name: "Try again" }),
		).toBeInTheDocument();

		fireEvent.click(screen.getByRole("button", { name: "Try again" }));
		expect(
			screen.getByText("Something went wrong while loading this page."),
		).toBeInTheDocument();

		consoleError.mockRestore();
	});
});
