import { createImageUrlBuilder } from "@sanity/image-url";
import { dataset, projectId } from "./client";

const imageBuilder = createImageUrlBuilder({
	projectId,
	dataset,
});

// biome-ignore lint/suspicious/noExplicitAny: Sanity image asset source structure
export function urlForImage(source: any) {
	if (!source) return null;
	return imageBuilder.image(source);
}
