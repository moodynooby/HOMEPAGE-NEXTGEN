import { AMO_BASE, GITHUB_API_BASE, SITE_OWNER } from "@/config/site";
import { readCacheEntry, writeCacheEntry } from "@/utils/cache";

const emptyRepoMetadata = () => ({
	created_at: null,
	pushed_at: null,
	year: new Date().getFullYear(),
	language: null,
	stars: 0,
	forks: 0,
	watchers: 0,
});

export async function fetchRepoMetadata(repoName) {
	const key = `github_meta_v3_${repoName}`;
	const ttl = 7 * 24 * 60 * 60 * 1000;

	const cached = readCacheEntry(key, ttl);
	if (cached) return cached;

	try {
		const response = await fetch(
			`${GITHUB_API_BASE}/repos/${SITE_OWNER}/${repoName}`,
		);
		if (!response.ok) {
			if (response.status === 403) {
				return readCacheEntry(key) || emptyRepoMetadata();
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

		writeCacheEntry(key, metadata);
		return metadata;
	} catch (_error) {
		return readCacheEntry(key) || emptyRepoMetadata();
	}
}

export async function fetchUserStats(username) {
	const key = `github_user_stats_v1_${username}`;
	const ttl = 24 * 60 * 60 * 1000;

	const cached = readCacheEntry(key, ttl);
	if (cached) return cached;

	try {
		const [profileResponse, reposResponse] = await Promise.all([
			fetch(`${GITHUB_API_BASE}/users/${encodeURIComponent(username)}`),
			fetch(
				`${GITHUB_API_BASE}/users/${encodeURIComponent(username)}/repos?per_page=100&type=owner`,
			),
		]);

		if (!profileResponse.ok || !reposResponse.ok) {
			throw new Error("GitHub profile request failed");
		}

		const profile = await profileResponse.json();
		const repositories = await reposResponse.json();
		const languageCounts = repositories.reduce((counts, repo) => {
			if (repo.language) {
				counts[repo.language] = (counts[repo.language] || 0) + 1;
			}
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

		writeCacheEntry(key, stats);
		return stats;
	} catch (_error) {
		return readCacheEntry(key) || null;
	}
}

export async function fetchAddonMetadata(addonId) {
	const key = `amo_meta_v1_${addonId}`;
	const ttl = 24 * 60 * 60 * 1000;

	const cached = readCacheEntry(key, ttl);
	if (cached) return cached;

	try {
		const response = await fetch(
			`${AMO_BASE}/api/v5/addons/addon/${encodeURIComponent(addonId)}/`,
		);
		if (!response.ok) {
			throw new Error(`Mozilla Add-ons API error: ${response.status}`);
		}

		const data = await response.json();
		const metadata = {
			averageDailyUsers: data.average_daily_users || 0,
			weeklyDownloads: data.weekly_downloads || 0,
			rating: data.ratings?.average || 0,
			ratingCount: data.ratings?.count || 0,
			version: data.current_version?.version || "",
			lastUpdated: data.last_updated || "",
		};

		writeCacheEntry(key, metadata);
		return metadata;
	} catch (_error) {
		return readCacheEntry(key) || null;
	}
}

export async function fetchProjectHealth(repoName) {
	const key = `github_health_v1_${repoName}`;
	const ttl = 24 * 60 * 60 * 1000;

	const cached = readCacheEntry(key, ttl);
	if (cached) return cached;

	try {
		const [repoResponse, releasesResponse] = await Promise.all([
			fetch(`${GITHUB_API_BASE}/repos/${SITE_OWNER}/${repoName}`),
			fetch(
				`${GITHUB_API_BASE}/repos/${SITE_OWNER}/${repoName}/releases/latest`,
			),
		]);

		let repoData = {};
		if (repoResponse.ok) {
			repoData = await repoResponse.json();
		} else if (repoResponse.status !== 404 && repoResponse.status !== 403) {
			console.warn(`GitHub API repo error: ${repoResponse.statusText}`);
		}

		let latestRelease = "";
		if (releasesResponse.ok) {
			const releaseData = await releasesResponse.json();
			latestRelease = releaseData.tag_name || "";
		} else if (
			releasesResponse.status !== 404 &&
			releasesResponse.status !== 403
		) {
			console.warn(`GitHub API releases error: ${releasesResponse.statusText}`);
		}

		const healthData = {
			latestRelease,
			openIssues: repoData.open_issues_count || 0,
			size: repoData.size || 0,
			pushed_at: repoData.pushed_at || null,
		};

		writeCacheEntry(key, healthData);
		return healthData;
	} catch (_error) {
		return readCacheEntry(key) || null;
	}
}
