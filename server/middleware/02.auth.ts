import { verifyToken } from '~~/server/utils/jwt'

export default defineEventHandler((event) => {
  const token = getCookie(event, 'auth_token')

  if (!token) {
    return
  }

  try {
    const decoded = verifyToken(token)
    event.context.auth = {
      userId: decoded.userId,
      role: decoded.role,
    }
  } catch {
    // Invalid or expired token - silently ignore, don't block the request
  }
})
