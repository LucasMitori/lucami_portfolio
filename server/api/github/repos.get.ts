import Project from '~~/server/models/Project'

interface GitHubRepo {
  id: number
  name: string
  full_name: string
  description: string | null
  html_url: string
  homepage: string | null
  stargazers_count: number
  forks_count: number
  language: string | null
  topics: string[]
  fork: boolean
  archived: boolean
  created_at: string
  updated_at: string
  pushed_at: string
  owner: {
    login: string
    avatar_url: string
  }
}

export default defineCachedEventHandler(async () => {
  const config = useRuntimeConfig()
  const username = config.public.githubUsername || 'LucasMitori'

  const url = `https://api.github.com/users/${username}/repos?per_page=100&sort=updated`
  const headers: Record<string, string> = {
    'Accept': 'application/vnd.github.v3+json',
    'User-Agent': 'portfolio-app',
  }

  if (config.githubToken) {
    headers['Authorization'] = `Bearer ${config.githubToken}`
  }

  let repos: GitHubRepo[] = []

  try {
    const response = await fetch(url, { headers })
    if (response.ok) {
      repos = await response.json() as GitHubRepo[]
    }
    else {
      console.warn(`[GitHub] API responded with ${response.status}: ${response.statusText}`)
    }
  }
  catch (error) {
    console.warn('[GitHub] Failed to fetch repos:', error)
  }

  let dbProjects: Array<{ repoId: number; customImage: string; category: string; featured: boolean; order: number }> = []
  try {
    dbProjects = await Project.find().lean()
  }
  catch {
    // DB not available, use defaults
  }

  const dbMap = new Map(dbProjects.map(p => [p.repoId, p]))

  const projects = repos
    .filter((repo) => !repo.fork && !repo.archived)
    .map((repo) => {
      const dbEntry = dbMap.get(repo.id)
      return {
        id: repo.id,
        name: repo.name,
        full_name: repo.full_name,
        description: repo.description || '',
        html_url: repo.html_url,
        homepage: repo.homepage || '',
        language: repo.language || '',
        stargazers_count: repo.stargazers_count,
        forks_count: repo.forks_count,
        topics: repo.topics || [],
        created_at: repo.created_at,
        updated_at: repo.updated_at,
        pushed_at: repo.pushed_at,
        category: (dbEntry?.category as 'frontend' | 'backend' | 'fullstack') || 'fullstack',
        featured: dbEntry?.featured || false,
        customImage: dbEntry?.customImage || '',
        order: dbEntry?.order || 0,
      }
    })
    .sort((a, b) => {
      if (a.featured !== b.featured) return a.featured ? -1 : 1
      if (a.order !== b.order) return a.order - b.order
      return b.stargazers_count - a.stargazers_count
    })

  return projects
}, {
  maxAge: 300,
})
