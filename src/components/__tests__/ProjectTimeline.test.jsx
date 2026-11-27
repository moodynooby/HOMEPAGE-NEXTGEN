import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import ProjectTimeline from "../ProjectTimeline";

vi.mock("@/hooks/useProjectsData", () => ({
	default: () => ({
		loading: false,
		loadError: "",
		projects: [
			{
				githubName: "Todo.Txt",
				category: "Web App",
				language: "JavaScript",
				tagline: "Plain-text todo app.",
				year: 2024,
				pushed_at: "2026-10-01T00:00:00Z",
				stars: 12,
				topics: ["react"],
			},
			{
				githubName: "Modern-TWP",
				category: "Browser Extension",
				language: "TypeScript",
				tagline: "Fast translation extension.",
				year: 2025,
				pushed_at: "2026-09-01T00:00:00Z",
				stars: 20,
				topics: ["webextension"],
			},
		],
	}),
}));

vi.mock("@/utils/githubUtils", async (importOriginal) => {
	const actual = await importOriginal();
	return {
		...actual,
		fetchRepoReleases: vi.fn(async (repoName) => {
			if (repoName === "Todo.Txt") {
				return [
					{
						id: 101,
						tag_name: "v1.2.0",
						name: "Keyboard Navigation Overhaul",
						body: "Added full vim-style keybindings.\n- J/K navigation\n- Quick archive",
						published_at: "2026-11-01T12:00:00Z",
						prerelease: false,
						html_url:
							"https://github.com/moodynooby/Todo.Txt/releases/tag/v1.2.0",
					},
				];
			}
			return [];
		}),
	};
});

const cardCount = () => screen.getAllByTestId(/^milestone-item-/).length;

describe("ProjectTimeline Component", () => {
	it("offers a search box and filter chips for repositories", async () => {
		render(<ProjectTimeline />);

		await waitFor(() => {
			expect(screen.getByTestId("filter-Todo.Txt")).toBeInTheDocument();
		});
		expect(screen.getByTestId("milestone-search")).toBeInTheDocument();
		expect(screen.getByTestId("filter-Modern-TWP")).toBeInTheDocument();
	});

	it("renders dynamic GitHub releases and fallback activity milestones", async () => {
		render(<ProjectTimeline />);

		await waitFor(() => {
			expect(
				screen.getByText("Keyboard Navigation Overhaul"),
			).toBeInTheDocument();
		});
		expect(cardCount()).toBe(2);
	});

	it("filters milestones when repository filter chips are clicked", async () => {
		render(<ProjectTimeline />);

		await waitFor(() => {
			expect(cardCount()).toBe(2);
		});

		fireEvent.click(screen.getByTestId("filter-Todo.Txt"));
		expect(cardCount()).toBe(1);
		expect(
			screen.getByText(/Showing 1 of 2 milestones in Todo\.Txt/),
		).toBeInTheDocument();

		fireEvent.click(screen.getByTestId("filter-All"));
		expect(cardCount()).toBe(2);
	});

	it("filters milestones by search query", async () => {
		render(<ProjectTimeline />);

		await waitFor(() => {
			expect(cardCount()).toBe(2);
		});

		fireEvent.change(
			screen.getByRole("textbox", { name: /Search milestones/i }),
			{
				target: { value: "v1.2.0" },
			},
		);

		expect(
			screen.getByText("Keyboard Navigation Overhaul"),
		).toBeInTheDocument();
		expect(cardCount()).toBe(1);
	});

	it("opens and closes the changelog drawer", async () => {
		render(<ProjectTimeline />);

		await waitFor(() => {
			expect(
				screen.getByText("Keyboard Navigation Overhaul"),
			).toBeInTheDocument();
		});

		fireEvent.click(
			screen.getByRole("button", {
				name: "View release details for Keyboard Navigation Overhaul",
			}),
		);

		expect(screen.getByTestId("milestone-drawer")).toBeInTheDocument();
		expect(screen.getByTestId("drawer-title")).toHaveTextContent(
			"Keyboard Navigation Overhaul",
		);

		fireEvent.click(screen.getByTestId("close-drawer"));
		expect(screen.queryByTestId("drawer-title")).not.toBeInTheDocument();
	});

	it("shows an empty state and resets when no milestones match", async () => {
		render(<ProjectTimeline />);

		await waitFor(() => {
			expect(cardCount()).toBe(2);
		});

		fireEvent.change(
			screen.getByRole("textbox", { name: /Search milestones/i }),
			{
				target: { value: "xyznonexistentquery999" },
			},
		);

		expect(
			screen.getByText(/No milestones found matching your filters/i),
		).toBeInTheDocument();

		fireEvent.click(screen.getByRole("button", { name: /Clear Filters/i }));
		expect(cardCount()).toBe(2);
	});
});
