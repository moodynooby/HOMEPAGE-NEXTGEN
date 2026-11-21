const ENV_PASSWORD_HASH =
	import.meta.env.VITE_ADMIN_PASSWORD_HASH ??
	import.meta.env.VITE_ADMIN_PASSWORD_HAS ??
	"";
const SESSION_KEY = "editorial_admin_session";

async function hashPassword(text) {
	const encoder = new TextEncoder();
	const data = encoder.encode(text);
	const hashBuffer = await crypto.subtle.digest("SHA-256", data);
	const hashArray = Array.from(new Uint8Array(hashBuffer));
	return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

export function isPasswordSet() {
	return Boolean(ENV_PASSWORD_HASH);
}

export async function verifyPassword(password) {
	if (!ENV_PASSWORD_HASH) {
		// No hash configured: allow entering development mode freely
		return true;
	}
	const inputHash = await hashPassword(password?.trim() || "");
	return inputHash === ENV_PASSWORD_HASH;
}

export async function login(password) {
	const valid = await verifyPassword(password);
	if (valid) {
		sessionStorage.setItem(SESSION_KEY, "true");
	}
	return valid;
}

export function isAuthenticated() {
	return sessionStorage.getItem(SESSION_KEY) === "true";
}

export function logout() {
	sessionStorage.removeItem(SESSION_KEY);
}
