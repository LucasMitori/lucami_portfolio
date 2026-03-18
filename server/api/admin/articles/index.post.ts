import { Article } from '~~/server/models/Article'

export default defineEventHandler(async (event) => {
  const auth = event.context.auth as { userId: string; role: string } | undefined
  if (!auth || auth.role !== 'admin') {
    throw createError({ statusCode: 403, message: 'Forbidden' })
  }

  const body = await readBody(event)

  if (!body.title) {
    throw createError({ statusCode: 400, message: 'Title is required' })
  }

  const slug = body.title
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9\-]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')

  const article = await Article.create({
    ...body,
    slug,
    author: auth.userId,
  })

  return article
})
