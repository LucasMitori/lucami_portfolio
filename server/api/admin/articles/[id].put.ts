import { Article } from '~~/server/models/Article'

export default defineEventHandler(async (event) => {
  const auth = event.context.auth as { userId: string; role: string } | undefined
  if (!auth || auth.role !== 'admin') {
    throw createError({ statusCode: 403, message: 'Forbidden' })
  }

  const id = getRouterParam(event, 'id')
  if (!id) {
    throw createError({ statusCode: 400, message: 'Article ID is required' })
  }

  const body = await readBody(event)

  const article = await Article.findByIdAndUpdate(
    id,
    { ...body, updatedAt: new Date() },
    { new: true }
  )

  if (!article) {
    throw createError({ statusCode: 404, message: 'Article not found' })
  }

  return article
})
