/**
 * Fetches repository metadata from GitHub API.
 * Caches results in localStorage for 7 days to avoid rate limits.
 *
 * @param {string} repoName - The name of the repository (moodynooby/{repoName}).
 * @returns {Promise<{created_at: string, pushed_at: string, year: number} | null>}
 */
export async function fetchRepoMetadata(repoName) {
	const cacheKey = `github_meta_${repoName}`;
	const cacheTimeKey = `github_meta_time_${repoName}`;
	const CACHE_DURATION = 7 * 24 * 60 * 60 * 1000; // 7 days

	try {
		const cachedData = localStorage.getItem(cacheKey);
		const cachedTime = localStorage.getItem(cacheTimeKey);

		if (cachedData && cachedTime) {
			const age = Date.now() - parseInt(cachedTime, 10);
			if (age < CACHE_DURATION) {
				return JSON.parse(cachedData);
			}
		}

		const response = await fetch(
			`https://api.github.com/repos/moodynooby/${repoName}`,
		);

		if (!response.ok) {
			if (response.status === 403) {
				console.warn(
					`GitHub API rate limit exceeded for ${repoName}. Using cached/fallback data.`,
				);
				if (cachedData) {
					return JSON.parse(cachedData);
				}
				return {
					created_at: null,
					pushed_at: null,
					year: new Date().getFullYear(),
				};
			}
			throw new Error(`GitHub API error: ${response.statusText}`);
		}

		const data = await response.json();
		const metadata = {
			created_at: data.created_at,
			pushed_at: data.pushed_at,
			year: new Date(data.created_at).getFullYear(),
		};

		localStorage.setItem(cacheKey, JSON.stringify(metadata));
		localStorage.setItem(cacheTimeKey, Date.now().toString());

		return metadata;
	} catch (error) {
		const cachedData = localStorage.getItem(cacheKey);
		if (cachedData) {
			console.warn(
				`Using cached data for ${repoName} due to error:`,
				error.message,
			);
			return JSON.parse(cachedData);
		}

		console.warn(`Failed to fetch metadata for ${repoName}:`, error.message);
		return {
			created_at: null,
			pushed_at: null,
			year: new Date().getFullYear(),
		};
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
