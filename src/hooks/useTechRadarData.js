import { useCallback, useEffect, useMemo, useState } from "react";
import { STORAGE_KEYS } from "@/config/storage";
import radarData from "@/content/techRadar.json";
import useProjectsData from "@/hooks/useProjectsData";
import { isAuthenticated } from "@/utils/authUtils";

const CURRENT_YEAR = new Date().getFullYear();

const readCustomBlips = () => {
	try {
		const raw = localStorage.getItem(STORAGE_KEYS.radarCustomBlips);
		if (!raw) return [];
		const parsed = JSON.parse(raw);
		return Array.isArray(parsed) ? parsed : [];
	} catch (_error) {
		return [];
	}
};

const writeCustomBlips = (blips) => {
	try {
		localStorage.setItem(STORAGE_KEYS.radarCustomBlips, JSON.stringify(blips));
	} catch (_error) {
		// Ignore storage errors in restricted contexts
	}
};

export default function useTechRadarData() {
	const { projects, loading } = useProjectsData();
	const [customBlips, setCustomBlips] = useState(readCustomBlips);

	useEffect(() => {
		const handleStorage = (e) => {
			if (e.key === STORAGE_KEYS.radarCustomBlips) {
				setCustomBlips(readCustomBlips());
			}
		};
		window.addEventListener("storage", handleStorage);
		return () => window.removeEventListener("storage", handleStorage);
	}, []);

	// Extract unique languages and projects from GitHub repo data
	const { availableLanguages, allProjects, projectsByLanguage } =
		useMemo(() => {
			const langMap = new Map();
			const projectNames = projects.map((p) => p.githubName);

			for (const project of projects) {
				const lang = project.language?.trim();
				if (!lang) continue;

				if (!langMap.has(lang)) {
					langMap.set(lang, []);
				}
				langMap.get(lang).push(project);
			}

			const sortedLangs = Array.from(langMap.keys()).sort((a, b) => {
				const diff = langMap.get(b).length - langMap.get(a).length;
				return diff !== 0 ? diff : a.localeCompare(b);
			});

			return {
				availableLanguages: sortedLangs,
				allProjects: projectNames,
				projectsByLanguage: langMap,
			};
		}, [projects]);

	// Derive dynamic blips merging:
	// 1. Detected GitHub languages from projects
	// 2. Curated baseline blips from techRadar.json
	// 3. User-created custom blips from dynamic form
	const blips = useMemo(() => {
		const result = [];
		const processedNames = new Set();
		let nextId = 1;

		// 1. Custom blips take precedence
		for (const custom of customBlips) {
			const id = custom.id || `custom-${nextId++}`;
			result.push({
				...custom,
				id,
				isCustom: true,
				source: "custom",
			});
			processedNames.add(custom.name.toLowerCase());
		}

		// 2. Curated blips from techRadar.json
		const curatedMap = new Map();
		for (const blip of radarData.blips) {
			curatedMap.set(blip.name.toLowerCase(), blip);
		}

		// 3. Dynamic GitHub languages
		for (const lang of availableLanguages) {
			const lower = lang.toLowerCase();
			if (processedNames.has(lower)) continue;

			const matchingProjects = projectsByLanguage.get(lang) || [];
			const matchingNames = matchingProjects.map((p) => p.githubName);
			const minYear = matchingProjects.reduce((earliest, p) => {
				const y = Number(p.year);
				return !Number.isNaN(y) && y > 2000 ? Math.min(earliest, y) : earliest;
			}, CURRENT_YEAR);

			const calculatedYoe = Math.max(1, CURRENT_YEAR - minYear + 1);

			// Automatically determine ring by usage frequency unless curated
			const curated = curatedMap.get(lower);
			const ring =
				curated?.ring ||
				(matchingProjects.length >= 3
					? "Adopt"
					: matchingProjects.length >= 2
						? "Trial"
						: "Assess");

			const yoe = Math.max(curated?.yoe || 0, calculatedYoe);
			const keyRepos =
				matchingNames.length > 0
					? matchingNames.slice(0, 3)
					: curated?.keyRepos || [];

			result.push({
				id: curated?.id || `github-${nextId++}`,
				name: curated?.name || lang,
				quadrant: "Languages",
				ring,
				yoe,
				keyRepos,
				projects:
					matchingNames.length > 0 ? matchingNames : curated?.projects || [],
				source: "github",
			});
			processedNames.add(lower);
		}

		// 4. Remaining curated blips (e.g. React, Node.js, Docker, AWS, Vue, etc.)
		for (const [lower, curated] of curatedMap.entries()) {
			if (processedNames.has(lower)) continue;

			// Dynamically infer related projects for known frameworks/tools
			const inferredProjects = [...(curated.projects || [])];
			if (lower === "react") {
				for (const p of projects) {
					if (
						(p.category === "Web App" || p.githubName === "modern-portfolio") &&
						!inferredProjects.includes(p.githubName)
					) {
						inferredProjects.push(p.githubName);
					}
				}
			}

			result.push({
				...curated,
				projects: inferredProjects,
				keyRepos:
					inferredProjects.length > 0
						? inferredProjects.slice(0, 3)
						: curated.keyRepos || [],
				source: "curated",
			});
			processedNames.add(lower);
		}

		return result;
	}, [customBlips, availableLanguages, projectsByLanguage, projects]);

	const addOrUpdateBlip = useCallback((blipData) => {
		if (!isAuthenticated()) return;
		setCustomBlips((prev) => {
			const id = blipData.id || `custom-${Date.now()}`;
			const normalized = {
				...blipData,
				id,
				yoe: Number(blipData.yoe) || 1,
				keyRepos: Array.isArray(blipData.keyRepos) ? blipData.keyRepos : [],
				projects: Array.isArray(blipData.projects) ? blipData.projects : [],
			};

			const existingIndex = prev.findIndex(
				(b) =>
					b.id === id || b.name.toLowerCase() === blipData.name.toLowerCase(),
			);

			let next;
			if (existingIndex >= 0) {
				next = [...prev];
				next[existingIndex] = { ...prev[existingIndex], ...normalized };
			} else {
				next = [normalized, ...prev];
			}

			writeCustomBlips(next);
			return next;
		});
	}, []);

	const deleteBlip = useCallback((blipId) => {
		if (!isAuthenticated()) return;
		setCustomBlips((prev) => {
			const next = prev.filter((b) => b.id !== blipId);
			writeCustomBlips(next);
			return next;
		});
	}, []);

	const resetToDefault = useCallback(() => {
		if (!isAuthenticated()) return;
		setCustomBlips([]);
		try {
			localStorage.removeItem(STORAGE_KEYS.radarCustomBlips);
		} catch (_e) {
			// ignore
		}
	}, []);

	return {
		rings: radarData.rings,
		quadrants: radarData.quadrants,
		blips,
		availableLanguages,
		allProjects,
		customBlipsCount: customBlips.length,
		addOrUpdateBlip,
		deleteBlip,
		resetToDefault,
		loading,
	};
}
