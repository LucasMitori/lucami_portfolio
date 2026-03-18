import type { SiteSettings, ComponentOrderItem, ThemeSlug } from '~~/shared/types'

export const useSettingsStore = defineStore('settings', () => {
  const settings = ref<SiteSettings | null>(null)
  const isLoaded = ref(false)

  const componentOrder = computed<ComponentOrderItem[]>(() => {
    return settings.value?.componentOrder ?? []
  })

  const defaultTheme = computed<ThemeSlug>(() => {
    return settings.value?.defaultTheme ?? 'default'
  })

  async function fetchSettings() {
    try {
      const data = await $fetch<SiteSettings>('/api/public/settings')
      settings.value = data
    }
    catch {
      // Settings may not exist yet
      settings.value = null
    }
    finally {
      isLoaded.value = true
    }
  }

  async function updateSettings(data: Partial<SiteSettings>) {
    const updated = await $fetch<SiteSettings>('/api/admin/settings', {
      method: 'PUT',
      body: data,
    })
    settings.value = updated
    return updated
  }

  return {
    settings,
    isLoaded,
    componentOrder,
    defaultTheme,
    fetchSettings,
    updateSettings,
  }
})
