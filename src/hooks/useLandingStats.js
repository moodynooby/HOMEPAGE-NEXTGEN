import { useEffect, useState } from "react";
import { SITE_OWNER } from "@/config/site";
import projectsData from "@/content/projects.json";
import {
	fetchAddonMetadata,
	fetchRepoMetadata,
	fetchUserStats,
} from "@/utils/githubUtils";

const addonIds = projectsData
	.filter((project) => project.addonId)
	.map((project) => project.addonId);

const featuredProjects = projectsData.filter((project) => project.featured);

const formatCompact = (value) =>
	new Intl.NumberFormat("en", {
		notation: "compact",
		maximumFractionDigits: 1,
	}).format(value || 0);

export const formatNumber = (value) =>
	new Intl.NumberFormat("en").format(value || 0);

/** Loads the classifieds-strip metrics and featured-card metadata once. */
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

		Promise.all([
			fetchUserStats(SITE_OWNER),
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

	return { ledgerEntries, featuredMeta, formatNumber };
}
