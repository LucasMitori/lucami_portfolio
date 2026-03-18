<template>
  <div class="admin-settings-panel">
    <v-progress-linear v-if="loading" indeterminate class="mb-4" />

    <v-alert v-if="fetchError" type="error" class="mb-4" closable>
      Failed to load settings. Please try again.
    </v-alert>

    <template v-if="settings">
      <v-card class="mb-4">
        <v-card-title>
          <v-icon start icon="mdi-cog" />
          General Settings
        </v-card-title>
        <v-card-text>
          <v-row>
            <v-col cols="12" sm="6">
              <v-select
                v-model="settings.defaultTheme"
                :items="themeOptions"
                item-title="title"
                item-value="value"
                label="Default Theme"
                variant="outlined"
                density="comfortable"
              />
            </v-col>
            <v-col cols="12" sm="6">
              <v-select
                v-model="settings.defaultLocale"
                :items="localeOptions"
                item-title="title"
                item-value="value"
                label="Default Locale"
                variant="outlined"
                density="comfortable"
              />
            </v-col>
          </v-row>

          <v-row>
            <v-col cols="12">
              <v-switch
                v-model="settings.registrationEnabled"
                label="Allow New User Registration"
                color="primary"
                hint="When disabled, only existing users can log in. Toggle this off once you have created your admin account."
                persistent-hint
              />
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>

      <v-card class="mb-4">
        <v-card-title>
          <v-icon start icon="mdi-view-list" />
          Component Order
        </v-card-title>
        <v-card-text>
          <v-list density="compact">
            <v-list-item
              v-for="(component, index) in settings.componentOrder"
              :key="component.componentId"
              class="component-order-item"
            >
              <template #prepend>
                <v-icon icon="mdi-drag-horizontal-variant" class="mr-2 drag-handle" />
              </template>

              <v-list-item-title class="d-flex align-center gap-3">
                <span class="text-body-1">{{ component.name }}</span>
                <v-chip size="x-small" variant="tonal">
                  {{ component.componentId }}
                </v-chip>
              </v-list-item-title>

              <template #append>
                <div class="d-flex align-center gap-3">
                  <v-text-field
                    v-model.number="component.order"
                    type="number"
                    :min="0"
                    :max="settings.componentOrder.length - 1"
                    density="compact"
                    hide-details
                    variant="outlined"
                    style="max-width: 80px"
                    @update:model-value="reorderComponents(index, Number($event))"
                  />
                  <v-switch
                    v-model="component.visible"
                    density="compact"
                    hide-details
                    color="primary"
                  />
                </div>
              </template>
            </v-list-item>
          </v-list>
        </v-card-text>
      </v-card>

      <div class="d-flex justify-end">
        <v-btn
          color="primary"
          variant="elevated"
          size="large"
          :loading="saving"
          @click="saveSettings"
        >
          <v-icon start icon="mdi-content-save" />
          Save Settings
        </v-btn>
      </div>
    </template>

    <v-snackbar v-model="snackbar" :color="snackbarColor" :timeout="3000">
      {{ snackbarText }}
    </v-snackbar>
  </div>
</template>

<script setup lang="ts">
import type { SiteSettings, ThemeSlug } from '~~/shared/types'

const themeOptions = [
  { title: 'Default', value: 'default' as ThemeSlug },
  { title: 'Nerd', value: 'nerd' as ThemeSlug },
  { title: 'Retro', value: 'retro' as ThemeSlug },
  { title: 'Coding', value: 'coding' as ThemeSlug },
]

const localeOptions = [
  { title: 'Portugues (Brasil)', value: 'pt-BR' as const },
  { title: 'English', value: 'en' as const },
]

const settings = ref<SiteSettings | null>(null)
const loading = ref(true)
const fetchError = ref(false)
const saving = ref(false)

const snackbar = ref(false)
const snackbarText = ref('')
const snackbarColor = ref('success')

async function loadSettings() {
  loading.value = true
  fetchError.value = false
  try {
    const data = await $fetch<SiteSettings>('/api/admin/settings')
    settings.value = data
  } catch {
    fetchError.value = true
  } finally {
    loading.value = false
  }
}

function reorderComponents(currentIndex: number, newOrder: number) {
  if (!settings.value) return
  const components = settings.value.componentOrder
  components[currentIndex].order = newOrder
  components.sort((a, b) => a.order - b.order)
}

async function saveSettings() {
  if (!settings.value) return
  saving.value = true
  try {
    await $fetch('/api/admin/settings', {
      method: 'PUT',
      body: settings.value,
    })
    snackbarText.value = 'Settings saved successfully'
    snackbarColor.value = 'success'
    snackbar.value = true
  } catch {
    snackbarText.value = 'Failed to save settings'
    snackbarColor.value = 'error'
    snackbar.value = true
  } finally {
    saving.value = false
  }
}

onMounted(loadSettings)
</script>

<style scoped>
.component-order-item {
  border-bottom: 1px solid rgba(128, 128, 128, 0.1);
}

.drag-handle {
  cursor: grab;
  opacity: 0.5;
}

.drag-handle:hover {
  opacity: 1;
}
</style>
