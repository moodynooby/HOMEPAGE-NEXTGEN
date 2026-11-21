import { useEffect, useSyncExternalStore } from "react";
import { fetchProjectHealth } from "@/utils/githubUtils";

const EMPTY = Object.freeze({ status: "idle", data: null });

const healthByRepo = new Map();
const listeners = new Set();

const notify = () => {
	for (const listener of listeners) listener();
};

const subscribe = (listener) => {
	listeners.add(listener);
	return () => listeners.delete(listener);
};

const getSnapshot = (repoName) => healthByRepo.get(repoName) || EMPTY;

const ensureHealth = (repoName) => {
	const current = healthByRepo.get(repoName);
	if (current && current.status !== "error") return;

	healthByRepo.set(repoName, Object.freeze({ status: "loading", data: null }));
	notify();

	fetchProjectHealth(repoName)
		.then((data) => {
			healthByRepo.set(
				repoName,
				Object.freeze({ status: "done", data: data || null }),
			);
			notify();
		})
		.catch(() => {
			healthByRepo.set(
				repoName,
				Object.freeze({ status: "error", data: null }),
			);
			notify();
		});
};

export default function useProjectHealth(repoName) {
	useEffect(() => {
		if (repoName) ensureHealth(repoName);
	}, [repoName]);

	return useSyncExternalStore(
		subscribe,
		() => getSnapshot(repoName),
		() => EMPTY,
	);
}
