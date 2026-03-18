import { SiteSettings } from '~~/server/models/SiteSettings'

export default defineEventHandler(async (event) => {
  const auth = event.context.auth as { userId: string; role: string } | undefined
  if (!auth || auth.role !== 'admin') {
    throw createError({ statusCode: 403, message: 'Forbidden' })
  }

  const { musicConfig, typingSoundConfig } = await readBody(event)

  const update: Record<string, unknown> = { updatedAt: new Date() }
  if (musicConfig !== undefined) update.musicConfig = musicConfig
  if (typingSoundConfig !== undefined) update.typingSoundConfig = typingSoundConfig

  const settings = await SiteSettings.findOneAndUpdate(
    {},
    update,
    { new: true, upsert: true }
  )

  return {
    musicConfig: settings.musicConfig,
    typingSoundConfig: settings.typingSoundConfig,
  }
})
