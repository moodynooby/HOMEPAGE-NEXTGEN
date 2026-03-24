import {
	Box,
	Container,
	Typography,
	useMediaQuery,
	useTheme,
	CircularProgress,
	Link,
} from "@mui/material";
import { motion } from "motion/react";
import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ButtonAppBar from "@/components/Header";
import projectsData from "@/content/projects.json";
import { fetchRepoMetadata, groupProjectsByYear } from "@/utils/githubUtils";

const MotionBox = motion.create(Box);

export default function Projects({ limit, showAppBar = true }) {
	const navigate = useNavigate();
	const theme = useTheme();
	const isMobile = useMediaQuery(theme.breakpoints.down("md"));
	const [projects, setProjects] = useState([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		async function loadProjects() {
			const projectsWithMetadata = await Promise.all(
				projectsData.map(async (project) => {
					const metadata = await fetchRepoMetadata(project.githubName);
					return {
						...project,
						year: metadata?.year || new Date().getFullYear(),
						date: metadata?.created_at || "",
					};
				}),
			);
			const sortedProjects = projectsWithMetadata.sort(
				(a, b) => new Date(b.date) - new Date(a.date),
			);

			setProjects(limit ? sortedProjects.slice(0, limit) : sortedProjects);
			setLoading(false);
		}
		loadProjects();
	}, [limit]);

	if (loading) {
		return (
			<Box
				sx={{
					display: "flex",
					justifyContent: "center",
					alignItems: "center",
					minHeight: "60vh",
				}}
			>
				<CircularProgress color="primary" />
			</Box>
		);
	}

	const groupedProjects = groupProjectsByYear(projects);
	const years = Object.keys(groupedProjects).sort((a, b) => {
		if (a === "Unknown") return 1;
		if (b === "Unknown") return -1;
		return Number(b) - Number(a);
	});

	return (
		<>
			{showAppBar && <ButtonAppBar />}
			<Box
				sx={{
					pt: showAppBar ? { xs: 10, md: 14 } : 0,
					pb: 8,
					position: "relative",
					minHeight: "100vh",
				}}
			>
				<Container maxWidth="lg">
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.8 }}
					>
						<Typography
							variant="h2"
							sx={{
								textAlign: "center",
								mb: 12,
								fontFamily: '"Newsreader", serif',
								fontWeight: 800,
								textTransform: "uppercase",
								letterSpacing: "-0.02em",
							}}
						>
							The Project Ledger
						</Typography>
					</motion.div>

					<Box sx={{ position: "relative" }}>
						{!isMobile && (
							<Box
								sx={{
									position: "absolute",
									left: "50%",
									top: 0,
									bottom: 0,
									width: "1px",
									bgcolor: "rgba(187, 186, 172, 0.3)",
									transform: "translateX(-50%)",
								}}
							/>
						)}

						{years.map((year) => (
							<Box
								key={year}
								sx={{
									mb: 12,
									display: "flex",
									flexDirection: "column",
									alignItems: "center",
									position: "relative",
								}}
							>
								<MotionBox
									initial={{ scale: 0.8, opacity: 0 }}
									whileInView={{ scale: 1, opacity: 1 }}
									viewport={{ once: true }}
									sx={{
										bgcolor: "background.default",
										px: 4,
										py: 1,
										mb: 8,
										zIndex: 2,
										border: "1px solid",
										borderColor: "divider",
										display: "flex",
										alignItems: "center",
										justifyContent: "center",
										width: 140,
										height: 140,
										borderRadius: "50%",
									}}
								>
									<Typography
										variant="h3"
										sx={{
											fontFamily: '"Newsreader", serif',
											fontStyle: "italic",
											color: "secondary.main",
											fontWeight: 300,
										}}
									>
										{year}
									</Typography>
								</MotionBox>

								<Box sx={{ width: "100%" }}>
									{groupedProjects[year].map((project, idx) => {
										const isEven = idx % 2 === 0;
										return (
											<Box
												key={project.githubName}
												sx={{
													display: "flex",
													flexDirection: isMobile ? "column" : "row",
													mb: 8,
													width: "100%",
												}}
											>
												{!isMobile && isEven && <Box sx={{ flex: 1, px: 4 }} />}

												<MotionBox
													initial={{
														x: isMobile ? 0 : isEven ? 50 : -50,
														opacity: 0,
													}}
													whileInView={{ x: 0, opacity: 1 }}
													viewport={{ once: true }}
													transition={{ duration: 0.6, delay: 0.1 }}
													sx={{
														flex: 1,
														px: { xs: 0, md: 8 },
														display: "flex",
														flexDirection: "column",
														alignItems: isMobile
															? "start"
															: isEven
																? "start"
																: "end",
														textAlign: isMobile
															? "left"
															: isEven
																? "left"
																: "right",
													}}
												>
													<Box
														component="article"
														sx={{
															maxWidth: 500,
															width: "100%",
															cursor: "pointer",
														}}
														onClick={() =>
															navigate(`/projects/${project.githubName}`)
														}
													>
														<Box
															sx={{
																width: "100%",
																aspectRatio: "4/3",
																bgcolor: "rgba(187, 186, 172, 0.1)",
																mb: 3,
																position: "relative",
																overflow: "hidden",
															}}
														>
															<Box
																component="img"
																src={project.githubImg}
																alt={project.githubName}
																sx={{
																	width: "100%",
																	height: "100%",
																	objectFit: "contain",
																	opacity: 0.8,
																	filter: "grayscale(100%) contrast(120%)",
																	transition: "all 0.6s ease-in-out",
																	"&:hover": {
																		opacity: 1,
																		filter: "grayscale(0%) contrast(100%)",
																		transform: "scale(1.02)",
																	},
																	p: 4,
																}}
															/>
														</Box>
														<Typography
															variant="h4"
															sx={{
																fontFamily: '"Newsreader", serif',
																mb: 1,
																color: "text.primary",
															}}
														>
															{project.githubName}
														</Typography>
														<Typography
															variant="body2"
															sx={{
																mb: 3,
																color: "text.primary",
																opacity: 0.8,
																fontFamily: '"Noto Serif", serif',
																lineHeight: 1.8,
															}}
														>
															Explore the archival details and technical
															blueprints for {project.githubName}. This dispatch
															curates the evolution of the project.
														</Typography>
														<Link
															sx={{
																fontFamily: '"Newsreader", serif',
																fontStyle: "italic",
																color: "secondary.main",
																textDecoration: "none",
																borderBottom: "1px solid",
																borderColor: "rgba(125, 93, 83, 0.3)",
																paddingBottom: "2px",
																"&:hover": {
																	borderColor: "secondary.main",
																},
															}}
														>
															Read the full dispatch
														</Link>
													</Box>
												</MotionBox>

												{!isMobile && !isEven && (
													<Box sx={{ flex: 1, px: 4 }} />
												)}
											</Box>
										);
									})}
								</Box>
							</Box>
						))}
					</Box>

					<Box
						sx={{
							mt: 16,
							pt: 8,
							pb: 8,
							borderTop: "0.5px solid",
							borderBottom: "0.5px solid",
							borderColor: "rgba(187, 186, 172, 0.3)",
							textAlign: "center",
						}}
					>
						<Typography
							variant="h4"
							sx={{
								fontFamily: '"Newsreader", serif',
								fontStyle: "italic",
								mb: 4,
								maxWidth: 800,
								mx: "auto",
							}}
						>
							"Design is the silent ambassador of your brand, an archive of
							thought etched in pixels."
						</Typography>
						<Typography
							variant="overline"
							sx={{
								display: "block",
								fontSize: "10px",
								letterSpacing: "0.3em",
								color: "text.secondary",
							}}
						>
							— Editorial Note, MCMXCIV – MMXXV
						</Typography>
					</Box>
				</Container>
			</Box>
		</>
	);
}

Projects.propTypes = {
	limit: PropTypes.number,
	showAppBar: PropTypes.bool,
};
