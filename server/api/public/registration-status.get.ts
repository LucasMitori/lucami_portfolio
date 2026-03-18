import { SiteSettings } from '~~/server/models/SiteSettings'

export default defineEventHandler(async () => {
  const settings = await SiteSettings.findOne().lean()
  return { enabled: settings?.registrationEnabled ?? true }
})
