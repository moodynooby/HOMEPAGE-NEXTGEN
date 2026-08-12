/**
 * Fetches repository metadata from GitHub API.
 * Caches results in localStorage for 7 days to avoid rate limits.
 *
 * @param {string} repoName - The name of the repository (moodynooby/{repoName}).
 * @returns {Promise<{created_at: string, pushed_at: string, year: number, language: string, stars: number, forks: number, watchers: number} | null>}
 */
export async function fetchRepoMetadata(repoName) {
	const cacheKey = `github_meta_v3_${repoName}`;
	const cacheTimeKey = `github_meta_time_v3_${repoName}`;
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
					language: null,
					stars: 0,
					forks: 0,
					watchers: 0,
				};
			}
			throw new Error(`GitHub API error: ${response.statusText}`);
		}

		const data = await response.json();
		const metadata = {
			created_at: data.created_at,
			pushed_at: data.pushed_at,
			year: new Date(data.created_at).getFullYear(),
			language: data.language,
			stars: data.stargazers_count || 0,
			forks: data.forks_count || 0,
			watchers: data.watchers_count || 0,
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
			language: null,
			stars: 0,
			forks: 0,
			watchers: 0,
		};
	}
}

/**
 * Groups projects by their year.
 *
 * @param {Array} projects - List of project objects with year property.
 * @returns {Object} - Projects grouped by year in descending order.
 */
/**
 * Fetches profile and repository statistics directly from GitHub.
 * The result is cached for 24 hours so the homepage stays lightweight and low-upkeep.
 *
 * @param {string} username - GitHub username.
 * @returns {Promise<{followers: number, following: number, publicRepos: number, totalStars: number, languages: Array<{name: string, count: number}>} | null>}
 */
export async function fetchUserStats(username) {
	const cacheKey = `github_user_stats_v1_${username}`;
	const cacheTimeKey = `github_user_stats_time_v1_${username}`;
	const CACHE_DURATION = 24 * 60 * 60 * 1000;

	try {
		const cachedData = localStorage.getItem(cacheKey);
		const cachedTime = localStorage.getItem(cacheTimeKey);
		if (
			cachedData &&
			cachedTime &&
			Date.now() - Number(cachedTime) < CACHE_DURATION
		) {
			return JSON.parse(cachedData);
		}

		const [profileResponse, reposResponse] = await Promise.all([
			fetch(`https://api.github.com/users/${encodeURIComponent(username)}`),
			fetch(
				`https://api.github.com/users/${encodeURIComponent(username)}/repos?per_page=100&type=owner`,
			),
		]);

		if (!profileResponse.ok || !reposResponse.ok) {
			throw new Error("GitHub profile request failed");
		}

		const profile = await profileResponse.json();
		const repositories = await reposResponse.json();
		const languageCounts = repositories.reduce((counts, repo) => {
			if (repo.language)
				counts[repo.language] = (counts[repo.language] || 0) + 1;
			return counts;
		}, {});

		const stats = {
			followers: profile.followers || 0,
			following: profile.following || 0,
			publicRepos: profile.public_repos || 0,
			totalStars: repositories.reduce(
				(total, repo) => total + (repo.stargazers_count || 0),
				0,
			),
			languages: Object.entries(languageCounts)
				.sort(([, a], [, b]) => b - a)
				.slice(0, 5)
				.map(([name, count]) => ({ name, count })),
		};

		localStorage.setItem(cacheKey, JSON.stringify(stats));
		localStorage.setItem(cacheTimeKey, Date.now().toString());
		return stats;
	} catch (error) {
		const cachedData = localStorage.getItem(cacheKey);
		if (cachedData) return JSON.parse(cachedData);
		console.warn(
			`Failed to fetch GitHub user stats for ${username}:`,
			error.message,
		);
		return null;
	}
}

/**
 * Fetches public Mozilla Add-ons metadata and caches it for 24 hours.
 * This avoids third-party image badges while keeping extension metrics current.
 *
 * @param {string} addonId - Mozilla Add-ons slug.
 * @returns {Promise<{averageDailyUsers: number, weeklyDownloads: number, rating: number, ratingCount: number, version: string, lastUpdated: string} | null>}
 */
export async function fetchAddonMetadata(addonId) {
	const cacheKey = `amo_meta_v1_${addonId}`;
	const cacheTimeKey = `amo_meta_time_v1_${addonId}`;
	const CACHE_DURATION = 24 * 60 * 60 * 1000;

	try {
		const cachedData = localStorage.getItem(cacheKey);
		const cachedTime = localStorage.getItem(cacheTimeKey);
		if (
			cachedData &&
			cachedTime &&
			Date.now() - Number(cachedTime) < CACHE_DURATION
		) {
			return JSON.parse(cachedData);
		}

		const response = await fetch(
			`https://addons.mozilla.org/api/v5/addons/addon/${encodeURIComponent(addonId)}/`,
		);
		if (!response.ok)
			throw new Error(`Mozilla Add-ons API error: ${response.status}`);

		const data = await response.json();
		const metadata = {
			averageDailyUsers: data.average_daily_users || 0,
			weeklyDownloads: data.weekly_downloads || 0,
			rating: data.ratings?.average || 0,
			ratingCount: data.ratings?.count || 0,
			version: data.current_version?.version || "",
			lastUpdated: data.last_updated || "",
		};

		localStorage.setItem(cacheKey, JSON.stringify(metadata));
		localStorage.setItem(cacheTimeKey, Date.now().toString());
		return metadata;
	} catch (error) {
		const cachedData = localStorage.getItem(cacheKey);
		if (cachedData) return JSON.parse(cachedData);
		console.warn(
			`Failed to fetch Mozilla Add-ons metadata for ${addonId}:`,
			error.message,
		);
		return null;
	}
}

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
