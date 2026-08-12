import { Code, GitHub, People, Star } from "@mui/icons-material";
import {
	Box,
	Button,
	Chip,
	Container,
	Divider,
	Grid,
	Typography,
} from "@mui/material";
import { motion } from "motion/react";
import { lazy, Suspense, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ButtonAppBar from "@/components/Header";
import RouteLoader from "@/components/RouteLoader";
import { fetchUserStats } from "@/utils/githubUtils";

const Gallery = lazy(() => import("@/components/Gallery"));

export default function LandingPage() {
	const [githubStats, setGithubStats] = useState(null);

	useEffect(() => {
		let mounted = true;
		fetchUserStats("moodynooby").then((stats) => {
			if (mounted) setGithubStats(stats);
		});
		return () => {
			mounted = false;
		};
	}, []);

	return (
		<Box sx={{ minHeight: "100vh", pb: 8 }}>
			<ButtonAppBar />

			<Container maxWidth="lg" sx={{ mt: 6 }}>
				<Grid container spacing={4} alignItems="center">
					<Grid size={{ xs: 12, md: 10, mdOffset: 1 }}>
						<motion.div
							initial={{ opacity: 0, y: 30 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.8 }}
						>
							<Typography
								variant="h2"
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
								hardware-software integration, and occasionally break things
								trying to learn.
							</Typography>
							<Box sx={{ display: "flex", flexWrap: "wrap", gap: 2, mb: 6 }}>
								<Button
									variant="contained"
									color="primary"
									component={Link}
									to="/projects"
								>
									VIEW PROJECTS
								</Button>
								<Button
									variant="outlined"
									color="primary"
									href="https://flowcv.com/resume/woofkdsq4sse"
									target="_blank"
									rel="noopener noreferrer"
								>
									VIEW RESUME
								</Button>
							</Box>

							{/* Native GitHub stats: fetched from GitHub's API and cached locally for 24 hours. */}
							{githubStats && (
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
											sx={{ display: "flex", flexWrap: "wrap", gap: 1, mt: 2 }}
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
								</Box>
							)}
						</motion.div>
					</Grid>
				</Grid>

				<Divider
					sx={{ my: 10, borderColor: "text.primary", borderWidth: "2px" }}
				/>

				{/* <Box sx={{ mt: 16 }}>
					<Typography
						variant="h3"
						sx={{
							fontFamily: '"Newsreader", serif',
							fontWeight: 800,
							textAlign: "center",
							mb: 6,
							textTransform: "uppercase",
						}}
					>
						The Visual Dispatch
					</Typography>
					<Suspense fallback={<RouteLoader />}>
						<Gallery limit={4} showAppBar={false} />
					</Suspense>
					<Box sx={{ display: "flex", justifyContent: "center", mt: 6 }}>
						<Button
							variant="outlined"
							color="primary"
							component={Link}
							to="/gallery"
							sx={{
								fontFamily: '"Newsreader", serif',
								fontStyle: "italic",
								px: 4,
							}}
						>
							VIEW THE FULL ARCHIVE →
						</Button>
					</Box>
				</Box> */}
			</Container>

			<Box
				sx={{
					borderTop: "1px solid black",
					py: 6,
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
