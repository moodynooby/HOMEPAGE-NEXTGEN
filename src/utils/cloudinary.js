import { Cloudinary } from "@cloudinary/url-gen";
import { dpr, format, quality } from "@cloudinary/url-gen/actions/delivery";
import { fill } from "@cloudinary/url-gen/actions/resize";
import { autoGravity } from "@cloudinary/url-gen/qualifiers/gravity";

const cloudName = "dirxi2gqz";

export const cld = new Cloudinary({
	cloud: { cloudName },
});

export const fullImage = (publicId) =>
	cld
		.image(publicId)
		.resize(fill().width(1920).height(1080))
		.delivery(format("auto"))
		.delivery(quality("auto"));

export const fullImageUrl = (publicId) => fullImage(publicId).toURL();

export const thumbnailImage = (publicId, width, height) =>
	cld
		.image(publicId)
		.resize(fill().width(width).height(height).gravity(autoGravity()))
		.delivery(format("auto"))
		.delivery(quality("auto:good"))
		.delivery(dpr("auto"));

export const videoUrl = (publicId) =>
	cld.video(publicId).delivery(format("mp4")).toURL();

// Requires "Resource List" to be enabled in Cloudinary Security settings.
export async function fetchResourcesByTag(tag, resourceType = "image") {
	try {
		const response = await fetch(
			`https://res.cloudinary.com/${cloudName}/${resourceType}/list/${tag}.json`,
		);
		if (!response.ok) {
			throw new Error(
				`Failed to fetch ${resourceType} resources (Status: ${response.status}). Ensure 'Resource List' is enabled in Cloudinary Security settings and the tag '${tag}' exists.`,
			);
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

export async function fetchAllMediaByTag(tag) {
	const [images, videos] = await Promise.all([
		fetchResourcesByTag(tag, "image"),
		fetchResourcesByTag(tag, "video"),
	]);

	return [...images, ...videos].sort(
		(a, b) => new Date(b.created_at) - new Date(a.created_at),
	);
}
