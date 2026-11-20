const STORAGE_KEYS = {
	PASSWORD_HASH: "editorial_admin_password_hash",
	AUTH_SESSION: "editorial_admin_session",
	GITHUB_TOKEN: "editorial_admin_github_token",
};

export const MIN_PASSWORD_LENGTH = 4;

async function hashPassword(text) {
	const encoder = new TextEncoder();
	const data = encoder.encode(text);
	const hashBuffer = await crypto.subtle.digest("SHA-256", data);
	const hashArray = Array.from(new Uint8Array(hashBuffer));
	return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

export function isPasswordSet() {
	return Boolean(localStorage.getItem(STORAGE_KEYS.PASSWORD_HASH));
}

export async function setMasterPassword(password) {
	if (!password || password.trim().length < MIN_PASSWORD_LENGTH) {
		throw new Error(
			`Password must be at least ${MIN_PASSWORD_LENGTH} characters.`,
		);
	}
	const hash = await hashPassword(password.trim());
	localStorage.setItem(STORAGE_KEYS.PASSWORD_HASH, hash);
}

export async function verifyPassword(password) {
	const storedHash = localStorage.getItem(STORAGE_KEYS.PASSWORD_HASH);
	if (!storedHash) {
		await setMasterPassword(password);
		return true;
	}
	const inputHash = await hashPassword(password.trim());
	return inputHash === storedHash;
}

/**
 * Checks if the current session is authenticated.
 * @returns {boolean}
 */
export function isAuthenticated() {
	return sessionStorage.getItem(STORAGE_KEYS.AUTH_SESSION) === "true";
}

/**
 * Logs in with the provided password.
 * @param {string} password
 * @returns {Promise<boolean>}
 */
export async function login(password) {
	const valid = await verifyPassword(password);
	if (valid) {
		sessionStorage.setItem(STORAGE_KEYS.AUTH_SESSION, "true");
	}
	return valid;
}

/**
 * Logs out of the admin session.
 */
export function logout() {
	sessionStorage.removeItem(STORAGE_KEYS.AUTH_SESSION);
}

/**
 * Retrieves the stored GitHub Personal Access Token.
 * @returns {string}
 */
export function getGitHubToken() {
	return localStorage.getItem(STORAGE_KEYS.GITHUB_TOKEN) || "";
}

/**
 * Stores the GitHub Personal Access Token.
 * @param {string} token
 */
export function setGitHubToken(token) {
	if (token) {
		localStorage.setItem(STORAGE_KEYS.GITHUB_TOKEN, token.trim());
	} else {
		localStorage.removeItem(STORAGE_KEYS.GITHUB_TOKEN);
	}
}

/**
 * Clears the stored GitHub token.
 */
export function clearGitHubToken() {
	localStorage.removeItem(STORAGE_KEYS.GITHUB_TOKEN);
}
