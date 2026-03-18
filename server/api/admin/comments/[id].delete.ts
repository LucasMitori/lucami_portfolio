import { Comment } from '~~/server/models/Comment'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  if (!id) throw createError({ statusCode: 400, message: 'Comment ID is required' })

  const deleted = await Comment.findByIdAndDelete(id)
  if (!deleted) throw createError({ statusCode: 404, message: 'Comment not found' })

  return { success: true }
})
