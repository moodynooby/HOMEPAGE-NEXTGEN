import { fireEvent, render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";
import radarData from "@/content/techRadar.json";
import TechRadar from "../TechRadar";

const renderWithRouter = (ui) => render(<BrowserRouter>{ui}</BrowserRouter>);

describe("TechRadar Component", () => {
	it("renders a label for every configured quadrant and an empty detail panel", () => {
		renderWithRouter(<TechRadar />);

		for (const quadrant of radarData.quadrants) {
			expect(screen.getByText(quadrant)).toBeInTheDocument();
		}
		expect(
			screen.getByText("Hover or click a blip to see details"),
		).toBeInTheDocument();
	});

	it("shows the hovered blip's details from the content", () => {
		const blip = radarData.blips[0];
		renderWithRouter(<TechRadar />);

		fireEvent.mouseEnter(screen.getByText(blip.name));

		expect(
			screen.getByText(new RegExp(`Quadrant: ${blip.quadrant}`)),
		).toBeInTheDocument();
		expect(
			screen.getByText("Years of Experience:").parentElement,
		).toHaveTextContent(String(blip.yoe));
		expect(screen.getByText("Key Repositories")).toBeInTheDocument();
		for (const repo of blip.keyRepos) {
			expect(screen.getAllByText(repo).length).toBeGreaterThan(0);
		}
	});
});
