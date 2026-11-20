import {
	Calendar as CalendarTodayIcon,
	X as ClearIcon,
	X as CloseIcon,
	GitCommit as CommitIcon,
	Filter as FilterAltIcon,
	ExternalLink as LaunchIcon,
	RotateCcw as RestartAltIcon,
	Search as SearchIcon,
	ArrowUpDown as SwapVertIcon,
} from "lucide-react";
import { useMemo, useState } from "react";
import {
	Box,
	Button,
	Card,
	CardActionArea,
	CardContent,
	Chip,
	Divider,
	Drawer,
	IconButton,
	InputAdornment,
	Paper,
	Stack,
	TextField,
	Typography,
	useTheme,
} from "@/components/ui";
import timelineData from "@/content/timelineMilestones.json";
import { socialIcons } from "@/utils/socialIcons";

const GitHubIcon = socialIcons.GitHub;

export const PROJECT_CONFIG = timelineData.projectConfig;
export const TIMELINE_MILESTONES = timelineData.milestones;

const BADGE_COLOR_MAP = {
	Feature: "primary",
	Major: "secondary",
	Initial: "default",
	"Initial Release": "default",
	Enhancement: "info",
	Resilience: "warning",
	Architecture: "secondary",
	Privacy: "info",
};

export default function ProjectTimeline() {
	const theme = useTheme();
	const isDark = theme.palette.mode === "dark";

	const [selectedProject, setSelectedProject] = useState("All");
	const [searchQuery, setSearchQuery] = useState("");
	const [sortDesc, setSortDesc] = useState(true);
	const [activeMilestone, setActiveMilestone] = useState(null);

	const projectFilterOptions = useMemo(() => {
		const projects = Object.keys(PROJECT_CONFIG);
		const counts = { All: TIMELINE_MILESTONES.length };
		for (const p of projects) {
			counts[p] = TIMELINE_MILESTONES.filter((m) => m.project === p).length;
		}
		return [
			{ id: "All", label: "All Repositories", count: counts.All },
			...projects.map((p) => ({
				id: p,
				label: PROJECT_CONFIG[p].shortName || p,
				count: counts[p] || 0,
				color: PROJECT_CONFIG[p].color,
			})),
		];
	}, []);

	const filteredMilestones = useMemo(() => {
		const query = searchQuery.trim().toLowerCase();
		return TIMELINE_MILESTONES.filter((milestone) => {
			const matchesProject =
				selectedProject === "All" || milestone.project === selectedProject;
			if (!matchesProject) return false;

			if (!query) return true;

			const matchText = [
				milestone.title,
				milestone.summary,
				milestone.version,
				milestone.project,
				milestone.commit,
				milestone.badge,
				...(milestone.tags || []),
				...(milestone.details || []),
			]
				.join(" ")
				.toLowerCase();

			return matchText.includes(query);
		}).sort((a, b) => {
			const timeA = new Date(a.date).getTime();
			const timeB = new Date(b.date).getTime();
			return sortDesc ? timeB - timeA : timeA - timeB;
		});
	}, [selectedProject, searchQuery, sortDesc]);

	const handleResetFilters = () => {
		setSelectedProject("All");
		setSearchQuery("");
	};

	const handleOpenDrawer = (milestone) => {
		setActiveMilestone(milestone);
	};

	const handleCloseDrawer = () => {
		setActiveMilestone(null);
	};

	return (
		<Paper
			elevation={0}
			data-testid="project-timeline"
			sx={{
				p: { xs: 2, sm: 3, md: 4 },
				border: "1px solid",
				borderColor: "divider",
				borderRadius: 2,
				backgroundColor: isDark
					? "rgba(40, 42, 33, 0.65)"
					: "rgba(253, 255, 218, 0.5)",
				position: "relative",
			}}
		>
			<Box sx={{ mb: 3 }}>
				<Box
					sx={{
						display: "flex",
						justifyContent: "space-between",
						alignItems: "flex-start",
						flexWrap: "wrap",
						gap: 1.5,
						mb: 2,
					}}
				>
					<Box>
						<Typography
							variant="h4"
							component="h3"
							sx={{
								fontFamily: '"Newsreader", serif',
								fontWeight: 700,
								fontSize: { xs: "1.5rem", sm: "1.85rem" },
							}}
						>
							Interactive Project Timeline &amp; Release Milestones
						</Typography>
						<Typography
							variant="body2"
							color="text.secondary"
							sx={{ fontStyle: "italic", mt: 0.5 }}
						>
							Chronological evolution and release changelog across the 5
							ecosystem applications.
						</Typography>
					</Box>

					<Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
						<Button
							variant="outlined"
							size="small"
							startIcon={<SwapVertIcon />}
							onClick={() => setSortDesc(!sortDesc)}
							sx={{
								textTransform: "none",
								fontSize: "0.8rem",
								py: 0.5,
								px: 1.25,
								borderColor: "divider",
								color: "text.primary",
								"&:hover": { borderColor: "text.primary" },
							}}
							aria-label={sortDesc ? "Sort oldest first" : "Sort newest first"}
						>
							{sortDesc ? "Newest first" : "Oldest first"}
						</Button>

						{(selectedProject !== "All" || searchQuery) && (
							<Button
								variant="outlined"
								size="small"
								startIcon={<RestartAltIcon />}
								onClick={handleResetFilters}
								sx={{
									textTransform: "none",
									fontSize: "0.8rem",
									py: 0.5,
									px: 1.25,
									borderColor: "divider",
									color: "text.primary",
									"&:hover": { borderColor: "text.primary" },
								}}
								aria-label="Reset filters"
							>
								Reset Filters
							</Button>
						)}
					</Box>
				</Box>

				<Box sx={{ mb: 2.5 }}>
					<TextField
						fullWidth
						size="small"
						label="Search milestones"
						placeholder="Search milestones, versions, features, or commits..."
						value={searchQuery}
						onChange={(e) => setSearchQuery(e.target.value)}
						data-testid="milestone-search"
						inputProps={{
							"aria-label": "Search milestones",
						}}
						InputProps={{
							startAdornment: (
								<InputAdornment position="start">
									<SearchIcon
										fontSize="small"
										sx={{ color: "text.secondary" }}
									/>
								</InputAdornment>
							),
							endAdornment: searchQuery ? (
								<InputAdornment position="end">
									<IconButton
										size="small"
										onClick={() => setSearchQuery("")}
										aria-label="Clear search query"
									>
										<ClearIcon fontSize="small" />
									</IconButton>
								</InputAdornment>
							) : null,
						}}
						sx={{
							"& .MuiOutlinedInput-root": {
								bgcolor: isDark
									? "rgba(40, 42, 33, 0.5)"
									: "rgba(255, 255, 255, 0.7)",
								borderRadius: 1,
							},
						}}
					/>
				</Box>

				<Box
					sx={{
						display: "flex",
						alignItems: "center",
						gap: 1,
						flexWrap: "wrap",
					}}
				>
					<Typography
						variant="caption"
						color="text.secondary"
						sx={{
							display: "flex",
							alignItems: "center",
							gap: 0.5,
							fontWeight: 600,
							letterSpacing: "0.05em",
							textTransform: "uppercase",
							mr: 0.5,
						}}
					>
						<FilterAltIcon sx={{ fontSize: 14 }} /> Repos:
					</Typography>

					{projectFilterOptions.map((opt) => {
						const isSelected = selectedProject === opt.id;
						const dotColor = opt.color || theme.palette.text.primary;
						return (
							<Chip
								key={opt.id}
								clickable
								label={`${opt.label} (${opt.count})`}
								size="small"
								onClick={() => setSelectedProject(opt.id)}
								aria-label={`Filter by ${opt.label}`}
								data-testid={`filter-${opt.id}`}
								variant={isSelected ? "filled" : "outlined"}
								icon={
									opt.id !== "All" ? (
										<Box
											component="span"
											sx={{
												width: 8,
												height: 8,
												borderRadius: "50%",
												bgcolor: dotColor,
												ml: 1,
												mr: -0.5,
											}}
										/>
									) : undefined
								}
								sx={{
									cursor: "pointer",
									fontWeight: isSelected ? 600 : 400,
									borderColor: isSelected ? "text.primary" : "divider",
									bgcolor: isSelected
										? isDark
											? "rgba(253, 255, 218, 0.15)"
											: "rgba(56, 57, 46, 0.1)"
										: "transparent",
									"&:hover": {
										bgcolor: isDark
											? "rgba(253, 255, 218, 0.1)"
											: "rgba(56, 57, 46, 0.05)",
									},
								}}
							/>
						);
					})}
				</Box>
			</Box>

			<Divider sx={{ mb: 3 }} />

			<Box
				sx={{
					display: "flex",
					justifyContent: "space-between",
					alignItems: "center",
					mb: 2,
				}}
			>
				<Typography variant="caption" color="text.secondary">
					Showing {filteredMilestones.length} of {TIMELINE_MILESTONES.length}{" "}
					milestones
					{selectedProject !== "All" && ` in ${selectedProject}`}
					{searchQuery && ` matching "${searchQuery}"`}
				</Typography>
				<Typography
					variant="caption"
					color="text.secondary"
					sx={{ fontStyle: "italic" }}
				>
					Click any card to open changelog details
				</Typography>
			</Box>

			{filteredMilestones.length === 0 ? (
				<Box
					sx={{
						py: 6,
						textAlign: "center",
						borderRadius: 1,
						border: "1px dashed",
						borderColor: "divider",
					}}
				>
					<Typography variant="body1" color="text.secondary" sx={{ mb: 1.5 }}>
						No milestones found matching your filters.
					</Typography>
					<Button
						variant="outlined"
						size="small"
						onClick={handleResetFilters}
						startIcon={<RestartAltIcon />}
					>
						Clear Filters
					</Button>
				</Box>
			) : (
				<Box
					sx={{
						position: "relative",
						pl: { xs: 2.5, sm: 4 },
						"&::before": {
							content: '""',
							position: "absolute",
							left: { xs: 10, sm: 16 },
							top: 16,
							bottom: 16,
							width: 2,
							bgcolor: "divider",
						},
					}}
				>
					<Stack spacing={2.5}>
						{filteredMilestones.map((milestone) => {
							const proj = PROJECT_CONFIG[milestone.project] || {};
							const projectColor = proj.color || "#888";
							const badgeColor = BADGE_COLOR_MAP[milestone.badge] || "default";

							return (
								<Box
									key={milestone.id}
									sx={{ position: "relative" }}
									data-testid={`milestone-item-${milestone.id}`}
								>
									<Box
										sx={{
											position: "absolute",
											left: { xs: -24, sm: -30 },
											top: 20,
											width: 14,
											height: 14,
											borderRadius: "50%",
											bgcolor: projectColor,
											border: "2px solid",
											borderColor: "background.paper",
											boxShadow: `0 0 0 2px ${projectColor}44`,
											zIndex: 1,
										}}
									/>

									<Card
										variant="outlined"
										sx={{
											borderColor: "divider",
											bgcolor: isDark
												? "rgba(40, 42, 33, 0.45)"
												: "rgba(255, 255, 255, 0.65)",
											borderRadius: 1.5,
											transition: "transform 0.2s ease, border-color 0.2s ease",
											"&:hover": {
												transform: "translateY(-2px)",
												borderColor: projectColor,
											},
										}}
									>
										<CardActionArea
											onClick={() => handleOpenDrawer(milestone)}
											aria-label={`View release details for ${milestone.title}`}
											sx={{ p: 2 }}
										>
											<CardContent sx={{ p: 0, "&:last-child": { pb: 0 } }}>
												<Box
													sx={{
														display: "flex",
														alignItems: "center",
														justifyContent: "space-between",
														flexWrap: "wrap",
														gap: 1,
														mb: 1,
													}}
												>
													<Box
														sx={{
															display: "flex",
															alignItems: "center",
															gap: 1,
															flexWrap: "wrap",
														}}
													>
														<Chip
															label={proj.shortName || milestone.project}
															size="small"
															sx={{
																bgcolor: `${projectColor}20`,
																color: projectColor,
																fontWeight: 600,
																fontSize: "0.75rem",
																border: `1px solid ${projectColor}40`,
															}}
														/>
														<Chip
															label={milestone.version}
															size="small"
															variant="outlined"
															sx={{
																fontFamily: "monospace",
																fontWeight: 600,
																fontSize: "0.75rem",
															}}
														/>
														<Chip
															label={milestone.badge}
															size="small"
															color={badgeColor}
															variant="filled"
															sx={{ fontSize: "0.7rem", height: 20 }}
														/>
													</Box>

													<Box
														sx={{
															display: "flex",
															alignItems: "center",
															gap: 0.5,
															color: "text.secondary",
														}}
													>
														<CalendarTodayIcon sx={{ fontSize: 13 }} />
														<Typography
															variant="caption"
															sx={{ fontStyle: "italic" }}
														>
															{milestone.displayDate}
														</Typography>
													</Box>
												</Box>

												<Typography
													variant="h6"
													component="h4"
													sx={{
														fontFamily: '"Newsreader", serif',
														fontWeight: 700,
														lineHeight: 1.25,
														mb: 0.75,
													}}
												>
													{milestone.title}
												</Typography>

												<Typography
													variant="body2"
													color="text.secondary"
													sx={{ mb: 1.5, lineHeight: 1.55 }}
												>
													{milestone.summary}
												</Typography>

												<Box
													sx={{
														display: "flex",
														alignItems: "center",
														justifyContent: "space-between",
														flexWrap: "wrap",
														gap: 1,
														pt: 1,
														borderTop: "1px dashed",
														borderColor: "divider",
													}}
												>
													<Box
														sx={{
															display: "flex",
															alignItems: "center",
															gap: 0.75,
															flexWrap: "wrap",
														}}
													>
														{(milestone.tags || []).slice(0, 4).map((tag) => (
															<Chip
																key={tag}
																label={tag}
																size="small"
																variant="outlined"
																sx={{
																	fontSize: "0.68rem",
																	height: 19,
																	borderColor: "divider",
																}}
															/>
														))}
													</Box>

													<Box
														sx={{
															display: "flex",
															alignItems: "center",
															gap: 0.5,
															color: "text.secondary",
															fontFamily: "monospace",
															fontSize: "0.75rem",
														}}
													>
														<CommitIcon sx={{ fontSize: 15 }} />
														<span>{milestone.commit}</span>
													</Box>
												</Box>
											</CardContent>
										</CardActionArea>
									</Card>
								</Box>
							);
						})}
					</Stack>
				</Box>
			)}

			<Drawer
				anchor="right"
				open={Boolean(activeMilestone)}
				onClose={handleCloseDrawer}
				data-testid="milestone-drawer"
				slotProps={{
					paper: {
						sx: {
							width: { xs: "100%", sm: 480, md: 540 },
							p: { xs: 2.5, sm: 3.5 },
							bgcolor: isDark ? "#282a21" : "#fdffda",
							color: "text.primary",
							boxShadow: isDark
								? "-4px 0 24px rgba(0,0,0,0.7)"
								: "-4px 0 24px rgba(56,57,46,0.15)",
						},
					},
				}}
			>
				{activeMilestone && (
					<Box
						sx={{ display: "flex", flexDirection: "column", height: "100%" }}
					>
						<Box
							sx={{
								display: "flex",
								alignItems: "center",
								justifyContent: "space-between",
								pb: 2,
								borderBottom: "1px solid",
								borderColor: "divider",
							}}
						>
							<Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
								<Chip
									label={
										PROJECT_CONFIG[activeMilestone.project]?.shortName ||
										activeMilestone.project
									}
									size="small"
									sx={{
										bgcolor: `${
											PROJECT_CONFIG[activeMilestone.project]?.color || "#888"
										}20`,
										color:
											PROJECT_CONFIG[activeMilestone.project]?.color || "#888",
										fontWeight: 600,
									}}
								/>
								<Chip
									label={activeMilestone.version}
									size="small"
									variant="outlined"
									sx={{ fontFamily: "monospace", fontWeight: 700 }}
								/>
								<Chip
									label={activeMilestone.badge}
									size="small"
									color={BADGE_COLOR_MAP[activeMilestone.badge] || "default"}
								/>
							</Box>

							<IconButton
								onClick={handleCloseDrawer}
								aria-label="Close changelog drawer"
								data-testid="close-drawer"
								size="small"
								sx={{
									border: "1px solid",
									borderColor: "divider",
									borderRadius: 1,
								}}
							>
								<CloseIcon fontSize="small" />
							</IconButton>
						</Box>

						<Box sx={{ flex: 1, overflowY: "auto", py: 3 }}>
							<Typography
								variant="overline"
								color="text.secondary"
								sx={{ letterSpacing: "0.08em" }}
							>
								Release Changelog &amp; Architecture
							</Typography>

							<Typography
								variant="h4"
								component="h3"
								data-testid="drawer-title"
								sx={{
									fontFamily: '"Newsreader", serif',
									fontWeight: 800,
									lineHeight: 1.15,
									mt: 0.5,
									mb: 1.5,
								}}
							>
								{activeMilestone.title}
							</Typography>

							<Box
								sx={{
									display: "flex",
									alignItems: "center",
									gap: 2,
									flexWrap: "wrap",
									color: "text.secondary",
									mb: 2.5,
								}}
							>
								<Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
									<CalendarTodayIcon sx={{ fontSize: 14 }} />
									<Typography variant="body2">
										{activeMilestone.displayDate}
									</Typography>
								</Box>
								<Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
									<GitHubIcon sx={{ fontSize: 14 }} />
									<Typography variant="body2" sx={{ fontFamily: "monospace" }}>
										{PROJECT_CONFIG[activeMilestone.project]?.repo ||
											activeMilestone.project}
									</Typography>
								</Box>
							</Box>

							<Paper
								variant="outlined"
								sx={{
									p: 1.5,
									mb: 3,
									bgcolor: isDark
										? "rgba(40, 42, 33, 0.6)"
										: "rgba(255, 255, 255, 0.8)",
									display: "flex",
									alignItems: "center",
									justifyContent: "space-between",
									gap: 1,
								}}
							>
								<Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
									<CommitIcon sx={{ color: "text.secondary" }} />
									<Box>
										<Typography
											variant="caption"
											color="text.secondary"
											sx={{ display: "block" }}
										>
											Verified Commit
										</Typography>
										<Typography
											variant="body2"
											sx={{ fontFamily: "monospace", fontWeight: 700 }}
										>
											{activeMilestone.commit}
										</Typography>
									</Box>
								</Box>

								<Button
									size="small"
									variant="outlined"
									href={activeMilestone.commitUrl}
									target="_blank"
									rel="noopener noreferrer"
									endIcon={<LaunchIcon sx={{ fontSize: 14 }} />}
									data-testid="drawer-commit-link"
									aria-label="View commit on GitHub"
									sx={{ textTransform: "none", fontSize: "0.75rem" }}
								>
									View on GitHub
								</Button>
							</Paper>

							<Typography
								variant="subtitle1"
								sx={{ fontWeight: 600, mb: 0.75 }}
							>
								Summary
							</Typography>
							<Typography
								variant="body2"
								color="text.secondary"
								sx={{ mb: 3, lineHeight: 1.7 }}
							>
								{activeMilestone.summary}
							</Typography>

							<Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
								Key Deliverables &amp; Changes
							</Typography>
							<Stack spacing={1} sx={{ mb: 3 }}>
								{(activeMilestone.details || []).map((detail) => (
									<Box
										key={detail}
										sx={{
											display: "flex",
											alignItems: "flex-start",
											gap: 1.25,
										}}
									>
										<Box
											component="span"
											sx={{
												width: 6,
												height: 6,
												borderRadius: "50%",
												bgcolor:
													PROJECT_CONFIG[activeMilestone.project]?.color ||
													"secondary.main",
												mt: 0.9,
												flexShrink: 0,
											}}
										/>
										<Typography
											variant="body2"
											color="text.primary"
											sx={{ lineHeight: 1.6 }}
										>
											{detail}
										</Typography>
									</Box>
								))}
							</Stack>

							{activeMilestone.breakingChanges && (
								<Paper
									variant="outlined"
									sx={{
										p: 2,
										mb: 3,
										borderColor: "warning.main",
										bgcolor: isDark
											? "rgba(245, 158, 11, 0.1)"
											: "rgba(245, 158, 11, 0.08)",
									}}
								>
									<Typography
										variant="subtitle2"
										color="warning.main"
										sx={{ fontWeight: 700, mb: 0.5 }}
									>
										Breaking Changes &amp; Schema Updates
									</Typography>
									<Typography variant="body2">
										{activeMilestone.breakingChanges}
									</Typography>
								</Paper>
							)}

							<Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
								Tags &amp; Capabilities
							</Typography>
							<Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.75 }}>
								{(activeMilestone.tags || []).map((tag) => (
									<Chip
										key={tag}
										label={tag}
										size="small"
										variant="outlined"
										sx={{ borderColor: "divider", fontSize: "0.75rem" }}
									/>
								))}
							</Box>
						</Box>

						<Box
							sx={{
								pt: 2,
								borderTop: "1px solid",
								borderColor: "divider",
								display: "flex",
								justifyContent: "space-between",
								alignItems: "center",
							}}
						>
							<Button
								variant="text"
								color="inherit"
								size="small"
								onClick={handleCloseDrawer}
							>
								Close
							</Button>
							<Button
								variant="contained"
								size="small"
								href={
									PROJECT_CONFIG[activeMilestone.project]?.repoUrl ||
									"https://github.com/moodynooby"
								}
								target="_blank"
								rel="noopener noreferrer"
								endIcon={<GitHubIcon sx={{ fontSize: 14 }} />}
								sx={{ textTransform: "none" }}
							>
								Open Repository
							</Button>
						</Box>
					</Box>
				)}
			</Drawer>
		</Paper>
	);
}
