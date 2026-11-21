import { useEffect, useState } from "react";
import projectsData from "@/content/projects.json";
import { fetchAddonMetadata, fetchRepoMetadata } from "@/utils/githubUtils";
import { byRecencyDesc, withProjectMetadata } from "@/utils/projects";

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
						return withProjectMetadata(project, metadata, addonMetadata);
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
