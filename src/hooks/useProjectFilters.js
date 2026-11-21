import { useEffect, useMemo, useState } from "react";
import {
	DEFAULT_SORT,
	FILTER_ALL,
	FILTER_BOOKMARKED,
	groupsByYear,
	SORT,
} from "@/config/ledger";
import { orderCategories } from "@/utils/projectCategories";
import {
	byRecencyDesc,
	groupProjectsByYear,
	UNKNOWN_YEAR,
} from "@/utils/projects";

const queryParamFromLocation = ({ search }) =>
	new URLSearchParams(search).get("q");

export default function useProjectFilters(projects, isBookmarked, location) {
	const [activeCategory, setActiveCategory] = useState(FILTER_ALL);
	const [searchQuery, setSearchQuery] = useState(
		() => queryParamFromLocation(location) || "",
	);
	const [sortBy, setSortBy] = useState(DEFAULT_SORT);
	const [selectedLanguages, setSelectedLanguages] = useState([]);

	useEffect(() => {
		const q = queryParamFromLocation(location);
		if (q !== null) setSearchQuery(q);
	}, [location]);

	const allLanguages = useMemo(() => {
		const langs = new Set(
			projects.map((project) => project.language).filter(Boolean),
		);
		return [...langs].sort();
	}, [projects]);

	const derived = (() => {
		const categoryCounts = projects.reduce((counts, project) => {
			counts[project.category] = (counts[project.category] || 0) + 1;
			return counts;
		}, {});
		const dataCategories = [
			...new Set(projects.map((project) => project.category).filter(Boolean)),
		];
		const categories = [
			FILTER_ALL,
			FILTER_BOOKMARKED,
			...orderCategories(dataCategories),
		];

		const normalizedQuery = searchQuery.trim().toLowerCase();
		const matchesQuery = (project) =>
			!normalizedQuery ||
			[project.githubName, project.tagline, project.category, project.language]
				.filter(Boolean)
				.some((value) => value.toLowerCase().includes(normalizedQuery));

		const filteredProjects = projects.filter((project) => {
			const matchesTech =
				selectedLanguages.length === 0 ||
				(project.language && selectedLanguages.includes(project.language));
			if (activeCategory === FILTER_BOOKMARKED) {
				return (
					isBookmarked(project.githubName) &&
					matchesQuery(project) &&
					matchesTech
				);
			}
			return (
				(activeCategory === FILTER_ALL ||
					project.category === activeCategory) &&
				matchesQuery(project) &&
				matchesTech
			);
		});

		const sortedFilteredProjects = [...filteredProjects].sort((a, b) => {
			if (sortBy === SORT.STARS) return (b.stars || 0) - (a.stars || 0);
			if (sortBy === SORT.NAME_ASC)
				return a.githubName.localeCompare(b.githubName);
			if (sortBy === SORT.NAME_DESC)
				return b.githubName.localeCompare(a.githubName);
			if (sortBy === SORT.YEAR_NEWEST) return (b.year || 0) - (a.year || 0);
			if (sortBy === SORT.YEAR_OLDEST) return (a.year || 0) - (b.year || 0);
			return byRecencyDesc(a, b);
		});

		const groupedProjects = groupProjectsByYear(sortedFilteredProjects);
		const years = Object.keys(groupedProjects).sort((a, b) => {
			if (a === UNKNOWN_YEAR) return 1;
			if (b === UNKNOWN_YEAR) return -1;
			if (sortBy === SORT.YEAR_OLDEST) return Number(a) - Number(b);
			return Number(b) - Number(a);
		});

		const entryNumbers = new Map(
			projects.map((project, index) => [project.githubName, index + 1]),
		);

		const activeFiltersCount =
			(activeCategory !== FILTER_ALL ? 1 : 0) +
			(searchQuery.trim() !== "" ? 1 : 0) +
			selectedLanguages.length +
			(sortBy !== DEFAULT_SORT ? 1 : 0);

		const isGroupedByYear = groupsByYear(sortBy);

		return {
			categoryCounts,
			categories,
			filteredProjects,
			sortedFilteredProjects,
			groupedProjects,
			years,
			entryNumbers,
			activeFiltersCount,
			isGroupedByYear,
		};
	})();

	const handleResetFilters = () => {
		setActiveCategory(FILTER_ALL);
		setSearchQuery("");
		setSortBy(DEFAULT_SORT);
		setSelectedLanguages([]);
	};

	const toggleLanguage = (lang) => {
		setSelectedLanguages((prev) =>
			prev.includes(lang)
				? prev.filter((item) => item !== lang)
				: [...prev, lang],
		);
	};

	return {
		totalProjects: projects.length,
		activeCategory,
		setActiveCategory,
		searchQuery,
		setSearchQuery,
		sortBy,
		setSortBy,
		selectedLanguages,
		allLanguages,
		...derived,
		handleResetFilters,
		toggleLanguage,
	};
}
