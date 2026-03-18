<template>
  <div>
    <h3 class="text-h5 font-weight-bold mb-2">
      <v-icon start color="primary">mdi-radar</v-icon>
      {{ t('about.techStack') }}
    </h3>
    <p class="text-body-2 text-medium-emphasis mb-6">{{ t('about.techStackSub') }}</p>

    <div class="tech-radar-list">
      <div
        v-for="(skill, index) in skills"
        :key="skill.name"
        class="tech-radar-item"
      >
        <div class="d-flex align-center justify-space-between mb-1">
          <div class="d-flex align-center gap-2">
            <v-icon :icon="skill.icon" size="small" :color="skill.color" />
            <span class="text-body-1 font-weight-medium">{{ skill.name }}</span>
          </div>
          <span class="text-body-2 font-weight-bold" :style="{ color: `rgb(var(--v-theme-${skill.color}))` }">
            {{ animatedValues[index] }}%
          </span>
        </div>
        <div class="radar-bar-track">
          <div
            class="radar-bar-fill"
            :style="{
              width: `${animatedValues[index]}%`,
              background: `linear-gradient(90deg, rgb(var(--v-theme-${skill.color})), rgb(var(--v-theme-${skill.color}), 0.6))`,
              transitionDelay: `${index * 150}ms`,
            }"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const { t } = useI18n()

const skills = [
  { name: 'Frontend', icon: 'mdi-monitor-dashboard', value: 90, color: 'primary' },
  { name: 'Backend', icon: 'mdi-server', value: 85, color: 'secondary' },
  { name: 'Database', icon: 'mdi-database', value: 80, color: 'info' },
  { name: 'Mobile', icon: 'mdi-cellphone', value: 70, color: 'success' },
  { name: 'DevOps', icon: 'mdi-cloud-cog', value: 60, color: 'warning' },
]

const isVisible = ref(false)
const animatedValues = ref(skills.map(() => 0))

onMounted(() => {
  const observer = new IntersectionObserver(
    (entries) => {
      if (entries[0].isIntersecting && !isVisible.value) {
        isVisible.value = true
        animateValues()
        observer.disconnect()
      }
    },
    { threshold: 0.3 },
  )

  const el = document.querySelector('.tech-radar-list')
  if (el) observer.observe(el)
})

function animateValues() {
  skills.forEach((skill, index) => {
    const duration = 1200
    const steps = 40
    const increment = skill.value / steps
    let current = 0
    const interval = setInterval(() => {
      current += increment
      if (current >= skill.value) {
        animatedValues.value[index] = skill.value
        clearInterval(interval)
      }
      else {
        animatedValues.value[index] = Math.round(current)
      }
    }, duration / steps + index * 5)
  })
}
</script>

<style scoped>
.tech-radar-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.tech-radar-item {
  transition: transform 0.2s ease;
}

.tech-radar-item:hover {
  transform: translateX(4px);
}

.radar-bar-track {
  width: 100%;
  height: 10px;
  border-radius: 5px;
  background: rgb(var(--v-theme-on-surface), 0.08);
  overflow: hidden;
}

.radar-bar-fill {
  height: 100%;
  border-radius: 5px;
  width: 0;
  transition: width 1.2s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}
</style>
