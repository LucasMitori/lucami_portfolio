import { seedDatabase } from '~~/server/utils/seed'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()

  const isDev = process.dev
  const seedSecret = getHeader(event, 'x-seed-secret')
  const isAuthorized = seedSecret && config.seedSecret && seedSecret === config.seedSecret

  if (!isDev && !isAuthorized) {
    throw createError({
      statusCode: 403,
      statusMessage: 'Seed endpoint is only available in development mode or with a valid seed secret',
    })
  }

  const result = await seedDatabase()

  if (result.seeded.length === 0) {
    return {
      success: true,
      message: 'Database already seeded, no changes made',
      seeded: [],
    }
  }

  return {
    success: true,
    message: `Database seeded successfully: ${result.seeded.join(', ')}`,
    seeded: result.seeded,
  }
})
