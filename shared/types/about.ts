export interface TimelineEntry {
  year: string
  title: string
  description: string
  company: string
  icon: string
  type: 'work' | 'education' | 'achievement'
}

export interface SkillCategory {
  name: string
  icon: string
  skills: string[]
}

export interface Education {
  institution: string
  degree: string
  period: string
  status: 'completed' | 'in-progress'
  description?: string
}

export interface AboutContent {
  _id?: string
  bio: string
  profileImage: string
  timeline: TimelineEntry[]
  skillCategories: SkillCategory[]
  education: Education[]
  location: string
  mapCoordinates: {
    lat: number
    lng: number
  }
  updatedAt?: string
}
