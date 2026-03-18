<template>
  <div class="admin-article-list">
    <div class="d-flex justify-space-between align-center mb-4">
      <h3 class="text-h6">Articles</h3>
      <v-btn color="primary" variant="elevated" @click="openEditor(null)">
        <v-icon start icon="mdi-plus" />
        New Article
      </v-btn>
    </div>

    <v-progress-linear v-if="loading" indeterminate class="mb-4" />

    <v-alert v-if="fetchError" type="error" class="mb-4" closable>
      Failed to load articles.
    </v-alert>

    <v-card v-if="articles.length || !loading">
      <v-data-table
        :headers="headers"
        :items="articles"
        :loading="loading"
        item-value="_id"
        hover
      >
        <template #item.title="{ item }">
          <div>
            <span class="font-weight-medium">{{ item.title }}</span>
            <div class="text-caption text-medium-emphasis">{{ item.slug }}</div>
          </div>
        </template>

        <template #item.published="{ item }">
          <v-chip
            :color="item.published ? 'success' : 'warning'"
            size="small"
            variant="tonal"
          >
            {{ item.published ? 'Published' : 'Draft' }}
          </v-chip>
        </template>

        <template #item.createdAt="{ item }">
          {{ formatDate(item.createdAt) }}
        </template>

        <template #item.actions="{ item }">
          <div class="d-flex gap-1">
            <v-btn
              icon="mdi-pencil"
              size="small"
              variant="text"
              color="primary"
              @click="openEditor(item)"
            />
            <v-btn
              icon="mdi-delete"
              size="small"
              variant="text"
              color="error"
              @click="confirmDelete(item)"
            />
          </div>
        </template>

        <template #no-data>
          <div class="text-center pa-4 text-medium-emphasis">
            <v-icon icon="mdi-file-document-outline" size="48" class="mb-2" />
            <div>No articles yet. Create your first article.</div>
          </div>
        </template>
      </v-data-table>
    </v-card>

    <AdminArticleEditor
      v-model="editorOpen"
      :article="editingArticle"
      @saved="onArticleSaved"
    />

    <v-dialog v-model="deleteDialog" max-width="400">
      <v-card>
        <v-card-title>Delete Article</v-card-title>
        <v-card-text>
          Are you sure you want to delete "{{ deletingArticle?.title }}"? This action cannot be undone.
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn variant="text" @click="deleteDialog = false">Cancel</v-btn>
          <v-btn
            color="error"
            variant="elevated"
            :loading="deleting"
            @click="deleteArticle"
          >
            Delete
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-snackbar v-model="snackbar" :color="snackbarColor" :timeout="3000">
      {{ snackbarText }}
    </v-snackbar>
  </div>
</template>

<script setup lang="ts">
import type { Article } from '~~/shared/types'

const headers = [
  { title: 'Title', key: 'title', sortable: true },
  { title: 'Status', key: 'published', sortable: true, width: '120px' },
  { title: 'Date', key: 'createdAt', sortable: true, width: '150px' },
  { title: 'Actions', key: 'actions', sortable: false, width: '120px' },
]

const articles = ref<Article[]>([])
const loading = ref(true)
const fetchError = ref(false)

const editorOpen = ref(false)
const editingArticle = ref<Article | null>(null)

const deleteDialog = ref(false)
const deletingArticle = ref<Article | null>(null)
const deleting = ref(false)

const snackbar = ref(false)
const snackbarText = ref('')
const snackbarColor = ref('success')

async function loadArticles() {
  loading.value = true
  fetchError.value = false
  try {
    articles.value = await $fetch<Article[]>('/api/admin/articles')
  } catch {
    fetchError.value = true
  } finally {
    loading.value = false
  }
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

function openEditor(article: Article | null) {
  editingArticle.value = article
  editorOpen.value = true
}

function confirmDelete(article: Article) {
  deletingArticle.value = article
  deleteDialog.value = true
}

async function deleteArticle() {
  if (!deletingArticle.value) return
  deleting.value = true
  try {
    await $fetch(`/api/admin/articles/${deletingArticle.value._id}`, {
      method: 'DELETE',
    })
    snackbarText.value = 'Article deleted successfully'
    snackbarColor.value = 'success'
    snackbar.value = true
    deleteDialog.value = false
    await loadArticles()
  } catch {
    snackbarText.value = 'Failed to delete article'
    snackbarColor.value = 'error'
    snackbar.value = true
  } finally {
    deleting.value = false
  }
}

function onArticleSaved() {
  snackbarText.value = 'Article saved successfully'
  snackbarColor.value = 'success'
  snackbar.value = true
  loadArticles()
}

onMounted(loadArticles)
</script>
