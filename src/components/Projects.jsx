import {
	ArrowForward,
	Download,
	RestartAlt,
	Search,
	Star,
} from "@mui/icons-material";
import {
	Alert,
	Badge,
	Box,
	Button,
	Chip,
	Container,
	FormControl,
	InputAdornment,
	InputLabel,
	MenuItem,
	Select,
	Skeleton,
	TextField,
	Typography,
	useMediaQuery,
	useTheme,
} from "@mui/material";
import { motion, useReducedMotion } from "motion/react";
import PropTypes from "prop-types";
import { useEffect, useMemo, useState } from "react";
import { Link as RouterLink, useLocation } from "react-router-dom";
import ButtonAppBar from "@/components/Header";
import projectsData from "@/content/projects.json";
import {
	fetchAddonMetadata,
	fetchRepoMetadata,
	groupProjectsByYear,
} from "@/utils/githubUtils";

const MotionBox = motion.create(Box);

export default function Projects({ limit, showAppBar = true }) {
	const theme = useTheme();
	const isMobile = useMediaQuery(theme.breakpoints.down("md"));
	const [projects, setProjects] = useState([]);
	const [loading, setLoading] = useState(true);
	const [loadError, setLoadError] = useState("");
	const location = useLocation();
	const [activeCategory, setActiveCategory] = useState("All");
	const [searchQuery, setSearchQuery] = useState(() => {
		const params = new URLSearchParams(location.search);
		return params.get("q") || "";
	});
	const [sortBy, setSortBy] = useState("Recently Updated");
	const [selectedLanguages, setSelectedLanguages] = useState([]);
	const shouldReduceMotion = useReducedMotion();

	const allLanguages = useMemo(() => {
		const langs = new Set();
		for (const p of projects) {
			if (p.language) langs.add(p.language);
			if (p.tags && Array.isArray(p.tags)) {
				for (const tag of p.tags) {
					langs.add(tag);
				}
			}
		}
		return Array.from(langs).sort();
	}, [projects]);

	useEffect(() => {
		const params = new URLSearchParams(location.search);
		const q = params.get("q");
		if (q !== null) {
			setSearchQuery(q);
		}
	}, [location.search]);

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
				const sortedProjects = projectsWithMetadata.sort((a, b) => {
					const dateB = b.pushed_at
						? new Date(b.pushed_at)
						: new Date(b.year, 0, 1);
					const dateA = a.pushed_at
						? new Date(a.pushed_at)
						: new Date(a.year, 0, 1);
					return dateB - dateA;
				});

				if (isMounted) {
					setProjects(limit ? sortedProjects.slice(0, limit) : sortedProjects);
					setLoadError("");
				}
			} catch (error) {
				console.error("Unable to load projects", error);
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
	}, [limit]);

	if (loading) {
		return (
			<Box
				sx={{ minHeight: "60vh", py: 8 }}
				role="status"
				aria-label="Loading projects"
			>
				<Container maxWidth="lg">
					<Skeleton variant="text" width="40%" height={64} sx={{ mb: 8 }} />
					{[1, 2, 3].map((item) => (
						<Box
							key={item}
							sx={{
								display: "flex",
								gap: 3,
								py: 3,
								borderTop: "1px solid",
								borderColor: "divider",
							}}
						>
							<Skeleton
								variant="rectangular"
								width={88}
								height={88}
								sx={{ flexShrink: 0 }}
							/>
							<Box sx={{ flex: 1 }}>
								<Skeleton variant="text" width="30%" />
								<Skeleton variant="text" width="70%" />
								<Skeleton variant="text" width="22%" />
							</Box>
						</Box>
					))}
				</Container>
			</Box>
		);
	}

	if (loadError) {
		return (
			<Box sx={{ minHeight: "60vh", py: 8 }}>
				<Alert severity="error">{loadError}</Alert>
			</Box>
		);
	}

	const categoryCounts = projects.reduce((acc, project) => {
		acc[project.category] = (acc[project.category] || 0) + 1;
		return acc;
	}, {});
	const categoryOrder = [
		"Web App",
		"Browser Extension",
		"Game",
		"AI Tool",
		"Computer Vision",
	];
	const categories = [
		"All",
		...categoryOrder.filter((category) => categoryCounts[category]),
	];

	const normalizedQuery = searchQuery.trim().toLowerCase();
	const matchesQuery = (project) =>
		!normalizedQuery ||
		[project.githubName, project.tagline, project.category, project.language]
			.filter(Boolean)
			.some((value) => value.toLowerCase().includes(normalizedQuery));

	const filteredProjects = projects.filter(
		(project) =>
			(activeCategory === "All" || project.category === activeCategory) &&
			matchesQuery(project) &&
			(selectedLanguages.length === 0 ||
				(project.language && selectedLanguages.includes(project.language)) ||
				project.tags?.some((tag) => selectedLanguages.includes(tag))),
	);

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
			default: {
				const dateB = b.pushed_at
					? new Date(b.pushed_at)
					: new Date(b.year, 0, 1);
				const dateA = a.pushed_at
					? new Date(a.pushed_at)
					: new Date(a.year, 0, 1);
				return dateB - dateA;
			}
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
			{showAppBar && <ButtonAppBar />}
			<Box
				sx={{
					pt: showAppBar ? { xs: 7, md: 10 } : 0,
					pb: 10,
					position: "relative",
					minHeight: "100vh",
				}}
			>
				<Container maxWidth="lg">
					<motion.div
						initial={shouldReduceMotion ? false : { opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={
							shouldReduceMotion ? { duration: 0 } : { duration: 0.7 }
						}
					>
						<Box
							sx={{
								display: "flex",
								alignItems: "baseline",
								justifyContent: "space-between",
								flexWrap: "wrap",
								gap: 1,
								borderBottom: "1px solid",
								borderColor: "divider",
								pb: 3,
								mb: 4,
							}}
						>
							<Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
								<Typography variant="h2" component="h1">
									The Project Ledger
								</Typography>
								{activeFiltersCount > 0 && (
									<Badge
										badgeContent={activeFiltersCount}
										color="primary"
										sx={{ ml: 1 }}
									>
										<Box sx={{ width: 8, height: 8 }} />
									</Badge>
								)}
							</Box>
							<Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
								{activeFiltersCount > 0 && (
									<Button
										size="small"
										startIcon={<RestartAlt />}
										onClick={handleResetFilters}
										sx={{ textTransform: "none" }}
									>
										Reset All Filters
									</Button>
								)}
								<Typography variant="overline" color="text.secondary">
									A running index of shipped work
								</Typography>
							</Box>
						</Box>

						<Box
							sx={{
								display: "flex",
								flexWrap: "wrap",
								gap: 2,
								mb: 4,
								alignItems: "flex-end",
							}}
						>
							<TextField
								fullWidth
								variant="standard"
								value={searchQuery}
								onChange={(event) => setSearchQuery(event.target.value)}
								placeholder="Filter by name, tagline, or technology"
								aria-label="Search projects"
								sx={{ maxWidth: 560, flex: "1 1 300px" }}
								slotProps={{
									input: {
										startAdornment: (
											<InputAdornment position="start">
												<Search fontSize="small" />
											</InputAdornment>
										),
										sx: { fontFamily: '"Work Sans Variable", sans-serif' },
									},
								}}
							/>

							<FormControl
								variant="standard"
								sx={{ minWidth: 200, flexShrink: 0 }}
							>
								<InputLabel id="sort-select-label">Sort By</InputLabel>
								<Select
									labelId="sort-select-label"
									value={sortBy}
									onChange={(e) => setSortBy(e.target.value)}
									label="Sort By"
									sx={{ fontFamily: '"Work Sans Variable", sans-serif' }}
								>
									<MenuItem value="Recently Updated">Recently Updated</MenuItem>
									<MenuItem value="Most Stars">Most Stars</MenuItem>
									<MenuItem value="Name (A-Z)">Name (A-Z)</MenuItem>
									<MenuItem value="Name (Z-A)">Name (Z-A)</MenuItem>
									<MenuItem value="Year (Newest)">Year (Newest)</MenuItem>
									<MenuItem value="Year (Oldest)">Year (Oldest)</MenuItem>
								</Select>
							</FormControl>
						</Box>

						<Box sx={{ mb: 2 }}>
							<Typography
								variant="overline"
								color="text.secondary"
								sx={{ display: "block", mb: 1 }}
							>
								Categories
							</Typography>
							<Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
								{categories.map((category) => {
									const count =
										category === "All"
											? projects.length
											: categoryCounts[category];
									return (
										<Chip
											key={category}
											label={`${category} · ${count}`}
											onClick={() => setActiveCategory(category)}
											variant={
												activeCategory === category ? "filled" : "outlined"
											}
											color={
												activeCategory === category ? "primary" : "default"
											}
										/>
									);
								})}
							</Box>
						</Box>

						{allLanguages.length > 0 && (
							<Box sx={{ mb: 6 }}>
								<Typography
									variant="overline"
									color="text.secondary"
									sx={{ display: "block", mb: 1 }}
								>
									Technologies / Languages
								</Typography>
								<Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
									{allLanguages.map((lang) => (
										<Chip
											key={lang}
											label={lang}
											onClick={() => toggleLanguage(lang)}
											variant={
												selectedLanguages.includes(lang) ? "filled" : "outlined"
											}
											color={
												selectedLanguages.includes(lang)
													? "secondary"
													: "default"
											}
											size="small"
										/>
									))}
								</Box>
							</Box>
						)}
					</motion.div>

					{filteredProjects.length === 0 ? (
						<Typography
							variant="body1"
							sx={{ textAlign: "center", py: 10, color: "text.secondary" }}
						>
							Nothing filed under this heading yet.
						</Typography>
					) : (
						<Box key={activeCategory} sx={{ position: "relative" }}>
							{!isMobile && isGroupedByYear && (
								<Box
									sx={{
										position: "absolute",
										left: "50%",
										top: 0,
										bottom: 0,
										width: "1px",
										bgcolor: "divider",
										transform: "translateX(-50%)",
									}}
								/>
							)}

							{isGroupedByYear ? (
								years.map((year) => (
									<Box
										key={year}
										sx={{
											mb: { xs: 7, md: 12 },
											display: "flex",
											flexDirection: "column",
											alignItems: "center",
											position: "relative",
										}}
									>
										<MotionBox
											initial={
												shouldReduceMotion ? false : { scale: 0.9, opacity: 0 }
											}
											whileInView={
												shouldReduceMotion
													? undefined
													: { scale: 1, opacity: 1 }
											}
											viewport={{ once: true }}
											sx={{
												bgcolor: "background.default",
												border: "1px solid",
												borderColor: "divider",
												display: "flex",
												alignItems: "center",
												justifyContent: "center",
												width: 128,
												height: 128,
												borderRadius: "50%",
												mb: 7,
												zIndex: 2,
											}}
										>
											<Typography
												variant="h3"
												component="p"
												sx={{ fontStyle: "italic", fontWeight: 400 }}
											>
												{year}
											</Typography>
										</MotionBox>

										<Box sx={{ width: "100%" }}>
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
										</Box>
									</Box>
								))
							) : (
								<Box sx={{ width: "100%" }}>
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
								</Box>
							)}
						</Box>
					)}
				</Container>
			</Box>
		</>
	);
}

