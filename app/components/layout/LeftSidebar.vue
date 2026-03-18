<template>
  <v-navigation-drawer
    :model-value="modelValue"
    temporary
    @update:model-value="$emit('update:modelValue', $event)"
  >
    <v-list-item class="pa-4">
      <template #prepend>
        <v-avatar color="primary" size="48">
          <span class="text-h6 font-weight-bold">LM</span>
        </v-avatar>
      </template>
      <v-list-item-title class="text-h6 font-weight-bold">
        Lucas Mitori
      </v-list-item-title>
      <v-list-item-subtitle>
        {{ t('home.heroSubtitleStatic') }}
      </v-list-item-subtitle>
    </v-list-item>

    <v-divider />

    <v-list density="comfortable" nav>
      <v-list-item
        v-for="item in navItems"
        :key="item.to"
        :to="localePath(item.to)"
        :prepend-icon="item.icon"
        :title="t(item.title)"
        exact
      />
    </v-list>

    <template #append>
      <v-divider />
      <v-list density="compact" nav>
        <v-list-item
          v-if="isAuthenticated"
          to="/admin"
          prepend-icon="mdi-shield-crown"
          :title="t('nav.admin')"
          color="primary"
        />
        <v-list-item
          v-else
          to="/admin/login"
          prepend-icon="mdi-login"
          :title="t('admin.loginTitle')"
        />
      </v-list>
    </template>
  </v-navigation-drawer>
</template>

<script setup lang="ts">
const { t } = useI18n()
const localePath = useLocalePath()
const { isAuthenticated } = useAuth()

defineProps<{
  modelValue: boolean
}>()

defineEmits<{
  'update:modelValue': [value: boolean]
}>()

const navItems = [
  { to: '/', icon: 'mdi-home', title: 'nav.home' },
  { to: '/about', icon: 'mdi-account', title: 'nav.about' },
  { to: '/projects', icon: 'mdi-code-braces', title: 'nav.projects' },
  { to: '/articles', icon: 'mdi-newspaper', title: 'nav.articles' },
]
</script>
