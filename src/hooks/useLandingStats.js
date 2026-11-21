import { useEffect, useState } from "react";
import { SITE_OWNER } from "@/config/site";
import projectsData from "@/content/projects.json";
import { formatCompact, formatNumber } from "@/utils/format";
import {
	fetchAddonMetadata,
	fetchRepoMetadata,
	fetchUserStats,
} from "@/utils/githubUtils";
import { selectFeaturedProjects } from "@/utils/projects";

const addonIds = projectsData
	.filter((project) => project.addonId)
	.map((project) => project.addonId);

const featuredProjects = selectFeaturedProjects(projectsData);

export default function useLandingStats() {
	const [githubStats, setGithubStats] = useState(null);
	const [addonStats, setAddonStats] = useState({
		totalUsers: 0,
		totalDownloads: 0,
		addonCount: 0,
	});
	const [featuredMeta, setFeaturedMeta] = useState({});

	useEffect(() => {
		let mounted = true;

		Promise.all({
			stats: fetchUserStats(SITE_OWNER),
			addons: Promise.all(
				addonIds.map((addonId) => fetchAddonMetadata(addonId)),
			),
			repos: Promise.all(
				featuredProjects.map((project) =>
					fetchRepoMetadata(project.githubName),
				),
			),
		}).then(({ stats, addons, repos }) => {
			if (!mounted) return;
			setGithubStats(stats);

			const addonById = new Map(
				addonIds.map((addonId, index) => [addonId, addons[index]]),
			);
			const resolvedAddons = addons.filter(Boolean);

			setAddonStats({
				totalUsers: resolvedAddons.reduce(
					(total, addon) => total + (addon.averageDailyUsers || 0),
					0,
				),
				totalDownloads: resolvedAddons.reduce(
					(total, addon) => total + (addon.weeklyDownloads || 0),
					0,
				),
				addonCount: resolvedAddons.length,
			});

			setFeaturedMeta(
				featuredProjects.reduce((metadata, project, index) => {
					metadata[project.githubName] = repos[index] || {};
					if (project.addonId) {
						metadata[project.githubName].addon =
							addonById.get(project.addonId) || null;
					}
					return metadata;
				}, {}),
			);
		});

		return () => {
			mounted = false;
		};
	}, []);

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

	return { ledgerEntries, featuredMeta };
}
