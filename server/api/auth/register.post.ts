import { User } from '~~/server/models/User'
import { SiteSettings } from '~~/server/models/SiteSettings'
import { hashPassword } from '~~/server/utils/password'
import { signToken } from '~~/server/utils/jwt'

export default defineEventHandler(async (event) => {
  // Check if registration is enabled
  const settings = await SiteSettings.findOne().lean()
  if (settings && settings.registrationEnabled === false) {
    throw createError({ statusCode: 403, message: 'Registration is currently disabled' })
  }

  const { email, password, name } = await readBody<{ email: string; password: string; name: string }>(event)

  if (!email || !password || !name) {
    throw createError({ statusCode: 400, message: 'Email, password, and name are required' })
  }

  const existing = await User.findOne({ email: email.toLowerCase() })
  if (existing) {
    throw createError({ statusCode: 409, message: 'User already exists' })
  }

  const passwordHash = await hashPassword(password)

  const user = await User.create({
    email: email.toLowerCase(),
    passwordHash,
    name,
    role: 'admin',
  })

  const token = signToken({ userId: user._id.toString(), role: user.role })

  setCookie(event, 'auth_token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60,
    path: '/',
  })

  const { passwordHash: _, ...userData } = user.toObject()
  return userData
})
