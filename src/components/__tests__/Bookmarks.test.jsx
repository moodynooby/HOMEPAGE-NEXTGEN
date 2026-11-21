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
import { ThemeContextProvider } from "@/contexts/ThemeContext";

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

vi.mock("kbar", () => ({
	useKBar: () => ({
		query: {
			toggle: vi.fn(),
		},
	}),
	KBarProvider: ({ children }) => <div>{children}</div>,
}));

vi.mock("@/utils/githubUtils", async (importOriginal) => {
	const actual = await importOriginal();
	return {
		...actual,
		fetchRepoMetadata: vi.fn().mockResolvedValue({
			year: 2023,
			stars: 10,
		}),
		fetchAddonMetadata: vi.fn(),
		fetchProjectHealth: vi.fn().mockResolvedValue(null),
	};
});

const renderWithProviders = (ui) => {
	return render(
		<ThemeContextProvider>
			<BookmarksContextProvider>
				<MemoryRouter>{ui}</MemoryRouter>
			</BookmarksContextProvider>
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
		localStorage.setItem(
			"bookmarked_projects",
			JSON.stringify(["test-project-1"]),
		);

		renderWithProviders(<Projects showAppBar={false} />);

		await waitFor(() => {
			expect(
				screen.queryByRole("status", { name: /loading projects/i }),
			).not.toBeInTheDocument();
		});

		expect(screen.getByText("test-project-1")).toBeInTheDocument();
		expect(screen.getByText("test-project-2")).toBeInTheDocument();

		const savedChip = screen.getByText("Saved (1)");
		fireEvent.click(savedChip);

		expect(screen.getByText("test-project-1")).toBeInTheDocument();
		expect(screen.queryByText("test-project-2")).not.toBeInTheDocument();
	});

	test("Projects component shows empty state message for empty bookmarks", async () => {
		renderWithProviders(<Projects showAppBar={false} />);

		await waitFor(() => {
			expect(
				screen.queryByRole("status", { name: /loading projects/i }),
			).not.toBeInTheDocument();
		});

		const savedChip = screen.getByText("Saved (0)");
		fireEvent.click(savedChip);

		expect(
			screen.getByText(
				"No bookmarked projects yet. Click the bookmark icon on any project to save it here.",
			),
		).toBeInTheDocument();
	});

	test("ProjectDetail allows bookmarking from header", async () => {
		render(
			<ThemeContextProvider>
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
			</ThemeContextProvider>,
		);

		const bookmarkBtn = await screen.findByRole("button", {
			name: /bookmark project/i,
		});
		expect(bookmarkBtn).toBeInTheDocument();

		fireEvent.click(bookmarkBtn);

		expect(
			await screen.findByRole("button", { name: /remove bookmark/i }),
		).toBeInTheDocument();
		expect(JSON.parse(localStorage.getItem("bookmarked_projects"))).toEqual([
			"test-project-1",
		]);
	});
});
