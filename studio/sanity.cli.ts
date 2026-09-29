import fs from 'node:fs'
import path from 'node:path'
import {defineCliConfig} from 'sanity/cli'

const rootEnvPath = path.resolve(__dirname, '../.env')
if (fs.existsSync(rootEnvPath) && typeof process.loadEnvFile === 'function') {
  try {
    process.loadEnvFile(rootEnvPath)
  } catch {
    // Ignore error loading env file
  }
}

export default defineCliConfig({
  api: {
    projectId:
      process.env.SANITY_STUDIO_PROJECT_ID || process.env.SANITY_PROJECT_ID || '',
    dataset:
      process.env.SANITY_STUDIO_DATASET || process.env.SANITY_DATASET || 'production',
  },
  project: {
    basePath: '/studio',
  },
  vite: (config) => ({
    ...config,
    base: '/studio/',
    envDir: path.resolve(__dirname, '..'),
  }),
  deployment: {
    autoUpdates: true,
  },
})

