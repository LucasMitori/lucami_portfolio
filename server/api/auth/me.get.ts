import { User } from '~~/server/models/User'

export default defineEventHandler(async (event) => {
  const auth = event.context.auth as { userId: string; role: string } | undefined

  if (!auth) {
    throw createError({ statusCode: 401, message: 'Not authenticated' })
  }

  const user = await User.findById(auth.userId).select('-passwordHash')
  if (!user) {
    throw createError({ statusCode: 401, message: 'User not found' })
  }

  return user
})
