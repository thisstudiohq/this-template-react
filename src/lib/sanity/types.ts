export interface SanityCloudinaryAsset {
	public_id?: string;
	resource_type?: string;
	format?: string;
	version?: number;
	url?: string;
	secure_url?: string;
	width?: number;
	height?: number;
	bytes?: number;
}

export interface SanityCloudinaryMedia {
	asset?: SanityCloudinaryAsset;
	url?: string;
	alt?: string;
}

export type SanityCloudinaryImage = SanityCloudinaryMedia;

export interface SanityMediaItem {
	mediaType?: "image" | "video";
	image?: SanityCloudinaryImage;
	video?: SanityCloudinaryMedia;
	width?: number;
	height?: number;
}

export interface SanityProject {
	_id: string;
	title: string;
	slug: {
		current: string;
	};
	client: string;
	year: string;
	order?: number;
	type?: string | null;
	description?: string | null;
	videoUrl?: string | null;
	video?: SanityCloudinaryMedia | null;
	thumbnail?: SanityMediaItem;
	assets?: SanityMediaItem[];
}

export interface SanityAboutLink {
	title: string;
	url: string;
}

export interface SanityAbout {
	_id?: string;
	bio?: string;
	portrait?: SanityCloudinaryImage;
	role?: string;
	links?: SanityAboutLink[];
}

export interface SanitySiteSettings {
	_id?: string;
	name?: string;
	description?: string;
	url?: string;
	author?: string;
	authorUrl?: string;
	email?: string;
	instagram?: string;
	role?: string;
	locale?: string;
	themeColor?: string;
}
