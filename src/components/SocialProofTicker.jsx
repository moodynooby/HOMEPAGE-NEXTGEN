import { Code, Download, People, Star } from "@mui/icons-material";
import { Box, Container, Typography } from "@mui/material";
import { useReducedMotion } from "motion/react";
import { useEffect, useState } from "react";
import projectsData from "@/content/projects.json";
import { fetchAddonMetadata, fetchUserStats } from "@/utils/githubUtils";

const formatCompact = (value) =>
	new Intl.NumberFormat("en", {
		notation: "compact",
		maximumFractionDigits: 1,
	}).format(value || 0);

export default function SocialProofTicker() {
	const shouldReduceMotion = useReducedMotion();
	const [githubStats, setGithubStats] = useState(null);
	const [addonUsers, setAddonUsers] = useState(0);
	const [weeklyDownloads, setWeeklyDownloads] = useState(0);

	useEffect(() => {
		let mounted = true;
		const addonIds = projectsData
			.filter((project) => project.addonId)
			.map((project) => project.addonId);

		Promise.all([
			fetchUserStats("moodynooby"),
			...addonIds.map((addonId) => fetchAddonMetadata(addonId)),
		]).then(([stats, ...addons]) => {
			if (!mounted) return;
			setGithubStats(stats);
			setAddonUsers(
				addons.reduce(
					(total, addon) => total + (addon?.averageDailyUsers || 0),
					0,
				),
			);
			setWeeklyDownloads(
				addons.reduce(
					(total, addon) => total + (addon?.weeklyDownloads || 0),
					0,
				),
			);
		});

		return () => {
			mounted = false;
		};
	}, []);

	const proofItems = [
		{
			label: `${formatCompact(addonUsers)} Firefox users across ${projectsData.filter((project) => project.addonId).length} extensions`,
			icon: <People fontSize="small" />,
		},
		{
			label: `${formatCompact(weeklyDownloads)} weekly add-on downloads`,
			icon: <Download fontSize="small" />,
		},
		{
			label: `${formatCompact(githubStats?.totalStars)} GitHub stars earned`,
			icon: <Star fontSize="small" />,
		},
		{
			label: `${projectsData.length} projects shipped`,
			icon: <Code fontSize="small" />,
		},
	];

	return (
		<Box
			component="section"
			aria-label="Portfolio impact summary"
			sx={{
				borderTop: "1px solid",
				borderBottom: "1px solid",
				borderColor: "divider",
				backgroundColor: "background.paper",
				overflow: "hidden",
				py: 1.25,
			}}
		>
			<Container maxWidth="xl">
				<Box
					aria-live="polite"
					sx={{
						display: "flex",
						width: "max-content",
						animation: shouldReduceMotion
							? "none"
							: "social-proof-scroll 32s linear infinite",
						"@keyframes social-proof-scroll": {
							from: { transform: "translateX(0)" },
							to: { transform: "translateX(-50%)" },
						},
					}}
				>
					{(shouldReduceMotion
						? proofItems
						: [...proofItems, ...proofItems]
						).map((item, index) => (
							<Box
								key={`${item.label}-${index}`}
								aria-hidden={index >= proofItems.length}
							sx={{
								display: "flex",
								alignItems: "center",
								gap: 1,
								px: { xs: 2, md: 4 },
								whiteSpace: "nowrap",
								color: "text.secondary",
								borderRight: "1px solid",
								borderColor: "divider",
							}}
						>
							{item.icon}
							<Typography variant="overline" sx={{ letterSpacing: "0.12em" }}>
								{item.label}
							</Typography>
						</Box>
					))}
				</Box>
			</Container>
		</Box>
	);
}

SocialProofTicker.displayName = "SocialProofTicker";

export { formatCompact };
