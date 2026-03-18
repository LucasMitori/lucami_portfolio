<template>
  <div class="admin-dashboard">
    <Transition name="tab-fade" mode="out-in">
      <AdminOverview v-if="currentTab === 'overview'" key="overview" />
      <AdminThemeManager v-else-if="currentTab === 'themes'" key="themes" />
      <AdminSettingsPanel v-else-if="currentTab === 'settings'" key="settings" />
      <AdminArticleList v-else-if="currentTab === 'articles'" key="articles" />
      <AdminAboutEditor v-else-if="currentTab === 'about'" key="about" />
      <AdminMusicManager v-else-if="currentTab === 'music'" key="music" />
      <AdminVisitorChart v-else-if="currentTab === 'visitors'" key="visitors" />
      <AdminCommentManager v-else-if="currentTab === 'comments'" key="comments" />
      <AdminTestimonialManager v-else-if="currentTab === 'testimonials'" key="testimonials" />
      <AdminProjectManager v-else-if="currentTab === 'projects'" key="projects" />
      <AdminOverview v-else key="default" />
    </Transition>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'admin',
  middleware: 'auth',
})

const { t } = useI18n()
const route = useRoute()

useHead({ title: t('admin.dashboard') })

const currentTab = computed(() => route.query.tab?.toString() || 'overview')
</script>

<style scoped>
.tab-fade-enter-active,
.tab-fade-leave-active {
  transition: all 0.2s ease;
}

.tab-fade-enter-from {
  opacity: 0;
  transform: translateY(8px);
}

.tab-fade-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}
</style>
