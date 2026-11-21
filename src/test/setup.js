import "@testing-library/jest-dom/vitest";

// Ignore unhandled animation cancellations from happy-dom / motion in tests
if (typeof process !== "undefined") {
	process.on("unhandledRejection", (reason) => {
		if (
			reason?.name === "AbortError" &&
			reason?.message?.includes("animation")
		) {
			return;
		}
		console.error("Unhandled Rejection:", reason);
	});
}

const createStorage = () => {
	const store = new Map();
	return {
		getItem: (key) => (store.has(key) ? store.get(key) : null),
		setItem: (key, value) => {
			store.set(key, String(value));
		},
		removeItem: (key) => {
			store.delete(key);
		},
		clear: () => {
			store.clear();
		},
		key: (index) => [...store.keys()][index] ?? null,
		get length() {
			return store.size;
		},
	};
};

const ensureStorage = (name) => {
	const storage = globalThis[name];
	if (
		storage &&
		typeof storage.getItem === "function" &&
		typeof storage.setItem === "function" &&
		typeof storage.clear === "function"
	) {
		return;
	}
	Object.defineProperty(globalThis, name, {
		value: createStorage(),
		configurable: true,
		writable: true,
	});
	if (typeof window !== "undefined") {
		Object.defineProperty(window, name, {
			value: globalThis[name],
			configurable: true,
			writable: true,
		});
	}
};

ensureStorage("localStorage");
ensureStorage("sessionStorage");

// The health store is module-scoped by design; reset it so isolated renders in
// one test file cannot observe the previous test's cached health entry.
beforeEach(async () => {
	const { resetProjectHealthStore } = await import("@/hooks/useProjectHealth");
	resetProjectHealthStore();
});
