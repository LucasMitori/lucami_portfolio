<template>
  <v-card class="pa-6" variant="flat">
    <div class="d-flex align-center mb-4">
      <v-avatar size="80" color="primary" class="mr-4">
        <v-img v-if="about?.profileImage" :src="about.profileImage" />
        <span v-else class="text-h4 font-weight-bold">LM</span>
      </v-avatar>
      <div>
        <h2 class="text-h4 font-weight-bold">Lucas Mitori</h2>
        <p class="text-subtitle-1 text-medium-emphasis">
          {{ t('about.role') }}
        </p>
        <div class="d-flex align-center gap-2 mt-1">
          <v-icon size="small" color="primary">mdi-map-marker</v-icon>
          <span class="text-body-2">{{ about?.location || 'Sao Paulo, BR' }}</span>
        </div>
      </div>
    </div>
    <div v-if="about?.bio" v-html="about.bio" class="text-body-1 bio-content" />
  </v-card>
</template>

<script setup lang="ts">
import type { AboutContent } from '~~/shared/types'

const { t } = useI18n()

defineProps<{
  about: AboutContent | null
}>()
</script>

<style scoped>
.bio-content :deep(p) {
  margin-bottom: 12px;
}

.bio-content :deep(strong) {
  color: rgb(var(--v-theme-primary));
}
</style>
