export const SITE_OWNER = "moodynooby";
export const SITE_TITLE = "Manas Doshi";
export const GITHUB_BASE = "https://github.com";
export const SITE_GITHUB_PROFILE = `${GITHUB_BASE}/${SITE_OWNER}`;
export const SITE_RESUME_URL = "https://flowcv.com/resume/woofkdsq4sse";

export const GITHUB_API_BASE = "https://api.github.com";
export const AMO_BASE = "https://addons.mozilla.org";

export const githubRepoUrl = (repoName) => `${SITE_GITHUB_PROFILE}/${repoName}`;
export const amoAddonUrl = (addonId) =>
	`${AMO_BASE}/en-US/firefox/addon/${addonId}/`;
export const chromeStatsTrendsUrl = (chromeStatsId, effectiveMode) =>
	`https://chrome-stats.com/embed/${chromeStatsId}/trends?theme=${effectiveMode === "dark" ? "dark" : "light"}`;
