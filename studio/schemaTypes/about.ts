import { defineArrayMember, defineField, defineType } from 'sanity'

export const about = defineType({
  name: 'about',
  title: 'About Page',
  type: 'document',
  fields: [
    defineField({
      name: 'bio',
      title: 'Bio Description',
      type: 'text',
      rows: 4,
      description: 'The biography text displayed in the about section or modal',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'portrait',
      title: 'Portrait Photo (Cloudinary)',
      type: 'cloudinaryImage',
      description: 'Portrait photo stored in Cloudinary',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'role',
      title: 'Role / Title',
      type: 'string',
      description: 'Role subtitle displayed below contact links',
      initialValue: 'Creative / Director / Designer',
    }),
    defineField({
      name: 'links',
      title: 'Contact & Social Links',
      type: 'array',
      description: 'Custom contact and social links',
      of: [
        defineArrayMember({
          name: 'contactLink',
          title: 'Contact Link',
          type: 'object',
          fields: [
            defineField({
              name: 'title',
              title: 'Label',
              type: 'string',
              description: 'Link label (e.g. Instagram, Email, LinkedIn, GitHub)',
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: 'url',
              title: 'URL',
              type: 'string',
              description: 'Full URL (e.g. https://instagram.com/... or mailto:name@domain.com)',
              validation: (rule) => rule.required(),
            }),
          ],
          preview: {
            select: {
              title: 'title',
              subtitle: 'url',
            },
          },
        }),
      ],
    }),
  ],
  preview: {
    select: {
      portraitUrl: 'portrait.url',
      assetPublicId: 'portrait.asset.public_id',
    },
    prepare({ portraitUrl, assetPublicId }) {
      return {
        title: 'About Page',
        subtitle: portraitUrl || assetPublicId || 'Cloudinary portrait',
      }
    },
  },
})
