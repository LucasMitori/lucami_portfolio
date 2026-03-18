import type { Project } from '~~/shared/types'

export function useGitHub() {
  const config = useRuntimeConfig()

  async function fetchRepos(): Promise<Project[]> {
    const { data } = await useFetch<Project[]>('/api/github/repos', {
      key: 'github-repos',
    })
    return data.value || []
  }

  async function fetchReadme(owner: string, repo: string): Promise<string> {
    const { data } = await useFetch<{ content: string }>('/api/github/readme', {
      key: `readme-${owner}-${repo}`,
      query: { owner, repo },
    })
    return data.value?.content || ''
  }

  return {
    fetchRepos,
    fetchReadme,
    username: config.public.githubUsername as string,
  }
}
