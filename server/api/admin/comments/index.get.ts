import { Comment } from '~~/server/models/Comment'

export default defineEventHandler(async () => {
  const comments = await Comment.find()
    .sort({ createdAt: -1 })
    .limit(100)
    .lean()
  return comments
})
