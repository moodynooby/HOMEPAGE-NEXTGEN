/**
 * GitHub API Publisher & Content Ledger Synchronization
 * Allows fetching repository metadata and committing changes directly to GitHub via Contents API.
 */

const REPO_OWNER = "moodynooby";
const REPO_NAME = "HOMEPAGE-NEXTGEN";
const FILE_PATH = "src/content/projects.json";

/**
 * Fetches repository information from GitHub to auto-fill project details.
 * @param {string} repoName
 * @param {string} [token]
 * @returns {Promise<{name: string, description: string, language: string, defaultBranch: string, topics: string[], homepage: string}>}
 */
export async function fetchGitHubRepoDetails(repoName, token = "") {
	const cleanName = repoName.replace(/^moodynooby\//i, "").trim();
	const headers = {
		Accept: "application/vnd.github.v3+json",
	};
	if (token) {
		headers.Authorization = `token ${token}`;
	}

	const response = await fetch(
		`https://api.github.com/repos/${REPO_OWNER}/${cleanName}`,
		{ headers },
	);

	if (!response.ok) {
		if (response.status === 404) {
			throw new Error(`Repository "${REPO_OWNER}/${cleanName}" not found.`);
		}
		if (response.status === 403) {
			throw new Error(
				"GitHub API rate limit exceeded. Add a GitHub Token in settings.",
			);
		}
		throw new Error(`GitHub error: ${response.statusText}`);
	}

	const data = await response.json();
	return {
		name: data.name,
		description: data.description || "",
		language: data.language || "",
		defaultBranch: data.default_branch || "main",
		topics: data.topics || [],
		homepage: data.homepage || "",
		stars: data.stargazers_count || 0,
	};
}

/**
 * Commits the updated projects.json file directly to the GitHub repository.
 * @param {object} params
 * @param {string} params.token - GitHub Personal Access Token (with repo scope)
 * @param {Array} params.projects - The updated array of projects
 * @param {string} [params.commitMessage] - Custom commit message
 * @returns {Promise<{commitSha: string, commitUrl: string}>}
 */
export async function commitProjectsToGitHub({
	token,
	projects,
	commitMessage = "chore(content): update projects ledger via Admin Dashboard",
}) {
	if (!token) {
		throw new Error(
			"A valid GitHub Personal Access Token is required to publish.",
		);
	}

	const headers = {
		Accept: "application/vnd.github.v3+json",
		Authorization: `token ${token.trim()}`,
		"Content-Type": "application/json",
	};

	// 1. Fetch current file SHA from GitHub
	const getUrl = `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${FILE_PATH}`;
	const fileResponse = await fetch(getUrl, { headers });

	let sha = "";
	if (fileResponse.ok) {
		const fileData = await fileResponse.json();
		sha = fileData.sha;
	} else if (fileResponse.status !== 404) {
		throw new Error(
			`Failed to fetch file metadata from GitHub: ${fileResponse.statusText}`,
		);
	}

	// 2. Format JSON with tabs matching repo convention
	const jsonString = `${JSON.stringify(projects, null, "\t")}\n`;

	// Base64 encode UTF-8 string safely
	const encodedContent = btoa(
		encodeURIComponent(jsonString).replace(/%([0-9A-F]{2})/g, (_, p1) =>
			String.fromCharCode(parseInt(p1, 16)),
		),
	);

	// 3. PUT file update to GitHub Contents API
	const payload = {
		message: commitMessage,
		content: encodedContent,
		branch: "main",
	};
	if (sha) {
		payload.sha = sha;
	}

	const putResponse = await fetch(getUrl, {
		method: "PUT",
		headers,
		body: JSON.stringify(payload),
	});

	if (!putResponse.ok) {
		const errData = await putResponse.json().catch(() => ({}));
		throw new Error(
			errData.message || `Failed to commit changes: ${putResponse.statusText}`,
		);
	}

	const result = await putResponse.json();
	return {
		commitSha: result.commit?.sha || "",
		commitUrl: result.commit?.html_url || "",
	};
}

/**
 * Triggers a browser download of the projects array as projects.json.
 * @param {Array} projects
 * @param {string} [filename="projects.json"]
 */
export function exportProjectsJson(projects, filename = "projects.json") {
	const jsonString = `${JSON.stringify(projects, null, "\t")}\n`;
	const blob = new Blob([jsonString], { type: "application/json" });
	const url = URL.createObjectURL(blob);
	const anchor = document.createElement("a");
	anchor.href = url;
	anchor.download = filename;
	document.body.appendChild(anchor);
	anchor.click();
	document.body.removeChild(anchor);
	URL.revokeObjectURL(url);
}
