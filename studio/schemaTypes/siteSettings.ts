import { defineField, defineType } from 'sanity'

export const siteSettings = defineType({
  name: 'siteSettings',
  title: 'Site Settings',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Site / Artist Name',
      type: 'string',
      initialValue: 'Studio Portfolio',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Site Description / Meta Tag',
      type: 'text',
      rows: 3,
      initialValue: 'A curated creative portfolio and showcase.',
    }),
    defineField({
      name: 'url',
      title: 'Site URL',
      type: 'url',
      initialValue: 'https://example.com',
    }),
    defineField({
      name: 'author',
      title: 'Author',
      type: 'string',
      initialValue: 'Author Name',
    }),
    defineField({
      name: 'authorUrl',
      title: 'Author URL',
      type: 'url',
    }),
    defineField({
      name: 'email',
      title: 'Contact Email',
      type: 'string',
      initialValue: 'hello@example.com',
    }),
    defineField({
      name: 'instagram',
      title: 'Instagram URL',
      type: 'url',
      initialValue: 'https://instagram.com',
    }),
    defineField({
      name: 'role',
      title: 'Default Role / Tagline',
      type: 'string',
      initialValue: 'Creative / Director / Designer',
    }),
    defineField({
      name: 'locale',
      title: 'Locale',
      type: 'string',
      initialValue: 'en_US',
    }),
    defineField({
      name: 'themeColor',
      title: 'Theme Color (Hex)',
      type: 'string',
      initialValue: '#000000',
    }),
  ],
  preview: {
    select: {
      title: 'name',
      subtitle: 'url',
    },
    prepare({ title, subtitle }) {
      return {
        title: title || 'Site Settings',
        subtitle: subtitle || 'Global website configuration',
      }
    },
  },
})
