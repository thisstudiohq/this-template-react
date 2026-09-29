import { getCloudinaryUrl } from "./cloudinary";
import { sanityClient } from "./sanity/client";
import { urlForImage } from "./sanity/image";
import { aboutQuery, siteSettingsQuery } from "./sanity/queries";
import type { SanityAbout, SanitySiteSettings } from "./sanity/types";

export interface SiteSettings {
	name: string;
	description: string;
	url: string;
	author: string;
	authorUrl: string;
	email: string;
	instagram: string;
	locale: string;
	themeColor: string;
	role: string;
}

export interface AboutContactLink {
	title: string;
	url: string;
}

export interface AboutData {
	bio: string;
	portraitUrl: string;
	role: string;
	links: AboutContactLink[];
}

export const siteConfig: SiteSettings = {
	name: "Template Studio",
	description: "A curated creative portfolio and showcase built with React and Sanity.",
	url: "https://example.com",
	author: "Ibrahim Raimi",
	authorUrl: "https://ibrahimraimi.xyz",
	email: "ibrahimraimi.tech@gmail.com",
	instagram: "https://instagram.com/ibrahimraimi_",
	locale: "en_US",
	themeColor: "#1500E1",
	role: "Creative / Director / Designer",
};

export const defaultAboutData: AboutData = {
	bio: siteConfig.description,
	portraitUrl: "",
	role: siteConfig.role,
	links: [
		{ title: "instagram", url: siteConfig.instagram },
		{ title: "email", url: `mailto:${siteConfig.email}` },
	],
};

export async function fetchSiteSettings(): Promise<SiteSettings> {
	try {
		const doc = await sanityClient.fetch<SanitySiteSettings | null>(siteSettingsQuery);
		if (doc) {
			return {
				name: doc.name || siteConfig.name,
				description: doc.description || siteConfig.description,
				url: doc.url || siteConfig.url,
				author: doc.author || siteConfig.author,
				authorUrl: doc.authorUrl || siteConfig.authorUrl,
				email: doc.email || siteConfig.email,
				instagram: doc.instagram || siteConfig.instagram,
				locale: doc.locale || siteConfig.locale,
				themeColor: doc.themeColor || siteConfig.themeColor,
				role: doc.role || siteConfig.role,
			};
		}
	} catch (error) {
		console.warn("Failed to fetch site settings from Sanity, using defaults:", error);
	}
	return siteConfig;
}

export async function fetchAbout(): Promise<AboutData> {
	try {
		const doc = await sanityClient.fetch<SanityAbout | null>(aboutQuery);
		if (doc) {
			let portraitUrl = "";
			if (doc.portrait) {
				portraitUrl = getCloudinaryUrl(doc.portrait, {
					width: 1600,
					quality: "auto",
					format: "auto",
				});
				if (!portraitUrl && (doc.portrait as { asset?: { _ref?: string } }).asset?._ref) {
					portraitUrl = urlForImage(doc.portrait)?.auto("format").quality(90).url() || "";
				}
			}
			if (!portraitUrl) {
				portraitUrl = defaultAboutData.portraitUrl;
			}

			const links =
				Array.isArray(doc.links) && doc.links.length > 0 ? doc.links : defaultAboutData.links;

			return {
				bio: doc.bio || defaultAboutData.bio,
				portraitUrl,
				role: doc.role || defaultAboutData.role,
				links,
			};
		}
	} catch (error) {
		console.warn("Failed to fetch about data from Sanity, using defaults:", error);
	}
	return defaultAboutData;
}
