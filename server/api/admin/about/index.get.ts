import { About } from '~~/server/models/About'

export default defineEventHandler(async (event) => {
  const auth = event.context.auth as { userId: string; role: string } | undefined
  if (!auth || auth.role !== 'admin') {
    throw createError({ statusCode: 403, message: 'Forbidden' })
  }

  const about = await About.findOne()

  if (!about) {
    return {
      bio: '',
      profileImage: '',
      timeline: [],
      skillCategories: [],
      education: [],
      location: '',
      mapCoordinates: { lat: 0, lng: 0 },
    }
  }

  return about
})
