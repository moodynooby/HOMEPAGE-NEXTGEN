import { fireEvent, render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import radarData from "@/content/techRadar.json";
import TechRadar from "../TechRadar";

const renderWithRouter = (ui) => render(<BrowserRouter>{ui}</BrowserRouter>);

describe("TechRadar Component", () => {
	beforeEach(() => {
		sessionStorage.clear();
	});

	afterEach(() => {
		sessionStorage.clear();
	});

	it("renders a label for every configured quadrant and does not show add button when not editable", () => {
		renderWithRouter(<TechRadar />);

		for (const quadrant of radarData.quadrants) {
			expect(screen.getAllByText(quadrant)[0]).toBeInTheDocument();
		}
		expect(
			screen.getByText("Hover or click a blip to see details"),
		).toBeInTheDocument();
		expect(
			screen.queryByRole("button", { name: /Add Technology/i }),
		).not.toBeInTheDocument();
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
		expect(
			screen.queryByRole("button", { name: /Edit/i }),
		).not.toBeInTheDocument();
	});

	it("opens the dynamic form when Add Technology is clicked and allows creating a blip when editable and authenticated", () => {
		sessionStorage.setItem("editorial_admin_session", "true");
		renderWithRouter(<TechRadar editable />);

		const addBtn = screen.getByRole("button", { name: /Add Technology/i });
		expect(addBtn).toBeInTheDocument();

		fireEvent.click(addBtn);

		// Form dialog should be visible
		expect(screen.getByTestId("tech-radar-form")).toBeInTheDocument();
		expect(screen.getByText("Add Radar Technology")).toBeInTheDocument();

		// Fill in dynamic form fields
		const nameInput = screen.getByPlaceholderText(/e\.g\. TypeScript/i);
		fireEvent.change(nameInput, { target: { value: "GraphQL" } });

		const saveBtn = screen.getByRole("button", { name: /Save Technology/i });
		fireEvent.click(saveBtn);

		// Form should close and new technology blip should be in document
		expect(screen.queryByTestId("tech-radar-form")).not.toBeInTheDocument();
		expect(screen.getByText("GraphQL")).toBeInTheDocument();
	});

	it("does not show add button even if editable is true when not authenticated", () => {
		renderWithRouter(<TechRadar editable />);

		expect(
			screen.queryByRole("button", { name: /Add Technology/i }),
		).not.toBeInTheDocument();
	});
});
