import { Howl } from 'howler'
import type { ThemeSlug } from '~~/shared/types'

const themeMusics: Partial<Record<ThemeSlug, Howl>> = {}
let currentHowl: Howl | null = null
let currentThemeSlug: ThemeSlug | null = null
let hasUserInteracted = false

export function useMusic() {
  const musicStore = useMusicStore()
  const themeStore = useThemeStore()

  function getOrCreateHowl(slug: ThemeSlug, url: string): Howl | null {
    if (!url) return null

    // If the URL changed or howl doesn't exist, recreate
    if (!themeMusics[slug]) {
      themeMusics[slug] = new Howl({
        src: [url],
        loop: true,
        volume: musicStore.isMuted ? 0 : musicStore.volume,
        html5: true,
        preload: true,
      })
    }
    return themeMusics[slug] || null
  }

  function play() {
    if (!hasUserInteracted) return

    const theme = themeStore.activeTheme
    const slug = themeStore.currentThemeSlug
    if (!theme?.musicUrl) return

    const howl = getOrCreateHowl(slug, theme.musicUrl)
    if (!howl) return

    // If switching themes, crossfade
    if (currentHowl && currentHowl !== howl && currentThemeSlug !== slug) {
      const oldHowl = currentHowl
      oldHowl.fade(oldHowl.volume(), 0, 800)
      setTimeout(() => {
        oldHowl.stop()
      }, 800)
    }

    currentHowl = howl
    currentThemeSlug = slug
    const targetVolume = musicStore.isMuted ? 0 : musicStore.volume

    if (!howl.playing()) {
      howl.volume(0)
      howl.play()
      howl.fade(0, targetVolume, 1000)
    } else {
      howl.volume(targetVolume)
    }
    musicStore.isPlaying = true
  }

  function pause() {
    if (currentHowl) {
      currentHowl.fade(currentHowl.volume(), 0, 500)
      setTimeout(() => {
        currentHowl?.pause()
      }, 500)
    }
    musicStore.isPlaying = false
  }

  function toggle() {
    if (musicStore.isPlaying) {
      pause()
    } else {
      play()
    }
  }

  function setVolume(vol: number) {
    musicStore.setVolume(vol)
    if (currentHowl) {
      currentHowl.volume(musicStore.isMuted ? 0 : vol)
    }
  }

  function toggleMute() {
    musicStore.toggleMute()
    if (currentHowl) {
      currentHowl.volume(musicStore.isMuted ? 0 : musicStore.volume)
    }
  }

  function handleFirstInteraction() {
    if (!hasUserInteracted) {
      hasUserInteracted = true
      // Auto-play music on first interaction
      if (!musicStore.isPlaying) {
        musicStore.isPlaying = true
      }
      play()
    }
  }

  if (import.meta.client) {
    const events = ['click', 'keydown', 'touchstart']
    events.forEach((event) => {
      document.addEventListener(event, handleFirstInteraction, { once: true })
    })
  }

  // Watch theme changes - when theme changes while playing, switch to new theme's music
  watch(() => themeStore.currentThemeSlug, (newSlug, oldSlug) => {
    if (newSlug !== oldSlug && musicStore.isPlaying && hasUserInteracted) {
      // Small delay to let theme store update activeTheme
      nextTick(() => {
        play()
      })
    }
  })

  return {
    play,
    pause,
    toggle,
    setVolume,
    toggleMute,
    isPlaying: computed(() => musicStore.isPlaying),
    volume: computed(() => musicStore.volume),
    isMuted: computed(() => musicStore.isMuted),
  }
}
