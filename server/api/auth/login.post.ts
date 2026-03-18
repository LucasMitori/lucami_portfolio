import { User } from '~~/server/models/User'
import { comparePassword } from '~~/server/utils/password'
import { signToken } from '~~/server/utils/jwt'

export default defineEventHandler(async (event) => {
  const { email, password } = await readBody<{ email: string; password: string }>(event)

  if (!email || !password) {
    throw createError({ statusCode: 400, message: 'Email and password are required' })
  }

  const user = await User.findOne({ email: email.toLowerCase() })
  if (!user) {
    throw createError({ statusCode: 401, message: 'Invalid email or password' })
  }

  const isValid = await comparePassword(password, user.passwordHash)
  if (!isValid) {
    throw createError({ statusCode: 401, message: 'Invalid email or password' })
  }

  const token = signToken({ userId: user._id.toString(), role: user.role })

  setCookie(event, 'auth_token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60,
    path: '/',
  })

  const { passwordHash, ...userData } = user.toObject()
  return userData
})
