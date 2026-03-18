import mongoose from 'mongoose'
import { SiteSettings } from '~~/server/models/SiteSettings'

const DEFAULT_SETTINGS = {
  defaultTheme: 'default' as const,
  defaultLocale: 'pt-BR',
  componentOrder: [
    { id: 'hero', visible: true, order: 0 },
    { id: 'skills', visible: true, order: 1 },
    { id: 'featured', visible: true, order: 2 },
    { id: 'contact', visible: true, order: 3 },
  ],
}

export default defineEventHandler(async () => {
  // Only query if fully connected (1), skip if disconnected (0), connecting (2), or disconnecting (3)
  if (mongoose.connection.readyState !== 1) {
    return DEFAULT_SETTINGS
  }

  try {
    const settings = await Promise.race([
      SiteSettings.findOne().lean(),
      new Promise((_, reject) => setTimeout(() => reject(new Error('timeout')), 3000)),
    ])
    return settings || DEFAULT_SETTINGS
  }
  catch {
    return DEFAULT_SETTINGS
  }
})
