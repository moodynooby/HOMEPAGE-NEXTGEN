export const STORAGE_KEYS = {
	themeMode: "themeMode",
	highContrast: "highContrast",
	bookmarks: "bookmarked_projects",
};

const DAY = 24 * 60 * 60 * 1000;

export const CACHE_TTL = { day: DAY, week: 7 * DAY };

// Bump a prefix's version whenever the shape of the cached value changes.
const CACHE_DEFS = {
	repoMetadata: ["github_meta_v3_", CACHE_TTL.week],
	repoReleases: ["github_releases_v1_", CACHE_TTL.day],
	userStats: ["github_user_stats_v1_", CACHE_TTL.day],
	addonMetadata: ["amo_meta_v1_", CACHE_TTL.day],
	projectHealth: ["github_health_v1_", CACHE_TTL.day],
	readme: ["readme_v1_", CACHE_TTL.day],
};

export const CACHE_ENTRIES = Object.fromEntries(
	Object.entries(CACHE_DEFS).map(([name, [prefix, ttl]]) => [
		name,
		(id) => ({ key: `${prefix}${id}`, ttl }),
	]),
);
