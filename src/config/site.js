export const SITE_OWNER = "moodynooby";
export const SITE_GITHUB_PROFILE = `https://github.com/${SITE_OWNER}`;
export const SITE_RESUME_URL = "https://flowcv.com/resume/woofkdsq4sse";

export const GITHUB_API_BASE = "https://api.github.com";
export const AMO_BASE = "https://addons.mozilla.org";

export const githubRepoUrl = (repoName) => `${SITE_GITHUB_PROFILE}/${repoName}`;
export const amoAddonUrl = (addonId) =>
	`${AMO_BASE}/en-US/firefox/addon/${addonId}/`;
export const chromeStatsTrendsUrl = (chromeStatsId, mode) =>
	`https://chrome-stats.com/embed/${chromeStatsId}/trends?theme=${mode === "dark" ? "dark" : "light"}`;
