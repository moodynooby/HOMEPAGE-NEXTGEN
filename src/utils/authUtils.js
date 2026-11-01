/**
 * Authentication and Token Management Utilities
 * Uses standard Web Crypto API for secure SHA-256 password hashing.
 */

const STORAGE_KEYS = {
	PASSWORD_HASH: "editorial_admin_password_hash",
	AUTH_SESSION: "editorial_admin_session",
	GITHUB_TOKEN: "editorial_admin_github_token",
};

/**
 * Computes a SHA-256 hash of a string using Web Crypto API.
 * @param {string} text
 * @returns {Promise<string>} Hex-encoded SHA-256 hash
 */
export async function hashPassword(text) {
	if (!text) return "";
	const encoder = new TextEncoder();
	const data = encoder.encode(text);
	const hashBuffer = await window.crypto.subtle.digest("SHA-256", data);
	const hashArray = Array.from(new Uint8Array(hashBuffer));
	return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

/**
 * Checks if a master password has already been set.
 * @returns {boolean}
 */
export function isPasswordSet() {
	return Boolean(localStorage.getItem(STORAGE_KEYS.PASSWORD_HASH));
}

/**
 * Sets or updates the master password.
 * @param {string} password
 * @returns {Promise<void>}
 */
export async function setMasterPassword(password) {
	if (!password || password.trim().length < 4) {
		throw new Error("Password must be at least 4 characters.");
	}
	const hash = await hashPassword(password.trim());
	localStorage.setItem(STORAGE_KEYS.PASSWORD_HASH, hash);
}

/**
 * Verifies a password against the stored master hash.
 * If no password was ever set, allows setting it or using default.
 * @param {string} password
 * @returns {Promise<boolean>}
 */
export async function verifyPassword(password) {
	const storedHash = localStorage.getItem(STORAGE_KEYS.PASSWORD_HASH);
	if (!storedHash) {
		// If no password exists yet, set this as the master password
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
