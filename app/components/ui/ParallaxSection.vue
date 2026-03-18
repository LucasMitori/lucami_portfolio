<template>
  <section
    ref="sectionRef"
    class="parallax-section"
    :style="{ minHeight: height }"
  >
    <div
      class="parallax-bg"
      :style="{
        backgroundImage: image ? `url(${image})` : undefined,
        transform: `translate3d(0, ${offset}px, 0)`,
      }"
    />
    <div v-if="overlay" class="parallax-overlay" />
    <div class="parallax-content">
      <slot />
    </div>
  </section>
</template>

<script setup lang="ts">
const props = withDefaults(defineProps<{
  image?: string
  height?: string
  speed?: number
  overlay?: boolean
}>(), {
  image: '',
  height: '100vh',
  speed: 0.4,
  overlay: true,
})

const sectionRef = ref<HTMLElement | null>(null)
const offset = ref(0)
let rafId: number | null = null

function updateParallax() {
  if (!sectionRef.value || !import.meta.client) return
  const rect = sectionRef.value.getBoundingClientRect()
  const windowHeight = window.innerHeight
  const visible = rect.bottom > 0 && rect.top < windowHeight
  if (visible) {
    offset.value = rect.top * props.speed * -0.5
  }
}

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
  if (rafId) cancelAnimationFrame(rafId)
})
</script>

<style scoped>
.parallax-section {
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: center;
}

.parallax-bg {
  position: absolute;
  top: -30%;
  left: 0;
  right: 0;
  bottom: -30%;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  will-change: transform;
  filter: var(--parallax-filter, none);
}

.parallax-overlay {
  position: absolute;
  inset: 0;
  z-index: 1;
}

.parallax-content {
  position: relative;
  z-index: 2;
  width: 100%;
  height: 100%;
}
</style>
