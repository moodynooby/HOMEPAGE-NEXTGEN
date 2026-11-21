export const UNKNOWN_YEAR = "Unknown";

export const emptyRepoMetadata = () => ({
	created_at: null,
	pushed_at: null,
	year: new Date().getFullYear(),
	language: null,
	stars: 0,
	forks: 0,
	watchers: 0,
});

export const withProjectMetadata = (project, metadata, addonMetadata) => {
	const fallback = emptyRepoMetadata();
	return {
		...project,
		year: metadata?.year || fallback.year,
		date: metadata?.created_at || "",
		pushed_at: metadata?.pushed_at || "",
		language: metadata?.language || "",
		stars: metadata?.stars || 0,
		forks: metadata?.forks || 0,
		addonMetadata,
	};
};

export const byRecencyDesc = (a, b) => {
	const dateB = b.pushed_at ? new Date(b.pushed_at) : new Date(b.year, 0, 1);
	const dateA = a.pushed_at ? new Date(a.pushed_at) : new Date(a.year, 0, 1);
	return dateB - dateA;
};

export const selectFeaturedProjects = (projects) =>
	projects.filter((project) => project.featured);

export function groupProjectsByYear(projects) {
	const grouped = projects.reduce((acc, project) => {
		const year = project.year || UNKNOWN_YEAR;
		if (!acc[year]) acc[year] = [];
		acc[year].push(project);
		return acc;
	}, {});

	return Object.keys(grouped).reduce((acc, key) => {
		acc[key] = grouped[key];
		return acc;
	}, {});
}
