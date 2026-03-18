<template>
  <div>
    <v-alert v-if="!cloudinaryConfigured" type="warning" variant="tonal" class="mb-6">
      <v-alert-title>{{ t('admin.projects.cloudinaryWarning') }}</v-alert-title>
      {{ t('admin.projects.cloudinarySetup') }}
    </v-alert>

    <v-text-field
      v-model="searchQuery"
      :placeholder="t('projects.searchPlaceholder')"
      prepend-inner-icon="mdi-magnify"
      variant="outlined"
      density="compact"
      clearable
      class="mb-4"
      style="max-width: 400px"
    />

    <v-row>
      <v-col
        v-for="project in filteredProjects"
        :key="project.id"
        cols="12"
        sm="6"
        lg="4"
      >
        <v-card variant="outlined" class="project-admin-card">
          <div class="project-thumb-area">
            <v-img
              v-if="project.customImage"
              :src="project.customImage"
              height="160"
              cover
              class="project-thumb"
            />
            <div v-else class="project-thumb-placeholder">
              <v-icon size="40" color="medium-emphasis">mdi-image-plus</v-icon>
              <span class="text-caption text-medium-emphasis mt-1">{{ t('admin.projects.noImage') }}</span>
            </div>
            <div class="thumb-overlay">
              <v-btn
                size="small"
                variant="flat"
                color="primary"
                prepend-icon="mdi-upload"
                :loading="uploading === project.id"
                @click="triggerUpload(project)"
              >
                {{ t('admin.projects.upload') }}
              </v-btn>
              <v-btn
                v-if="project.customImage"
                size="small"
                variant="flat"
                color="error"
                icon="mdi-delete"
                @click="removeImage(project)"
              />
            </div>
          </div>

          <v-card-text class="pa-4">
            <div class="d-flex align-center justify-space-between mb-2">
              <h4 class="text-body-1 font-weight-bold text-truncate">{{ project.name }}</h4>
              <v-chip
                :color="categoryColor(project.category)"
                size="x-small"
                variant="tonal"
              >
                {{ project.category }}
              </v-chip>
            </div>

            <p class="text-caption text-medium-emphasis mb-3 text-truncate">
              {{ project.description || t('projects.noDescription') }}
            </p>

            <div class="d-flex align-center gap-2 mb-3">
              <v-icon size="14">mdi-star</v-icon>
              <span class="text-caption">{{ project.stargazers_count }}</span>
              <v-icon size="14" class="ml-2">mdi-source-fork</v-icon>
              <span class="text-caption">{{ project.forks_count }}</span>
              <v-chip v-if="project.language" size="x-small" variant="outlined" class="ml-auto">
                {{ project.language }}
              </v-chip>
            </div>

            <v-select
              v-model="project.category"
              :items="categories"
              :label="t('admin.projects.category')"
              variant="outlined"
              density="compact"
              class="mb-2"
              @update:model-value="saveProject(project)"
            />

            <div class="d-flex align-center gap-2">
              <v-switch
                v-model="project.featured"
                :label="t('admin.projects.featured')"
                color="primary"
                density="compact"
                hide-details
                @update:model-value="saveProject(project)"
              />
              <v-text-field
                v-model.number="project.order"
                :label="t('admin.projects.order')"
                type="number"
                variant="outlined"
                density="compact"
                style="max-width: 80px"
                hide-details
                @blur="saveProject(project)"
              />
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <input
      ref="fileInput"
      type="file"
      accept="image/*"
      style="display: none"
      @change="handleFileSelected"
    >

    <v-snackbar v-model="snackbar" :color="snackbarColor" :timeout="3000">
      {{ snackbarText }}
    </v-snackbar>
  </div>
</template>

<script setup lang="ts">
import type { Project } from '~~/shared/types'

const { t } = useI18n()
const config = useRuntimeConfig()

const cloudinaryConfigured = computed(() => !!config.public.cloudinaryCloudName)

const { data: projects, refresh } = await useFetch<Project[]>('/api/github/repos')

const searchQuery = ref('')
const uploading = ref<number | null>(null)
const fileInput = ref<HTMLInputElement | null>(null)
const selectedProject = ref<Project | null>(null)
const snackbar = ref(false)
const snackbarText = ref('')
const snackbarColor = ref('success')

const categories = [
  { title: 'Frontend', value: 'frontend' },
  { title: 'Backend', value: 'backend' },
  { title: 'Full Stack', value: 'fullstack' },
]

const filteredProjects = computed(() => {
  if (!searchQuery.value) return projects.value || []
  const q = searchQuery.value.toLowerCase()
  return (projects.value || []).filter(p =>
    p.name.toLowerCase().includes(q)
    || (p.description || '').toLowerCase().includes(q),
  )
})

function categoryColor(cat: string) {
  switch (cat) {
    case 'frontend': return 'info'
    case 'backend': return 'warning'
    case 'fullstack': return 'success'
    default: return 'default'
  }
}

function triggerUpload(project: Project) {
  selectedProject.value = project
  fileInput.value?.click()
}

async function handleFileSelected(event: Event) {
  const file = (event.target as HTMLInputElement).files?.[0]
  if (!file || !selectedProject.value) return

  uploading.value = selectedProject.value.id

  try {
    const reader = new FileReader()
    const base64 = await new Promise<string>((resolve) => {
      reader.onload = () => resolve(reader.result as string)
      reader.readAsDataURL(file)
    })

    const { url } = await $fetch<{ url: string }>('/api/admin/upload/image', {
      method: 'POST',
      body: { image: base64, folder: 'portfolio/projects' },
    })

    selectedProject.value.customImage = url
    await saveProject(selectedProject.value)
    showMessage(t('admin.projects.uploadSuccess'), 'success')
  }
  catch {
    showMessage(t('admin.projects.uploadError'), 'error')
  }
  finally {
    uploading.value = null
    if (fileInput.value) fileInput.value.value = ''
  }
}

async function removeImage(project: Project) {
  project.customImage = ''
  await saveProject(project)
  showMessage(t('admin.projects.imageRemoved'), 'info')
}

async function saveProject(project: Project) {
  try {
    await $fetch(`/api/admin/projects/${project.id}`, {
      method: 'PUT',
      body: {
        name: project.name,
        customImage: project.customImage,
        category: project.category,
        featured: project.featured,
        order: project.order,
      },
    })
  }
  catch {
    showMessage(t('admin.projects.saveError'), 'error')
  }
}

function showMessage(text: string, color: string) {
  snackbarText.value = text
  snackbarColor.value = color
  snackbar.value = true
}
</script>

<style scoped>
.project-admin-card {
  border-radius: 12px !important;
  transition: all 0.2s ease;
}

.project-admin-card:hover {
  border-color: rgb(var(--v-theme-primary), 0.3) !important;
}

.project-thumb-area {
  position: relative;
  height: 160px;
  background: rgb(var(--v-theme-on-surface), 0.03);
  overflow: hidden;
}

.project-thumb-placeholder {
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.thumb-overlay {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  background: rgba(0, 0, 0, 0.5);
  opacity: 0;
  transition: opacity 0.2s ease;
}

.project-thumb-area:hover .thumb-overlay {
  opacity: 1;
}
</style>
