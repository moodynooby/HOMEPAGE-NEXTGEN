import { fireEvent, render, screen } from "@testing-library/react";
import { useState } from "react";
import { describe, expect, it, vi } from "vitest";

import ErrorBoundary from "@/components/ErrorBoundary";
import RouteLoader from "@/components/RouteLoader";

function ThrowingChild({ fail }) {
	if (fail) throw new Error("test render failure");
	return <div>Recovered content</div>;
}

function BoundaryHarness() {
	const [fail, setFail] = useState(true);
	return (
		<>
			<button type="button" onClick={() => setFail(false)}>
				Fix child
			</button>
			<ErrorBoundary>
				<ThrowingChild fail={fail} />
			</ErrorBoundary>
		</>
	);
}

describe("resilience UI", () => {
	it("renders an accessible loading status", () => {
		render(<RouteLoader />);

		expect(
			screen.getByRole("status", { name: "Loading page" }),
		).toBeInTheDocument();
		expect(screen.getByText("Loading page…")).toBeInTheDocument();
	});

	it("recovers when the underlying failure is fixed and retry is clicked", () => {
		const consoleError = vi
			.spyOn(console, "error")
			.mockImplementation(() => {});

		render(<BoundaryHarness />);
		expect(
			screen.getByText("Something went wrong while loading this page."),
		).toBeInTheDocument();

		fireEvent.click(screen.getByRole("button", { name: "Fix child" }));
		fireEvent.click(screen.getByRole("button", { name: "Try again" }));

		expect(screen.getByText("Recovered content")).toBeInTheDocument();
		expect(
			screen.queryByText("Something went wrong while loading this page."),
		).not.toBeInTheDocument();

		consoleError.mockRestore();
	});
});
