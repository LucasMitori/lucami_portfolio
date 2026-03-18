<template>
  <div class="music-player">
    <v-btn
      icon
      size="large"
      :color="isPlaying ? 'primary' : undefined"
      elevation="4"
      class="music-fab"
      @click="toggle()"
    >
      <v-icon>{{ isPlaying ? 'mdi-music-note' : 'mdi-music-note-off' }}</v-icon>
      <v-tooltip activator="parent" location="left">
        {{ isPlaying ? t('common.pauseMusic') : t('common.playMusic') }}
      </v-tooltip>
    </v-btn>
  </div>
</template>

<script setup lang="ts">
const { t } = useI18n()
const { toggle, isPlaying } = useMusic()
</script>

<style scoped>
.music-player {
  position: fixed;
  bottom: 24px;
  right: 24px;
  z-index: 1000;
}

.music-fab {
  animation: pulse-subtle 2s ease-in-out infinite;
}

@keyframes pulse-subtle {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
}
</style>
