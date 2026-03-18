import mongoose from 'mongoose'
import { About } from '~~/server/models/About'

const DEFAULT_ABOUT = {
  bio: '',
  profileImage: '',
  timeline: [],
  skillCategories: [],
  education: [],
  location: '',
  mapCoordinates: { lat: 0, lng: 0 },
}

export default defineEventHandler(async () => {
  if (mongoose.connection.readyState !== 1) {
    return DEFAULT_ABOUT
  }

  try {
    const about = await About.findOne()
    return about || DEFAULT_ABOUT
  }
  catch {
    return DEFAULT_ABOUT
  }
})
