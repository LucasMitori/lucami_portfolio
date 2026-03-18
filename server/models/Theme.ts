import mongoose from 'mongoose'
const { Schema, model, models } = mongoose

export interface ITheme {
  slug: 'default' | 'nerd' | 'retro' | 'coding'
  name: string
  colors: {
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
  fonts: {
    heading: string
    body: string
    mono: string
  }
  borderRadius: string
  parallaxImages: string[]
  musicUrl: string
  typingSoundUrl: string
  animationPreset: 'smooth' | 'glitch' | 'typewriter' | 'terminal'
  isDefault: boolean
}

const ThemeSchema = new Schema<ITheme>({
  slug: {
    type: String,
    unique: true,
    required: true,
    enum: ['default', 'nerd', 'retro', 'coding'],
  },
  name: {
    type: String,
    required: true,
  },
  colors: {
    primary: { type: String },
    secondary: { type: String },
    accent: { type: String },
    background: { type: String },
    surface: { type: String },
    onPrimary: { type: String },
    onSecondary: { type: String },
    onBackground: { type: String },
    onSurface: { type: String },
  },
  fonts: {
    heading: { type: String },
    body: { type: String },
    mono: { type: String },
  },
  borderRadius: {
    type: String,
    default: '8px',
  },
  parallaxImages: {
    type: [String],
    default: [],
  },
  musicUrl: {
    type: String,
    default: '',
  },
  typingSoundUrl: {
    type: String,
    default: '',
  },
  animationPreset: {
    type: String,
    enum: ['smooth', 'glitch', 'typewriter', 'terminal'],
    default: 'smooth',
  },
  isDefault: {
    type: Boolean,
    default: false,
  },
})

export const Theme = models.Theme || model<ITheme>('Theme', ThemeSchema)
