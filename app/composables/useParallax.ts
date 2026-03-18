export function useParallax(speed: number = 0.5) {
  const offset = ref(0)
  const elementRef = ref<HTMLElement | null>(null)

  function updateParallax() {
    if (!import.meta.client) return

    if (elementRef.value) {
      const rect = elementRef.value.getBoundingClientRect()
      const windowHeight = window.innerHeight
      const elementCenter = rect.top + rect.height / 2
      const distanceFromCenter = elementCenter - windowHeight / 2
      offset.value = distanceFromCenter * speed * -1
    } else {
      offset.value = window.scrollY * speed
    }
  }

  let rafId: number | null = null

  function onScroll() {
    if (rafId) return
    rafId = requestAnimationFrame(() => {
      updateParallax()
      rafId = null
    })
  }

  onMounted(() => {
    window.addEventListener('scroll', onScroll, { passive: true })
    updateParallax()
  })

  onUnmounted(() => {
    window.removeEventListener('scroll', onScroll)
    if (rafId) {
      cancelAnimationFrame(rafId)
    }
  })

  return {
    offset: readonly(offset),
    elementRef,
  }
}
