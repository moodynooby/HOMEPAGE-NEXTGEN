import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { beforeEach, describe, expect, test, vi } from "vitest";
import ProjectDetail from "@/components/ProjectDetail";
import Projects from "@/components/Projects";
import {
	BookmarksContextProvider,
	useBookmarksContext,
} from "@/contexts/BookmarksContext";
import "@testing-library/jest-dom";
import { ThemeProvider } from "@mui/material/styles";
import { ThemeContextProvider } from "@/contexts/ThemeContext";
import { getTheme } from "@/theme/theme";

// Mock matchMedia
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

// Mock projects content
vi.mock("@/content/projects.json", () => ({
	default: [
		{
			githubName: "test-project-1",
			tagline: "Test Project 1",
			category: "Web App",
			githubImg: "test1.jpg",
		},
		{
			githubName: "test-project-2",
			tagline: "Test Project 2",
			category: "Browser Extension",
			githubImg: "test2.jpg",
		},
	],
}));

// Mock kbar to fix the 'query.toggle' TypeError in Header.jsx
vi.mock("kbar", () => ({
	useKBar: () => ({
		query: {
			toggle: vi.fn(),
		},
	}),
	KBarProvider: ({ children }) => <div>{children}</div>,
}));

// Mock GitHub API utils
vi.mock("@/utils/githubUtils", () => ({
	fetchRepoMetadata: vi.fn().mockResolvedValue({
		year: 2024,
		created_at: "2024-01-01T00:00:00Z",
		language: "JavaScript",
		stars: 10,
		forks: 2,
	}),
	fetchAddonMetadata: vi.fn().mockResolvedValue({
		averageDailyUsers: 100,
	}),
	groupProjectsByYear: (projects) => ({ 2024: projects }),
}));

const renderWithProviders = (ui) => {
	const theme = getTheme("light");
	return render(
		<ThemeContextProvider>
			<ThemeProvider theme={theme}>
				<BookmarksContextProvider>
					<MemoryRouter>{ui}</MemoryRouter>
				</BookmarksContextProvider>
			</ThemeProvider>
		</ThemeContextProvider>,
	);
};

describe("Bookmarks Feature", () => {
	beforeEach(() => {
		localStorage.clear();
		vi.clearAllMocks();
	});

	test("toggles bookmarks and persists to localStorage", async () => {
		const TestComponent = () => {
			const { bookmarks, isBookmarked, toggleBookmark } = useBookmarksContext();
			return (
				<div>
					<div data-testid="count">{bookmarks.length}</div>
					<div data-testid="is-bookmarked">
						{isBookmarked("test-project-1").toString()}
					</div>
					<button
						type="button"
						onClick={() => toggleBookmark("test-project-1")}
					>
						Toggle
					</button>
				</div>
			);
		};

		render(
			<BookmarksContextProvider>
				<TestComponent />
			</BookmarksContextProvider>,
		);

		expect(screen.getByTestId("count")).toHaveTextContent("0");
		expect(screen.getByTestId("is-bookmarked")).toHaveTextContent("false");

		fireEvent.click(screen.getByText("Toggle"));

		expect(screen.getByTestId("count")).toHaveTextContent("1");
		expect(screen.getByTestId("is-bookmarked")).toHaveTextContent("true");
		expect(JSON.parse(localStorage.getItem("bookmarked_projects"))).toEqual([
			"test-project-1",
		]);

		fireEvent.click(screen.getByText("Toggle"));

		expect(screen.getByTestId("count")).toHaveTextContent("0");
		expect(screen.getByTestId("is-bookmarked")).toHaveTextContent("false");
		expect(JSON.parse(localStorage.getItem("bookmarked_projects"))).toEqual([]);
	});

	test("loads bookmarks from localStorage on initialization", () => {
		localStorage.setItem(
			"bookmarked_projects",
			JSON.stringify(["saved-project"]),
		);

		const TestComponent = () => {
			const { bookmarks } = useBookmarksContext();
			return <div data-testid="count">{bookmarks.length}</div>;
		};

		render(
			<BookmarksContextProvider>
				<TestComponent />
			</BookmarksContextProvider>,
		);

		expect(screen.getByTestId("count")).toHaveTextContent("1");
	});

	test("Projects component filters by Bookmarked category", async () => {
		// Mock initial load state
		localStorage.setItem(
			"bookmarked_projects",
			JSON.stringify(["test-project-1"]),
		);

		renderWithProviders(<Projects limit={null} showAppBar={false} />);

		// Wait for initial load to finish
		await waitFor(() => {
			expect(
				screen.queryByRole("status", { name: /loading projects/i }),
			).not.toBeInTheDocument();
		});

		// Verify both projects are rendered initially (All category)
		expect(screen.getByText("test-project-1")).toBeInTheDocument();
		expect(screen.getByText("test-project-2")).toBeInTheDocument();

		// Click Bookmarked filter chip
		const savedChip = screen.getByText("Saved (1)");
		fireEvent.click(savedChip);

		// Now only test-project-1 should be visible
		expect(screen.getByText("test-project-1")).toBeInTheDocument();
		expect(screen.queryByText("test-project-2")).not.toBeInTheDocument();
	});

	test("Projects component shows empty state message for empty bookmarks", async () => {
		renderWithProviders(<Projects limit={null} showAppBar={false} />);

		await waitFor(() => {
			expect(
				screen.queryByRole("status", { name: /loading projects/i }),
			).not.toBeInTheDocument();
		});

		// Click Bookmarked filter chip (should have 0 count)
		const savedChip = screen.getByText("Saved (0)");
		fireEvent.click(savedChip);

		expect(
			screen.getByText(
				"No bookmarked projects yet. Click the bookmark icon on any project to save it here.",
			),
		).toBeInTheDocument();
	});

	test("ProjectDetail allows bookmarking from header", async () => {
		const theme = getTheme("light");
		render(
			<ThemeContextProvider>
				<ThemeProvider theme={theme}>
					<BookmarksContextProvider>
						<MemoryRouter initialEntries={["/projects/test-project-1"]}>
							<Routes>
								<Route
									path="/projects/:projectName"
									element={<ProjectDetail />}
								/>
							</Routes>
						</MemoryRouter>
					</BookmarksContextProvider>
				</ThemeProvider>
			</ThemeContextProvider>,
		);

		// Find the bookmark button
		const bookmarkBtn = await screen.findByRole("button", {
			name: /bookmark project/i,
		});
		expect(bookmarkBtn).toBeInTheDocument();

		fireEvent.click(bookmarkBtn);

		// It should change to "Remove bookmark"
		expect(
			await screen.findByRole("button", { name: /remove bookmark/i }),
		).toBeInTheDocument();
		expect(JSON.parse(localStorage.getItem("bookmarked_projects"))).toEqual([
			"test-project-1",
		]);
	});
});
