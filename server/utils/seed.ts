import { Theme } from '~~/server/models/Theme'
import { About } from '~~/server/models/About'
import { SiteSettings } from '~~/server/models/SiteSettings'
import { User } from '~~/server/models/User'
import { hashPassword } from '~~/server/utils/password'

const defaultThemes = [
  {
    slug: 'default',
    name: 'Default',
    colors: {
      primary: '#6366F1',
      secondary: '#8B5CF6',
      accent: '#EC4899',
      background: '#FFFFFF',
      surface: '#F8FAFC',
      onPrimary: '#FFFFFF',
      onSecondary: '#FFFFFF',
      onBackground: '#1E293B',
      onSurface: '#334155',
    },
    fonts: {
      heading: 'Inter',
      body: 'Inter',
      mono: 'JetBrains Mono',
    },
    borderRadius: '8px',
    parallaxImages: [],
    musicUrl: '',
    typingSoundUrl: '',
    animationPreset: 'smooth' as const,
    isDefault: true,
  },
  {
    slug: 'nerd',
    name: 'Nerd',
    colors: {
      primary: '#00D4FF',
      secondary: '#FF6B00',
      accent: '#00FF87',
      background: '#0A0A1A',
      surface: '#12122A',
      onPrimary: '#0A0A1A',
      onSecondary: '#FFFFFF',
      onBackground: '#E0E0FF',
      onSurface: '#B0B0D0',
    },
    fonts: {
      heading: 'Orbitron',
      body: 'Rajdhani',
      mono: 'Fira Code',
    },
    borderRadius: '0px',
    parallaxImages: [],
    musicUrl: '',
    typingSoundUrl: '',
    animationPreset: 'glitch' as const,
    isDefault: false,
  },
  {
    slug: 'retro',
    name: 'Retro',
    colors: {
      primary: '#8B4513',
      secondary: '#A0522D',
      accent: '#CD853F',
      background: '#F5E6C8',
      surface: '#FFF8EE',
      onPrimary: '#FFFFFF',
      onSecondary: '#FFFFFF',
      onBackground: '#3E2723',
      onSurface: '#5D4037',
    },
    fonts: {
      heading: 'Special Elite',
      body: 'Courier Prime',
      mono: 'Courier Prime',
    },
    borderRadius: '2px',
    parallaxImages: [],
    musicUrl: '',
    typingSoundUrl: '',
    animationPreset: 'typewriter' as const,
    isDefault: false,
  },
  {
    slug: 'coding',
    name: 'Coding',
    colors: {
      primary: '#00FF41',
      secondary: '#00CC33',
      accent: '#39FF14',
      background: '#0D0D0D',
      surface: '#1A1A1A',
      onPrimary: '#0D0D0D',
      onSecondary: '#0D0D0D',
      onBackground: '#00FF41',
      onSurface: '#00CC33',
    },
    fonts: {
      heading: 'Fira Code',
      body: 'Fira Code',
      mono: 'Fira Code',
    },
    borderRadius: '0px',
    parallaxImages: [],
    musicUrl: '',
    typingSoundUrl: '',
    animationPreset: 'terminal' as const,
    isDefault: false,
  },
]

const defaultAbout = {
  bio: 'Desenvolvedor Fullstack apaixonado por tecnologia e inovacao. Experiencia em desenvolvimento web moderno com foco em criar solucoes escaláveis e interfaces intuitivas. Sempre buscando aprender novas tecnologias e aprimorar minhas habilidades.',
  profileImage: '',
  timeline: [
    {
      year: '2023',
      title: 'Desenvolvedor Fullstack',
      description: 'Desenvolvimento de aplicacoes web fullstack com tecnologias modernas.',
      company: 'SaltCode',
      icon: 'mdi-briefcase',
      type: 'work' as const,
    },
    {
      year: '2022',
      title: 'Desenvolvedor Frontend',
      description: 'Desenvolvimento de interfaces e experiencias de usuario para aplicacoes financeiras.',
      company: 'NossBank',
      icon: 'mdi-briefcase',
      type: 'work' as const,
    },
    {
      year: '2021',
      title: 'Bacharelado em Engenharia de Software',
      description: 'Cursando Engenharia de Software com foco em desenvolvimento de sistemas.',
      company: 'UNINTER',
      icon: 'mdi-school',
      type: 'education' as const,
    },
  ],
  skillCategories: [
    {
      name: 'Frontend',
      icon: 'mdi-palette',
      skills: [
        'HTML',
        'CSS',
        'JavaScript',
        'Angular',
        'React',
        'React Native',
        'NextJS',
        'Vue 2/3',
        'Nuxt 3/4',
        'TypeScript',
      ],
    },
    {
      name: 'Backend',
      icon: 'mdi-server',
      skills: [
        'Node.js',
        'NestJS',
        'Python',
        'Django',
        'MongoDB',
        'AWS',
        'PostgreSQL',
        'SQL',
        'REST API',
        'Docker',
        'MySQL',
        'TypeORM/Knex.js',
        'Git/GitHub',
      ],
    },
  ],
  education: [
    {
      institution: 'UNINTER',
      degree: 'Bacharelado em Engenharia de Software',
      period: '2021 - Presente',
      status: 'in-progress' as const,
    },
  ],
  location: 'Sao Paulo, BR',
  mapCoordinates: {
    lat: -23.5505,
    lng: -46.6333,
  },
}

const defaultSiteSettings = {
  defaultTheme: 'default' as const,
  defaultLocale: 'pt-BR' as const,
  componentOrder: [
    { componentId: 'hero', name: 'Hero', visible: true, order: 0 },
    { componentId: 'skills', name: 'Skills', visible: true, order: 1 },
    { componentId: 'featured', name: 'Featured Projects', visible: true, order: 2 },
    { componentId: 'contact', name: 'Contact', visible: true, order: 3 },
  ],
  musicConfig: [],
  typingSoundConfig: [],
}

export async function seedDatabase(): Promise<{ seeded: string[] }> {
  const seeded: string[] = []

  const themeCount = await Theme.countDocuments()
  if (themeCount === 0) {
    await Theme.insertMany(defaultThemes)
    seeded.push('themes')
  }

  const aboutCount = await About.countDocuments()
  if (aboutCount === 0) {
    await About.create(defaultAbout)
    seeded.push('about')
  }

  const settingsCount = await SiteSettings.countDocuments()
  if (settingsCount === 0) {
    await SiteSettings.create(defaultSiteSettings)
    seeded.push('siteSettings')
  }

  const userCount = await User.countDocuments()
  if (userCount === 0) {
    await User.create({
      email: 'admin@admin.com',
      passwordHash: await hashPassword('admin@123'),
      name: 'Admin',
      role: 'admin',
    })
    seeded.push('adminUser')
  }

  return { seeded }
}
