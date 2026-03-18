import { Favorite } from '~~/server/models/Favorite'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const sessionId = query.sessionId as string

  if (!sessionId) {
    throw createError({ statusCode: 400, message: 'sessionId is required' })
  }

  const favorites = await Favorite.find({ sessionId }).lean()
  return favorites
})
