<template>
  <v-card class="fill-height d-flex flex-column article-card" :to="localePath(`/articles/${article.slug}`)">
    <v-img
      v-if="article.coverImage"
      :src="article.coverImage"
      height="200"
      cover
    />
    <div v-else class="article-placeholder">
      <v-icon size="48" color="white" style="opacity: 0.3">mdi-newspaper-variant</v-icon>
    </div>

    <v-card-item>
      <v-card-title class="text-subtitle-1 font-weight-bold">
        {{ article.title }}
      </v-card-title>
      <v-card-subtitle>
        <v-icon size="x-small" class="mr-1">mdi-calendar</v-icon>
        {{ formatDate(article.createdAt) }}
        <span class="mx-2">|</span>
        <v-icon size="x-small" class="mr-1">mdi-clock-outline</v-icon>
        {{ readingTime }} min
      </v-card-subtitle>
    </v-card-item>

    <v-card-text class="flex-grow-1 text-body-2">
      {{ article.excerpt }}
    </v-card-text>

    <v-card-actions>
      <div class="d-flex flex-wrap gap-1">
        <v-chip
          v-for="tag in article.tags.slice(0, 3)"
          :key="tag"
          size="x-small"
          variant="tonal"
          color="primary"
        >
          {{ tag }}
        </v-chip>
      </div>
      <v-spacer />
      <v-btn variant="text" color="primary" append-icon="mdi-arrow-right">
        {{ t('articles.readMore') }}
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script setup lang="ts">
import type { Article } from '~~/shared/types'

const { t } = useI18n()
const localePath = useLocalePath()

const props = defineProps<{
  article: Article
}>()

const readingTime = computed(() => {
  const words = props.article.content.split(/\s+/).length
  return Math.max(1, Math.ceil(words / 200))
})

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString()
}
</script>

<style scoped>
.article-card {
  transition: all var(--transition-speed) ease;
}

.article-placeholder {
  height: 200px;
  background: linear-gradient(135deg, rgb(var(--v-theme-primary)), rgb(var(--v-theme-secondary)));
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
