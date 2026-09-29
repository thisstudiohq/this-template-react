export const CLOUDINARY_CLOUD_NAME =
	(typeof process !== "undefined" && process.env?.CLOUDINARY_CLOUD_NAME) ||
	(typeof import.meta !== "undefined" && import.meta.env?.VITE_CLOUDINARY_CLOUD_NAME) ||
	"";

export const CLOUDINARY_FOLDER =
	(typeof process !== "undefined" && process.env?.CLOUDINARY_FOLDER) ||
	(typeof import.meta !== "undefined" && import.meta.env?.VITE_CLOUDINARY_FOLDER) ||
	"uploads";

export interface CloudinaryTransformOptions {
	width?: number;
	height?: number;
	quality?: number | string;
	format?: string;
	crop?: "fill" | "fit" | "limit" | "scale" | "thumb";
	animated?: boolean;
}

export interface CloudinaryAssetSource {
	secure_url?: string;
	url?: string;
	public_id?: string;
	format?: string;
	resource_type?: string;
	asset?: {
		secure_url?: string;
		url?: string;
		public_id?: string;
		format?: string;
		resource_type?: string;
	};
	alt?: string;
}

export type CloudinaryImageSource = string | CloudinaryAssetSource | null | undefined;

export function isGifSource(source: CloudinaryImageSource): boolean {
	if (!source) return false;

	if (typeof source === "string") {
		const lower = source.toLowerCase();
		return (
			lower.endsWith(".gif") ||
			lower.includes(".gif?") ||
			lower.includes(".gif/") ||
			lower.includes("format=gif") ||
			lower.includes("/gif/") ||
			lower.includes("fl_animated")
		);
	}

	const directFormat = source.format;
	if (typeof directFormat === "string" && directFormat.toLowerCase() === "gif") {
		return true;
	}

	const nestedFormat = source.asset?.format;
	if (typeof nestedFormat === "string" && nestedFormat.toLowerCase() === "gif") {
		return true;
	}

	const directUrl = source.url || source.secure_url;
	const nestedUrl = source.asset?.secure_url || source.asset?.url;
	const candidateUrl = nestedUrl || directUrl;

	if (typeof candidateUrl === "string") {
		const lower = candidateUrl.toLowerCase();
		if (
			lower.endsWith(".gif") ||
			lower.includes(".gif?") ||
			lower.includes(".gif/") ||
			lower.includes("format=gif") ||
			lower.includes("/gif/") ||
			lower.includes("fl_animated")
		) {
			return true;
		}
	}

	const publicId = source.asset?.public_id || source.public_id;
	if (typeof publicId === "string" && publicId.toLowerCase().endsWith(".gif")) {
		return true;
	}

	return false;
}

export function isVideoSource(source: CloudinaryImageSource): boolean {
	if (!source) return false;

	if (typeof source === "string") {
		const lower = source.toLowerCase();
		return (
			lower.endsWith(".mp4") ||
			lower.endsWith(".mov") ||
			lower.endsWith(".webm") ||
			lower.includes("/video/upload/") ||
			lower.includes("resource_type=video")
		);
	}

	const directType = source.resource_type;
	if (typeof directType === "string" && directType.toLowerCase() === "video") {
		return true;
	}

	const nestedType = source.asset?.resource_type;
	if (typeof nestedType === "string" && nestedType.toLowerCase() === "video") {
		return true;
	}

	const directUrl = source.url || source.secure_url;
	const nestedUrl = source.asset?.secure_url || source.asset?.url;
	const candidateUrl = nestedUrl || directUrl;

	if (typeof candidateUrl === "string") {
		const lower = candidateUrl.toLowerCase();
		return (
			lower.endsWith(".mp4") ||
			lower.endsWith(".mov") ||
			lower.endsWith(".webm") ||
			lower.includes("/video/upload/")
		);
	}

	return false;
}

export function ensureCloudinaryFolder(publicId: string): string {
	const trimmed = publicId.trim().replace(/^\/+/, "");
	if (!CLOUDINARY_FOLDER || trimmed.startsWith(`${CLOUDINARY_FOLDER}/`)) {
		return trimmed;
	}
	return `${CLOUDINARY_FOLDER}/${trimmed}`;
}

function buildTransformationSegment(
	options: CloudinaryTransformOptions = {},
	isGif = false,
): string {
	const parts: string[] = [];

	if (isGif || options.animated) {
		parts.push("fl_animated");
	}

	parts.push(`f_${options.format || "auto"}`);
	parts.push(`q_${options.quality || "auto"}`);

	if (options.width) {
		parts.push(`w_${Math.round(options.width)}`);
	}
	if (options.height) {
		parts.push(`h_${Math.round(options.height)}`);
	}
	if (options.crop) {
		parts.push(`c_${options.crop}`);
	} else if (options.width && options.height) {
		parts.push("c_fill");
	}

	return parts.join(",");
}

export function buildCloudinaryUrl(
	publicId: string,
	options: CloudinaryTransformOptions = {},
	resourceType: "image" | "video" = "image",
): string {
	const formattedId = ensureCloudinaryFolder(publicId);
	const isGif = Boolean(options.animated) || isGifSource(publicId);
	const transform = buildTransformationSegment(options, isGif);
	const resolvedResourceType = isVideoSource(publicId) ? "video" : resourceType;
	return `https://res.cloudinary.com/${CLOUDINARY_CLOUD_NAME}/${resolvedResourceType}/upload/${transform}/${formattedId}`;
}

export function getCloudinaryUrl(
	source: CloudinaryImageSource,
	options: CloudinaryTransformOptions = {},
): string {
	if (!source) return "";

	const isGif = Boolean(options.animated) || isGifSource(source);
	const isVideo = isVideoSource(source);
	const resolvedOptions: CloudinaryTransformOptions = isGif
		? { ...options, animated: true }
		: options;

	if (typeof source === "string") {
		const trimmed = source.trim();
		if (!trimmed) return "";

		if (
			trimmed.startsWith("https://res.cloudinary.com/") ||
			trimmed.startsWith("http://res.cloudinary.com/")
		) {
			const uploadIndex = trimmed.indexOf("/upload/");
			if (uploadIndex !== -1) {
				const before = trimmed.slice(0, uploadIndex + "/upload/".length);
				const after = trimmed.slice(uploadIndex + "/upload/".length);

				const existingTransformMatch = after.match(/^([a-z]_[a-zA-Z0-9_,-]+)\/(.+)$/);
				const pathWithoutTransform = existingTransformMatch ? existingTransformMatch[2] : after;

				const transform = buildTransformationSegment(resolvedOptions, isGif);
				return `${before}${transform}/${pathWithoutTransform}`;
			}
			return trimmed;
		}

		if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
			return trimmed;
		}

		return buildCloudinaryUrl(trimmed, resolvedOptions, isVideo ? "video" : "image");
	}

	const directUrl = source.url || source.secure_url;
	const nestedUrl = source.asset?.secure_url || source.asset?.url;
	const candidateUrl = nestedUrl || directUrl;

	if (candidateUrl) {
		return getCloudinaryUrl(candidateUrl, resolvedOptions);
	}

	const publicId = source.asset?.public_id || source.public_id;
	if (publicId) {
		return buildCloudinaryUrl(publicId, resolvedOptions, isVideo ? "video" : "image");
	}

	return "";
}
