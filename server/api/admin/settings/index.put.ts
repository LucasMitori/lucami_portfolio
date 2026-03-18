import { SiteSettings } from '~~/server/models/SiteSettings'

export default defineEventHandler(async (event) => {
  const auth = event.context.auth as { userId: string; role: string } | undefined
  if (!auth || auth.role !== 'admin') {
    throw createError({ statusCode: 403, message: 'Forbidden' })
  }

  const body = await readBody(event)

  const settings = await SiteSettings.findOneAndUpdate(
    {},
    { ...body, updatedAt: new Date() },
    { new: true, upsert: true }
  )

  return settings
})
