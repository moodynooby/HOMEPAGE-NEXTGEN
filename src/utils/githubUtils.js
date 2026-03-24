/**
 * Fetches repository metadata from GitHub API.
 *
 * @param {string} repoName - The name of the repository (moodynooby/{repoName}).
 * @returns {Promise<{created_at: string, pushed_at: string, year: number} | null>}
 */
export async function fetchRepoMetadata(repoName) {
	try {
		const response = await fetch(
			`https://api.github.com/repos/moodynooby/${repoName}`,
		);
		if (!response.ok) {
			throw new Error(`GitHub API error: ${response.statusText}`);
		}
		const data = await response.json();
		return {
			created_at: data.created_at,
			pushed_at: data.pushed_at,
			year: new Date(data.created_at).getFullYear(),
		};
	} catch (error) {
		console.warn(`Failed to fetch metadata for ${repoName}:`, error);
		return null;
	}
}

/**
 * Groups projects by their year.
 *
 * @param {Array} projects - List of project objects with year property.
 * @returns {Object} - Projects grouped by year in descending order.
 */
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
