import { fetchGitHubAPI } from '~~/server/utils/github'

interface GitHubReadme {
  content: string
  encoding: string
}

export default defineCachedEventHandler(async (event) => {
  const query = getQuery(event)
  const owner = query.owner as string
  const repo = query.repo as string

  if (!owner || !repo) {
    throw createError({ statusCode: 400, message: 'Owner and repo query params are required' })
  }

  try {
    const readme = await fetchGitHubAPI<GitHubReadme>(
      `/repos/${owner}/${repo}/readme`,
    )

    const content = Buffer.from(readme.content, 'base64').toString('utf-8')

    return { content }
  }
  catch (error: unknown) {
    const err = error as { statusCode?: number }
    if (err?.statusCode === 404) {
      return { content: '' }
    }
    throw error
  }
}, {
  maxAge: 600,
})
