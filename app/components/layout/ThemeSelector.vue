<template>
  <div class="theme-selector">
    <v-row class="g-1">
      <v-col
        v-for="theme in themes"
        :key="theme.slug"
        cols="6"
      >
        <v-card
          :variant="currentSlug === theme.slug ? 'outlined' : 'flat'"
          :color="currentSlug === theme.slug ? 'primary' : undefined"
          class="theme-preview-card cursor-pointer"
          :class="{ 'active-theme': currentSlug === theme.slug }"
          @click="applyTheme(theme.slug)"
        >
          <div
            class="theme-preview"
            :style="{
              background: theme.colors.background,
              borderTop: `3px solid ${theme.colors.primary}`,
            }"
          >
            <div class="d-flex gap-1 pa-2">
              <div
                v-for="color in [theme.colors.primary, theme.colors.secondary, theme.colors.accent]"
                :key="color"
                class="color-dot"
                :style="{ background: color }"
              />
            </div>
            <div class="pa-2 pt-0">
              <div
                class="text-caption font-weight-bold"
                :style="{ color: theme.colors.onBackground, fontFamily: theme.fonts.heading }"
              >
                Aa
              </div>
            </div>
          </div>
          <v-card-text class="pa-2 text-center text-caption">
            {{ t(`themes.${theme.slug}`) }}
            <v-icon
              v-if="currentSlug === theme.slug"
              size="x-small"
              color="primary"
              class="ml-1"
            >
              mdi-check-circle
            </v-icon>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script setup lang="ts">
import type { ThemeSlug } from '~~/shared/types'

const { t } = useI18n()
const { applyTheme, currentSlug } = useAppTheme()

const themes = [
  {
    slug: 'default' as ThemeSlug,
    colors: { primary: '#6C63FF', secondary: '#2EC4B6', accent: '#FF6B6B', background: '#FAFAFA', onBackground: '#1A1A2E' },
    fonts: { heading: 'Inter, sans-serif' },
  },
  {
    slug: 'nerd' as ThemeSlug,
    colors: { primary: '#00F0FF', secondary: '#FF00FF', accent: '#FFE600', background: '#0D0221', onBackground: '#E0E0FF' },
    fonts: { heading: 'Orbitron, sans-serif' },
  },
  {
    slug: 'retro' as ThemeSlug,
    colors: { primary: '#8B4513', secondary: '#D2691E', accent: '#CD853F', background: '#F5E6D3', onBackground: '#3E2723' },
    fonts: { heading: 'Special Elite, cursive' },
  },
  {
    slug: 'coding' as ThemeSlug,
    colors: { primary: '#00FF41', secondary: '#008F11', accent: '#00FF41', background: '#0A0A0A', onBackground: '#00FF41' },
    fonts: { heading: 'Fira Code, monospace' },
  },
]
</script>

<style scoped>
.theme-preview-card {
  transition: all 0.2s ease;
  overflow: hidden;
}

.theme-preview-card:hover {
  transform: scale(1.03);
}

.active-theme {
  border: 2px solid rgb(var(--v-theme-primary)) !important;
}

.theme-preview {
  min-height: 50px;
}

.color-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
}

.cursor-pointer {
  cursor: pointer;
}
</style>
