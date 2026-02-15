const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours

const getCachedData = (key) => {
  const cached = localStorage.getItem(key);
  if (!cached) return null;

  const { data, timestamp } = JSON.parse(cached);
  if (Date.now() - timestamp > CACHE_DURATION) {
    localStorage.removeItem(key);
    return null;
  }
  return data;
};

const setCachedData = (key, data) => {
  localStorage.setItem(key, JSON.stringify({ data, timestamp: Date.now() }));
};

export const fetchGitHubStats = async (username) => {
  const cacheKey = `github_stats_${username}`;
  const cached = getCachedData(cacheKey);
  if (cached) return cached;

  try {
    const userRes = await fetch(`https://api.github.com/users/${username}`);
    const userData = await userRes.json();

    const reposRes = await fetch(`https://api.github.com/users/${username}/repos?per_page=100`);
    const reposData = await reposRes.json();

    const stars = reposData.reduce((acc, repo) => acc + repo.stargazers_count, 0);

    const stats = {
      followers: userData.followers,
      publicRepos: userData.public_repos,
      totalStars: stars,
      recentRepos: reposData
        .sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at))
        .slice(0, 3)
        .map(repo => ({
          name: repo.name,
          stars: repo.stargazers_count,
          url: repo.html_url,
          description: repo.description,
        })),
    };

    setCachedData(cacheKey, stats);
    return stats;
  } catch (error) {
    console.error('Error fetching GitHub stats:', error);
    throw error;
  }
};

export const fetchAddonStats = async (addonId) => {
  const cacheKey = `addon_stats_${addonId}`;
  const cached = getCachedData(cacheKey);
  if (cached) return cached;

  try {
    const res = await fetch(`https://addons.mozilla.org/api/v5/addons/addon/${addonId}/`);
    const data = await res.json();

    const stats = {
      dailyUsers: data.average_daily_users,
      weeklyDownloads: data.weekly_downloads,
    };

    setCachedData(cacheKey, stats);
    return stats;
  } catch (error) {
    console.error(`Error fetching addon stats for ${addonId}:`, error);
    throw error;
  }
};
