import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { readCacheEntry, writeCacheEntry } from "@/utils/cache";
import { fetchAddonMetadata, fetchRepoMetadata } from "@/utils/githubUtils";

const README_TTL = 24 * 60 * 60 * 1000;

/** Owns the article's document title, README fetch, repo stats and share toast. */
export default function useProjectDetail(project) {
	const navigate = useNavigate();
	const abortControllerRef = useRef(null);

	const [markdown, setMarkdown] = useState("");
	const [loading, setLoading] = useState(true);
	const [repoStats, setRepoStats] = useState(null);
	const [addonStats, setAddonStats] = useState(null);
	const [snackbarOpen, setSnackbarOpen] = useState(false);

	useEffect(() => {
		if (!project) return undefined;
		const previousTitle = document.title;
		document.title = `${project.githubName} — Manas Doshi`;
		return () => {
			document.title = previousTitle;
		};
	}, [project]);

	useEffect(() => {
		if (!project) {
			navigate("/projects");
			return undefined;
		}

		abortControllerRef.current?.abort();
		const controller = new AbortController();
		abortControllerRef.current = controller;
		const { signal } = controller;

		const cacheKey = `readme_${project.githubName}`;
		const cachedContent = readCacheEntry(cacheKey, README_TTL);

		if (cachedContent) {
			setMarkdown(cachedContent);
			setLoading(false);
		} else {
			setLoading(true);
			fetch(project.githubContentPath, { signal })
				.then((response) => response.text())
				.then((content) => {
					if (!signal.aborted) {
						setMarkdown(content);
						writeCacheEntry(cacheKey, content);
						setLoading(false);
					}
				})
				.catch((error) => {
					if (error.name !== "AbortError") {
						setMarkdown("Failed to load content.");
						setLoading(false);
					}
				});
		}

		Promise.all([
			fetchRepoMetadata(project.githubName),
			project.addonId ? fetchAddonMetadata(project.addonId) : null,
		])
			.then(([stats, addonMetadata]) => {
				if (!signal.aborted) {
					setRepoStats(stats);
					setAddonStats(addonMetadata);
				}
			})
			.catch(() => {});

		return () => controller.abort();
	}, [project, navigate]);

	const handleShare = () => {
		navigator.clipboard?.writeText(window.location.href);
		setSnackbarOpen(true);
		setTimeout(() => setSnackbarOpen(false), 3000);
	};

	return {
		markdown,
		loading,
		repoStats,
		addonStats,
		snackbarOpen,
		handleShare,
	};
}
