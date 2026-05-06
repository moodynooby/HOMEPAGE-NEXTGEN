import { Cloudinary } from "@cloudinary/url-gen";

export const cloudName = "dirxi2gqz";

export const cld = new Cloudinary({
  cloud: { cloudName: cloudName }});

/**
 * Fetches a list of resources from Cloudinary by tag.
 * Note: "Resource List" must be enabled in Cloudinary Security settings.
 * @param {string} tag - The tag to fetch resources for.
 * @param {string} resourceType - 'image' or 'video'.
 * @returns {Promise<Array>} - List of resource objects.
 */
export async function fetchResourcesByTag(tag, resourceType = "image") {
	try {
		const response = await fetch(
			`https://res.cloudinary.com/${cloudName}/${resourceType}/list/${tag}.json`,
		);
		if (!response.ok) {
			throw new Error(`Failed to fetch ${resourceType} resources (Status: ${response.status}). Ensure 'Resource List' is enabled in Cloudinary Security settings and the tag '${tag}' exists.`);
		}
		const data = await response.json();
		return data.resources.map((res) => ({
			...res,
			resource_type: resourceType,
		}));
	} catch (error) {
		console.error(`Error fetching Cloudinary ${resourceType}s:`, error);
		return [];
	}
}

/**
 * Fetches both images and videos for a given tag and merges them.
 * @param {string} tag
 * @returns {Promise<Array>}
 */
export async function fetchAllMediaByTag(tag) {
	const [images, videos] = await Promise.all([
		fetchResourcesByTag(tag, "image"),
		fetchResourcesByTag(tag, "video"),
	]);

	// Merge and sort by creation date (or just return combined)
	return [...images, ...videos].sort(
		(a, b) => new Date(b.created_at) - new Date(a.created_at),
	);
}
