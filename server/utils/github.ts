export async function fetchGitHubAPI<T>(path: string): Promise<T> {
  const config = useRuntimeConfig()
  const url = `https://api.github.com${path}`

  const headers: Record<string, string> = {
    'Accept': 'application/vnd.github.v3+json',
    'User-Agent': 'portfolio-app',
  }

  if (config.githubToken) {
    headers['Authorization'] = `Bearer ${config.githubToken}`
  }

  const response = await fetch(url, { headers })

  const rateLimitRemaining = response.headers.get('X-RateLimit-Remaining')
  if (rateLimitRemaining && parseInt(rateLimitRemaining, 10) <= 0) {
    const resetTime = response.headers.get('X-RateLimit-Reset')
    const resetDate = resetTime ? new Date(parseInt(resetTime, 10) * 1000).toISOString() : 'unknown'
    throw createError({
      statusCode: 429,
      statusMessage: `GitHub API rate limit exceeded. Resets at ${resetDate}`,
    })
  }

  if (!response.ok) {
    throw createError({
      statusCode: response.status,
      statusMessage: `GitHub API error: ${response.statusText}`,
    })
  }

  return response.json() as Promise<T>
}
