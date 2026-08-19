import { Code, Download, GitHub, People, Star } from "@mui/icons-material";
import {
	Box,
	Button,
	Chip,
	CircularProgress,
	Container,
	Divider,
	Grid,
	Typography,
} from "@mui/material";
import { motion, useReducedMotion } from "motion/react";
import { lazy, Suspense, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ButtonAppBar from "@/components/Header";
import SocialProofTicker from "@/components/SocialProofTicker";
import linkedinPosts from "@/content/linkedinPosts.json";
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

	return (
		<Box sx={{ minHeight: "100vh", pb: 8 }}>
			<ButtonAppBar />
			<SocialProofTicker />

			<Container maxWidth="lg" sx={{ mt: 6 }}>
				<motion.div
					initial={shouldReduceMotion ? false : { opacity: 0, y: 30 }}
					animate={{ opacity: 1, y: 0 }}
					transition={shouldReduceMotion ? { duration: 0 } : { duration: 0.8 }}
				>
					<Typography
						variant="h2"
						component="h1"
						sx={{
							fontSize: { xs: "2.5rem", md: "4rem" },
							lineHeight: 1.1,
							mb: 4,
							fontWeight: 800,
						}}
					>
						STUDENT. ENGINEER.
					</Typography>
					<Typography
						variant="body1"
						sx={{ mb: 4, maxWidth: "600px", fontSize: "1.25rem" }}
					>
						Hi, I'm Manas. I build browser extensions, tinker with
						hardware-software integration, and occasionally break things trying
						to learn. If I see something I like, I try to learn how it works —
						then build my own version.
					</Typography>
					<Box sx={{ display: "flex", flexWrap: "wrap", gap: 2, mb: 6 }}>
						<Button
							variant="contained"
							color="primary"
							component={Link}
							to="/projects"
							aria-label="View Manas Doshi's projects"
						>
							VIEW PROJECTS
						</Button>
						<Button
							variant="outlined"
							color="primary"
							href="https://flowcv.com/resume/woofkdsq4sse"
							target="_blank"
							rel="noopener noreferrer"
							aria-label="Open Manas Doshi's resume in a new tab"
						>
							VIEW RESUME
						</Button>
					</Box>

					{(githubStats || addonStats.addonCount > 0) && (
						<Box
							sx={{
								mt: 4,
								p: { xs: 2, sm: 3 },
								border: "1px solid",
								borderColor: "divider",
								borderRadius: 2,
								backgroundColor: "background.paper",
								maxWidth: 680,
							}}
						>
							{githubStats && (
								<>
									<Box
										sx={{
											display: "flex",
											alignItems: "center",
											gap: 1,
											mb: 2,
										}}
									>
										<GitHub fontSize="small" />
										<Typography variant="overline" sx={{ fontWeight: 800 }}>
											GitHub / MOOD YNOOBY
										</Typography>
									</Box>
									<Grid container spacing={1.5}>
										{[
											{
												label: "Repositories",
												value: githubStats.publicRepos,
												icon: <Code fontSize="small" />,
											},
											{
												label: "Stars earned",
												value: githubStats.totalStars,
												icon: <Star fontSize="small" />,
											},
											{
												label: "Followers",
												value: githubStats.followers,
												icon: <People fontSize="small" />,
											},
										].map((stat) => (
											<Grid key={stat.label} size={{ xs: 4 }}>
												<Box
													sx={{
														display: "flex",
														alignItems: "center",
														gap: 0.75,
													}}
												>
													{stat.icon}
													<Typography variant="h6" sx={{ fontWeight: 800 }}>
														{stat.value}
													</Typography>
												</Box>
												<Typography variant="caption" color="text.secondary">
													{stat.label}
												</Typography>
											</Grid>
										))}
									</Grid>
									{githubStats.languages.length > 0 && (
										<Box
											sx={{
												display: "flex",
												flexWrap: "wrap",
												gap: 1,
												mt: 2,
											}}
										>
											{githubStats.languages.map((language) => (
												<Chip
													key={language.name}
													label={`${language.name} · ${language.count}`}
													size="small"
													variant="outlined"
												/>
											))}
										</Box>
									)}
								</>
							)}
							{addonStats.addonCount > 0 && (
								<Box
									sx={{
										display: "flex",
										flexWrap: "wrap",
										alignItems: "center",
										gap: 2,
										mt: githubStats ? 3 : 0,
									}}
								>
									<Box
										sx={{ display: "flex", alignItems: "center", gap: 0.75 }}
									>
										<Download fontSize="small" />
										<Typography variant="overline" color="text.secondary">
											{formatCompact(addonStats.totalUsers)} users across{" "}
											{addonStats.addonCount} extensions
										</Typography>
									</Box>
									<Box
										sx={{ display: "flex", alignItems: "center", gap: 0.75 }}
									>
										<Star fontSize="small" />
										<Typography variant="overline" color="text.secondary">
											{formatCompact(addonStats.totalDownloads)} weekly
											downloads
										</Typography>
									</Box>
								</Box>
							)}
						</Box>
					)}
				</motion.div>
			</Container>

			<Container maxWidth="lg" sx={{ mt: 10 }}>
				<Box
					sx={{
						p: { xs: 2, sm: 4 },
						border: "1px solid",
						borderColor: "divider",
						borderRadius: 2,
						backgroundColor: "background.paper",
					}}
				>
					<Typography
						variant="h4"
						sx={{
							fontWeight: 800,
							mb: 1,
							textTransform: "uppercase",
							letterSpacing: "-0.02em",
						}}
					>
						Featured Projects
					</Typography>
					<Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
						I try to learn and make things I like — here are the ones that
						stuck.
					</Typography>
					<Box
						sx={{
							display: "grid",
							gridTemplateColumns: { xs: "1fr", md: "repeat(3, 1fr)" },
							gap: { xs: 2, md: 3 },
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
										p: 2.5,
										border: "1px solid",
										borderColor: "divider",
										borderRadius: 0,
										textDecoration: "none",
										color: "text.primary",
										transition: "background-color 0.3s ease",
										"&:hover": { bgcolor: "action.hover" },
									}}
								>
									<Box
										sx={{
											display: "flex",
											alignItems: "center",
											gap: 1.5,
										}}
									>
										<Box
											component="img"
											src={project.githubImg}
											alt=""
											loading="lazy"
											sx={{
												width: { xs: 40, md: 44 },
												height: { xs: 40, md: 44 },
												objectFit: "contain",
												opacity: 0.85,
												filter: "grayscale(100%) contrast(115%)",
												transition: "all 0.5s ease-in-out",
												"&:hover": {
													opacity: 1,
													filter: "grayscale(0%) contrast(100%)",
												},
											}}
										/>
										<Typography variant="h6" sx={{ fontWeight: 800 }}>
											{project.githubName}
										</Typography>
									</Box>
									<Typography
										variant="body2"
										color="text.secondary"
										sx={{ lineHeight: 1.6 }}
									>
										{project.tagline}
									</Typography>
									<Box sx={{ mt: "auto" }}>
										<Box
											sx={{
												display: "flex",
												flexWrap: "wrap",
												alignItems: "center",
												gap: 1.5,
												mt: 1,
											}}
										>
											{meta.stars > 0 && (
												<Box
													sx={{
														display: "flex",
														alignItems: "center",
														gap: 0.5,
													}}
												>
													<Star fontSize="small" color="secondary" />
													<Typography
														variant="overline"
														sx={{ fontSize: "0.7rem" }}
													>
														{formatNumber(meta.stars)} stars
													</Typography>
												</Box>
											)}
											{meta.addon?.averageDailyUsers > 0 && (
												<Box
													sx={{
														display: "flex",
														alignItems: "center",
														gap: 0.5,
													}}
												>
													<People fontSize="small" color="secondary" />
													<Typography
														variant="overline"
														sx={{ fontSize: "0.7rem" }}
													>
														{formatNumber(meta.addon.averageDailyUsers)} users
													</Typography>
												</Box>
											)}
											{meta.addon?.weeklyDownloads > 0 && (
												<Box
													sx={{
														display: "flex",
														alignItems: "center",
														gap: 0.5,
													}}
												>
													<Download fontSize="small" color="secondary" />
													<Typography
														variant="overline"
														sx={{ fontSize: "0.7rem" }}
													>
														{formatNumber(meta.addon.weeklyDownloads)} weekly
														downloads
													</Typography>
												</Box>
											)}
										</Box>
										<Typography
											variant="overline"
											color="secondary.main"
											sx={{ display: "block", mt: 1 }}
										>
											{project.category}
										</Typography>
									</Box>
								</Box>
							);
						})}
					</Box>
				</Box>
			</Container>

			<Container maxWidth="lg" sx={{ mt: 10 }}>
				<Typography
					variant="h2"
					sx={{
						textAlign: "center",
						mb: { xs: 3, md: 4 },
						fontFamily: '"Newsreader", serif',
						fontWeight: 800,
						textTransform: "uppercase",
						letterSpacing: "-0.02em",
						fontSize: { xs: "1.9rem", sm: "2.5rem", md: "3.25rem" },
						lineHeight: 1.15,
					}}
				>
					The Visual Archive
				</Typography>
				<Typography
					variant="body1"
					sx={{
						textAlign: "center",
						mb: { xs: 5, md: 8 },
						fontFamily: '"Noto Serif", serif',
						fontStyle: "italic",
						opacity: 0.7,
						maxWidth: 600,
						mx: "auto",
					}}
				>
					A curated selection from the living archive.
				</Typography>
				<Suspense
					fallback={
						<Box
							sx={{
								display: "flex",
								justifyContent: "center",
								py: 8,
							}}
						>
							<CircularProgress size={40} thickness={3} />
						</Box>
					}
				>
					<Gallery limit={4} showAppBar={false} />
				</Suspense>
			</Container>

			<Container maxWidth="lg">
				<Box
					sx={{
						mt: 10,
						p: { xs: 2, sm: 4 },
						border: "1px solid",
						borderColor: "divider",
						borderRadius: 2,
						backgroundColor: "background.paper",
					}}
				>
					<Box
						sx={{
							display: "flex",
							flexWrap: "wrap",
							alignItems: "center",
							justifyContent: "space-between",
							gap: 2,
							mb: 3,
						}}
					>
						<Typography
							variant="h4"
							sx={{
								fontWeight: 800,
								textTransform: "uppercase",
								letterSpacing: "-0.02em",
							}}
						>
							LinkedIn Posts
						</Typography>
						<Button
							variant="outlined"
							color="primary"
							component="a"
							href="https://www.linkedin.com/in/manas-doshi-644751363/"
							target="_blank"
							rel="noopener noreferrer"
							aria-label="Open Manas Doshi's LinkedIn profile in a new tab"
						>
							FOLLOW ME
						</Button>
					</Box>
					<Box
						sx={{
							display: "grid",
							gridTemplateColumns: { xs: "1fr", md: "repeat(3, 1fr)" },
							gap: { xs: 2, md: 3 },
						}}
					>
						{linkedinPosts.map((post) => (
							<Box
								key={post.id}
								component="a"
								href={post.url}
								target="_blank"
								rel="noopener noreferrer"
								sx={{
									display: "flex",
									flexDirection: "column",
									gap: 1.5,
									p: 2.5,
									border: "1px solid",
									borderColor: "divider",
									borderRadius: 0,
									textDecoration: "none",
									color: "text.primary",
									transition: "background-color 0.3s ease",
									"&:hover": { bgcolor: "action.hover" },
								}}
							>
								<Typography variant="body2" sx={{ lineHeight: 1.6 }}>
									{post.text}
								</Typography>
								<Box sx={{ mt: "auto" }}>
									<Box
										sx={{
											display: "flex",
											flexWrap: "wrap",
											gap: 1.5,
											alignItems: "center",
										}}
									>
										<Typography
											variant="overline"
											color="text.secondary"
											sx={{ fontSize: "0.7rem" }}
										>
											{formatNumber(post.likes)} likes
										</Typography>
										<Typography
											variant="overline"
											color="text.secondary"
											sx={{ fontSize: "0.7rem" }}
										>
											{formatNumber(post.comments)} comments
										</Typography>
									</Box>
								</Box>
							</Box>
						))}
					</Box>
				</Box>
			</Container>

			<Container maxWidth="lg">
				<Divider
					sx={{
						my: { xs: 5, md: 10 },
						borderColor: "text.primary",
						borderWidth: "2px",
					}}
				/>
			</Container>

			<Box
				component="footer"
				sx={{
					borderTop: "1px solid",
					borderColor: "divider",
					py: 6,
					px: 2,
					textAlign: "center",
					mt: 10,
				}}
			>
				<Typography variant="overline" sx={{ fontWeight: 800 }}>
					© {new Date().getFullYear()} MANAS DOSHI — ALL RIGHTS RESERVED
				</Typography>
			</Box>
		</Box>
	);
}
