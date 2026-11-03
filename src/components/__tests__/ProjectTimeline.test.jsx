import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import ProjectTimeline, {
	PROJECT_CONFIG,
	TIMELINE_MILESTONES,
} from "../ProjectTimeline";

describe("ProjectTimeline Component", () => {
	it("renders the timeline header, search bar, and repo filter chips", () => {
		render(<ProjectTimeline />);

		// Header title and subtitle
		expect(
			screen.getByText(/Interactive Project Timeline & Release Milestones/i),
		).toBeInTheDocument();
		expect(
			screen.getByText(
				/Chronological evolution and release changelog across the 5 ecosystem applications/i,
			),
		).toBeInTheDocument();

		// Search input
		const searchInput = screen.getByTestId("milestone-search");
		expect(searchInput).toBeInTheDocument();
		expect(
			screen.getByPlaceholderText(
				/Search milestones, versions, features, or commits/i,
			),
		).toBeInTheDocument();

		// Filter chips for all 5 repos + All Repositories
		expect(screen.getByTestId("filter-All")).toBeInTheDocument();
		for (const projectId of Object.keys(PROJECT_CONFIG)) {
			expect(screen.getByTestId(`filter-${projectId}`)).toBeInTheDocument();
		}

		// Initial milestone count
		expect(
			screen.getByText(
				new RegExp(
					`Showing ${TIMELINE_MILESTONES.length} of ${TIMELINE_MILESTONES.length} milestones`,
				),
			),
		).toBeInTheDocument();
	});

	it("renders milestone entries across all 5 ecosystem applications", () => {
		render(<ProjectTimeline />);

		// Verify presence of milestones for each app
		expect(screen.getAllByText("NotebookForge").length).toBeGreaterThan(0);
		expect(screen.getAllByText("diet-logs").length).toBeGreaterThan(0);
		expect(screen.getAllByText("WhatsApp Incognito").length).toBeGreaterThan(0);
		expect(screen.getAllByText("notion-lite").length).toBeGreaterThan(0);
		expect(screen.getAllByText("HOMEPAGE").length).toBeGreaterThan(0);

		// Verify specific recent milestone titles
		expect(
			screen.getByText("Hands-Free Audio Flashcard Quiz Player"),
		).toBeInTheDocument();
		expect(
			screen.getByText(
				"Smart Multi-Source Nutrition Lookup & AI Food Estimation",
			),
		).toBeInTheDocument();
		expect(
			screen.getByText("Custom Contact Privacy Rules & Whitelist Manager"),
		).toBeInTheDocument();
		expect(
			screen.getByText(
				"Interactive Project Timeline & Release Milestone Changelog Drawer",
			),
		).toBeInTheDocument();
	});

	it("filters milestones when repository filter chips are clicked", () => {
		render(<ProjectTimeline />);

		// Filter by NotebookForge
		const nbFilter = screen.getByTestId("filter-NotebookForge");
		fireEvent.click(nbFilter);

		const nbCount = TIMELINE_MILESTONES.filter(
			(m) => m.project === "NotebookForge",
		).length;
		expect(
			screen.getByText(
				new RegExp(
					`Showing ${nbCount} of ${TIMELINE_MILESTONES.length} milestones in NotebookForge`,
				),
			),
		).toBeInTheDocument();

		// NotebookForge cards should be visible
		expect(
			screen.getByText("Hands-Free Audio Flashcard Quiz Player"),
		).toBeInTheDocument();

		// Other projects shouldn't be in the list
		expect(
			screen.queryByText(
				"Smart Multi-Source Nutrition Lookup & AI Food Estimation",
			),
		).not.toBeInTheDocument();

		// Reset by clicking "All Repositories"
		const allFilter = screen.getByTestId("filter-All");
		fireEvent.click(allFilter);

		expect(
			screen.getByText(
				new RegExp(
					`Showing ${TIMELINE_MILESTONES.length} of ${TIMELINE_MILESTONES.length} milestones`,
				),
			),
		).toBeInTheDocument();
	});

	it("filters milestones by search keywords across title, tags, and commits", () => {
		render(<ProjectTimeline />);

		const searchInput = screen.getByRole("textbox", {
			name: /Search milestones/i,
		});

		// Search for FSRS-4 tag
		fireEvent.change(searchInput, { target: { value: "FSRS-4" } });

		expect(
			screen.getByText("Hands-Free Audio Flashcard Quiz Player"),
		).toBeInTheDocument();
		expect(
			screen.queryByText("Custom Contact Privacy Rules & Whitelist Manager"),
		).not.toBeInTheDocument();

		// Clear search
		fireEvent.change(searchInput, { target: { value: "" } });
		expect(
			screen.getByText("Custom Contact Privacy Rules & Whitelist Manager"),
		).toBeInTheDocument();

		// Search by commit hash
		fireEvent.change(searchInput, { target: { value: "d34b173" } });
		expect(
			screen.getByText("Custom Contact Privacy Rules & Whitelist Manager"),
		).toBeInTheDocument();
		expect(
			screen.queryByText("Hands-Free Audio Flashcard Quiz Player"),
		).not.toBeInTheDocument();
	});

	it("opens slide-over changelog drawer when a milestone card is clicked", () => {
		render(<ProjectTimeline />);

		// Click on HAG-77 milestone card
		const cardButton = screen.getByRole("button", {
			name: /View release details for Hands-Free Audio Flashcard Quiz Player/i,
		});
		fireEvent.click(cardButton);

		// Drawer should now be visible with details
		expect(screen.getByTestId("milestone-drawer")).toBeInTheDocument();
		expect(screen.getByTestId("drawer-title")).toHaveTextContent(
			"Hands-Free Audio Flashcard Quiz Player",
		);

		// Verify commit link in drawer
		const commitLink = screen.getByTestId("drawer-commit-link");
		expect(commitLink).toBeInTheDocument();
		expect(commitLink).toHaveAttribute(
			"href",
			"https://github.com/moodynooby/NotebookForge/commit/85f69a7",
		);
		expect(commitLink).toHaveAttribute("target", "_blank");

		// Verify key changes are rendered
		expect(
			screen.getByText(
				/Audio flashcard synthesis generating high-fidelity Edge-TTS MP3 audio per card/i,
			),
		).toBeInTheDocument();
	});

	it("closes the drawer when close button is clicked", () => {
		render(<ProjectTimeline />);

		// Open drawer
		const cardButton = screen.getByRole("button", {
			name: /View release details for Custom Contact Privacy Rules & Whitelist Manager/i,
		});
		fireEvent.click(cardButton);

		expect(screen.getByTestId("milestone-drawer")).toBeInTheDocument();
		expect(
			screen.getByText("Breaking Changes & Schema Updates"),
		).toBeInTheDocument();

		// Click close button
		const closeBtn = screen.getByTestId("close-drawer");
		fireEvent.click(closeBtn);

		// Active milestone reset, drawer contents cleared
		expect(screen.queryByTestId("drawer-title")).not.toBeInTheDocument();
	});

	it("toggles sorting order between newest first and oldest first", () => {
		render(<ProjectTimeline />);

		const sortBtn = screen.getByRole("button", {
			name: /Sort oldest first/i,
		});
		fireEvent.click(sortBtn);

		// Oldest first button should now offer sort newest first
		expect(
			screen.getByRole("button", { name: /Sort newest first/i }),
		).toBeInTheDocument();

		// Earliest milestone (v1.0.0 WhatsApp Incognito from June 10, 2026) should be visible
		expect(
			screen.getByText("Incognito Presence & Read Receipt Blocker"),
		).toBeInTheDocument();
	});

	it("shows empty state when no milestones match filter query", () => {
		render(<ProjectTimeline />);

		const searchInput = screen.getByRole("textbox", {
			name: /Search milestones/i,
		});
		fireEvent.change(searchInput, {
			target: { value: "xyznonexistentquery999" },
		});

		expect(
			screen.getByText(/No milestones found matching your filters/i),
		).toBeInTheDocument();

		// Clicking Clear Filters button restores milestones
		const clearBtn = screen.getByRole("button", { name: /Clear Filters/i });
		fireEvent.click(clearBtn);

		expect(
			screen.getByText(
				new RegExp(
					`Showing ${TIMELINE_MILESTONES.length} of ${TIMELINE_MILESTONES.length} milestones`,
				),
			),
		).toBeInTheDocument();
	});
});
