import mongoose from 'mongoose'
const { Schema, model, models } = mongoose

export interface ITimelineEntry {
  year: string
  title: string
  description: string
  company: string
  icon: string
  type: 'work' | 'education' | 'achievement'
}

export interface ISkillCategory {
  name: string
  icon: string
  skills: string[]
}

export interface IEducation {
  institution: string
  degree: string
  period: string
  description: string
  status: 'completed' | 'in-progress'
}

export interface IAbout {
  bio: string
  profileImage: string
  timeline: ITimelineEntry[]
  skillCategories: ISkillCategory[]
  education: IEducation[]
  location: string
  mapCoordinates: {
    lat: number
    lng: number
  }
  updatedAt: Date
}

const AboutSchema = new Schema<IAbout>({
  bio: {
    type: String,
    default: '',
  },
  profileImage: {
    type: String,
    default: '',
  },
  timeline: [
    {
      year: { type: String },
      title: { type: String },
      description: { type: String },
      company: { type: String },
      icon: { type: String },
      type: {
        type: String,
        enum: ['work', 'education', 'achievement'],
      },
    },
  ],
  skillCategories: [
    {
      name: { type: String },
      icon: { type: String },
      skills: { type: [String] },
    },
  ],
  education: [
    {
      institution: { type: String },
      degree: { type: String },
      period: { type: String },
      description: { type: String, default: '' },
      status: {
        type: String,
        enum: ['completed', 'in-progress'],
      },
    },
  ],
  location: {
    type: String,
    default: '',
  },
  mapCoordinates: {
    lat: { type: Number },
    lng: { type: Number },
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
})

export const About = models.About || model<IAbout>('About', AboutSchema)
