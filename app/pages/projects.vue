<template>
  <div class="projects-page">
    <section class="page-hero">
      <div class="page-hero-bg" />
      <div class="hero-particles">
        <div v-for="n in 50" :key="n" class="particle" :style="particleStyle(n)" />
      </div>
      <div class="hero-code-symbols">
        <span v-for="(sym, i) in codeSymbols" :key="i" class="code-sym" :style="symStyle(i)">{{ sym }}</span>
      </div>
      <div class="hero-matrix-rain">
        <div v-for="n in 12" :key="`rain-${n}`" class="matrix-col" :style="matrixColStyle(n)" />
      </div>
      <div class="hero-orbits">
        <div class="orbit orbit-1"><div class="orbit-dot" /></div>
        <div class="orbit orbit-2"><div class="orbit-dot" /></div>
      </div>
      <div class="hero-glow-orbs">
        <div class="glow-orb orb-1" />
        <div class="glow-orb orb-2" />
        <div class="glow-orb orb-3" />
      </div>
      <v-container class="page-hero-content">
        <v-row align="center" justify="center">
          <v-col cols="12" class="text-center">
            <AnimatedSection>
              <div class="hero-badge">
                <v-icon size="16" class="mr-1">mdi-source-repository</v-icon>
                {{ t('projects.badge') }}
              </div>
              <h1 class="page-title">
                <span class="title-line">{{ t('projects.title') }}</span>
              </h1>
              <p class="page-subtitle">{{ t('projects.subtitle') }}</p>
              <div class="hero-stats">
                <div class="hero-stat">
                  <span class="stat-number">{{ projects?.length || 0 }}</span>
                  <span class="stat-label">{{ t('projects.repos') }}</span>
                </div>
                <div class="stat-divider" />
                <div class="hero-stat">
                  <span class="stat-number">{{ totalStars }}</span>
                  <span class="stat-label">{{ t('projects.stars') }}</span>
                </div>
                <div class="stat-divider" />
                <div class="hero-stat">
                  <span class="stat-number">{{ totalForks }}</span>
                  <span class="stat-label">{{ t('projects.forks') }}</span>
                </div>
              </div>
              <div class="page-line" />
            </AnimatedSection>
          </v-col>
        </v-row>
      </v-container>
      <div class="hero-bottom-fade" />
    </section>

    <v-container class="py-12">
      <ProjectFilter
        v-model:category="selectedCategory"
        v-model:search="searchQuery"
      />

      <div class="projects-count text-body-2 text-medium-emphasis mb-6">
        {{ filteredProjects.length }} {{ filteredProjects.length === 1 ? t('projects.project') : t('projects.projectsCount') }}
      </div>

      <v-row v-if="filteredProjects.length">
        <v-col
          v-for="(project, index) in filteredProjects"
          :key="project.id"
          cols="12"
          sm="6"
          lg="4"
        >
          <AnimatedSection animation="fadeInUp" :delay="(index % 6) * 80">
            <ProjectCard :project="project" @select="selectedProject = $event" />
          </AnimatedSection>
        </v-col>
      </v-row>

      <div v-else class="text-center py-16">
        <v-icon size="64" color="medium-emphasis" class="mb-4">mdi-code-braces-box</v-icon>
        <p class="text-h6 text-medium-emphasis">{{ t('projects.noResults') }}</p>
      </div>
    </v-container>

    <ProjectDialog :project="selectedProject" @close="selectedProject = null" />
  </div>
</template>

<script setup lang="ts">
import type { Project } from '~~/shared/types'

const { t } = useI18n()

useHead({ title: t('projects.metaTitle') })

const { data: projects } = await useFetch<Project[]>('/api/github/repos')

const selectedCategory = ref('all')
const searchQuery = ref('')
const selectedProject = ref<Project | null>(null)

const totalStars = computed(() => (projects.value || []).reduce((sum, p) => sum + (p.stargazers_count || 0), 0))
const totalForks = computed(() => (projects.value || []).reduce((sum, p) => sum + (p.forks_count || 0), 0))

const codeSymbols = ['</', '/>', '{', '}', '()', '=>', '[]', '&&', '||', '/**/', '...', '===', '!=', '++', '::', '#!', '<?', '/>']

function particleStyle(n: number) {
  const phi = 1.618033988749895
  const xPos = ((n * phi * 100) % 100)
  const yPos = ((n * phi * 61.8) % 100)
  const shapes = ['50%', '3px', '0']
  return {
    '--x': `${xPos}%`,
    '--y': `${yPos}%`,
    '--size': `${2 + (n % 5) * 2}px`,
    '--duration': `${12 + (n % 12) * 2.5}s`,
    '--delay': `${-(n % 15) * 1.8}s`,
    '--opacity': `${0.08 + (n % 6) * 0.04}`,
    '--radius': shapes[n % 3],
  }
}

