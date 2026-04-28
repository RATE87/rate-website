import { visionTool } from '@sanity/vision'
import { defineConfig } from 'sanity'
import { schemaTypes } from './sanity.schema'

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'rateproj'
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'

export default defineConfig({
  name: 'default',
  title: 'RATE Studio',
  projectId,
  dataset,
  basePath: '/studio',
  plugins: [visionTool()],
  schema: {
    types: schemaTypes,
  },
})
