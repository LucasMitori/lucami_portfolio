<template>
  <div>
    <v-container class="py-12" style="max-width: 800px">
      <v-btn
        :to="localePath('/articles')"
        variant="text"
        prepend-icon="mdi-arrow-left"
        class="mb-6"
      >
        {{ t('common.back') }}
      </v-btn>

      <template v-if="article">
        <v-img
          v-if="article.coverImage"
          :src="article.coverImage"
          height="400"
          cover
          class="rounded-lg mb-8"
        />

        <h1 class="text-h3 font-weight-black mb-4">
          {{ article.title }}
        </h1>

        <div class="d-flex align-center gap-4 text-body-2 text-medium-emphasis mb-6">
          <span>
            <v-icon size="small" class="mr-1">mdi-calendar</v-icon>
            {{ formatDate(article.createdAt) }}
          </span>
          <span>
            <v-icon size="small" class="mr-1">mdi-clock-outline</v-icon>
            {{ readingTime }} min {{ t('articles.readTime') }}
          </span>
        </div>

        <div class="d-flex flex-wrap gap-2 mb-8">
          <v-chip
            v-for="tag in article.tags"
            :key="tag"
            size="small"
            variant="tonal"
            color="primary"
          >
            {{ tag }}
          </v-chip>
        </div>

        <v-divider class="mb-8" />

        <div class="article-content text-body-1" v-html="article.content" />

        <v-divider class="my-8" />

        <div class="d-flex justify-center gap-3">
          <v-btn variant="outlined" prepend-icon="mdi-share-variant">
            {{ t('articles.share') }}
          </v-btn>
          <v-btn :to="localePath('/articles')" variant="text" prepend-icon="mdi-arrow-left">
            {{ t('articles.backToList') }}
          </v-btn>
        </div>
      </template>

      <div v-else class="text-center py-16">
        <v-progress-circular indeterminate color="primary" size="64" />
      </div>
    </v-container>
  </div>
</template>

<script setup lang="ts">
import type { Article } from '~~/shared/types'

const { t } = useI18n()
const localePath = useLocalePath()
const route = useRoute()

const { data: article } = await useFetch<Article>(`/api/public/articles/${route.params.slug}`)

useHead({ title: article.value?.title || t('articles.title') })

const readingTime = computed(() => {
  if (!article.value) return 0
  const words = article.value.content.split(/\s+/).length
  return Math.max(1, Math.ceil(words / 200))
})

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString()
}
</script>

<style scoped>
.article-content :deep(h1),
.article-content :deep(h2),
.article-content :deep(h3) {
  margin-top: 32px;
  margin-bottom: 16px;
  font-family: var(--font-heading);
}

.article-content :deep(p) {
  margin-bottom: 16px;
  line-height: 1.8;
}

.article-content :deep(pre) {
  background: rgba(0, 0, 0, 0.05);
  padding: 16px;
  border-radius: 8px;
  overflow-x: auto;
  margin: 24px 0;
}

.article-content :deep(code) {
  font-family: 'Fira Code', monospace;
}

.article-content :deep(img) {
  max-width: 100%;
  border-radius: 8px;
  margin: 16px 0;
}

.article-content :deep(blockquote) {
  border-left: 4px solid rgb(var(--v-theme-primary));
  padding-left: 16px;
  margin: 24px 0;
  opacity: 0.85;
}
</style>