function ProjectCard({
	project,
	entryNumber,
	isMobile,
	shouldReduceMotion,
	year,
}) {
	return (
		<MotionBox
			initial={shouldReduceMotion ? false : { y: 16, opacity: 0 }}
			whileInView={shouldReduceMotion ? undefined : { y: 0, opacity: 1 }}
			viewport={{ once: true }}
			transition={shouldReduceMotion ? { duration: 0 } : { duration: 0.45 }}
			sx={{ bgcolor: "background.default" }}
		>
			<Box
				component={RouterLink}
				to={`/projects/${project.githubName}`}
				aria-label={`Open project ${project.githubName}`}
				sx={{
					display: "flex",
					alignItems: "center",
					gap: { xs: 2.5, md: 4 },
					py: { xs: 2.5, md: 3.5 },
					px: { xs: 1.5, md: 2 },
					cursor: "pointer",
					textDecoration: "none",
					color: "text.primary",
					borderTop: "1px solid",
					borderColor: "divider",
					transition: "background-color 0.3s ease",
					"&:hover": {
						bgcolor: "action.hover",
					},
					"&:hover .ledger-arrow": {
						transform: "translateX(4px)",
						opacity: 1,
					},
					"&:hover .ledger-thumb img": {
						filter: "grayscale(0%) contrast(100%)",
					},
				}}
			>
				{!isMobile && (
					<Typography
						variant="overline"
						sx={{
							width: 56,
							flexShrink: 0,
							color: "text.secondary",
							lineHeight: 1,
						}}
					>
						No. {String(entryNumber).padStart(2, "0")}
					</Typography>
				)}

				<Box
					className="ledger-thumb"
					sx={{
						width: { xs: 56, md: 88 },
						height: { xs: 56, md: 88 },
						flexShrink: 0,
						bgcolor: "background.paper",
						border: "1px solid",
						borderColor: "divider",
						display: "flex",
						alignItems: "center",
						justifyContent: "center",
						p: { xs: 1, md: 1.5 },
						overflow: "hidden",
					}}
				>
					<Box
						component="img"
						src={project.githubImg}
						alt=""
						loading="lazy"
						sx={{
							maxWidth: "100%",
							maxHeight: "100%",
							objectFit: "contain",
							filter: "grayscale(100%) contrast(115%)",
							transition: "filter 0.5s ease-in-out",
						}}
					/>
				</Box>

				<Box sx={{ flex: 1, minWidth: 0 }}>
					<Typography variant="h5" sx={{ mb: 0.5 }}>
						{project.githubName}
					</Typography>
					<Typography
						variant="body2"
						color="text.secondary"
						sx={{
							display: "-webkit-box",
							WebkitLineClamp: 2,
							WebkitBoxOrient: "vertical",
							overflow: "hidden",
						}}
					>
						{project.tagline}
					</Typography>
					<Box
						sx={{
							display: "flex",
							alignItems: "center",
							columnGap: 1.5,
							rowGap: 0.5,
							mt: 1,
							flexWrap: "wrap",
						}}
					>
						<Typography
							variant="overline"
							color="secondary.main"
							lineHeight={1}
						>
							{project.category}
						</Typography>
						<Typography
							variant="overline"
							color="text.secondary"
							lineHeight={1}
							sx={{ opacity: 0.85 }}
						>
							{year}
							{project.language ? ` · ${project.language}` : ""}
						</Typography>
						{project.stars > 0 && (
							<Box
								sx={{
									display: "flex",
									alignItems: "center",
									gap: 0.5,
								}}
							>
								<Star
									sx={{
										fontSize: "0.8rem",
										color: "secondary.main",
									}}
								/>
								<Typography
									variant="overline"
									color="text.secondary"
									lineHeight={1}
								>
									{project.stars}
								</Typography>
							</Box>
						)}
						{project.addonMetadata && (
							<Box
								sx={{
									display: "flex",
									alignItems: "center",
									gap: 0.5,
								}}
							>
								<Download
									sx={{
										fontSize: "0.8rem",
										color: "secondary.main",
									}}
								/>
								<Typography
									variant="overline"
									color="text.secondary"
									lineHeight={1}
								>
									{project.addonMetadata.averageDailyUsers.toLocaleString()}{" "}
									users
								</Typography>
							</Box>
						)}
					</Box>
				</Box>

				<Box
					className="ledger-arrow"
					sx={{
						flexShrink: 0,
						color: "secondary.main",
						display: "flex",
						alignItems: "center",
						opacity: 0.35,
						transition: "transform 0.3s ease, opacity 0.3s ease",
					}}
				>
					<ArrowForward />
				</Box>
			</Box>
		</MotionBox>
	);
}

ProjectCard.propTypes = {
	project: PropTypes.object.isRequired,
	entryNumber: PropTypes.number,
	isMobile: PropTypes.bool,
	shouldReduceMotion: PropTypes.bool,
	year: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

Projects.propTypes = {
	limit: PropTypes.number,
	showAppBar: PropTypes.bool,
};
