import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { vi } from "vitest";
import Projects from "../Projects";

// Mock matchMedia to prevent motion/react errors during tests
beforeAll(() => {
	Object.defineProperty(window, "matchMedia", {
		writable: true,
		value: vi.fn().mockImplementation((query) => ({
			matches: false,
			media: query,
			onchange: null,
			addListener: vi.fn(),
			removeListener: vi.fn(),
			addEventListener: vi.fn(),
			removeEventListener: vi.fn(),
			dispatchEvent: vi.fn(),
		})),
	});
});

vi.mock("@/utils/githubUtils", () => ({
	fetchRepoMetadata: vi.fn((repoName) => {
		const mocks = {
			"Project-A": {
				created_at: "2023-01-01T00:00:00Z",
				year: 2023,
				language: "JavaScript",
				stars: 10,
			},
			"Project-B": {
				created_at: "2024-01-01T00:00:00Z",
				year: 2024,
				language: "Python",
				stars: 5,
			},
			"Project-C": {
				created_at: "2022-01-01T00:00:00Z",
				year: 2022,
				language: "Rust",
				stars: 20,
			},
		};
		return Promise.resolve(
			mocks[repoName] || {
				created_at: "2021-01-01T00:00:00Z",
				year: 2021,
				language: null,
				stars: 0,
			},
		);
	}),
	fetchAddonMetadata: vi.fn(() => Promise.resolve(null)),
	groupProjectsByYear: vi.fn((projects) => {
		const grouped = {};
		for (const p of projects) {
			const year = p.year || "Unknown";
			if (!grouped[year]) grouped[year] = [];
			grouped[year].push(p);
		}
		return grouped;
	}),
}));

vi.mock("@/content/projects.json", () => ({
	default: [
		{ githubName: "Project-A", category: "Web App", tagline: "Tagline A" },
		{
			githubName: "Project-B",
			category: "Browser Extension",
			tagline: "Tagline B",
		},
		{ githubName: "Project-C", category: "Web App", tagline: "Tagline C" },
	],
}));

describe("Projects - Filter and Sort", () => {
	it("renders filter chips and allows filtering by technology", async () => {
		render(
			<BrowserRouter>
				<Projects showAppBar={false} />
			</BrowserRouter>,
		);

		await waitFor(() => {
			expect(screen.queryByRole("status")).not.toBeInTheDocument();
		});

		// Technologies should be present
		expect(screen.getByText("Technologies / Languages")).toBeInTheDocument();
		expect(screen.getByText("JavaScript")).toBeInTheDocument();
		expect(screen.getByText("Python")).toBeInTheDocument();
		expect(screen.getByText("Rust")).toBeInTheDocument();

		// Click on Python
		fireEvent.click(screen.getByText("Python"));

		// Only Project-B should be visible
		expect(screen.queryByText("Project-A")).not.toBeInTheDocument();
		expect(screen.getByText("Project-B")).toBeInTheDocument();
		expect(screen.queryByText("Project-C")).not.toBeInTheDocument();

		// Badge count should be 1
		// We can't directly check the badge easily if it has no role, but we can look for Reset button
		expect(screen.getByText("Reset All Filters")).toBeInTheDocument();

		// Click reset
		fireEvent.click(screen.getByText("Reset All Filters"));

		// All projects should be visible again
		expect(screen.getByText("Project-A")).toBeInTheDocument();
		expect(screen.getByText("Project-B")).toBeInTheDocument();
		expect(screen.getByText("Project-C")).toBeInTheDocument();
	});

	it("sorts projects by Stars and by Name", async () => {
		render(
			<BrowserRouter>
				<Projects showAppBar={false} />
			</BrowserRouter>,
		);

		await waitFor(() => {
			expect(screen.queryByRole("status")).not.toBeInTheDocument();
		});

		// Currently grouped by year by default, so order is 2024, 2023, 2022
		const getProjectNames = () => {
			const projectLinks = screen.getAllByRole("link");
			return projectLinks
				.map((link) => {
					const heading = link.querySelector("h5");
					return heading ? heading.textContent : "";
				})
				.filter(Boolean);
		};

		expect(getProjectNames()).toEqual(["Project-B", "Project-A", "Project-C"]);

		// Change sort to Most Stars (C=20, A=10, B=5)
		const select = screen.getByRole("combobox", { name: /sort by/i });
		fireEvent.mouseDown(select);
		fireEvent.click(screen.getByRole("option", { name: "Most Stars" }));

		await waitFor(() => {
			expect(getProjectNames()).toEqual([
				"Project-C",
				"Project-A",
				"Project-B",
			]);
		});

		// Change sort to Name (Z-A)
		fireEvent.mouseDown(select);
		fireEvent.click(screen.getByRole("option", { name: "Name (Z-A)" }));

		await waitFor(() => {
			expect(getProjectNames()).toEqual([
				"Project-C",
				"Project-B",
				"Project-A",
			]);
		});
	});
});
