<template>
  <v-container class="fill-height" fluid>
    <v-row align="center" justify="center">
      <v-col cols="12" sm="8" md="5" lg="4">
        <v-card class="pa-6" elevation="8">
          <div class="text-center mb-6">
            <v-icon size="64" color="primary">mdi-shield-crown</v-icon>
            <h1 class="text-h5 font-weight-bold mt-2">
              {{ isRegister ? t('admin.registerTitle') : t('admin.loginTitle') }}
            </h1>
          </div>

          <v-form ref="formRef" @submit.prevent="handleSubmit">
            <v-text-field
              v-if="isRegister"
              v-model="form.name"
              :label="t('admin.name')"
              prepend-inner-icon="mdi-account"
              :rules="[rules.required]"
              class="mb-3"
            />

            <v-text-field
              v-model="form.email"
              :label="t('admin.email')"
              type="email"
              prepend-inner-icon="mdi-email"
              :rules="[rules.required, rules.email]"
              class="mb-3"
            />

            <v-text-field
              v-model="form.password"
              :label="t('admin.password')"
              :type="showPassword ? 'text' : 'password'"
              prepend-inner-icon="mdi-lock"
              :append-inner-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'"
              :rules="[rules.required, rules.minLength]"
              class="mb-3"
              @click:append-inner="showPassword = !showPassword"
            />

            <v-text-field
              v-if="isRegister"
              v-model="form.confirmPassword"
              :label="t('admin.confirmPassword')"
              :type="showPassword ? 'text' : 'password'"
              prepend-inner-icon="mdi-lock-check"
              :rules="[rules.required, rules.passwordMatch]"
              class="mb-3"
            />

            <v-alert v-if="error" type="error" variant="tonal" class="mb-4" closable>
              {{ error }}
            </v-alert>

            <v-btn
              type="submit"
              color="primary"
              size="large"
              block
              :loading="loading"
            >
              {{ isRegister ? t('admin.registerBtn') : t('admin.loginBtn') }}
            </v-btn>
          </v-form>

          <div v-if="registrationEnabled" class="text-center mt-4">
            <v-btn variant="text" size="small" color="primary" @click="toggleMode">
              {{ isRegister ? t('admin.hasAccount') : t('admin.noAccount') }}
            </v-btn>
          </div>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
const { t } = useI18n()
const { login, register } = useAuth()

const showPassword = ref(false)
const loading = ref(false)
const error = ref('')
const formRef = ref()
const isRegister = ref(false)
const registrationEnabled = ref(true)

const form = reactive({
  email: '',
  password: '',
  confirmPassword: '',
  name: '',
})

const rules = {
  required: (v: string) => !!v || t('admin.fieldRequired'),
  email: (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) || t('admin.invalidEmail'),
  minLength: (v: string) => v.length >= 6 || t('admin.minPassword'),
  passwordMatch: (v: string) => v === form.password || t('admin.passwordMismatch'),
}

function toggleMode() {
  isRegister.value = !isRegister.value
  error.value = ''
  formRef.value?.resetValidation()
}

async function handleSubmit() {
  const { valid } = await formRef.value?.validate()
  if (!valid) return

  loading.value = true
  error.value = ''

  try {
    if (isRegister.value) {
      await register(form.email, form.password, form.name)
    } else {
      await login(form.email, form.password)
    }
  } catch (e: unknown) {
    error.value = (e as Error).message || t('admin.loginError')
  } finally {
    loading.value = false
  }
}

onMounted(async () => {
  try {
    const data = await $fetch<{ enabled: boolean }>('/api/public/registration-status')
    registrationEnabled.value = data.enabled
  } catch {
    registrationEnabled.value = true
  }
})
</script>
