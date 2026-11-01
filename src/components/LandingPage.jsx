import {
	Box,
	Button,
	CircularProgress,
	Container,
	Divider,
	Typography,
} from "@mui/material";
import { motion, useReducedMotion } from "motion/react";
import { lazy, Suspense, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ButtonAppBar from "@/components/Header";
import projectsData from "@/content/projects.json";
import {
	fetchAddonMetadata,
	fetchRepoMetadata,
	fetchUserStats,
} from "@/utils/githubUtils";

const Gallery = lazy(() => import("@/components/Gallery"));

const addonIds = projectsData
	.filter((project) => project.addonId)
	.map((project) => project.addonId);

const featuredProjects = projectsData.filter((project) => project.featured);

export default function LandingPage() {
	const [githubStats, setGithubStats] = useState(null);
	const [addonStats, setAddonStats] = useState({
		totalUsers: 0,
		totalDownloads: 0,
		addonCount: 0,
	});
	const [featuredMeta, setFeaturedMeta] = useState({});
	const shouldReduceMotion = useReducedMotion();

	useEffect(() => {
		let mounted = true;

		Promise.all([
			fetchUserStats("moodynooby"),
			...addonIds.map((addonId) => fetchAddonMetadata(addonId)),
			...featuredProjects.map((project) =>
				fetchRepoMetadata(project.githubName),
			),
		]).then(([stats, ...rest]) => {
			if (!mounted) return;
			setGithubStats(stats);

			const addons = rest.slice(0, addonIds.length);
			const repos = rest.slice(addonIds.length);

			const addonById = new Map(
				addonIds.map((addonId, index) => [addonId, addons[index]]),
			);
			const resolvedAddons = addons.filter(Boolean);

			const totalUsers = resolvedAddons.reduce(
				(total, addon) => total + (addon.averageDailyUsers || 0),
				0,
			);
			const totalDownloads = resolvedAddons.reduce(
				(total, addon) => total + (addon.weeklyDownloads || 0),
				0,
			);
			setAddonStats({
				totalUsers,
				totalDownloads,
				addonCount: resolvedAddons.length,
			});

			setFeaturedMeta(
				featuredProjects.reduce((acc, project, index) => {
					acc[project.githubName] = repos[index] || {};
					if (project.addonId) {
						acc[project.githubName].addon =
							addonById.get(project.addonId) || null;
					}
					return acc;
				}, {}),
			);
		});

		return () => {
			mounted = false;
		};
	}, []);

	const formatCompact = (value) =>
		new Intl.NumberFormat("en", {
			notation: "compact",
			maximumFractionDigits: 1,
		}).format(value || 0);

	const formatNumber = (value) =>
		new Intl.NumberFormat("en").format(value || 0);

	const ledgerEntries = [
		githubStats && {
			label: "Repositories",
			value: formatNumber(githubStats.publicRepos),
		},
		githubStats &&
			githubStats.totalStars > 0 && {
				label: "Stars earned",
				value: formatNumber(githubStats.totalStars),
			},
		addonStats.totalUsers > 0 && {
			label: "Firefox users",
			value: formatCompact(addonStats.totalUsers),
		},
		addonStats.totalDownloads > 0 && {
			label: "Weekly downloads",
			value: formatCompact(addonStats.totalDownloads),
		},
	].filter(Boolean);

	return (
		<Box sx={{ minHeight: "100vh", pb: 8 }}>
			<ButtonAppBar />

			<Container
				maxWidth="lg"
				sx={{ mt: { xs: 7, md: 10 } }}
				id="about-section"
			>
				<motion.div
					initial={shouldReduceMotion ? false : { opacity: 0, y: 24 }}
					animate={{ opacity: 1, y: 0 }}
					transition={shouldReduceMotion ? { duration: 0 } : { duration: 0.7 }}
				>
					<Typography variant="overline" color="text.secondary">
						Manas Doshi · Student · Engineer
					</Typography>
					<Typography
						variant="h2"
						component="h1"
						sx={{
							fontSize: { xs: "2.6rem", md: "4rem" },
							lineHeight: 1.08,
							mt: 1.5,
							mb: 3.5,
							maxWidth: "17ch",
						}}
					>
						I see something I like — then build{" "}
						<Box component="em" sx={{ fontStyle: "italic", fontWeight: 400 }}>
							my own version.
						</Box>
					</Typography>
					<Typography variant="body1" sx={{ mb: 4, maxWidth: "58ch" }}>
						Browser extensions, hardware-software experiments, and the
						occasional breakage it takes to learn something properly.
					</Typography>
					<Box
						sx={{
							display: "flex",
							flexWrap: "wrap",
							gap: 2,
							mb: { xs: 6, md: 9 },
						}}
					>
						<Button
							variant="contained"
							color="primary"
							component={Link}
							to="/projects"
							aria-label="View Manas Doshi's projects"
						>
							View Projects
						</Button>
						<Button
							variant="outlined"
							color="primary"
							href="https://flowcv.com/resume/woofkdsq4sse"
							target="_blank"
							rel="noopener noreferrer"
							aria-label="Open Manas Doshi's resume in a new tab"
						>
							View Résumé
						</Button>
					</Box>

					{ledgerEntries.length > 0 && (
						<Box
							sx={{
								borderTop: "1px solid",
								borderBottom: "1px solid",
								borderColor: "divider",
								py: 2.5,
								display: "flex",
								flexWrap: "wrap",
							}}
						>
							{ledgerEntries.map((entry) => (
								<Box
									key={entry.label}
									sx={{
										flex: { xs: "1 1 40%", sm: "1 1 auto" },
										minWidth: 120,
										px: { xs: 0, sm: 4 },
										py: { xs: 1, sm: 0 },
										"& + &": {
											borderLeft: { xs: "none", sm: "1px solid" },
											borderColor: "divider",
											pl: { sm: 4 },
										},
									}}
								>
									<Typography
										variant="h4"
										component="p"
										sx={{ lineHeight: 1.2 }}
									>
										{entry.value}
									</Typography>
									<Typography variant="overline" color="text.secondary">
										{entry.label}
									</Typography>
								</Box>
							))}
						</Box>
					)}
				</motion.div>
			</Container>

			<Container
				maxWidth="lg"
				sx={{ mt: { xs: 8, md: 12 } }}
				id="projects-section"
			>
				<Box
					sx={{
						display: "flex",
						alignItems: "baseline",
						justifyContent: "space-between",
						flexWrap: "wrap",
						gap: 1,
						borderTop: "1px solid",
						borderColor: "divider",
						pt: 3,
						mb: 4,
					}}
				>
					<Typography variant="h3">Featured Work</Typography>
					<Typography variant="overline" color="text.secondary">
						{featuredProjects.length} of {projectsData.length} entries
					</Typography>
				</Box>
				<Box
					sx={{
						display: "grid",
						gridTemplateColumns: {
							xs: "1fr",
							md: `repeat(${Math.min(featuredProjects.length, 3)}, 1fr)`,
						},
						gap: { xs: 0, md: 4 },
					}}
				>
					{featuredProjects.map((project) => {
						const meta = featuredMeta[project.githubName] || {};
						return (
							<Box
								key={project.githubName}
								component={Link}
								to={`/projects/${project.githubName}`}
								sx={{
									display: "flex",
									flexDirection: "column",
									gap: 1.5,
									py: { xs: 3, md: 0 },
									textDecoration: "none",
									color: "text.primary",
									transition: "background-color 0.3s ease",
									"&:hover": { bgcolor: "action.hover" },
									"&:hover .featured-thumb img": {
										filter: "grayscale(0%) contrast(100%)",
									},
								}}
							>
								<Box
									className="featured-thumb"
									sx={{
										width: 88,
										height: 88,
										flexShrink: 0,
										border: "1px solid",
										borderColor: "divider",
										display: "flex",
										alignItems: "center",
										justifyContent: "center",
										p: 1.5,
										bgcolor: "background.paper",
										mb: 1,
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
								<Typography variant="h5">{project.githubName}</Typography>
								<Typography
									variant="body2"
									color="text.secondary"
									sx={{
										lineHeight: 1.6,
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
										flexWrap: "wrap",
										alignItems: "center",
										columnGap: 1.5,
										rowGap: 0.5,
										mt: "auto",
										pt: 1,
									}}
								>
									<Typography
										variant="overline"
										color="secondary.main"
										component="span"
									>
										{project.category}
									</Typography>
									{meta.stars > 0 && (
										<Typography
											variant="overline"
											color="text.secondary"
											component="span"
										>
											{formatNumber(meta.stars)} stars
										</Typography>
									)}
									{meta.addon?.averageDailyUsers > 0 && (
										<Typography
											variant="overline"
											color="text.secondary"
											component="span"
										>
											{formatNumber(meta.addon.averageDailyUsers)} users
										</Typography>
									)}
								</Box>
							</Box>
						);
					})}
				</Box>
			</Container>

			<Container
				maxWidth="lg"
				sx={{ mt: { xs: 9, md: 14 } }}
				id="experience-section"
			>
				<Typography
					variant="h2"
					component="h2"
					sx={{
						textAlign: "center",
						mb: 1,
						fontSize: { xs: "2rem", sm: "2.6rem", md: "3.25rem" },
					}}
				>
					The Visual Archive
				</Typography>
				<Typography
					variant="body2"
					component="p"
					sx={{
						textAlign: "center",
						fontStyle: "italic",
						color: "text.secondary",
						mb: { xs: 5, md: 8 },
					}}
				>
					Photographs and kinetic studies, preserved for the record.
				</Typography>
				<Suspense
					fallback={
						<Box
							sx={{
								display: "flex",
								justifyContent: "center",
								py: 8,
							}}
							role="status"
							aria-label="Loading gallery"
						>
							<CircularProgress
								size={32}
								thickness={2}
								color="inherit"
								sx={{ color: "text.secondary" }}
							/>
						</Box>
					}
				>
					<Gallery limit={4} showAppBar={false} />
				</Suspense>
			</Container>

			<Container maxWidth="lg">
				<Divider sx={{ my: { xs: 6, md: 10 }, borderColor: "divider" }} />
			</Container>

			<Box
				component="footer"
				sx={{
					borderTop: "1px solid",
					borderColor: "divider",
					py: 4,
					px: 2,
				}}
			>
				<Container
					maxWidth="lg"
					sx={{
						display: "flex",
						justifyContent: "space-between",
						flexWrap: "wrap",
						gap: 1,
					}}
				>
					<Typography variant="overline" color="text.secondary">
						© {new Date().getFullYear()} Manas Doshi
					</Typography>
					<Typography variant="overline" color="text.secondary">
						Set in Newsreader &amp; Noto Serif
					</Typography>
				</Container>
			</Box>
		</Box>
	);
}
