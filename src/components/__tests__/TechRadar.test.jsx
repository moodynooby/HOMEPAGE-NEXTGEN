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

		expect(screen.getByText("Languages")).toBeInTheDocument();
		expect(screen.getByText("Frontend/UI")).toBeInTheDocument();
		expect(screen.getByText("Backend/Data")).toBeInTheDocument();
		expect(screen.getByText("DevOps/Cloud")).toBeInTheDocument();

		expect(
			screen.getByText("Hover or click a blip to see details"),
		).toBeInTheDocument();
	});

	it("displays blip details when clicked/hovered", () => {
		renderWithRouter(<TechRadar />);

		const jsBlip = screen.getByText("JavaScript");
		expect(jsBlip).toBeInTheDocument();

		fireEvent.mouseEnter(jsBlip);

		expect(screen.getByText(/Quadrant:/)).toBeInTheDocument();
		expect(screen.getByText(/Years of Experience:/)).toBeInTheDocument();

		expect(screen.getByText("Key Repositories")).toBeInTheDocument();
		expect(screen.getAllByText("Todo.Txt")[0]).toBeInTheDocument();

		expect(screen.getByText("Related Projects")).toBeInTheDocument();
		const links = screen.getAllByRole("link");
		expect(links.length).toBeGreaterThan(0);
	});
});
