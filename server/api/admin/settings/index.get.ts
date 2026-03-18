import { SiteSettings } from '~~/server/models/SiteSettings'

export default defineEventHandler(async (event) => {
  const auth = event.context.auth as { userId: string; role: string } | undefined
  if (!auth || auth.role !== 'admin') {
    throw createError({ statusCode: 403, message: 'Forbidden' })
  }

  const settings = await SiteSettings.findOne()

  if (!settings) {
    return {
      defaultTheme: 'default',
      defaultLocale: 'pt-BR',
      componentOrder: [],
      musicConfig: [],
      typingSoundConfig: [],
    }
  }

  return settings
})
