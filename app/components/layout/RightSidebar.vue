<template>
  <v-navigation-drawer
    :model-value="modelValue"
    location="right"
    temporary
    width="320"
    @update:model-value="$emit('update:modelValue', $event)"
  >
    <v-list-item class="pa-4">
      <v-list-item-title class="text-h6 font-weight-bold">
        <v-icon start>mdi-tune</v-icon>
        {{ t('common.settings') }}
      </v-list-item-title>
    </v-list-item>

    <v-divider />

    <div class="pa-4">
      <div class="text-subtitle-2 text-medium-emphasis mb-3">
        {{ t('common.theme') }}
      </div>
      <ThemeSelector />
    </div>

    <v-divider />

    <div class="pa-4">
      <div class="text-subtitle-2 text-medium-emphasis mb-3">
        <v-icon start size="small">mdi-music</v-icon>
        {{ t('common.music') }}
      </div>

      <div class="d-flex align-center gap-2 mb-3">
        <v-btn
          icon
          size="small"
          variant="text"
          @click="toggle()"
        >
          <v-icon>{{ isPlaying ? 'mdi-pause' : 'mdi-play' }}</v-icon>
        </v-btn>

        <v-slider
          :model-value="volume"
          :disabled="isMuted"
          min="0"
          max="1"
          step="0.01"
          hide-details
          density="compact"
          class="flex-grow-1"
          @update:model-value="setVolume($event as number)"
        />

        <v-btn
          icon
          size="small"
          variant="text"
          @click="toggleMute()"
        >
          <v-icon>{{ isMuted ? 'mdi-volume-off' : 'mdi-volume-high' }}</v-icon>
        </v-btn>
      </div>

      <v-switch
        v-model="typingSoundEnabled"
        :label="t('common.typingSound')"
        density="compact"
        hide-details
        color="primary"
      />
    </div>

    <v-divider />

    <div class="pa-4">
      <div class="text-subtitle-2 text-medium-emphasis mb-3">
        <v-icon start size="small">mdi-translate</v-icon>
        {{ t('common.language') }}
      </div>

      <v-btn-toggle
        :model-value="locale"
        mandatory
        density="comfortable"
        color="primary"
        class="w-100"
        @update:model-value="setLocale($event as string)"
      >
        <v-btn value="pt-BR" class="flex-grow-1">
          PT-BR
        </v-btn>
        <v-btn value="en" class="flex-grow-1">
          EN
        </v-btn>
      </v-btn-toggle>
    </div>

    <v-divider />

    <div class="pa-4">
      <v-btn
        block
        variant="tonal"
        color="primary"
        prepend-icon="mdi-compass"
        @click="startTour()"
      >
        {{ t('common.tour') }}
      </v-btn>
    </div>
  </v-navigation-drawer>
</template>

<script setup lang="ts">
const { t, locale, setLocale } = useI18n()
const { toggle, setVolume, toggleMute, isPlaying, volume, isMuted } = useMusic()
const { startTour } = useTour()
const musicStore = useMusicStore()

defineProps<{
  modelValue: boolean
}>()

defineEmits<{
  'update:modelValue': [value: boolean]
}>()

const typingSoundEnabled = computed({
  get: () => musicStore.typingSoundEnabled,
  set: (val: boolean) => { musicStore.typingSoundEnabled = val },
})
</script>
