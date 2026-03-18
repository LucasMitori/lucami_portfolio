<template>
  <div class="coding-journey">
    <div class="journey-grid">
      <v-row>
        <v-col v-for="(item, i) in journeyItems" :key="item.title" cols="12" sm="6" md="3">
          <div class="journey-card" :style="{ '--accent': item.color }">
            <div class="journey-icon-wrap">
              <v-icon :color="item.color" size="28">{{ item.icon }}</v-icon>
            </div>
            <div class="journey-number">{{ item.value }}</div>
            <div class="journey-label">{{ item.title }}</div>
            <div class="journey-bar">
              <div class="journey-bar-fill" :style="{ width: item.percent + '%' }" />
            </div>
          </div>
        </v-col>
      </v-row>
    </div>

    <div class="journey-timeline mt-10">
      <h4 class="text-subtitle-1 font-weight-bold mb-4 text-center">
        <v-icon size="18" class="mr-1" color="primary">mdi-timeline-check</v-icon>
        {{ t('about.journeyMilestones') }}
      </h4>
      <div class="milestone-track">
        <div
          v-for="(milestone, i) in milestones"
          :key="i"
          class="milestone-item"
        >
          <div class="milestone-dot" :style="{ background: milestone.color }" />
          <div class="milestone-content">
            <span class="milestone-year">{{ milestone.year }}</span>
            <span class="milestone-text">{{ milestone.text }}</span>
          </div>
        </div>
      </div>
    </div>

    <div class="journey-quote mt-8">
      <v-icon size="24" color="primary" class="quote-icon">mdi-format-quote-open</v-icon>
      <p class="quote-text">{{ t('about.journeyQuote') }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
const { t } = useI18n()

const journeyItems = computed(() => [
  {
    icon: 'mdi-coffee',
    value: '2,000+',
    title: t('about.journeyCoffee'),
    color: '#8B4513',
    percent: 90,
  },
  {
    icon: 'mdi-source-commit',
    value: '500+',
    title: t('about.journeyCommits'),
    color: 'rgb(var(--v-theme-primary))',
    percent: 75,
  },
  {
    icon: 'mdi-bug',
    value: '∞',
    title: t('about.journeyBugs'),
    color: '#ef4444',
    percent: 100,
  },
  {
    icon: 'mdi-lightbulb',
    value: '24/7',
    title: t('about.journeyLearning'),
    color: '#f59e0b',
    percent: 95,
  },
])

const milestones = computed(() => [
  { year: '2017', text: t('about.milestone2017'), color: '#6C63FF' },
  { year: '2022', text: t('about.milestone2022'), color: '#2EC4B6' },
  { year: '2023', text: t('about.milestone2023'), color: '#f59e0b' },
  { year: '2026', text: t('about.milestone2026'), color: '#10b981' },
])
</script>

<style scoped>
.journey-grid {
  position: relative;
}

.journey-card {
  text-align: center;
  padding: 24px 16px;
  border-radius: var(--border-radius, 12px);
  background: rgb(var(--v-theme-surface), 0.6);
  border: 1px solid rgb(var(--v-theme-on-surface), 0.06);
  transition: all 0.3s ease;
}

.journey-card:hover {
  transform: translateY(-4px);
  border-color: rgb(var(--v-theme-primary), 0.2);
  box-shadow: 0 8px 24px rgb(var(--v-theme-primary), 0.08);
}

.journey-icon-wrap {
  width: 52px;
  height: 52px;
  border-radius: 50%;
  background: rgb(var(--v-theme-primary), 0.08);
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 12px;
}

.journey-number {
  font-size: 1.6rem;
  font-weight: 900;
  font-family: var(--font-heading);
  color: rgb(var(--v-theme-primary));
  margin-bottom: 4px;
}

.journey-label {
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 1px;
  color: rgb(var(--v-theme-on-surface), 0.5);
  margin-bottom: 12px;
}

.journey-bar {
  height: 3px;
  border-radius: 2px;
  background: rgb(var(--v-theme-on-surface), 0.06);
  overflow: hidden;
}

.journey-bar-fill {
  height: 100%;
  border-radius: 2px;
  background: linear-gradient(90deg, rgb(var(--v-theme-primary)), rgb(var(--v-theme-secondary)));
  transition: width 1s ease-out;
}

.milestone-track {
  display: flex;
  justify-content: center;
  gap: 0;
  flex-wrap: wrap;
  position: relative;
}

.milestone-track::before {
  content: '';
  position: absolute;
  top: 8px;
  left: 10%;
  right: 10%;
  height: 2px;
  background: linear-gradient(90deg, transparent, rgb(var(--v-theme-primary), 0.15), transparent);
}

.milestone-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 0 20px;
  position: relative;
}

.milestone-dot {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  border: 3px solid rgb(var(--v-theme-background));
  box-shadow: 0 0 0 2px rgb(var(--v-theme-primary), 0.2);
  z-index: 1;
}

.milestone-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.milestone-year {
  font-size: 0.8rem;
  font-weight: 800;
  font-family: var(--font-mono);
  color: rgb(var(--v-theme-primary));
}

.milestone-text {
  font-size: 0.7rem;
  color: rgb(var(--v-theme-on-surface), 0.5);
  max-width: 120px;
}

.journey-quote {
  text-align: center;
  max-width: 500px;
  margin: 0 auto;
  position: relative;
}

.quote-icon {
  opacity: 0.3;
}

.quote-text {
  font-size: 0.95rem;
  font-style: italic;
  line-height: 1.7;
  color: rgb(var(--v-theme-on-surface), 0.6);
  margin-top: 8px;
}

@media (max-width: 600px) {
  .milestone-item {
    padding: 0 12px;
  }

  .milestone-text {
    max-width: 80px;
    font-size: 0.6rem;
  }
}
</style>
