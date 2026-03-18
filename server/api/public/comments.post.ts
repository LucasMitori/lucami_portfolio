import { Comment } from '~~/server/models/Comment'

export default defineEventHandler(async (event) => {
  const body = await readBody<{
    authorName: string
    authorEmail?: string
    content: string
    rating: number
    section: string
    targetId?: string
  }>(event)

  if (!body.authorName || !body.content || !body.rating || !body.section) {
    throw createError({ statusCode: 400, message: 'Name, content, rating, and section are required' })
  }

  if (body.rating < 1 || body.rating > 5) {
    throw createError({ statusCode: 400, message: 'Rating must be between 1 and 5' })
  }

  if (body.content.length > 1000) {
    throw createError({ statusCode: 400, message: 'Comment must be under 1000 characters' })
  }

  const comment = await Comment.create({
    authorName: body.authorName.slice(0, 50),
    authorEmail: body.authorEmail,
    content: body.content.slice(0, 1000),
    rating: Math.round(body.rating),
    section: body.section,
    targetId: body.targetId,
    approved: true,
  })

  return comment
})
