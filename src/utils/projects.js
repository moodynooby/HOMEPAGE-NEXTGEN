export function groupProjectsByYear(projects) {
	const grouped = projects.reduce((acc, project) => {
		const year = project.year || "Unknown";
		if (!acc[year]) acc[year] = [];
		acc[year].push(project);
		return acc;
	}, {});

	return Object.keys(grouped)
		.sort((a, b) => (b === "Unknown" ? -1 : a === "Unknown" ? 1 : b - a))
		.reduce((acc, key) => {
			acc[key] = grouped[key];
			return acc;
		}, {});
}
