import { fireEvent, render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";
import ArchitectureTopology, { ECOSYSTEM_NODES } from "../ArchitectureTopology";

describe("ArchitectureTopology Component", () => {
	const renderWithRouter = (ui) => {
		return render(<BrowserRouter>{ui}</BrowserRouter>);
	};

	it("renders the initial state with all 5 ecosystem app nodes", () => {
		renderWithRouter(<ArchitectureTopology />);

		// Check header title
		expect(
			screen.getByText(/Ecosystem Architecture & Cross-App Topology/i),
		).toBeInTheDocument();

		// Check initial prompt in detail panel
		expect(screen.getByText("Select an Application")).toBeInTheDocument();

		// Check all 5 app node short names in SVG
		for (const node of ECOSYSTEM_NODES) {
			expect(screen.getAllByText(node.shortName).length).toBeGreaterThan(0);
		}

		// Check category filter chips (may match chip + SVG category label)
		expect(screen.getAllByText("AI & ML").length).toBeGreaterThan(0);
		expect(screen.getAllByText("Health & Habits").length).toBeGreaterThan(0);
		expect(screen.getAllByText("Productivity").length).toBeGreaterThan(0);
		expect(screen.getAllByText("Privacy & WebExt").length).toBeGreaterThan(0);
		expect(screen.getAllByText("Web & Portal").length).toBeGreaterThan(0);
	});

	it("displays node details, tech stack, and data flows when clicked", () => {
		renderWithRouter(<ArchitectureTopology />);

		// Click the NotebookForge node button
		const nbNode = screen.getByRole("button", { name: /NotebookForge/i });
		expect(nbNode).toBeInTheDocument();
		fireEvent.click(nbNode);

		// Detail drawer should now show details
		expect(
			screen.getByText("Multimodal AI Research & RAPTOR Tree RAG Engine"),
		).toBeInTheDocument();
		expect(screen.getByText("RAPTOR RAG")).toBeInTheDocument();
		expect(screen.getByText("FastAPI")).toBeInTheDocument();
		expect(
			screen.getByText("Hierarchical RAPTOR Tree RAG & Hybrid Query Router"),
		).toBeInTheDocument();

		// Check active data flows (appears in edge label and detail panel)
		expect(
			screen.getAllByText("Telemetry & Knowledge Sync").length,
		).toBeGreaterThan(0);
		expect(
			screen.getAllByText("Research Synthesis & Notes").length,
		).toBeGreaterThan(0);
	});

	it("closes detail inspector when close button is clicked", () => {
		renderWithRouter(<ArchitectureTopology />);

		// Select diet-logs
		const dlNode = screen.getByRole("button", { name: /diet-logs/i });
		fireEvent.click(dlNode);

		expect(
			screen.getByText(
				"Weekly Meal Prep Planner & Auto-Generated Grocery List",
			),
		).toBeInTheDocument();

		// Click close button
		const closeBtn = screen.getByLabelText("Close details");
		expect(closeBtn).toBeInTheDocument();
		fireEvent.click(closeBtn);

		// Detail drawer returns to placeholder
		expect(screen.getByText("Select an Application")).toBeInTheDocument();
	});

	it("supports keyboard navigation on nodes", () => {
		renderWithRouter(<ArchitectureTopology />);

		const notionNode = screen.getByRole("button", { name: /notion-lite/i });
		fireEvent.keyDown(notionNode, { key: "Enter", code: "Enter" });

		expect(
			screen.getByText("Offline-First Local Desktop Canvas"),
		).toBeInTheDocument();
		expect(screen.getByText("TipTap")).toBeInTheDocument();
	});

	it("filters by category and resets view", () => {
		renderWithRouter(<ArchitectureTopology />);

		// Click "Health & Habits" filter chip
		const filterChips = screen.getAllByText("Health & Habits");
		fireEvent.click(filterChips[0]);

		// Reset View button should now appear
		const resetBtn = screen.getByText("Reset View");
		expect(resetBtn).toBeInTheDocument();

		// Click Reset View
		fireEvent.click(resetBtn);

		// Reset View button should disappear
		expect(screen.queryByText("Reset View")).not.toBeInTheDocument();
	});
});
