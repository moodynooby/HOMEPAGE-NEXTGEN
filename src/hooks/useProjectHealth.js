import { useEffect, useSyncExternalStore } from "react";
import { fetchProjectHealth } from "@/utils/githubUtils";

const EMPTY = Object.freeze({ status: "idle", data: null });

/** repoName -> frozen { status, data } entry. One canonical slot per repo. */
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

const ensureHealth = (repoName, initialData) => {
	const current = healthByRepo.get(repoName);
	if (current && current.status !== "error") return;

	if (initialData) {
		healthByRepo.set(
			repoName,
			Object.freeze({ status: "done", data: initialData }),
		);
		notify();
		return;
	}

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

/** Test-only helper: clears the module store between isolated renders. */
export function resetProjectHealthStore() {
	healthByRepo.clear();
	notify();
}

/**
 * Subscribe to the single health entry for a repo. Fetching is deduped here as
 * well as in `fetchProjectHealth`, so every card shares one state transition
 * instead of owning a private `useState` + `useEffect`.
 */
export default function useProjectHealth(repoName, initialData = null) {
	useEffect(() => {
		if (repoName) ensureHealth(repoName, initialData);
	}, [repoName, initialData]);

	const entry = useSyncExternalStore(
		subscribe,
		() => getSnapshot(repoName),
		() => EMPTY,
	);

	return { ...entry, data: entry.data || initialData || null };
}
