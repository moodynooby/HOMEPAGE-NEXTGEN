import { AMO_BASE, GITHUB_API_BASE, SITE_OWNER } from "@/config/site";
import { CACHE_ENTRIES } from "@/config/storage";
import { readCacheEntry, writeCacheEntry } from "@/utils/cache";
import { emptyRepoMetadata } from "@/utils/projects";

const inFlight = new Map();

const dedupe = (key, load) => {
	if (inFlight.has(key)) return inFlight.get(key);

	const promise = Promise.resolve().then(load);
	inFlight.set(key, promise);
	promise.finally(() => inFlight.delete(key)).catch(() => {});
	return promise;
};

const isExpectedMiss = (status) => status === 404 || status === 403;

const readFresh = (entry) => readCacheEntry(entry.key, entry.ttl);
const readStale = (entry) => readCacheEntry(entry.key);
const write = (entry, value) => writeCacheEntry(entry.key, value);

export async function fetchRepoMetadata(repoName) {
	const entry = CACHE_ENTRIES.repoMetadata(repoName);
	const cached = readFresh(entry);
	if (cached) return cached;

	return dedupe(entry.key, async () => {
		try {
			const response = await fetch(
				`${GITHUB_API_BASE}/repos/${SITE_OWNER}/${repoName}`,
			);
			if (!response.ok) {
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
				topics: Array.isArray(data.topics) ? data.topics : [],
			};

			write(entry, metadata);
			return metadata;
		} catch (_error) {
			return readStale(entry) || emptyRepoMetadata();
		}
	});
}

export async function fetchUserStats(username) {
	const entry = CACHE_ENTRIES.userStats(username);
	const cached = readFresh(entry);
	if (cached) return cached;

	return dedupe(entry.key, async () => {
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

			write(entry, stats);
			return stats;
		} catch (_error) {
			return readStale(entry) || null;
		}
	});
}

export async function fetchAddonMetadata(addonId) {
	const entry = CACHE_ENTRIES.addonMetadata(addonId);
	const cached = readFresh(entry);
	if (cached) return cached;

	return dedupe(entry.key, async () => {
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

			write(entry, metadata);
			return metadata;
		} catch (_error) {
			return readStale(entry) || null;
		}
	});
}

export async function fetchProjectHealth(repoName) {
	const entry = CACHE_ENTRIES.projectHealth(repoName);
	const cached = readFresh(entry);
	if (cached) return cached;

	return dedupe(entry.key, async () => {
		try {
			const [repoResponse, releasesResponse] = await Promise.all([
				fetch(`${GITHUB_API_BASE}/repos/${SITE_OWNER}/${repoName}`),
				fetch(
					`${GITHUB_API_BASE}/repos/${SITE_OWNER}/${repoName}/releases/latest`,
				),
			]);

			if (!repoResponse.ok && !isExpectedMiss(repoResponse.status)) {
				console.warn(`GitHub API repo error: ${repoResponse.statusText}`);
			}
			if (!releasesResponse.ok && !isExpectedMiss(releasesResponse.status)) {
				console.warn(
					`GitHub API releases error: ${releasesResponse.statusText}`,
				);
			}

			const repoData = repoResponse.ok ? await repoResponse.json() : {};
			const releaseData = releasesResponse.ok
				? await releasesResponse.json()
				: {};

			const healthData = {
				latestRelease: releaseData.tag_name || "",
				openIssues: repoData.open_issues_count || 0,
				size: repoData.size || 0,
				pushed_at: repoData.pushed_at || null,
			};

			write(entry, healthData);
			return healthData;
		} catch (_error) {
			return readStale(entry) || null;
		}
	});
}
