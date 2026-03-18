export type ThemeSlug = 'default' | 'nerd' | 'retro' | 'coding'

export interface ThemeColors {
  primary: string
  secondary: string
  accent: string
  background: string
  surface: string
  onPrimary: string
  onSecondary: string
  onBackground: string
  onSurface: string
}

export interface ThemeFonts {
  heading: string
  body: string
  mono: string
}

export interface ThemeConfig {
  _id?: string
  slug: ThemeSlug
  name: string
  colors: ThemeColors
  fonts: ThemeFonts
  borderRadius: string
  parallaxImages: string[]
  musicUrl: string
  typingSoundUrl: string
  animationPreset: 'smooth' | 'glitch' | 'typewriter' | 'terminal'
  isDefault: boolean
}
