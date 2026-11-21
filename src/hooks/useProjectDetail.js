import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { SITE_TITLE } from "@/config/site";
import { CACHE_ENTRIES } from "@/config/storage";
import { readCacheEntry, writeCacheEntry } from "@/utils/cache";
import { fetchAddonMetadata, fetchRepoMetadata } from "@/utils/githubUtils";

const SNACKBAR_DURATION_MS = 3000;

export default function useProjectDetail(project) {
	const navigate = useNavigate();
	const abortControllerRef = useRef(null);
	const snackbarTimerRef = useRef(null);

	const [markdown, setMarkdown] = useState("");
	const [loading, setLoading] = useState(true);
	const [repoStats, setRepoStats] = useState(null);
	const [addonStats, setAddonStats] = useState(null);
	const [snackbarOpen, setSnackbarOpen] = useState(false);

	useEffect(() => {
		if (!project) return undefined;
		const previousTitle = document.title;
		document.title = `${project.githubName} — ${SITE_TITLE}`;
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

		const { key: cacheKey, ttl: readmeTtl } = CACHE_ENTRIES.readme(
			project.githubName,
		);
		const cachedContent = readCacheEntry(cacheKey, readmeTtl);

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
		]).then(([stats, addonMetadata]) => {
			if (!signal.aborted) {
				setRepoStats(stats);
				setAddonStats(addonMetadata);
			}
		});

		return () => controller.abort();
	}, [project, navigate]);

	useEffect(() => () => clearTimeout(snackbarTimerRef.current), []);

	const handleShare = () => {
		navigator.clipboard?.writeText(window.location.href);
		setSnackbarOpen(true);
		clearTimeout(snackbarTimerRef.current);
		snackbarTimerRef.current = setTimeout(
			() => setSnackbarOpen(false),
			SNACKBAR_DURATION_MS,
		);
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
