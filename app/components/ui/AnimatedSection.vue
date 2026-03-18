<template>
  <div ref="sectionRef" class="animated-section" :style="animatedStyle">
    <slot />
  </div>
</template>

<script setup lang="ts">
type AnimationType = 'fadeInUp' | 'fadeIn' | 'slideInLeft' | 'slideInRight' | 'scaleIn' | 'blurIn'

const props = withDefaults(defineProps<{
  animation?: AnimationType
  delay?: number
  duration?: number
  threshold?: number
}>(), {
  animation: 'fadeInUp',
  delay: 0,
  duration: 600,
  threshold: 0.15,
})

const themeStore = useThemeStore()
const sectionRef = ref<HTMLElement | null>(null)
const isVisible = ref(false)

// Theme-specific easing functions
const easingMap: Record<string, string> = {
  default: 'cubic-bezier(0.33, 1, 0.68, 1)',    // easeOutCubic
  nerd: 'cubic-bezier(0.34, 1.56, 0.64, 1)',    // easeOutBack (overshoot)
  retro: 'cubic-bezier(0.45, 0, 0.55, 1)',      // easeInOutQuad
  coding: 'cubic-bezier(0.16, 1, 0.3, 1)',      // easeOutExpo
}

// "From" transforms per animation type (hidden state)
const fromStates: Record<AnimationType, Record<string, string>> = {
  fadeInUp: {
    opacity: '0',
    transform: 'translateY(30px)',
    filter: 'none',
  },
  fadeIn: {
    opacity: '0',
    transform: 'none',
    filter: 'none',
  },
  slideInLeft: {
    opacity: '0',
    transform: 'translateX(-60px)',
    filter: 'none',
  },
  slideInRight: {
    opacity: '0',
    transform: 'translateX(60px)',
    filter: 'none',
  },
  scaleIn: {
    opacity: '0',
    transform: 'scale(0.85)',
    filter: 'none',
  },
  blurIn: {
    opacity: '0',
    transform: 'none',
    filter: 'blur(8px)',
  },
}

// "To" transforms (visible state)
const toState: Record<string, string> = {
  opacity: '1',
  transform: 'none',
  filter: 'none',
}

const easing = computed(() => {
  return easingMap[themeStore.currentThemeSlug] || easingMap.default
})

const transitionValue = computed(() => {
  const ms = props.duration
  const delayMs = props.delay
  const ease = easing.value
  const properties = ['opacity', 'transform', 'filter']
  return properties.map(p => `${p} ${ms}ms ${ease} ${delayMs}ms`).join(', ')
})

const animatedStyle = computed(() => {
  const state = isVisible.value ? toState : fromStates[props.animation]
  return {
    opacity: state.opacity,
    transform: state.transform,
    filter: state.filter,
    transition: transitionValue.value,
    willChange: 'opacity, transform, filter',
  }
})

let observer: IntersectionObserver | null = null

onMounted(() => {
  if (!sectionRef.value) return

  observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        isVisible.value = entry.isIntersecting
      }
    },
    { threshold: props.threshold },
  )

  observer.observe(sectionRef.value)
})

onUnmounted(() => {
  observer?.disconnect()
  observer = null
})
</script>
