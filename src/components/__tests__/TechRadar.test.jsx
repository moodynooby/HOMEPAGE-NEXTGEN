import { fireEvent, render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { describe, expect, it, vi } from "vitest";
import { RADAR_QUADRANTS } from "@/hooks/useTechRadarData";
import TechRadar from "../TechRadar";

vi.mock("@/hooks/useProjectsData", () => ({
	default: () => ({
		loading: false,
		loadError: "",
		projects: [
			{
				githubName: "Todo.Txt",
				category: "Web App",
				language: "JavaScript",
				year: 2022,
				pushed_at: new Date().toISOString(),
				topics: ["react", "vite"],
			},
			{
				githubName: "Modern-TWP",
				category: "Browser Extension",
				language: "TypeScript",
				year: 2023,
				pushed_at: new Date().toISOString(),
				topics: ["webextension"],
			},
			{
				githubName: "TaskTimer",
				category: "Web App",
				language: "JavaScript",
				year: 2021,
				pushed_at: new Date().toISOString(),
				topics: ["react"],
			},
		],
	}),
}));

const renderWithRouter = (ui) => render(<BrowserRouter>{ui}</BrowserRouter>);

describe("TechRadar Component", () => {
	it("renders a label for every configured quadrant and dynamic blips", () => {
		renderWithRouter(<TechRadar />);

		for (const quadrant of RADAR_QUADRANTS) {
			expect(screen.getAllByText(quadrant)[0]).toBeInTheDocument();
		}
		expect(
			screen.getByText("Hover or click a blip to see details"),
		).toBeInTheDocument();
		expect(screen.getByText("JavaScript")).toBeInTheDocument();
		expect(screen.getByText("React")).toBeInTheDocument();
	});

	it("shows the hovered blip's details derived from GitHub metadata", () => {
		renderWithRouter(<TechRadar />);

		fireEvent.mouseEnter(screen.getByText("JavaScript"));

		expect(screen.getByText(/Quadrant: Languages/)).toBeInTheDocument();
		expect(screen.getByText("Key Repositories")).toBeInTheDocument();
		expect(screen.getAllByText("Todo.Txt").length).toBeGreaterThan(0);
		expect(screen.getAllByText("TaskTimer").length).toBeGreaterThan(0);
	});

	it("filters blips when a quadrant chip is clicked", () => {
		renderWithRouter(<TechRadar />);

		fireEvent.click(screen.getByRole("button", { name: "Languages" }));

		expect(screen.getByText("JavaScript")).toBeInTheDocument();
		expect(screen.getByText("TypeScript")).toBeInTheDocument();
		expect(screen.queryByText("WebExtensions")).not.toBeInTheDocument();
	});
});
