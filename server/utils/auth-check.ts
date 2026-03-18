import type { H3Event } from 'h3'

interface AuthContext {
  userId: string
  role: string
}

export function requireAdmin(event: H3Event): void {
  const auth = event.context.auth as AuthContext | undefined

  if (!auth || auth.role !== 'admin') {
    throw createError({
      statusCode: 403,
      statusMessage: 'Forbidden: admin access required',
    })
  }
}

export function getAuthUser(event: H3Event): AuthContext | null {
  return (event.context.auth as AuthContext) || null
}
