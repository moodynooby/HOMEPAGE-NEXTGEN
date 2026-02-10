import { useState, useEffect, useCallback } from 'react';

const CACHE_DURATION = 24 * 60 * 60 * 1000;

function getCacheKey(username, endpoint) {
  return `github-cache-${username}-${endpoint}`;
}

function getCachedData(key) {
  try {
    const cached = localStorage.getItem(key);
    if (!cached) return null;

    const { data, timestamp } = JSON.parse(cached);
    const now = Date.now();

    if (now - timestamp > CACHE_DURATION) {
      localStorage.removeItem(key);
      return null;
    }

    return data;
  } catch {
    return null;
  }
}

function setCachedData(key, data) {
  try {
    const cacheEntry = {
      data,
      timestamp: Date.now(),
    };
    localStorage.setItem(key, JSON.stringify(cacheEntry));
  } catch (error) {
    console.warn('Failed to cache data:', error);
  }
}

export function useGitHubCache(username) {
  const [userData, setUserData] = useState(null);
  const [reposData, setReposData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchWithCache = useCallback(async () => {
    if (!username) {
      setError(new Error('Username is required'));
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    const userCacheKey = getCacheKey(username, 'user');
    const reposCacheKey = getCacheKey(username, 'repos');

    const cachedUser = getCachedData(userCacheKey);
    const cachedRepos = getCachedData(reposCacheKey);

    if (cachedUser && cachedRepos) {
      setUserData(cachedUser);
      setReposData(cachedRepos);
      setLoading(false);
      return;
    }

    try {
      const userResponse = await fetch(
        `https://api.github.com/users/${username}`,
      );

      if (!userResponse.ok) {
        if (userResponse.status === 403) {
          throw new Error(
            'GitHub API rate limit exceeded. Please try again later.',
          );
        }
        if (userResponse.status === 404) {
          throw new Error(`User "${username}" not found.`);
        }
        throw new Error(`GitHub API error: ${userResponse.status}`);
      }

      const user = await userResponse.json();

      const reposResponse = await fetch(
        `https://api.github.com/users/${username}/repos?per_page=100&sort=updated`,
      );

      if (!reposResponse.ok) {
        throw new Error(`Failed to fetch repositories: ${reposResponse.status}`);
      }

      const repos = await reposResponse.json();

      setCachedData(userCacheKey, user);
      setCachedData(reposCacheKey, repos);

      setUserData(user);
      setReposData(repos);
    } catch (err) {
      setError(err);

      if (cachedUser) setUserData(cachedUser);
      if (cachedRepos) setReposData(cachedRepos);
    } finally {
      setLoading(false);
    }
  }, [username]);

  useEffect(() => {
    fetchWithCache();
  }, [fetchWithCache]);

  const refresh = useCallback(() => {
    const userCacheKey = getCacheKey(username, 'user');
    const reposCacheKey = getCacheKey(username, 'repos');
    localStorage.removeItem(userCacheKey);
    localStorage.removeItem(reposCacheKey);
    fetchWithCache();
  }, [username, fetchWithCache]);

  return {
    userData,
    reposData,
    loading,
    error,
    refresh,
  };
}
