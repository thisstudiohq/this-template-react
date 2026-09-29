import { createImageUrlBuilder } from "@sanity/image-url";
import { dataset, isSanityConfigured, projectId } from "./client";

const imageBuilder = isSanityConfigured
	? createImageUrlBuilder({
			projectId,
			dataset,
		})
	: null;

// biome-ignore lint/suspicious/noExplicitAny: Sanity image asset source structure
export function urlForImage(source: any) {
	if (!source || !imageBuilder) return null;
	return imageBuilder.image(source);
}
