import { Theme } from '~~/server/models/Theme'

export default defineEventHandler(async (event) => {
  const auth = event.context.auth as { userId: string; role: string } | undefined
  if (!auth || auth.role !== 'admin') {
    throw createError({ statusCode: 403, message: 'Forbidden' })
  }

  const id = getRouterParam(event, 'id')
  if (!id) {
    throw createError({ statusCode: 400, message: 'Theme ID is required' })
  }

  const body = await readBody(event)

  // Try to find by _id first, then by slug
  let theme = await Theme.findByIdAndUpdate(id, body, { new: true }).catch(() => null)
  if (!theme) {
    theme = await Theme.findOneAndUpdate({ slug: id }, body, { new: true })
  }
  if (!theme) {
    throw createError({ statusCode: 404, message: 'Theme not found' })
  }

  return theme
})
