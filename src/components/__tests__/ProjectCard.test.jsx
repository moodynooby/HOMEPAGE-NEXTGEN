import { render, screen, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import ProjectCard from "@/components/ProjectCard";
import { BookmarksProvider } from "@/contexts/BookmarksContext";
import * as githubUtils from "@/utils/githubUtils";

vi.mock("@/contexts/BookmarksContext", () => ({
	useBookmarksContext: () => ({
		isBookmarked: vi.fn(),
		toggleBookmark: vi.fn(),
	}),
	BookmarksProvider: ({ children }) => <>{children}</>,
}));

vi.mock("@/utils/githubUtils", async (importOriginal) => {
	const actual = await importOriginal();
	return {
		...actual,
		fetchProjectHealth: vi.fn(),
	};
});

const mockProject = {
	githubName: "TestProject",
	githubImg: "test.png",
	tagline: "A test project",
	category: "Web App",
	language: "JavaScript",
	stars: 42,
};

const renderWithContext = (ui) => {
	return render(
		<BrowserRouter>
			<BookmarksProvider>{ui}</BookmarksProvider>
		</BrowserRouter>,
	);
};

describe("ProjectCard", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it("renders project details correctly", async () => {
		githubUtils.fetchProjectHealth.mockResolvedValue(null);

		renderWithContext(
			<ProjectCard
				project={mockProject}
				entryNumber={1}
				isMobile={false}
				shouldReduceMotion={true}
				year="2023"
			/>,
		);

		expect(screen.getByText("TestProject")).toBeInTheDocument();
		expect(screen.getByText("A test project")).toBeInTheDocument();
		expect(screen.getByText("Web App")).toBeInTheDocument();
		expect(screen.getByText("42")).toBeInTheDocument(); // Stars
	});

	it("renders dynamic health metrics when available", async () => {
		githubUtils.fetchProjectHealth.mockResolvedValue({
			latestRelease: "v1.0.0",
			openIssues: 5,
			size: 2048, // 2MB
			pushed_at: new Date().toISOString(),
		});

		renderWithContext(
			<ProjectCard
				project={mockProject}
				entryNumber={1}
				isMobile={false}
				shouldReduceMotion={true}
				year="2023"
			/>,
		);

		await waitFor(() => {
			expect(screen.getByText("v1.0.0")).toBeInTheDocument();
			expect(screen.getByText("5 issues")).toBeInTheDocument();
			expect(screen.getByText("2.0 MB")).toBeInTheDocument();
		});
	});

	it("handles singular issue correctly", async () => {
		githubUtils.fetchProjectHealth.mockResolvedValue({
			latestRelease: "v1.0.0",
			openIssues: 1,
			size: 2048,
			pushed_at: new Date().toISOString(),
		});

		renderWithContext(
			<ProjectCard
				project={mockProject}
				entryNumber={1}
				isMobile={false}
				shouldReduceMotion={true}
				year="2023"
			/>,
		);

		await waitFor(() => {
			expect(screen.getByText("1 issue")).toBeInTheDocument();
		});
	});

	it("renders active pulse indicator for recent updates", async () => {
		const recentDate = new Date();
		recentDate.setDate(recentDate.getDate() - 5); // 5 days ago (Active)

		githubUtils.fetchProjectHealth.mockResolvedValue({
			pushed_at: recentDate.toISOString(),
		});

		const { container } = renderWithContext(
			<ProjectCard
				project={mockProject}
				entryNumber={1}
				isMobile={false}
				shouldReduceMotion={true}
				year="2023"
			/>,
		);

		await waitFor(() => {
			const pulseBox = container.querySelector('[title="Active"]');
			expect(pulseBox).toBeInTheDocument();
		});
	});

	it("renders maintenance pulse indicator for older updates", async () => {
		const oldDate = new Date();
		oldDate.setDate(oldDate.getDate() - 40); // 40 days ago (Maintenance)

		githubUtils.fetchProjectHealth.mockResolvedValue({
			pushed_at: oldDate.toISOString(),
		});

		const { container } = renderWithContext(
			<ProjectCard
				project={mockProject}
				entryNumber={1}
				isMobile={false}
				shouldReduceMotion={true}
				year="2023"
			/>,
		);

		await waitFor(() => {
			const pulseBox = container.querySelector('[title="Maintenance"]');
			expect(pulseBox).toBeInTheDocument();
		});
	});
});