function symStyle(i: number) {
  const phi = 1.618033988749895
  return {
    '--sx': `${((i * phi * 100) % 92) + 4}%`,
    '--sy': `${((i * phi * 61.8) % 85) + 8}%`,
    '--sd': `${16 + (i % 10) * 4}s`,
    '--sdelay': `${-(i % 8) * 2.5}s`,
    '--srot': `${(i % 2 === 0 ? 1 : -1) * (5 + i % 15)}deg`,
  }
}

function matrixColStyle(n: number) {
  return {
    '--mx': `${(n * 8.33) + (n % 3) * 2}%`,
    '--mdelay': `${-(n % 6) * 2}s`,
    '--mdur': `${8 + (n % 5) * 3}s`,
    '--mheight': `${30 + (n % 4) * 20}%`,
  }
}

const filteredProjects = computed(() => {
  let result = projects.value || []

  if (selectedCategory.value !== 'all') {
    result = result.filter((p) => p.category === selectedCategory.value)
  }

  if (searchQuery.value) {
    const q = searchQuery.value.toLowerCase()
    result = result.filter((p) =>
      p.name.toLowerCase().includes(q)
      || (p.description || '').toLowerCase().includes(q)
      || (p.language || '').toLowerCase().includes(q),
    )
  }

  return result
})
</script>

<style scoped>
.page-hero {
  position: relative;
  min-height: 55vh;
  display: flex;
  align-items: center;
  overflow: hidden;
}

.page-hero-bg {
  position: absolute;
  inset: 0;
  background:
    radial-gradient(ellipse at 20% 30%, rgb(var(--v-theme-primary), 0.18) 0%, transparent 50%),
    radial-gradient(ellipse at 80% 70%, rgb(var(--v-theme-secondary), 0.12) 0%, transparent 50%),
    radial-gradient(ellipse at 50% 50%, rgb(var(--v-theme-primary), 0.05) 0%, transparent 70%),
    linear-gradient(180deg, rgb(var(--v-theme-background)) 0%, rgb(var(--v-theme-surface)) 100%);
}

.page-hero-bg::before {
  content: '';
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(rgb(var(--v-theme-primary), 0.04) 1px, transparent 1px),
    linear-gradient(90deg, rgb(var(--v-theme-primary), 0.04) 1px, transparent 1px);
  background-size: 50px 50px;
  animation: grid-move 30s linear infinite;
}

@keyframes grid-move {
  0% { transform: translate(0, 0); }
  100% { transform: translate(50px, 50px); }
}

.hero-particles {
  position: absolute;
  inset: 0;
  overflow: hidden;
  pointer-events: none;
}

.particle {
  position: absolute;
  left: var(--x);
  top: var(--y);
  width: var(--size);
  height: var(--size);
  border-radius: var(--radius);
  background: rgb(var(--v-theme-primary));
  opacity: var(--opacity);
  animation: particle-float var(--duration) ease-in-out infinite;
  animation-delay: var(--delay);
}

@keyframes particle-float {
  0%, 100% { transform: translate(0, 0) scale(1) rotate(0deg); }
  25% { transform: translate(40px, -50px) scale(1.3) rotate(45deg); }
  50% { transform: translate(-30px, -100px) scale(0.7) rotate(90deg); }
  75% { transform: translate(50px, -40px) scale(1.15) rotate(135deg); }
}

.hero-code-symbols {
  position: absolute;
  inset: 0;
  overflow: hidden;
  pointer-events: none;
}

.code-sym {
  position: absolute;
  left: var(--sx);
  top: var(--sy);
  font-family: var(--font-mono, 'Fira Code', monospace);
  font-size: 0.85rem;
  color: rgb(var(--v-theme-primary), 0.15);
  font-weight: 700;
  animation: sym-drift var(--sd) ease-in-out infinite;
  animation-delay: var(--sdelay);
  user-select: none;
}

@keyframes sym-drift {
  0%, 100% { transform: translate(0, 0) rotate(0deg); opacity: 0.08; }
  33% { transform: translate(25px, -35px) rotate(var(--srot, 10deg)); opacity: 0.22; }
  66% { transform: translate(-15px, -20px) rotate(calc(var(--srot, 10deg) * -1)); opacity: 0.12; }
}

.hero-matrix-rain {
  position: absolute;
  inset: 0;
  overflow: hidden;
  pointer-events: none;
}

.matrix-col {
  position: absolute;
  left: var(--mx);
  top: -10%;
  width: 1px;
  height: var(--mheight);
  background: linear-gradient(180deg, transparent, rgb(var(--v-theme-primary), 0.15), transparent);
  animation: matrix-fall var(--mdur) linear infinite;
  animation-delay: var(--mdelay);
}

