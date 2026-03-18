import { Comment } from '~~/server/models/Comment'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const section = query.section as string
  const targetId = query.targetId as string | undefined

  const filter: Record<string, unknown> = { approved: true }
  if (section) filter.section = section
  if (targetId) filter.targetId = targetId

  const comments = await Comment.find(filter)
    .sort({ createdAt: -1 })
    .limit(50)
    .lean()

  return comments
})
