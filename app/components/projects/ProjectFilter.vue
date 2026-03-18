<template>
  <div class="d-flex flex-wrap gap-4 align-center mb-8">
    <v-chip-group
      :model-value="category"
      mandatory
      selected-class="text-primary"
      @update:model-value="$emit('update:category', $event as string)"
    >
      <v-chip
        v-for="cat in categories"
        :key="cat.value"
        :value="cat.value"
        variant="tonal"
        filter
      >
        <v-icon start>{{ cat.icon }}</v-icon>
        {{ t(cat.label) }}
      </v-chip>
    </v-chip-group>

    <v-spacer />

    <v-text-field
      :model-value="search"
      :placeholder="t('projects.searchPlaceholder')"
      prepend-inner-icon="mdi-magnify"
      density="compact"
      hide-details
      clearable
      style="max-width: 300px"
      @update:model-value="$emit('update:search', $event || '')"
    />
  </div>
</template>

<script setup lang="ts">
const { t } = useI18n()

defineProps<{
  category: string
  search: string
}>()

defineEmits<{
  'update:category': [value: string]
  'update:search': [value: string]
}>()

const categories = [
  { value: 'all', label: 'projects.filterAll', icon: 'mdi-all-inclusive' },
  { value: 'frontend', label: 'projects.filterFrontend', icon: 'mdi-monitor' },
  { value: 'backend', label: 'projects.filterBackend', icon: 'mdi-server' },
  { value: 'fullstack', label: 'projects.filterFullstack', icon: 'mdi-layers' },
]
</script>
