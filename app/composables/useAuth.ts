export function useAuth() {
  const authStore = useAuthStore()
  const router = useRouter()

  const isAuthenticated = computed(() => authStore.isAuthenticated)
  const user = computed(() => authStore.user)
  const isAdmin = computed(() => authStore.user?.role === 'admin')

  async function login(email: string, password: string) {
    await authStore.login(email, password)
    await router.push('/admin')
  }

  async function register(email: string, password: string, name: string) {
    await authStore.register({ email, password, confirmPassword: password, name })
    await router.push('/admin')
  }

  async function logout() {
    await authStore.logout()
    await router.push('/')
  }

  async function checkAuth() {
    if (!authStore.user) {
      await authStore.fetchMe()
    }
    return authStore.isAuthenticated
  }

  return {
    isAuthenticated,
    user,
    isAdmin,
    login,
    register,
    logout,
    checkAuth,
  }
}
