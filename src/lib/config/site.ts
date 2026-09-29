import { getCloudinaryUrl } from "../cloudinary";
import { isSanityConfigured, sanityClient } from "../sanity/client";
import { urlForImage } from "../sanity/image";
import { aboutQuery, siteSettingsQuery } from "../sanity/queries";
import type { SanityAbout, SanitySiteSettings } from "../sanity/types";

export interface SiteIcons {
	icon: string;
	icon16: string;
	icon32: string;
	apple: string;
	manifest: string;
}

export interface SiteSettings {
	name: string;
	description: string;
	url: string;
	ogImage?: string;
	author: string;
	authorUrl: string;
	github?: string;
	email: string;
	instagram: string;
	locale: string;
	themeColor: string;
	role: string;
	icons: SiteIcons;
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
	name: "This Studio Template",
	description: "This Studio boilterplate template for creatives, built with React and Sanity.",
	url: "https://example.com",
	ogImage: "/opengraph-image.png",
	author: "Ibrahim Raimi",
	authorUrl: "https://ibrahimraimi.xyz",
	github: "https://github.com/thisstudiohq/this-template-react",
	email: "ibrahimraimi.tech@gmail.com",
	instagram: "https://instagram.com/ibrahimraimi_",
	locale: "en_US",
	themeColor: "#1500E1",
	role: "Creative / Director / Designer",
	icons: {
		icon: "/favicon.ico",
		icon16: "/favicon-16x16.png",
		icon32: "/favicon-32x32.png",
		apple: "/apple-touch-icon.png",
		manifest: "/site.webmanifest",
	},
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
	if (!isSanityConfigured) {
		return siteConfig;
	}

	try {
		const doc = await sanityClient.fetch<SanitySiteSettings | null>(siteSettingsQuery);
		if (doc) {
			return {
				name: doc.name || siteConfig.name,
				description: doc.description || siteConfig.description,
				url: doc.url || siteConfig.url,
				ogImage: siteConfig.ogImage,
				author: doc.author || siteConfig.author,
				authorUrl: doc.authorUrl || siteConfig.authorUrl,
				github: siteConfig.github,
				email: doc.email || siteConfig.email,
				instagram: doc.instagram || siteConfig.instagram,
				locale: doc.locale || siteConfig.locale,
				themeColor: doc.themeColor || siteConfig.themeColor,
				role: doc.role || siteConfig.role,
				icons: siteConfig.icons,
			};
		}
	} catch (error) {
		console.warn("Failed to fetch site settings from Sanity, using defaults:", error);
	}
	return siteConfig;
}

export async function fetchAbout(): Promise<AboutData> {
	if (!isSanityConfigured) {
		return defaultAboutData;
	}

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
