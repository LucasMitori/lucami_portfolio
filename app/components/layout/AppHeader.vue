<template>
  <v-app-bar
    class="app-header"
    flat
    :color="scrolled ? undefined : 'transparent'"
    :elevation="scrolled ? 2 : 0"
    :style="{
      backdropFilter: scrolled ? 'blur(12px) saturate(1.5)' : 'none',
      transition: 'all 0.3s ease',
    }"
  >
    <v-app-bar-nav-icon @click="$emit('toggleLeftSidebar')">
      <v-icon>mdi-menu</v-icon>
    </v-app-bar-nav-icon>

    <v-toolbar-title class="font-weight-bold">
      <NuxtLink to="/" class="text-decoration-none" style="color: inherit">
        <span class="d-none d-sm-inline">Lucas Mitori</span>
        <span class="d-inline d-sm-none">LM</span>
      </NuxtLink>
    </v-toolbar-title>

    <v-spacer />

    <v-btn icon variant="text" @click="toggleLocale">
      <v-icon>mdi-translate</v-icon>
      <v-tooltip activator="parent" location="bottom">
        {{ locale === 'pt-BR' ? 'English' : 'Portugues' }}
      </v-tooltip>
    </v-btn>

    <v-btn icon variant="text" @click="$emit('toggleRightSidebar')">
      <v-icon>mdi-cog-outline</v-icon>
      <v-tooltip activator="parent" location="bottom">
        {{ t('common.settings') }}
      </v-tooltip>
    </v-btn>
  </v-app-bar>
</template>

<script setup lang="ts">
const { t, locale, setLocale } = useI18n()

defineEmits<{
  toggleLeftSidebar: []
  toggleRightSidebar: []
}>()

const scrolled = ref(false)

function toggleLocale() {
  setLocale(locale.value === 'pt-BR' ? 'en' : 'pt-BR')
}

onMounted(() => {
  window.addEventListener('scroll', onScroll, { passive: true })
})

onUnmounted(() => {
  window.removeEventListener('scroll', onScroll)
})

function onScroll() {
  scrolled.value = window.scrollY > 50
}
</script>

<style scoped>
.app-header {
  z-index: 1006 !important;
}

.app-header :deep(.v-toolbar__content) {
  max-width: 1400px;
  margin: 0 auto;
  width: 100%;
}
</style>
