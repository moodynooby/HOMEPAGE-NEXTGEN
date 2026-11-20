import { useEffect, useState } from "react";
import projectsData from "@/content/projects.json";
import { fetchAddonMetadata, fetchRepoMetadata } from "@/utils/githubUtils";

export const byRecencyDesc = (a, b) => {
	const dateB = b.pushed_at ? new Date(b.pushed_at) : new Date(b.year, 0, 1);
	const dateA = a.pushed_at ? new Date(a.pushed_at) : new Date(a.year, 0, 1);
	return dateB - dateA;
};

export default function useProjectsData() {
	const [projects, setProjects] = useState([]);
	const [loading, setLoading] = useState(true);
	const [loadError, setLoadError] = useState("");

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
				const sortedProjects = projectsWithMetadata.sort(byRecencyDesc);

				if (isMounted) {
					setProjects(sortedProjects);
					setLoadError("");
				}
			} catch (_error) {
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
	}, []);

	return { projects, loading, loadError };
}
