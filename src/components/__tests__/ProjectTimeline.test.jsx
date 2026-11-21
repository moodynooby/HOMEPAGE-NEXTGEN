import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import {
	PROJECT_CONFIG,
	TIMELINE_MILESTONES,
} from "@/content/timelineMilestones";
import ProjectTimeline from "../ProjectTimeline";

const cardCount = () => screen.getAllByTestId(/^milestone-item-/).length;

describe("ProjectTimeline Component", () => {
	it("offers a search box and a filter chip for every project", () => {
		render(<ProjectTimeline />);

		expect(screen.getByTestId("milestone-search")).toBeInTheDocument();
		for (const projectId of Object.keys(PROJECT_CONFIG)) {
			expect(screen.getByTestId(`filter-${projectId}`)).toBeInTheDocument();
		}
	});

	it("renders every milestone in the content", () => {
		render(<ProjectTimeline />);

		expect(cardCount()).toBe(TIMELINE_MILESTONES.length);
		expect(screen.getByText(TIMELINE_MILESTONES[0].title)).toBeInTheDocument();
	});

	it("filters milestones when repository filter chips are clicked", () => {
		render(<ProjectTimeline />);

		const projectId = Object.keys(PROJECT_CONFIG)[0];
		const expected = TIMELINE_MILESTONES.filter(
			(milestone) => milestone.project === projectId,
		).length;

		fireEvent.click(screen.getByTestId(`filter-${projectId}`));

		expect(cardCount()).toBe(expected);
		expect(
			screen.getByText(
				new RegExp(
					`Showing ${expected} of ${TIMELINE_MILESTONES.length} milestones in ${projectId}`,
				),
			),
		).toBeInTheDocument();

		fireEvent.click(screen.getByTestId("filter-All"));
		expect(cardCount()).toBe(TIMELINE_MILESTONES.length);
	});

	it("filters milestones by a commit from the content", () => {
		const sample = TIMELINE_MILESTONES.find((milestone) => milestone.commit);
		render(<ProjectTimeline />);

		const searchInput = screen.getByRole("textbox", {
			name: /Search milestones/i,
		});
		fireEvent.change(searchInput, { target: { value: sample.commit } });

		expect(screen.getByText(sample.title)).toBeInTheDocument();
		expect(cardCount()).toBe(1);
	});

	it("opens the changelog drawer with the selected milestone's data", () => {
		const sample = TIMELINE_MILESTONES[0];
		render(<ProjectTimeline />);

		fireEvent.click(
			screen.getByRole("button", {
				name: `View release details for ${sample.title}`,
			}),
		);

		expect(screen.getByTestId("milestone-drawer")).toBeInTheDocument();
		expect(screen.getByTestId("drawer-title")).toHaveTextContent(sample.title);
		expect(screen.getByTestId("drawer-commit-link")).toHaveAttribute(
			"href",
			`${PROJECT_CONFIG[sample.project].repoUrl}/commit/${sample.commit}`,
		);
	});

	it("closes the drawer when the close button is clicked", () => {
		render(<ProjectTimeline />);

		fireEvent.click(
			screen.getByRole("button", {
				name: `View release details for ${TIMELINE_MILESTONES[0].title}`,
			}),
		);
		expect(screen.getByTestId("milestone-drawer")).toBeInTheDocument();

		fireEvent.click(screen.getByTestId("close-drawer"));
		expect(screen.queryByTestId("drawer-title")).not.toBeInTheDocument();
	});

	it("reverses the milestone order when sorting is toggled", () => {
		render(<ProjectTimeline />);

		const firstTitle = () =>
			screen.getAllByTestId(/^milestone-item-/)[0].querySelector("h4")
				.textContent;

		const newestFirst = firstTitle();
		fireEvent.click(screen.getByRole("button", { name: /Sort oldest first/i }));

		expect(
			screen.getByRole("button", { name: /Sort newest first/i }),
		).toBeInTheDocument();
		expect(firstTitle()).not.toBe(newestFirst);
	});

	it("shows an empty state and resets when no milestones match", () => {
		render(<ProjectTimeline />);

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
		expect(cardCount()).toBe(TIMELINE_MILESTONES.length);
	});
});
