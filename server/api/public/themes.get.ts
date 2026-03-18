import mongoose from 'mongoose'
import { Theme } from '~~/server/models/Theme'

export default defineEventHandler(async () => {
  if (mongoose.connection.readyState !== 1) {
    return []
  }

  try {
    const themes = await Theme.find()
    return themes
  }
  catch {
    return []
  }
})
