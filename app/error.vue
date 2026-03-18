<template>
  <v-app>
    <v-container class="fill-height" fluid>
      <v-row align="center" justify="center">
        <v-col cols="12" sm="8" md="6" class="text-center">
          <div class="error-code mb-4">
            {{ error?.statusCode || 500 }}
          </div>
          <h1 class="text-h4 mb-4">
            {{ error?.statusCode === 404 ? t('common.notFound') : t('common.error') }}
          </h1>
          <p class="text-body-1 text-medium-emphasis mb-8">
            {{ error?.message || t('common.errorMessage') }}
          </p>
          <v-btn color="primary" size="large" @click="handleError">
            <v-icon start>mdi-home</v-icon>
            {{ t('nav.home') }}
          </v-btn>
        </v-col>
      </v-row>
    </v-container>
  </v-app>
</template>

<script setup lang="ts">
import type { NuxtError } from '#app'

const { t } = useI18n()

defineProps<{
  error: NuxtError
}>()

function handleError() {
  clearError({ redirect: '/' })
}
</script>

<style scoped>
.error-code {
  font-size: 8rem;
  font-weight: 800;
  font-family: var(--font-heading);
  opacity: 0.1;
  line-height: 1;
}
</style>
