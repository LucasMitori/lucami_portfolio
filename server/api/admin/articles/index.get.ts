import { Article } from '~~/server/models/Article'

export default defineEventHandler(async (event) => {
  const auth = event.context.auth as { userId: string; role: string } | undefined
  if (!auth || auth.role !== 'admin') {
    throw createError({ statusCode: 403, message: 'Forbidden' })
  }

  const articles = await Article.find().sort({ createdAt: -1 })
  return articles
})
