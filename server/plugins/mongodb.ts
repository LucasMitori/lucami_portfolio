import mongoose from 'mongoose'

export default defineNitroPlugin(async (nitroApp) => {
  const config = useRuntimeConfig()

  if (!config.mongodbUri) {
    console.warn('[MongoDB] No MONGODB_URI configured, skipping connection')
    return
  }

  try {
    await mongoose.connect(config.mongodbUri)
    console.log('[MongoDB] Connected successfully')
  } catch (error) {
    console.error('[MongoDB] Connection error:', error)
  }

  nitroApp.hooks.hook('close', async () => {
    await mongoose.disconnect()
    console.log('[MongoDB] Disconnected')
  })
})
