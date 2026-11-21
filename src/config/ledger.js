export const FILTER_ALL = "All";
export const FILTER_BOOKMARKED = "Bookmarked";

export const SORT = {
	RECENT: "Recently Updated",
	STARS: "Most Stars",
	NAME_ASC: "Name (A-Z)",
	NAME_DESC: "Name (Z-A)",
	YEAR_NEWEST: "Year (Newest)",
	YEAR_OLDEST: "Year (Oldest)",
};

export const SORT_OPTIONS = Object.values(SORT);
export const DEFAULT_SORT = SORT.RECENT;

const YEAR_GROUPED_SORTS = new Set([
	SORT.RECENT,
	SORT.YEAR_NEWEST,
	SORT.YEAR_OLDEST,
]);

export const groupsByYear = (sortBy) => YEAR_GROUPED_SORTS.has(sortBy);
