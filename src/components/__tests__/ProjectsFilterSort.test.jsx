import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { vi } from "vitest";
import { BookmarksContextProvider } from "@/contexts/BookmarksContext";
import Projects from "../Projects";

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

vi.mock("@/utils/githubUtils", async (importOriginal) => {
	const actual = await importOriginal();
	return {
		...actual,
		fetchRepoMetadata: vi.fn().mockImplementation((name) => {
			if (name === "Project-A")
				return Promise.resolve({
					year: 2023,
					language: "JavaScript",
					stars: 10,
					pushed_at: "2023-06-01T00:00:00Z",
				});
			if (name === "Project-B")
				return Promise.resolve({
					year: 2024,
					language: "Python",
					stars: 5,
					pushed_at: "2024-06-01T00:00:00Z",
				});
			if (name === "Project-C")
				return Promise.resolve({
					year: 2022,
					language: "Rust",
					stars: 20,
					pushed_at: "2022-06-01T00:00:00Z",
				});
			return Promise.resolve({ year: 2023, stars: 10 });
		}),
		fetchAddonMetadata: vi.fn(),
		fetchProjectHealth: vi.fn().mockResolvedValue(null),
	};
});

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

const renderProjects = () =>
	render(
		<BookmarksContextProvider>
			<BrowserRouter>
				<Projects showAppBar={false} />
			</BrowserRouter>
		</BookmarksContextProvider>,
	);

describe("Projects - Filter and Sort", () => {
	it("renders filter chips and allows filtering by technology", async () => {
		renderProjects();

		await waitFor(() => {
			expect(screen.queryByRole("status")).not.toBeInTheDocument();
		});

		expect(screen.getByText("Technologies / Languages")).toBeInTheDocument();
		expect(screen.getByText("JavaScript")).toBeInTheDocument();
		expect(screen.getByText("Python")).toBeInTheDocument();
		expect(screen.getByText("Rust")).toBeInTheDocument();

		fireEvent.click(screen.getByText("Python"));

		expect(screen.queryByText("Project-A")).not.toBeInTheDocument();
		expect(screen.getByText("Project-B")).toBeInTheDocument();
		expect(screen.queryByText("Project-C")).not.toBeInTheDocument();

		expect(screen.getByText("Reset All Filters")).toBeInTheDocument();
		fireEvent.click(screen.getByText("Reset All Filters"));

		expect(screen.getByText("Project-A")).toBeInTheDocument();
		expect(screen.getByText("Project-B")).toBeInTheDocument();
		expect(screen.getByText("Project-C")).toBeInTheDocument();
	});

	it("sorts projects by Stars and by Name", async () => {
		renderProjects();

		await waitFor(() => {
			expect(screen.queryByRole("status")).not.toBeInTheDocument();
		});

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
