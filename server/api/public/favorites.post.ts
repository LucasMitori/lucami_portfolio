import { Favorite } from '~~/server/models/Favorite'

export default defineEventHandler(async (event) => {
  const body = await readBody<{
    sessionId: string
    projectName: string
    projectUrl: string
  }>(event)

  if (!body.sessionId || !body.projectName || !body.projectUrl) {
    throw createError({ statusCode: 400, message: 'sessionId, projectName, and projectUrl are required' })
  }

  // Toggle: remove if exists, add if not
  const existing = await Favorite.findOne({
    sessionId: body.sessionId,
    projectName: body.projectName,
  })

  if (existing) {
    await Favorite.deleteOne({ _id: existing._id })
    return { action: 'removed', projectName: body.projectName }
  }

  const favorite = await Favorite.create(body)
  return { action: 'added', favorite }
})
