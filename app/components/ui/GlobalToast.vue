<template>
  <v-snackbar
    v-model="toastState.show"
    :color="toastState.color"
    :timeout="toastState.timeout"
    location="bottom right"
    rounded="lg"
  >
    <div class="d-flex align-center gap-2">
      <v-icon size="18">{{ iconForColor }}</v-icon>
      {{ toastState.message }}
    </div>
  </v-snackbar>
</template>

<script setup lang="ts">
const { state: toastState } = useToast()

const iconForColor = computed(() => {
  switch (toastState.color) {
    case 'success': return 'mdi-check-circle'
    case 'error': return 'mdi-alert-circle'
    case 'info': return 'mdi-information'
    case 'warning': return 'mdi-alert'
    default: return 'mdi-check-circle'
  }
})
</script>