@keyframes matrix-fall {
  0% { transform: translateY(-100%); }
  100% { transform: translateY(400%); }
}

.hero-orbits {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  pointer-events: none;
}

.orbit {
  position: absolute;
  border-radius: 50%;
  border: 1px solid rgb(var(--v-theme-primary), 0.06);
}

.orbit-1 {
  width: 300px;
  height: 300px;
  top: -150px;
  left: -150px;
  animation: orbit-spin 25s linear infinite;
}

.orbit-2 {
  width: 500px;
  height: 500px;
  top: -250px;
  left: -250px;
  animation: orbit-spin 40s linear infinite reverse;
}

.orbit-dot {
  position: absolute;
  top: -3px;
  left: 50%;
  transform: translateX(-50%);
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: rgb(var(--v-theme-primary));
  box-shadow: 0 0 10px rgb(var(--v-theme-primary), 0.5);
}

@keyframes orbit-spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.hero-glow-orbs {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.glow-orb {
  position: absolute;
  border-radius: 50%;
  filter: blur(60px);
  animation: orb-pulse 8s ease-in-out infinite;
}

.orb-1 {
  width: 200px;
  height: 200px;
  top: 10%;
  left: 5%;
  background: rgb(var(--v-theme-primary), 0.08);
  animation-delay: 0s;
}

.orb-2 {
  width: 150px;
  height: 150px;
  top: 60%;
  right: 10%;
  background: rgb(var(--v-theme-secondary), 0.06);
  animation-delay: -3s;
}

.orb-3 {
  width: 180px;
  height: 180px;
  bottom: 20%;
  left: 40%;
  background: rgb(var(--v-theme-primary), 0.05);
  animation-delay: -5s;
}

@keyframes orb-pulse {
  0%, 100% { transform: scale(1); opacity: 0.6; }
  50% { transform: scale(1.4); opacity: 1; }
}

.page-hero-content {
  position: relative;
  z-index: 2;
  padding: 120px 24px 80px;
}

.hero-badge {
  display: inline-flex;
  align-items: center;
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 3px;
  text-transform: uppercase;
  color: rgb(var(--v-theme-primary));
  margin-bottom: 16px;
  padding: 6px 16px;
  border-radius: 20px;
  background: rgb(var(--v-theme-primary), 0.08);
  border: 1px solid rgb(var(--v-theme-primary), 0.15);
  animation: badge-glow 3s ease-in-out infinite;
}

@keyframes badge-glow {
  0%, 100% { box-shadow: 0 0 0 0 rgb(var(--v-theme-primary), 0); }
  50% { box-shadow: 0 0 20px 4px rgb(var(--v-theme-primary), 0.1); }
}

.page-title {
  font-size: clamp(2.5rem, 6vw, 4rem);
  font-weight: 900;
  font-family: var(--font-heading);
  margin-bottom: 12px;
  line-height: 1.1;
}

.title-line {
  background: linear-gradient(135deg, rgb(var(--v-theme-on-surface)), rgb(var(--v-theme-primary)));
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.page-subtitle {
  font-size: 1.15rem;
  color: rgb(var(--v-theme-on-surface), 0.6);
  margin-bottom: 24px;
  max-width: 500px;
  margin-left: auto;
  margin-right: auto;
}

.hero-stats {
  display: inline-flex;
  align-items: center;
  gap: 20px;
  padding: 12px 28px;
  border-radius: 16px;
  background: rgb(var(--v-theme-surface), 0.6);
  backdrop-filter: blur(10px);
  border: 1px solid rgb(var(--v-theme-on-surface), 0.06);
  margin-bottom: 24px;
}

.hero-stat {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
}

.stat-number {
  font-size: 1.4rem;
  font-weight: 900;
  font-family: var(--font-heading);
  color: rgb(var(--v-theme-primary));
}

.stat-label {
  font-size: 0.65rem;
  font-weight: 600;
  letter-spacing: 1px;
  text-transform: uppercase;
  color: rgb(var(--v-theme-on-surface), 0.5);
}

.stat-divider {
  width: 1px;
  height: 30px;
  background: rgb(var(--v-theme-on-surface), 0.1);
}

.page-line {
  width: 60px;
  height: 3px;
  background: linear-gradient(90deg, rgb(var(--v-theme-primary)), rgb(var(--v-theme-secondary)));
  margin: 0 auto;
  border-radius: 2px;
}

.hero-bottom-fade {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 80px;
  background: linear-gradient(to bottom, transparent, rgb(var(--v-theme-background)));
  z-index: 3;
}

.projects-count {
  font-family: var(--font-mono);
  font-size: 0.8rem;
}
</style>
