export default defineNuxtRouteMiddleware(async () => {
  const authStore = useAuthStore()

  if (!authStore.user) {
    try {
      await authStore.fetchMe()
    } catch {
      // Silent fail
    }
  }

  if (!authStore.isAuthenticated) {
    return navigateTo('/admin/login')
  }
})
