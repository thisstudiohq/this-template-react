import { defineField, defineType } from 'sanity'
import { CloudinaryImageInput } from '../components/CloudinaryImageInput'

export const cloudinaryImage = defineType({
  name: 'cloudinaryImage',
  title: 'Cloudinary Image / GIF',
  type: 'object',
  components: {
    input: CloudinaryImageInput,
  },
  fields: [
    defineField({
      name: 'asset',
      title: 'Cloudinary Asset',
      type: 'cloudinary.asset',
      description:
        'Select or upload image or animated GIF from Cloudinary Media Library',
    }),
    defineField({
      name: 'url',
      title: 'Cloudinary URL or Public ID',
      type: 'string',
      description:
        'Direct Cloudinary image/GIF URL or public_id (e.g. my-folder/artwork.gif or full Cloudinary URL)',
    }),
    defineField({
      name: 'alt',
      title: 'Alt Text',
      type: 'string',
      description: 'Alternative text for accessibility and SEO',
    }),
  ],
  preview: {
    select: {
      url: 'asset.secure_url',
      directUrl: 'url',
      alt: 'alt',
    },
    prepare({ url, directUrl, alt }) {
      return {
        title: alt || 'Cloudinary Image',
        subtitle: directUrl || url || 'No image attached',
      }
    },
  },
})
