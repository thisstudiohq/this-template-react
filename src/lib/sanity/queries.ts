export const projectsQuery = `
*[_type == "project"] | order(coalesce(order, 999) asc, _createdAt desc) {
  _id,
  title,
  slug,
  client,
  year,
  order,
  type,
  description,
  videoUrl,
  video,
  thumbnail {
    mediaType,
    image,
    video,
    width,
    height
  },
  assets[] {
    mediaType,
    image,
    video,
    width,
    height
  }
}
`;

export const projectBySlugQuery = `
*[_type == "project" && slug.current == $slug][0] {
  _id,
  title,
  slug,
  client,
  year,
  order,
  type,
  description,
  videoUrl,
  video,
  thumbnail {
    mediaType,
    image,
    video,
    width,
    height
  },
  assets[] {
    mediaType,
    image,
    video,
    width,
    height
  }
}
`;

export const aboutQuery = `
*[_type == "about"][0] {
  _id,
  bio,
  portrait,
  role,
  links
}
`;

export const siteSettingsQuery = `
*[_type == "siteSettings"][0] {
  _id,
  name,
  description,
  url,
  author,
  authorUrl,
  email,
  instagram,
  role,
  locale,
  themeColor
}
`;
