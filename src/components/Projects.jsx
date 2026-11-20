import { RotateCcw as RestartAlt, Search } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import PropTypes from "prop-types";
import { useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import Header from "@/components/Header";
import ProjectCard from "@/components/ProjectCard";
import projectsData from "@/content/projects.json";
import { useBookmarksContext } from "@/contexts/BookmarksContext";
import useIsMobile from "@/hooks/useIsMobile";
import { fetchAddonMetadata, fetchRepoMetadata } from "@/utils/githubUtils";
import { orderCategories } from "@/utils/projectCategories";
import { groupProjectsByYear } from "@/utils/projects";

const queryParamFromLocation = ({ search }) =>
	new URLSearchParams(search).get("q");

const byRecencyDesc = (a, b) => {
	const dateB = b.pushed_at ? new Date(b.pushed_at) : new Date(b.year, 0, 1);
	const dateA = a.pushed_at ? new Date(a.pushed_at) : new Date(a.year, 0, 1);
	return dateB - dateA;
};

export default function Projects({ showAppBar = true }) {
	const isMobile = useIsMobile();
	const [projects, setProjects] = useState([]);
	const [loading, setLoading] = useState(true);
	const [loadError, setLoadError] = useState("");
	const location = useLocation();
	const [activeCategory, setActiveCategory] = useState("All");
	const [searchQuery, setSearchQuery] = useState(
		() => queryParamFromLocation(location) || "",
	);
	const [sortBy, setSortBy] = useState("Recently Updated");
	const [selectedLanguages, setSelectedLanguages] = useState([]);
	const shouldReduceMotion = useReducedMotion();
	const { bookmarks, isBookmarked } = useBookmarksContext();

	const allLanguages = useMemo(() => {
		const langs = new Set();
		for (const p of projects) {
			if (p.language) langs.add(p.language);
			if (Array.isArray(p.tags)) {
				for (const tag of p.tags) {
					langs.add(tag);
				}
			}
		}
		return [...langs].sort();
	}, [projects]);

	useEffect(() => {
		const q = queryParamFromLocation(location);
		if (q !== null) {
			setSearchQuery(q);
		}
	}, [location]);

	useEffect(() => {
		let isMounted = true;

		async function loadProjects() {
			try {
				const projectsWithMetadata = await Promise.all(
					projectsData.map(async (project) => {
						const [metadata, addonMetadata] = await Promise.all([
							fetchRepoMetadata(project.githubName),
							project.addonId ? fetchAddonMetadata(project.addonId) : null,
						]);
						return {
							...project,
							year: metadata?.year || new Date().getFullYear(),
							date: metadata?.created_at || "",
							pushed_at: metadata?.pushed_at || "",
							language: metadata?.language || "",
							stars: metadata?.stars || 0,
							forks: metadata?.forks || 0,
							addonMetadata,
						};
					}),
				);
				const sortedProjects = projectsWithMetadata.sort(byRecencyDesc);

				if (isMounted) {
					setProjects(sortedProjects);
					setLoadError("");
				}
			} catch (_error) {
				if (isMounted) {
					setLoadError("Projects could not be loaded. Please try again.");
				}
			} finally {
				if (isMounted) setLoading(false);
			}
		}

		loadProjects();
		return () => {
			isMounted = false;
		};
	}, []);

	if (loading) {
		return (
			<div
				style={{ minHeight: "60vh", padding: "4rem 0" }}
				role="status"
				aria-label="Loading projects"
			>
				<div className="editorial-container">
					<div
						className="skeleton"
						style={{ width: "40%", height: "64px", marginBottom: "4rem" }}
					/>
					{[1, 2, 3].map((item) => (
						<div
							key={item}
							style={{
								display: "flex",
								gap: "1.5rem",
								padding: "1.5rem 0",
								borderTop:
									"1px solid var(--color-border, var(--hairline-rule))",
							}}
						>
							<div
								className="skeleton"
								style={{ width: "88px", height: "88px", flexShrink: 0 }}
							/>
							<div
								style={{
									flex: 1,
									display: "flex",
									flexDirection: "column",
									gap: "0.5rem",
								}}
							>
								<div
									className="skeleton"
									style={{ width: "30%", height: "1.25rem" }}
								/>
								<div
									className="skeleton"
									style={{ width: "70%", height: "1rem" }}
								/>
								<div
									className="skeleton"
									style={{ width: "22%", height: "0.875rem" }}
								/>
							</div>
						</div>
					))}
				</div>
			</div>
		);
	}

	if (loadError) {
		return (
			<div
				className="editorial-container"
				style={{ minHeight: "60vh", padding: "4rem 0" }}
			>
				<div className="alert alert-error">{loadError}</div>
			</div>
		);
	}

	const categoryCounts = projects.reduce((acc, project) => {
		acc[project.category] = (acc[project.category] || 0) + 1;
		return acc;
	}, {});
	const dataCategories = [
		...new Set(projects.map((p) => p.category).filter(Boolean)),
	];
	const categories = ["All", "Bookmarked", ...orderCategories(dataCategories)];

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
				isBookmarked(project.githubName) && matchesQuery(project) && matchesTech
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
		projects.map((project, idx) => [project.githubName, idx + 1]),
	);

	const activeFiltersCount =
		(activeCategory !== "All" ? 1 : 0) +
		(searchQuery.trim() !== "" ? 1 : 0) +
		selectedLanguages.length +
		(sortBy !== "Recently Updated" ? 1 : 0);

	const handleResetFilters = () => {
		setActiveCategory("All");
		setSearchQuery("");
		setSortBy("Recently Updated");
		setSelectedLanguages([]);
	};

	const toggleLanguage = (lang) => {
		setSelectedLanguages((prev) =>
			prev.includes(lang) ? prev.filter((l) => l !== lang) : [...prev, lang],
		);
	};

	const isGroupedByYear =
		sortBy === "Recently Updated" ||
		sortBy === "Year (Newest)" ||
		sortBy === "Year (Oldest)";

	return (
		<>
			{showAppBar && <Header />}
			<div
				style={{
					paddingTop: showAppBar ? "3rem" : 0,
					paddingBottom: "5rem",
					position: "relative",
					minHeight: "100vh",
				}}
			>
				<div className="editorial-container">
					<motion.div
						initial={shouldReduceMotion ? false : { opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={
							shouldReduceMotion ? { duration: 0 } : { duration: 0.7 }
						}
					>
						<div
							style={{
								display: "flex",
								alignItems: "baseline",
								justifyContent: "space-between",
								flexWrap: "wrap",
								gap: "0.5rem",
								borderBottom:
									"1px solid var(--color-border, var(--hairline-rule))",
								paddingBottom: "1.5rem",
								marginBottom: "2rem",
							}}
						>
							<div
								style={{ display: "flex", alignItems: "center", gap: "1rem" }}
							>
								<h1 className="editorial-headline" style={{ margin: 0 }}>
									The Project Ledger
								</h1>
								{activeFiltersCount > 0 && (
									<span
										className="badge"
										style={{
											background: "var(--color-primary, #38392e)",
											color: "var(--color-background-body, #fdffda)",
											padding: "2px 8px",
											fontSize: "0.72rem",
											fontWeight: 600,
											fontFamily:
												"var(--font-family-code, 'Work Sans', sans-serif)",
										}}
									>
										{activeFiltersCount}
									</span>
								)}
							</div>
							<div
								style={{ display: "flex", alignItems: "center", gap: "1rem" }}
							>
								{activeFiltersCount > 0 && (
									<button
										type="button"
										onClick={handleResetFilters}
										className="btn btn-outlined btn-sm"
										style={{
											display: "inline-flex",
											alignItems: "center",
											gap: "4px",
										}}
									>
										<RestartAlt size={14} />
										<span>Reset All Filters</span>
									</button>
								)}
								<p className="editorial-meta" style={{ margin: 0 }}>
									A running index of shipped work
								</p>
							</div>
						</div>

						<div
							style={{
								display: "flex",
								flexWrap: "wrap",
								gap: "1rem",
								marginBottom: "2rem",
								alignItems: "flex-end",
							}}
						>
							<div
								style={{
									position: "relative",
									maxWidth: "560px",
									flex: "1 1 300px",
								}}
							>
								<Search
									size={16}
									style={{
										position: "absolute",
										left: "12px",
										top: "50%",
										transform: "translateY(-50%)",
										color: "var(--color-text-secondary, #7d5d53)",
										pointerEvents: "none",
									}}
								/>
								<input
									type="search"
									value={searchQuery}
									onChange={(event) => setSearchQuery(event.target.value)}
									placeholder="Filter by name, tagline, or technology"
									aria-label="Search projects"
									className="input"
									style={{ paddingLeft: "36px", width: "100%" }}
								/>
							</div>

							<div
								style={{
									display: "flex",
									flexDirection: "column",
									gap: "4px",
									minWidth: "200px",
								}}
							>
								<label
									id="sort-select-label"
									htmlFor="sort-select"
									style={{
										fontFamily:
											"var(--font-family-code, 'Work Sans', sans-serif)",
										fontSize: "0.72rem",
										letterSpacing: "0.1em",
										textTransform: "uppercase",
										color: "var(--color-text-secondary, #7d5d53)",
									}}
								>
									Sort By
								</label>
								<select
									id="sort-select"
									aria-labelledby="sort-select-label"
									aria-label="Sort By"
									value={sortBy}
									onChange={(e) => setSortBy(e.target.value)}
									className="select"
									style={{ width: "100%" }}
								>
									{[
										"Recently Updated",
										"Most Stars",
										"Name (A-Z)",
										"Name (Z-A)",
										"Year (Newest)",
										"Year (Oldest)",
									].map((opt) => (
										<option key={opt} value={opt}>
											{opt}
										</option>
									))}
								</select>
							</div>
						</div>

						<div style={{ marginBottom: "1rem" }}>
							<p
								className="editorial-meta"
								style={{ display: "block", marginBottom: "0.5rem" }}
							>
								Categories
							</p>
							<div
								style={{
									display: "flex",
									flexWrap: "wrap",
									gap: "0.5rem",
								}}
							>
								{categories.map((category) => {
									let count = 0;
									if (category === "All") {
										count = projects.length;
									} else if (category === "Bookmarked") {
										count = bookmarks.length;
									} else {
										count = categoryCounts[category] || 0;
									}
									const label =
										category === "Bookmarked"
											? `Saved (${count})`
											: `${category} · ${count}`;
									const isActive = activeCategory === category;
									return (
										<button
											type="button"
											key={category}
											onClick={() => setActiveCategory(category)}
											className={`chip ${isActive ? "chip-primary" : ""}`}
										>
											{label}
										</button>
									);
								})}
							</div>
						</div>

						{allLanguages.length > 0 && (
							<div style={{ marginBottom: "3rem" }}>
								<p
									className="editorial-meta"
									style={{ display: "block", marginBottom: "0.5rem" }}
								>
									Technologies / Languages
								</p>
								<div
									style={{
										display: "flex",
										flexWrap: "wrap",
										gap: "0.5rem",
									}}
								>
									{allLanguages.map((lang) => {
										const isSelected = selectedLanguages.includes(lang);
										return (
											<button
												type="button"
												key={lang}
												onClick={() => toggleLanguage(lang)}
												className={`chip chip-sm ${isSelected ? "chip-primary" : ""}`}
											>
												{lang}
											</button>
										);
									})}
								</div>
							</div>
						)}
					</motion.div>

					{filteredProjects.length === 0 ? (
						<p
							className="editorial-body"
							style={{
								textAlign: "center",
								padding: "5rem 0",
								color: "var(--color-text-secondary, #7d5d53)",
							}}
						>
							{activeCategory === "Bookmarked"
								? "No bookmarked projects yet. Click the bookmark icon on any project to save it here."
								: "Nothing filed under this heading yet."}
						</p>
					) : (
						<div key={activeCategory} style={{ position: "relative" }}>
							{!isMobile && isGroupedByYear && (
								<div
									style={{
										position: "absolute",
										left: "50%",
										top: 0,
										bottom: 0,
										width: "1px",
										background: "var(--color-border, var(--hairline-rule))",
										transform: "translateX(-50%)",
									}}
								/>
							)}

							{isGroupedByYear ? (
								years.map((year) => (
									<div
										key={year}
										style={{
											marginBottom: "4rem",
											display: "flex",
											flexDirection: "column",
											alignItems: "center",
											position: "relative",
										}}
									>
										<motion.div
											initial={
												shouldReduceMotion ? false : { scale: 0.9, opacity: 0 }
											}
											whileInView={
												shouldReduceMotion
													? undefined
													: { scale: 1, opacity: 1 }
											}
											viewport={{ once: true }}
											style={{
												background: "var(--color-background-body, #fdffda)",
												border:
													"1px solid var(--color-border, var(--hairline-rule))",
												display: "flex",
												alignItems: "center",
												justifyContent: "center",
												width: 128,
												height: 128,
												borderRadius: "50%",
												marginBottom: "3.5rem",
												zIndex: 2,
											}}
										>
											<p
												style={{
													fontFamily:
														"var(--font-family-heading, 'Newsreader', serif)",
													fontSize: "1.75rem",
													fontStyle: "italic",
													fontWeight: 400,
													margin: 0,
												}}
											>
												{year}
											</p>
										</motion.div>
										<div style={{ width: "100%" }}>
											{groupedProjects[year].map((project) => (
												<ProjectCard
													key={project.githubName}
													project={project}
													entryNumber={entryNumbers.get(project.githubName)}
													isMobile={isMobile}
													shouldReduceMotion={shouldReduceMotion}
													year={year}
												/>
											))}
										</div>
									</div>
								))
							) : (
								<div style={{ width: "100%" }}>
									{sortedFilteredProjects.map((project) => (
										<ProjectCard
											key={project.githubName}
											project={project}
											entryNumber={entryNumbers.get(project.githubName)}
											isMobile={isMobile}
											shouldReduceMotion={shouldReduceMotion}
											year={project.year || "Unknown"}
										/>
									))}
								</div>
							)}
						</div>
					)}
				</div>
			</div>
		</>
	);
}

Projects.propTypes = {
	showAppBar: PropTypes.bool,
};
