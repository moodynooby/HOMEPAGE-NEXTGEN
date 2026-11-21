import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { beforeEach, describe, expect, it } from "vitest";
import AdminDashboard from "../AdminDashboard";

const renderWithRouter = (ui = <AdminDashboard showAppBar={false} />) =>
	render(<BrowserRouter>{ui}</BrowserRouter>);

describe("AdminDashboard Component", () => {
	beforeEach(() => {
		sessionStorage.clear();
		localStorage.clear();
	});

	it("shows login screen initially when unauthenticated", () => {
		renderWithRouter(<AdminDashboard showAppBar={false} />);

		expect(screen.getByText("Ledger Access")).toBeInTheDocument();
		expect(
			screen.getByRole("button", { name: /Unlock Curator Console/i }),
		).toBeInTheDocument();
	});

	it("authenticates and unlocks the Curator Console dashboard", async () => {
		renderWithRouter(<AdminDashboard showAppBar={false} />);

		const passkeyInput = screen.getByPlaceholderText("Enter passkey...");
		fireEvent.change(passkeyInput, { target: { value: "testpass" } });

		const unlockBtn = screen.getByRole("button", {
			name: /Unlock Curator Console/i,
		});
		fireEvent.click(unlockBtn);

		await waitFor(() => {
			expect(screen.getByText("Portfolio Administration")).toBeInTheDocument();
		});

		// Check tabs exist
		expect(screen.getByText(/Projects Ledger/i)).toBeInTheDocument();
		expect(screen.getByText(/Tech Stack Radar/i)).toBeInTheDocument();
	});

	it("allows switching between Projects Ledger and Tech Stack Radar tabs", async () => {
		sessionStorage.setItem("editorial_admin_session", "true");
		renderWithRouter(<AdminDashboard showAppBar={false} />);

		expect(screen.getByText("Portfolio Administration")).toBeInTheDocument();

		// Default active tab is Projects Ledger
		expect(
			screen.getByPlaceholderText(/Search projects by name/i),
		).toBeInTheDocument();

		// Switch to Radar tab
		const radarTabBtn = screen.getByRole("button", {
			name: /Tech Stack Radar/i,
		});
		fireEvent.click(radarTabBtn);

		// Radar controls should now be visible
		expect(screen.getAllByText("All Quadrants")[0]).toBeInTheDocument();
		expect(
			screen.getAllByRole("button", { name: /Add Technology/i })[0],
		).toBeInTheDocument();
	});

	it("opens the Add Project modal and updates the list", async () => {
		sessionStorage.setItem("editorial_admin_session", "true");
		renderWithRouter(<AdminDashboard showAppBar={false} />);

		const addProjectBtn = screen.getByRole("button", {
			name: /Add Project/i,
		});
		fireEvent.click(addProjectBtn);

		expect(screen.getByRole("dialog")).toBeInTheDocument();
		expect(screen.getByText("GitHub Repo Name *")).toBeInTheDocument();

		// Fill in form
		fireEvent.change(screen.getByLabelText(/GitHub Repo Name \*/i), {
			target: { value: "New-AI-Tool" },
		});
		fireEvent.change(screen.getByLabelText(/Tagline/i), {
			target: { value: "A wonderful new tool for the portfolio." },
		});

		const saveBtn = screen.getByRole("button", { name: /Save Project/i });
		fireEvent.click(saveBtn);

		// Modal should close and new project should be listed
		expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
		expect(screen.getByText("New-AI-Tool")).toBeInTheDocument();
	});
});
