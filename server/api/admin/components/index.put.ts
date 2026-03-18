import { SiteSettings } from '~~/server/models/SiteSettings'

export default defineEventHandler(async (event) => {
  const auth = event.context.auth as { userId: string; role: string } | undefined
  if (!auth || auth.role !== 'admin') {
    throw createError({ statusCode: 403, message: 'Forbidden' })
  }

  const componentOrder = await readBody(event)

  if (!Array.isArray(componentOrder)) {
    throw createError({ statusCode: 400, message: 'Body must be an array of component order items' })
  }

  const settings = await SiteSettings.findOneAndUpdate(
    {},
    { componentOrder, updatedAt: new Date() },
    { new: true, upsert: true }
  )

  return settings.componentOrder
})
