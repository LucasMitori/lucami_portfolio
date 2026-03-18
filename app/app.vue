<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

<script setup lang="ts">
const { initTheme, themeClass } = useAppTheme()
const authStore = useAuthStore()
const settingsStore = useSettingsStore()

onMounted(async () => {
  await settingsStore.fetchSettings()
  initTheme()
  authStore.fetchMe().catch(() => {})
})

useHead({
  htmlAttrs: {
    class: themeClass,
  },
})
</script>
