import { readCacheEntry, writeCacheEntry } from "@/utils/cache";

const GITHUB_BASE = "https://api.github.com";
const AMO_BASE = "https://addons.mozilla.org";

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
		const response = await fetch(`${GITHUB_BASE}/repos/moodynooby/${repoName}`);
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
			fetch(`${GITHUB_BASE}/users/${encodeURIComponent(username)}`),
			fetch(
				`${GITHUB_BASE}/users/${encodeURIComponent(username)}/repos?per_page=100&type=owner`,
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

export async function fetchProjectHealth(repoName) {
	const key = `github_health_v1_${repoName}`;
	const ttl = 24 * 60 * 60 * 1000;

	const cached = readCacheEntry(key, ttl);
	if (cached) return cached;

	try {
		const [repoResponse, releasesResponse] = await Promise.all([
			fetch(`${GITHUB_BASE}/repos/moodynooby/${repoName}`),
			fetch(`${GITHUB_BASE}/repos/moodynooby/${repoName}/releases/latest`),
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

const REPO_OWNER = "moodynooby";
const REPO_NAME = "HOMEPAGE-NEXTGEN";
const PROJECTS_FILE_PATH = "src/content/projects.json";

export async function fetchGitHubRepoDetails(repoName, token = "") {
	const cleanName = repoName.replace(/^moodynooby\//i, "").trim();
	const headers = { Accept: "application/vnd.github.v3+json" };
	if (token) headers.Authorization = `token ${token}`;

	const response = await fetch(
		`${GITHUB_BASE}/repos/${REPO_OWNER}/${cleanName}`,
		{ headers },
	);
	if (!response.ok) {
		if (response.status === 404)
			throw new Error(`Repository "${REPO_OWNER}/${cleanName}" not found.`);
		if (response.status === 403)
			throw new Error(
				"GitHub API rate limit exceeded. Add a GitHub Token in settings.",
			);
		throw new Error(`GitHub error: ${response.statusText}`);
	}

	const data = await response.json();
	return {
		name: data.name,
		description: data.description || "",
		language: data.language || "",
		defaultBranch: data.default_branch || "main",
		defaultReadmeUrl: `https://raw.githubusercontent.com/${REPO_OWNER}/${data.name}/${data.default_branch || "main"}/README.md`,
		topics: data.topics || [],
		homepage: data.homepage || "",
		stars: data.stargazers_count || 0,
	};
}

export async function commitProjectsToGitHub({
	token,
	projects,
	commitMessage = "chore(content): update projects ledger via Admin Dashboard",
}) {
	if (!token)
		throw new Error(
			"A valid GitHub Personal Access Token is required to publish.",
		);

	const headers = {
		Accept: "application/vnd.github.v3+json",
		Authorization: `token ${token.trim()}`,
		"Content-Type": "application/json",
	};

	const getUrl = `${GITHUB_BASE}/repos/${REPO_OWNER}/${REPO_NAME}/contents/${PROJECT_FILE_PATH || PROJECTS_FILE_PATH}`;
	const fileResponse = await fetch(getUrl, { headers });

	let sha = "";
	if (fileResponse.ok) {
		const fileData = await fileResponse.json();
		sha = fileData.sha;
	} else if (fileResponse.status !== 404) {
		throw new Error(
			`Failed to fetch file metadata from GitHub: ${fileResponse.statusText}`,
		);
	}

	const jsonString = `${JSON.stringify(projects, null, "\t")}\n`;
	const encodedContent = btoa(
		encodeURIComponent(jsonString).replace(/%([0-9A-F]{2})/g, (_, p1) =>
			String.fromCharCode(parseInt(p1, 16)),
		),
	);

	const payload = {
		message: commitMessage,
		content: encodedContent,
		branch: "main",
	};
	if (sha) payload.sha = sha;

	const putResponse = await fetch(getUrl, {
		method: "PUT",
		headers,
		body: JSON.stringify(payload),
	});
	if (!putResponse.ok) {
		const errData = await putResponse.json().catch(() => ({}));
		throw new Error(
			errData.message || `Failed to commit changes: ${putResponse.statusText}`,
		);
	}

	const result = await putResponse.json();
	return {
		commitSha: result.commit?.sha || "",
		commitUrl: result.commit?.html_url || "",
	};
}

export function exportProjectsJson(projects, filename = "projects.json") {
	const jsonString = `${JSON.stringify(projects, null, "\t")}\n`;
	const blob = new Blob([jsonString], { type: "application/json" });
	const url = URL.createObjectURL(blob);
	const anchor = document.createElement("a");
	anchor.href = url;
	anchor.download = filename;
	document.body.appendChild(anchor);
	anchor.click();
	document.body.removeChild(anchor);
	URL.revokeObjectURL(url);
}
