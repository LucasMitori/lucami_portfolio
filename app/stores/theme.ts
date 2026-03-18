import type { ThemeSlug, ThemeConfig, ThemeFonts } from '~~/shared/types'

// Local audio paths - place files in public/audio/<theme>/background.mp3
const THEME_MUSIC: Record<ThemeSlug, string> = {
  default: '/audio/default/background.mp3',
  nerd: '/audio/nerd/background.mp3',
  retro: '/audio/retro/background.mp3',
  coding: '/audio/coding/background.mp3',
}

const THEME_TYPING_SOUNDS: Record<ThemeSlug, string> = {
  default: '/audio/default/typing.mp3',
  nerd: '/audio/nerd/typing.mp3',
  retro: '/audio/retro/typing.mp3',
  coding: '/audio/coding/typing.mp3',
}

const DEFAULT_THEME: ThemeConfig = {
  slug: 'default',
  name: 'Default',
  colors: {
    primary: '#6366f1',
    secondary: '#8b5cf6',
    accent: '#f59e0b',
    background: '#0f172a',
    surface: '#1e293b',
    onPrimary: '#ffffff',
    onSecondary: '#ffffff',
    onBackground: '#f8fafc',
    onSurface: '#f1f5f9',
  },
  fonts: {
    heading: 'Inter',
    body: 'Inter',
    mono: 'Fira Code',
  },
  borderRadius: '0.5rem',
  parallaxImages: [],
  musicUrl: '/audio/default/background.mp3',
  typingSoundUrl: '/audio/default/typing.mp3',
  animationPreset: 'smooth',
  isDefault: true,
}

export const useThemeStore = defineStore('theme', () => {
  const currentThemeSlug = ref<ThemeSlug>('default')
  const themes = ref<ThemeConfig[]>([])

  const activeTheme = computed<ThemeConfig>(() => {
    const found = themes.value.find((t) => t.slug === currentThemeSlug.value)
    if (found) {
      // Ensure music URLs have fallbacks to local audio files
      return {
        ...found,
        musicUrl: found.musicUrl || THEME_MUSIC[found.slug] || '',
        typingSoundUrl: found.typingSoundUrl || THEME_TYPING_SOUNDS[found.slug] || '',
      }
    }
    return {
      ...DEFAULT_THEME,
      slug: currentThemeSlug.value,
      musicUrl: THEME_MUSIC[currentThemeSlug.value] || DEFAULT_THEME.musicUrl,
      typingSoundUrl: THEME_TYPING_SOUNDS[currentThemeSlug.value] || DEFAULT_THEME.typingSoundUrl,
    }
  })

  const currentFonts = computed<ThemeFonts>(() => activeTheme.value.fonts)

  const animationPreset = computed(() => activeTheme.value.animationPreset)

  function setTheme(slug: ThemeSlug) {
    currentThemeSlug.value = slug
  }

  async function fetchThemes() {
    const { data } = await useFetch<ThemeConfig[]>('/api/public/themes')
    if (data.value) {
      themes.value = data.value
    }
  }

  async function initTheme() {
    await fetchThemes()

    const stored = currentThemeSlug.value
    const exists = themes.value.some((t) => t.slug === stored)
    if (exists) return

    try {
      const settings = await $fetch<{ defaultTheme?: ThemeSlug }>('/api/public/settings')
      if (settings?.defaultTheme) {
        currentThemeSlug.value = settings.defaultTheme
        return
      }
    }
    catch {
      // Settings endpoint may not be available yet
    }

    const defaultTheme = themes.value.find((t) => t.isDefault)
    if (defaultTheme) {
      currentThemeSlug.value = defaultTheme.slug
    }
    else {
      currentThemeSlug.value = 'default'
    }
  }

  return {
    currentThemeSlug,
    themes,
    activeTheme,
    currentFonts,
    animationPreset,
    setTheme,
    fetchThemes,
    initTheme,
  }
}, {
  persist: {
    pick: ['currentThemeSlug'],
  },
})
