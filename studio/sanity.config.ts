import { visionTool } from '@sanity/vision'
import { defineConfig } from 'sanity'
import { cloudinarySchemaPlugin } from 'sanity-plugin-cloudinary'
import { structureTool } from 'sanity/structure'
import { schemaTypes } from './schemaTypes'
import { structure } from './structure'

const projectId =
  process.env.SANITY_STUDIO_PROJECT_ID || process.env.SANITY_PROJECT_ID || 'your-project-id'
const dataset =
  process.env.SANITY_STUDIO_DATASET || process.env.SANITY_DATASET || 'production'

export default defineConfig({
  name: 'default',
  title: 'Studio',

  projectId,
  dataset,
  basePath: '/studio',

  plugins: [
    structureTool({ structure }),
    visionTool(),
    cloudinarySchemaPlugin(),
  ],

  schema: {
    types: schemaTypes,
  },
})
