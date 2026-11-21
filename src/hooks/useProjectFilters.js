import { useEffect, useMemo, useState } from "react";
import { byRecencyDesc } from "@/hooks/useProjectsData";
import { orderCategories } from "@/utils/projectCategories";
import { groupProjectsByYear } from "@/utils/projects";

export const SORT_OPTIONS = [
	"Recently Updated",
	"Most Stars",
	"Name (A-Z)",
	"Name (Z-A)",
	"Year (Newest)",
	"Year (Oldest)",
];

const queryParamFromLocation = ({ search }) =>
	new URLSearchParams(search).get("q");

/**
 * Owns the ledger's filter/sort state and all derived views. Presentation
 * components consume the returned values without knowing how they are derived.
 */
export default function useProjectFilters(projects, isBookmarked, location) {
	const [activeCategory, setActiveCategory] = useState("All");
	const [searchQuery, setSearchQuery] = useState(
		() => queryParamFromLocation(location) || "",
	);
	const [sortBy, setSortBy] = useState("Recently Updated");
	const [selectedLanguages, setSelectedLanguages] = useState([]);

	useEffect(() => {
		const q = queryParamFromLocation(location);
		if (q !== null) setSearchQuery(q);
	}, [location]);

	const allLanguages = useMemo(() => {
		const langs = new Set();
		for (const project of projects) {
			if (project.language) langs.add(project.language);
			if (Array.isArray(project.tags)) {
				for (const tag of project.tags) langs.add(tag);
			}
		}
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
			"All",
			"Bookmarked",
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
				(project.language && selectedLanguages.includes(project.language)) ||
				project.tags?.some((tag) => selectedLanguages.includes(tag));
			if (activeCategory === "Bookmarked") {
				return (
					isBookmarked(project.githubName) &&
					matchesQuery(project) &&
					matchesTech
				);
			}
			return (
				(activeCategory === "All" || project.category === activeCategory) &&
				matchesQuery(project) &&
				matchesTech
			);
		});

		const sortedFilteredProjects = [...filteredProjects].sort((a, b) => {
			switch (sortBy) {
				case "Most Stars":
					return (b.stars || 0) - (a.stars || 0);
				case "Name (A-Z)":
					return a.githubName.localeCompare(b.githubName);
				case "Name (Z-A)":
					return b.githubName.localeCompare(a.githubName);
				case "Year (Newest)":
					return (b.year || 0) - (a.year || 0);
				case "Year (Oldest)":
					return (a.year || 0) - (b.year || 0);
				default:
					return byRecencyDesc(a, b);
			}
		});

		const groupedProjects = groupProjectsByYear(sortedFilteredProjects);
		const years = Object.keys(groupedProjects).sort((a, b) => {
			if (a === "Unknown") return 1;
			if (b === "Unknown") return -1;
			if (sortBy === "Year (Oldest)") return Number(a) - Number(b);
			return Number(b) - Number(a);
		});

		const entryNumbers = new Map(
			projects.map((project, index) => [project.githubName, index + 1]),
		);

		const activeFiltersCount =
			(activeCategory !== "All" ? 1 : 0) +
			(searchQuery.trim() !== "" ? 1 : 0) +
			selectedLanguages.length +
			(sortBy !== "Recently Updated" ? 1 : 0);

		const isGroupedByYear =
			sortBy === "Recently Updated" ||
			sortBy === "Year (Newest)" ||
			sortBy === "Year (Oldest)";

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
		setActiveCategory("All");
		setSearchQuery("");
		setSortBy("Recently Updated");
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
