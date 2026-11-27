import { useEffect, useMemo, useState } from "react";
import { FILTER_ALL } from "@/config/ledger";
import { githubRepoUrl, SITE_OWNER } from "@/config/site";
import useProjectsData from "@/hooks/useProjectsData";
import { fetchRepoReleases } from "@/utils/githubUtils";

const PROJECT_COLORS = [
	"var(--color-chart-adopt)",
	"var(--color-chart-trial)",
	"var(--color-chart-assess)",
	"var(--color-chart-hold)",
	"var(--color-accent)",
];

function parseReleaseBody(body) {
	if (!body) return { summary: "Published release on GitHub.", details: [] };
	const lines = body
		.split(/\r?\n/)
		.map((line) =>
			line
				.replace(/^[-*•]\s*/, "")
				.replace(/^#+\s*/, "")
				.trim(),
		)
		.filter(Boolean);
	return {
		summary: lines[0] || "Published release on GitHub.",
		details: lines.slice(1, 8),
	};
}

function releaseToMilestone(project, release) {
	const { summary, details } = parseReleaseBody(release.body);
	return {
		id: `${project.githubName}-${release.id || release.tag_name}`,
		project: project.githubName,
		version: release.tag_name || "release",
		date: (release.published_at || "").slice(0, 10),
		title: release.name || release.tag_name,
		summary,
		badge: release.prerelease ? "Pre-release" : "Release",
		commit: release.tag_name || "HEAD",
		tags: [project.category, project.language, ...(project.topics || [])]
			.filter(Boolean)
			.slice(0, 4),
		details,
		url: release.html_url,
		breakingChanges: null,
	};
}

function repoActivityMilestone(project) {
	const date = (project.pushed_at || project.date || "").slice(0, 10);
	if (!date) return null;
	return {
		id: `${project.githubName}-activity`,
		project: project.githubName,
		version: `${project.year || new Date().getFullYear()}`,
		date,
		title: `${project.githubName} — Latest Repository Update`,
		summary: project.tagline,
		badge: project.category || "Update",
		commit: "main",
		tags: [project.category, project.language, ...(project.topics || [])]
			.filter(Boolean)
			.slice(0, 4),
		details: [
			project.language ? `Primary language: ${project.language}` : null,
			project.stars > 0 ? `${project.stars} GitHub stars` : null,
		].filter(Boolean),
		breakingChanges: null,
	};
}

export default function useTimelineFilters(limit = null) {
	const { projects, loading: projectsLoading } = useProjectsData();
	const [milestones, setMilestones] = useState([]);
	const [releasesLoading, setReleasesLoading] = useState(true);
	const [selectedProject, setSelectedProject] = useState(FILTER_ALL);
	const [searchQuery, setSearchQuery] = useState("");
	const [sortDesc, setSortDesc] = useState(true);
	const [activeMilestone, setActiveMilestone] = useState(null);
	const [visibleCount, setVisibleCount] = useState(limit || Infinity);

	useEffect(() => {
		if (projectsLoading) return undefined;
		let isMounted = true;

		async function loadReleases() {
			setReleasesLoading(true);
			const results = await Promise.all(
				projects.map(async (project) => {
					const releases = await fetchRepoReleases(project.githubName);
					if (releases.length > 0) {
						return releases.map((r) => releaseToMilestone(project, r));
					}
					const fallback = repoActivityMilestone(project);
					return fallback ? [fallback] : [];
				}),
			);

			if (isMounted) {
				setMilestones(results.flat());
				setReleasesLoading(false);
			}
		}

		loadReleases();
		return () => {
			isMounted = false;
		};
	}, [projects, projectsLoading]);

	const projectConfig = useMemo(() => {
		const config = {};
		projects.forEach((project, idx) => {
			config[project.githubName] = {
				shortName: project.githubName,
				color: PROJECT_COLORS[idx % PROJECT_COLORS.length],
				repo: `${SITE_OWNER}/${project.githubName}`,
				repoUrl: githubRepoUrl(project.githubName),
			};
		});
		return config;
	}, [projects]);

	const projectFilterOptions = useMemo(() => {
		const counts = { [FILTER_ALL]: milestones.length };
		for (const milestone of milestones) {
			counts[milestone.project] = (counts[milestone.project] || 0) + 1;
		}
		const activeProjects = Object.keys(projectConfig).filter(
			(name) => (counts[name] || 0) > 0,
		);
		return [
			{
				id: FILTER_ALL,
				label: "All Repositories",
				count: counts[FILTER_ALL] || 0,
			},
			...activeProjects.map((project) => ({
				id: project,
				label: projectConfig[project].shortName || project,
				count: counts[project] || 0,
				color: projectConfig[project].color,
			})),
		];
	}, [milestones, projectConfig]);

	const filteredMilestones = useMemo(() => {
		const query = searchQuery.trim().toLowerCase();
		return milestones
			.filter((milestone) => {
				const matchesProject =
					selectedProject === FILTER_ALL ||
					milestone.project === selectedProject;
				if (!matchesProject) return false;
				if (!query) return true;

				return [
					milestone.title,
					milestone.summary,
					milestone.version,
					milestone.project,
					milestone.commit,
					milestone.badge,
					...(milestone.tags || []),
					...(milestone.details || []),
				]
					.join(" ")
					.toLowerCase()
					.includes(query);
			})
			.sort((a, b) => {
				const timeA = new Date(a.date).getTime();
				const timeB = new Date(b.date).getTime();
				return sortDesc ? timeB - timeA : timeA - timeB;
			});
	}, [milestones, selectedProject, searchQuery, sortDesc]);

	return {
		projectConfig,
		totalMilestones: milestones.length,
		loading: projectsLoading || releasesLoading,
		selectedProject,
		setSelectedProject,
		searchQuery,
		setSearchQuery,
		sortDesc,
		setSortDesc,
		activeMilestone,
		setActiveMilestone,
		visibleCount,
		setVisibleCount,
		projectFilterOptions,
		filteredMilestones,
		resetFilters: () => {
			setSelectedProject(FILTER_ALL);
			setSearchQuery("");
		},
	};
}
