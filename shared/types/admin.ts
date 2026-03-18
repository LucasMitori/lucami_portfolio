import type { ThemeSlug } from './theme'

export interface ComponentOrderItem {
  componentId: string
  name: string
  visible: boolean
  order: number
}

export interface MusicConfigItem {
  themeSlug: ThemeSlug
  url: string
  volume: number
}

export interface TypingSoundConfigItem {
  themeSlug: ThemeSlug
  url: string
  volume: number
}

export interface SiteSettings {
  _id?: string
  defaultTheme: ThemeSlug
  defaultLocale: 'pt-BR' | 'en'
  registrationEnabled: boolean
  componentOrder: ComponentOrderItem[]
  musicConfig: MusicConfigItem[]
  typingSoundConfig: TypingSoundConfigItem[]
  updatedAt?: string
}

export interface VisitorRecord {
  _id?: string
  sessionId: string
  page: string
  theme: ThemeSlug
  locale: string
  userAgent: string
  referrer: string
  timestamp: string
}

export interface VisitorStats {
  total: number
  byPage: Record<string, number>
  byTheme: Record<string, number>
  byLocale: Record<string, number>
  byDay: { date: string; count: number }[]
}
