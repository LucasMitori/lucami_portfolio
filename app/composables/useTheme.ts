import { useTheme as useVuetifyTheme } from 'vuetify'
import type { ThemeSlug } from '~~/shared/types'

export function useAppTheme() {
  const themeStore = useThemeStore()
  const vuetifyTheme = useVuetifyTheme()

  const themeClass = computed(() => `theme-${themeStore.currentThemeSlug}`)

  function applyTheme(slug: ThemeSlug) {
    themeStore.setTheme(slug)

    // Vuetify 4: use theme.change() instead of deprecated theme.global.name.value
    if (typeof vuetifyTheme.change === 'function') {
      vuetifyTheme.change(slug)
    } else {
      vuetifyTheme.global.name.value = slug
    }

    if (import.meta.client) {
      document.documentElement.className = document.documentElement.className
        .replace(/theme-\w+/g, '')
        .trim()
      document.documentElement.classList.add(`theme-${slug}`)
    }
  }

  function initTheme() {
    const slug = themeStore.currentThemeSlug

    // Vuetify 4: use theme.change() instead of deprecated theme.global.name.value
    if (typeof vuetifyTheme.change === 'function') {
      vuetifyTheme.change(slug)
    } else {
      vuetifyTheme.global.name.value = slug
    }

    if (import.meta.client) {
      document.documentElement.classList.add(`theme-${slug}`)
    }
  }

  watch(() => themeStore.currentThemeSlug, (newSlug) => {
    applyTheme(newSlug)
  })

  return {
    themeClass,
    applyTheme,
    initTheme,
    currentSlug: computed(() => themeStore.currentThemeSlug),
    activeTheme: computed(() => themeStore.activeTheme),
    animationPreset: computed(() => themeStore.animationPreset),
  }
}
