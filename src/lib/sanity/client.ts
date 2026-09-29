import { createClient } from "@sanity/client";

export const projectId =
	process.env.SANITY_PROJECT_ID || process.env.SANITY_STUDIO_PROJECT_ID || "";

export const dataset =
	process.env.SANITY_DATASET || process.env.SANITY_STUDIO_DATASET || "production";

export const apiVersion = process.env.SANITY_API_VERSION || "2024-03-01";

export const sanityClient = createClient({
	projectId,
	dataset,
	apiVersion,
	useCdn: false,
});
