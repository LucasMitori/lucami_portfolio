<template>
  <v-card class="fill-height d-flex flex-column project-card" @click="$emit('select', project)">
    <v-img
      v-if="project.customImage"
      :src="project.customImage"
      height="180"
      cover
      class="project-image"
    >
      <template #placeholder>
        <v-row align="center" justify="center" class="fill-height">
          <v-progress-circular indeterminate color="primary" />
        </v-row>
      </template>
    </v-img>
    <div v-else class="project-placeholder" :style="{ background: placeholderGradient }">
      <v-icon size="48" color="white" style="opacity: 0.3">mdi-source-repository</v-icon>
    </div>

    <v-card-item>
      <v-card-title class="text-subtitle-1 font-weight-bold">
        {{ project.name }}
      </v-card-title>
      <template #append>
        <v-chip
          v-if="project.category"
          size="x-small"
          :color="categoryColor"
          variant="tonal"
        >
          {{ project.category }}
        </v-chip>
      </template>
    </v-card-item>

    <v-card-text class="flex-grow-1 text-body-2">
      {{ project.description || t('projects.noDescription') }}
    </v-card-text>

    <v-card-actions>
      <div class="d-flex align-center gap-3 text-body-2 text-medium-emphasis">
        <span v-if="project.language">
          <span class="language-dot" :style="{ background: languageColor }" />
          {{ project.language }}
        </span>
        <span>
          <v-icon size="small">mdi-star-outline</v-icon>
          {{ project.stargazers_count }}
        </span>
        <span>
          <v-icon size="small">mdi-source-fork</v-icon>
          {{ project.forks_count }}
        </span>
      </div>
      <v-spacer />
      <v-btn icon size="small" variant="text" :href="project.html_url" target="_blank" @click.stop>
        <v-icon>mdi-open-in-new</v-icon>
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script setup lang="ts">
import type { Project } from '~~/shared/types'

const { t } = useI18n()

const props = defineProps<{
  project: Project
}>()

defineEmits<{
  select: [project: Project]
}>()

const categoryColor = computed(() => {
  switch (props.project.category) {
    case 'frontend': return 'info'
    case 'backend': return 'success'
    case 'fullstack': return 'primary'
    default: return 'default'
  }
})

const languageColors: Record<string, string> = {
  TypeScript: '#3178C6',
  JavaScript: '#F7DF1E',
  Python: '#3776AB',
  Vue: '#4FC08D',
  HTML: '#E34F26',
  CSS: '#1572B6',
  Java: '#ED8B00',
}

const languageColor = computed(() => languageColors[props.project.language || ''] || '#6C63FF')

const placeholderGradient = computed(() => {
  const hash = props.project.name.split('').reduce((a, b) => ((a << 5) - a + b.charCodeAt(0)) | 0, 0)
  const hue = Math.abs(hash) % 360
  return `linear-gradient(135deg, hsl(${hue}, 60%, 40%), hsl(${(hue + 60) % 360}, 60%, 50%))`
})
</script>

<style scoped>
.project-card {
  cursor: pointer;
  transition: all var(--transition-speed) ease;
}

.project-placeholder {
  height: 180px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.project-image {
  transition: transform 0.3s ease;
}

.project-card:hover .project-image {
  transform: scale(1.05);
}

.language-dot {
  display: inline-block;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  margin-right: 4px;
  vertical-align: middle;
}
</style>
