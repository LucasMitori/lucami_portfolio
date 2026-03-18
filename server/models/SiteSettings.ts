import mongoose from 'mongoose'
const { Schema, model, models } = mongoose

export interface IComponentOrder {
  componentId: string
  name: string
  visible: boolean
  order: number
}

export interface IMusicConfig {
  themeSlug: string
  url: string
  volume: number
}

export interface ITypingSoundConfig {
  themeSlug: string
  url: string
  volume: number
}

export interface ISiteSettings {
  defaultTheme: 'default' | 'nerd' | 'retro' | 'coding'
  defaultLocale: 'pt-BR' | 'en'
  registrationEnabled: boolean
  componentOrder: IComponentOrder[]
  musicConfig: IMusicConfig[]
  typingSoundConfig: ITypingSoundConfig[]
  updatedAt: Date
}

const SiteSettingsSchema = new Schema<ISiteSettings>({
  defaultTheme: {
    type: String,
    enum: ['default', 'nerd', 'retro', 'coding'],
    default: 'default',
  },
  defaultLocale: {
    type: String,
    enum: ['pt-BR', 'en'],
    default: 'pt-BR',
  },
  registrationEnabled: {
    type: Boolean,
    default: true,
  },
  componentOrder: [
    {
      componentId: { type: String },
      name: { type: String },
      visible: { type: Boolean },
      order: { type: Number },
    },
  ],
  musicConfig: [
    {
      themeSlug: { type: String },
      url: { type: String },
      volume: { type: Number },
    },
  ],
  typingSoundConfig: [
    {
      themeSlug: { type: String },
      url: { type: String },
      volume: { type: Number },
    },
  ],
  updatedAt: {
    type: Date,
    default: Date.now,
  },
})

export const SiteSettings = models.SiteSettings || model<ISiteSettings>('SiteSettings', SiteSettingsSchema)
