<template>
  <div>
    <h3 class="text-h5 font-weight-bold mb-2">
      <v-icon start color="primary">mdi-lightbulb-on</v-icon>
      {{ t('about.philosophy') }}
    </h3>
    <p class="text-body-2 text-medium-emphasis mb-6">{{ t('about.philosophySub') }}</p>

    <v-row>
      <v-col
        v-for="principle in principles"
        :key="principle.titleKey"
        cols="12"
        sm="6"
      >
        <v-card
          variant="outlined"
          class="philosophy-card pa-5 h-100"
          rounded="lg"
        >
          <div class="philosophy-icon-wrap mb-4">
            <v-icon :icon="principle.icon" size="32" color="primary" />
          </div>
          <h4 class="text-subtitle-1 font-weight-bold mb-2">
            {{ t(principle.titleKey) }}
          </h4>
          <p class="text-body-2 text-medium-emphasis mb-0">
            {{ t(principle.descKey) }}
          </p>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script setup lang="ts">
const { t } = useI18n()

const principles = [
  { icon: 'mdi-broom', titleKey: 'about.cleanCode', descKey: 'about.cleanCodeDesc' },
  { icon: 'mdi-speedometer', titleKey: 'about.performance', descKey: 'about.performanceDesc' },
  { icon: 'mdi-account-heart', titleKey: 'about.userFirst', descKey: 'about.userFirstDesc' },
  { icon: 'mdi-school', titleKey: 'about.continuousLearning', descKey: 'about.continuousLearningDesc' },
]
</script>

<style scoped>
.philosophy-card {
  border-color: rgb(var(--v-theme-on-surface), 0.1);
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  cursor: default;
}

.philosophy-card:hover {
  transform: translateY(-4px);
  border-color: rgb(var(--v-theme-primary), 0.4);
  box-shadow: 0 12px 32px rgb(var(--v-theme-primary), 0.1);
}

.philosophy-card:hover .philosophy-icon-wrap {
  background: rgb(var(--v-theme-primary), 0.15);
  transform: scale(1.05);
}

.philosophy-icon-wrap {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 56px;
  height: 56px;
  border-radius: 12px;
  background: rgb(var(--v-theme-primary), 0.08);
  transition: all 0.3s ease;
}
</style>
