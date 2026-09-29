import { defineArrayMember, defineField, defineType } from 'sanity'

export const project = defineType({
  name: 'project',
  title: 'Project',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'client',
      title: 'Client',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'year',
      title: 'Year',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'order',
      title: 'Display Order',
      type: 'number',
      description: 'Determines the display order on the website (lower numbers appear first)',
      initialValue: 10,
    }),
    defineField({
      name: 'type',
      title: 'Type',
      type: 'string',
      options: {
        list: [
          { title: 'Campaign', value: 'Campaign' },
          { title: 'Short Film', value: 'Short Film' },
          { title: 'Commercial', value: 'Commercial' },
          { title: 'Editorial', value: 'Editorial' },
          { title: 'Music Video', value: 'Music Video' },
          { title: 'Documentary', value: 'Documentary' },
          { title: 'Personal', value: 'Personal' },
        ],
      },
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'videoUrl',
      title: 'External Video URL (YouTube / Vimeo)',
      type: 'url',
      description: 'Optional link for video embed in the project detail view',
    }),
    defineField({
      name: 'video',
      title: 'Direct Cloudinary Video',
      type: 'cloudinaryImage',
      description: 'Upload or link video stored in Cloudinary for streaming playback in the project detail view',
    }),
    defineField({
      name: 'thumbnail',
      title: 'Thumbnail Asset',
      type: 'object',
      fields: [
        defineField({
          name: 'mediaType',
          title: 'Media Type',
          type: 'string',
          options: {
            list: [
              { title: 'Image / GIF', value: 'image' },
              { title: 'Video', value: 'video' },
            ],
            layout: 'radio',
          },
          initialValue: 'image',
          validation: (rule) => rule.required(),
        }),
        defineField({
          name: 'image',
          title: 'Cloudinary Image / GIF',
          type: 'cloudinaryImage',
          description: 'Image or animated GIF stored in Cloudinary',
          hidden: ({ parent }) => parent?.mediaType === 'video',
        }),
        defineField({
          name: 'video',
          title: 'Cloudinary Video',
          type: 'cloudinaryImage',
          description: 'Video stored in Cloudinary',
          hidden: ({ parent }) => parent?.mediaType === 'image',
        }),
        defineField({
          name: 'width',
          title: 'Width (px)',
          type: 'number',
          initialValue: 1200,
        }),
        defineField({
          name: 'height',
          title: 'Height (px)',
          type: 'number',
          initialValue: 1500,
        }),
      ],
    }),
    defineField({
      name: 'assets',
      title: 'Project Media Gallery',
      type: 'array',
      description: 'Images, animated GIFs, and videos displayed in the project detail view and canvas',
      of: [
        defineArrayMember({
          name: 'projectAsset',
          title: 'Asset',
          type: 'object',
          fields: [
            defineField({
              name: 'mediaType',
              title: 'Media Type',
              type: 'string',
              options: {
                list: [
                  { title: 'Image / GIF', value: 'image' },
                  { title: 'Video', value: 'video' },
                ],
                layout: 'radio',
              },
              initialValue: 'image',
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: 'image',
              title: 'Cloudinary Image / GIF',
              type: 'cloudinaryImage',
              description: 'Image or animated GIF stored in Cloudinary',
              hidden: ({ parent }) => parent?.mediaType === 'video',
            }),
            defineField({
              name: 'video',
              title: 'Cloudinary Video',
              type: 'cloudinaryImage',
              description: 'Video stored in Cloudinary',
              hidden: ({ parent }) => parent?.mediaType === 'image',
            }),
            defineField({
              name: 'width',
              title: 'Width (px)',
              type: 'number',
              initialValue: 1200,
            }),
            defineField({
              name: 'height',
              title: 'Height (px)',
              type: 'number',
              initialValue: 1500,
            }),
          ],
          preview: {
            select: {
              mediaType: 'mediaType',
              imageAlt: 'image.alt',
              imageUrl: 'image.url',
              videoUrl: 'video.url',
              assetPublicId: 'image.asset.public_id',
              videoAssetPublicId: 'video.asset.public_id',
            },
            prepare({ mediaType, imageAlt, imageUrl, videoUrl, assetPublicId, videoAssetPublicId }) {
              const isVideo = mediaType === 'video'
              const subtitle = isVideo
                ? videoUrl || videoAssetPublicId || ''
                : imageUrl || assetPublicId || imageAlt || ''
              return {
                title: isVideo ? 'Cloudinary Video Asset' : 'Cloudinary Image Asset',
                subtitle,
              }
            },
          },
        }),
      ],
    }),
  ],
  orderings: [
    {
      title: 'Display Order',
      name: 'orderAsc',
      by: [{ field: 'order', direction: 'asc' }],
    },
    {
      title: 'Year (Newest First)',
      name: 'yearDesc',
      by: [{ field: 'year', direction: 'desc' }],
    },
  ],
  preview: {
    select: {
      title: 'title',
      client: 'client',
      year: 'year',
      order: 'order',
      image: 'thumbnail.image',
    },
    prepare({ title, client, year, order, image }) {
      const orderPrefix = typeof order === 'number' ? `[#${order}] ` : ''
      return {
        title: `${orderPrefix}${title || 'Untitled'}`,
        subtitle: [client, year].filter(Boolean).join(' • '),
        media: image,
      }
    },
  },
})
