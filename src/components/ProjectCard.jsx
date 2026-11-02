import {
	ArrowForward,
	Bookmark,
	BookmarkBorder,
	BugReport,
	Download,
	Label,
	Star,
	Storage,
} from "@mui/icons-material";
import { Box, IconButton, Typography } from "@mui/material";
import { motion } from "motion/react";
import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import { useBookmarksContext } from "@/contexts/BookmarksContext";
import { fetchProjectHealth } from "@/utils/githubUtils";

const MotionBox = motion.create(Box);

export default function ProjectCard({
	project,
	entryNumber,
	isMobile,
	shouldReduceMotion,
	year,
}) {
	const { isBookmarked, toggleBookmark } = useBookmarksContext();
	const [health, setHealth] = useState(null);

	useEffect(() => {
		let isMounted = true;
		async function getHealth() {
			const data = await fetchProjectHealth(project.githubName);
			if (isMounted) setHealth(data);
		}
		getHealth();
		return () => {
			isMounted = false;
		};
	}, [project.githubName]);

	// Status calculation
	const isRecent =
		health?.pushed_at &&
		Date.now() - new Date(health.pushed_at).getTime() <
			30 * 24 * 60 * 60 * 1000; // 30 days
	const statusColor = isRecent ? "#4caf50" : "#ff9800";
	const statusLabel = isRecent ? "Active" : "Maintenance";

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
					<Typography
						variant="h5"
						sx={{ mb: 0.5, display: "flex", alignItems: "center", gap: 1 }}
					>
						{project.githubName}
						{health && (
							<Box
								title={statusLabel}
								sx={{ display: "flex", alignItems: "center" }}
							>
								<Box
									sx={{
										width: 8,
										height: 8,
										borderRadius: "50%",
										backgroundColor: statusColor,
										position: "relative",
										"&::after": {
											content: '""',
											position: "absolute",
											top: 0,
											left: 0,
											right: 0,
											bottom: 0,
											borderRadius: "50%",
											border: `2px solid ${statusColor}`,
											animation: "pulse 2s infinite",
										},
										"@keyframes pulse": {
											"0%": { transform: "scale(1)", opacity: 0.8 },
											"70%": { transform: "scale(2.5)", opacity: 0 },
											"100%": { transform: "scale(1)", opacity: 0 },
										},
									}}
								/>
							</Box>
						)}
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
							sx={{ lineHeight: 1, opacity: 0.85 }}
						>
							{project.category}
						</Typography>
						<Typography
							variant="overline"
							color="text.secondary"
							sx={{ lineHeight: 1, opacity: 0.85 }}
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
									sx={{ lineHeight: 1, opacity: 0.85 }}
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
									sx={{ lineHeight: 1, opacity: 0.85 }}
								>
									{project.addonMetadata.averageDailyUsers.toLocaleString()}{" "}
									users
								</Typography>
							</Box>
						)}

						{health?.latestRelease && (
							<Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
								<Label sx={{ fontSize: "0.8rem", color: "text.secondary" }} />
								<Typography
									variant="overline"
									color="text.secondary"
									sx={{ lineHeight: 1, opacity: 0.85 }}
								>
									{health.latestRelease}
								</Typography>
							</Box>
						)}
						{health?.openIssues !== undefined && (
							<Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
								<BugReport
									sx={{ fontSize: "0.8rem", color: "text.secondary" }}
								/>
								<Typography
									variant="overline"
									color="text.secondary"
									sx={{ lineHeight: 1, opacity: 0.85 }}
								>
									{health.openIssues} issue{health.openIssues !== 1 ? "s" : ""}
								</Typography>
							</Box>
						)}
						{health?.size > 0 && (
							<Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
								<Storage sx={{ fontSize: "0.8rem", color: "text.secondary" }} />
								<Typography
									variant="overline"
									color="text.secondary"
									sx={{ lineHeight: 1, opacity: 0.85 }}
								>
									{(health.size / 1024).toFixed(1)} MB
								</Typography>
							</Box>
						)}
					</Box>
				</Box>

				<IconButton
					size="small"
					onClick={(e) => {
						e.preventDefault();
						toggleBookmark(project.githubName);
					}}
					aria-label={
						isBookmarked(project.githubName)
							? "Remove bookmark"
							: "Bookmark project"
					}
					sx={{ mr: 1, zIndex: 2 }}
				>
					{isBookmarked(project.githubName) ? (
						<Bookmark color="primary" />
					) : (
						<BookmarkBorder />
					)}
				</IconButton>

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
