const CACHE_TIME_SUFFIX = ":time";

export const readCacheEntry = (key, maxAgeMs) => {
	try {
		const cached = localStorage.getItem(key);
		if (cached == null) return undefined;
		if (maxAgeMs === undefined) return JSON.parse(cached);
		const cachedTime = Number(
			localStorage.getItem(`${key}${CACHE_TIME_SUFFIX}`),
		);
		if (Number.isFinite(cachedTime) && Date.now() - cachedTime < maxAgeMs) {
			return JSON.parse(cached);
		}
	} catch (_error) {
		return undefined;
	}
	return undefined;
};

export const writeCacheEntry = (key, value) => {
	try {
		localStorage.setItem(key, JSON.stringify(value));
		localStorage.setItem(`${key}${CACHE_TIME_SUFFIX}`, String(Date.now()));
	} catch (_error) {
		// Storage may be unavailable or full.
	}
};
