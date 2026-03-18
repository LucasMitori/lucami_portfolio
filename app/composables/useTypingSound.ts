import { Howl } from 'howler'
import type { ThemeSlug } from '~~/shared/types'

const themeSounds: Partial<Record<ThemeSlug, Howl>> = {}

export function useTypingSound() {
  const musicStore = useMusicStore()
  const themeStore = useThemeStore()

  function getOrCreateSound(): Howl | null {
    const theme = themeStore.activeTheme
    if (!theme?.typingSoundUrl) return null

    const slug = themeStore.currentThemeSlug
    if (!themeSounds[slug]) {
      themeSounds[slug] = new Howl({
        src: [theme.typingSoundUrl],
        volume: 0.3,
        html5: true,
      })
    }
    return themeSounds[slug] || null
  }

  function playKeystroke() {
    if (!musicStore.typingSoundEnabled) return

    const sound = getOrCreateSound()
    if (!sound) return

    const rate = 0.9 + Math.random() * 0.2
    sound.rate(rate)
    sound.play()
  }

  // Only play typing sound on actual keyboard input (not background music)
  function attachToElement(el: HTMLElement) {
    const handler = (e: KeyboardEvent) => {
      // Only trigger on printable keys, backspace, delete, enter, tab, space
      const isTypingKey = e.key.length === 1
        || ['Backspace', 'Delete', 'Enter', 'Tab', ' '].includes(e.key)

      // Ignore modifier-only keys and shortcuts
      if (!isTypingKey || e.ctrlKey || e.metaKey || e.altKey) return

      playKeystroke()
    }
    el.addEventListener('keydown', handler)
    return () => el.removeEventListener('keydown', handler)
  }

  // Global keyboard listener - only for actual typing in inputs/textareas/contenteditable
  function attachGlobal() {
    if (!import.meta.client) return () => {}

    const handler = (e: KeyboardEvent) => {
      if (!musicStore.typingSoundEnabled) return

      const target = e.target as HTMLElement
      const isInput = target.tagName === 'INPUT'
        || target.tagName === 'TEXTAREA'
        || target.isContentEditable

      // Only play sound when user is typing in an input field
      if (!isInput) return

      const isTypingKey = e.key.length === 1
        || ['Backspace', 'Delete', 'Enter', 'Tab', ' '].includes(e.key)

      if (!isTypingKey || e.ctrlKey || e.metaKey || e.altKey) return

      playKeystroke()
    }

    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }

  return {
    playKeystroke,
    attachToElement,
    attachGlobal,
    enabled: computed(() => musicStore.typingSoundEnabled),
  }
}
