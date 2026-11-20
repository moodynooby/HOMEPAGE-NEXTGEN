// All secrets are sourced from environment variables only.
// Set VITE_ADMIN_PASSWORD_HASH and VITE_GITHUB_TOKEN in your .env file.
// Never commit .env — it is listed in .gitignore.

// ─── Password (SHA-256 hex of your admin passphrase) ────────────────────────
// Generate: https://emn178.github.io/online-tools/sha256.html
//           or: echo -n "yourpassword" | sha256sum
const ENV_PASSWORD_HASH = import.meta.env.VITE_ADMIN_PASSWORD_HASH ?? "";

const SESSION_KEY = "editorial_admin_session";

async function hashPassword(text) {
	const encoder = new TextEncoder();
	const data = encoder.encode(text);
	const hashBuffer = await crypto.subtle.digest("SHA-256", data);
	const hashArray = Array.from(new Uint8Array(hashBuffer));
	return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

/** Returns true if a password hash is configured via VITE_ADMIN_PASSWORD_HASH. */
export function isPasswordSet() {
	return Boolean(ENV_PASSWORD_HASH);
}

/**
 * Verifies the supplied password against VITE_ADMIN_PASSWORD_HASH.
 * @param {string} password
 * @returns {Promise<boolean>}
 */
export async function verifyPassword(password) {
	if (!ENV_PASSWORD_HASH) {
		// No hash configured — allow any non-empty password so the site stays
		// usable in a local dev environment without a .env file.
		return Boolean(password?.trim());
	}
	const inputHash = await hashPassword(password.trim());
	return inputHash === ENV_PASSWORD_HASH;
}

/**
 * Logs in with the provided password.
 * Writes an in-memory session flag (sessionStorage — cleared on tab close).
 * @param {string} password
 * @returns {Promise<boolean>}
 */
export async function login(password) {
	const valid = await verifyPassword(password);
	if (valid) {
		sessionStorage.setItem(SESSION_KEY, "true");
	}
	return valid;
}

/** Returns true if the current tab has an active admin session. */
export function isAuthenticated() {
	return sessionStorage.getItem(SESSION_KEY) === "true";
}

/** Clears the admin session for the current tab. */
export function logout() {
	sessionStorage.removeItem(SESSION_KEY);
}

// ─── GitHub PAT (read-only from env) ────────────────────────────────────────
// Set VITE_GITHUB_TOKEN in .env.  Never stored in localStorage.

/**
 * Returns the GitHub Personal Access Token from the environment.
 * @returns {string}
 */
export function getGitHubToken() {
	return import.meta.env.VITE_GITHUB_TOKEN ?? "";
}
