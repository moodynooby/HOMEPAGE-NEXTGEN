import { fireEvent, render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";
import TechRadar from "../TechRadar";

describe("TechRadar Component", () => {
	const renderWithRouter = (ui) => {
		return render(<BrowserRouter>{ui}</BrowserRouter>);
	};

	it("renders the initial state correctly", () => {
		renderWithRouter(<TechRadar />);

		// Check if quadrants are rendered
		expect(screen.getByText("Languages")).toBeInTheDocument();
		expect(screen.getByText("Frontend/UI")).toBeInTheDocument();
		expect(screen.getByText("Backend/Data")).toBeInTheDocument();
		expect(screen.getByText("DevOps/Cloud")).toBeInTheDocument();

		// Check if initial placeholder text is rendered
		expect(
			screen.getByText("Hover or click a blip to see details"),
		).toBeInTheDocument();
	});

	it("displays blip details when clicked/hovered", () => {
		renderWithRouter(<TechRadar />);

		// Find the JavaScript blip
		const jsBlip = screen.getByText("JavaScript");
		expect(jsBlip).toBeInTheDocument();

		// Trigger hover/click
		fireEvent.mouseEnter(jsBlip);

		// Details should now show up
		expect(screen.getByText(/Quadrant:/)).toBeInTheDocument();
		expect(screen.getByText(/Years of Experience:/)).toBeInTheDocument();

		// For JavaScript blip (keyRepos: ['Todo.Txt', 'TaskTimer'])
		expect(screen.getByText("Key Repositories")).toBeInTheDocument();
		// Using getAllByText since Todo.Txt appears in both Key Repositories and Related Projects
		expect(screen.getAllByText("Todo.Txt")[0]).toBeInTheDocument();

		// It should render Related Projects as links
		expect(screen.getByText("Related Projects")).toBeInTheDocument();
		const links = screen.getAllByRole("link");
		// It contains related projects "Todo.Txt" and "TaskTimer" as links,
		// but the key repos might also render as `<a>` tags with `href`.
		expect(links.length).toBeGreaterThan(0);
	});
});
