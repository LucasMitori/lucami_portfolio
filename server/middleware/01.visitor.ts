import { Visitor } from '~~/server/models/Visitor'

export default defineEventHandler((event) => {
  const path = getRequestURL(event).pathname

  if (
    event.method !== 'GET'
    || path.startsWith('/api/')
    || path.startsWith('/admin')
    || path.startsWith('/_nuxt')
    || path.startsWith('/__nuxt')
  ) {
    return
  }

  let sessionId = getCookie(event, 'visitor_session')
  if (!sessionId) {
    sessionId = crypto.randomUUID()
    setCookie(event, 'visitor_session', sessionId, {
      maxAge: 60 * 60 * 24 * 365,
      httpOnly: true,
      sameSite: 'lax',
      path: '/',
    })
  }

  const headers = getRequestHeaders(event)

  // Fire and forget - don't await
  Visitor.create({
    sessionId,
    page: path,
    theme: getCookie(event, 'theme') || 'default',
    locale: getCookie(event, 'locale') || 'pt-BR',
    userAgent: headers['user-agent'] || '',
    referrer: headers['referer'] || '',
  }).catch(() => {
    // Silently ignore visitor logging errors
  })
})
