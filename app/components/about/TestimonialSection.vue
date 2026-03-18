<template>
  <div class="testimonial-section">
    <div class="testimonial-header text-center mb-8">
      <v-chip color="primary" variant="elevated" size="small" class="mb-3">
        <v-icon start size="14">mdi-format-quote-open</v-icon>
        {{ t('testimonials.title') }}
      </v-chip>
      <h2 class="section-heading">{{ t('testimonials.heading') }}</h2>
      <p class="section-subheading">{{ t('testimonials.subtitle') }}</p>
    </div>

    <div class="text-center mb-6">
      <v-btn
        variant="tonal"
        color="primary"
        size="small"
        @click="showForm = !showForm"
      >
        <v-icon start>{{ showForm ? 'mdi-chevron-up' : 'mdi-plus' }}</v-icon>
        {{ showForm ? t('testimonials.close') : t('testimonials.leaveRecommendation') }}
      </v-btn>
    </div>

    <v-expand-transition>
      <v-card v-show="showForm" variant="outlined" class="testimonial-form-card mb-8 mx-auto" max-width="600">
        <v-card-text class="pa-5">
          <h4 class="text-subtitle-1 font-weight-bold mb-3">
            <v-icon start size="18" color="primary">mdi-pencil</v-icon>
            {{ t('testimonials.formTitle') }}
          </h4>
          <v-form ref="formRef" @submit.prevent="submitTestimonial">
            <v-row density="comfortable">
              <v-col cols="12" sm="6">
                <v-text-field
                  v-model="form.authorName"
                  :label="t('testimonials.yourName')"
                  density="compact"
                  variant="outlined"
                  :rules="[rules.required]"
                  prepend-inner-icon="mdi-account"
                  hide-details="auto"
                />
              </v-col>
              <v-col cols="12" sm="6">
                <v-text-field
                  v-model="form.authorEmail"
                  :label="t('testimonials.yourTitle')"
                  density="compact"
                  variant="outlined"
                  prepend-inner-icon="mdi-briefcase"
                  hide-details="auto"
                  :placeholder="t('testimonials.titlePlaceholder')"
                />
              </v-col>
            </v-row>

            <div class="d-flex align-center gap-2 my-3">
              <span class="text-caption font-weight-medium">{{ t('testimonials.rating') }}</span>
              <div class="rating-stars">
                <v-icon
                  v-for="star in 5"
                  :key="star"
                  size="20"
                  :color="star <= form.rating ? 'amber' : 'grey-lighten-1'"
                  class="rating-star-btn"
                  @click="form.rating = star"
                >
                  {{ star <= form.rating ? 'mdi-star' : 'mdi-star-outline' }}
                </v-icon>
              </div>
            </div>

            <v-textarea
              v-model="form.content"
              :label="t('testimonials.yourRecommendation')"
              density="compact"
              variant="outlined"
              rows="3"
              auto-grow
              :rules="[rules.required, rules.maxLength]"
              counter="500"
              hide-details="auto"
              :placeholder="t('testimonials.recommendationPlaceholder')"
            />

            <div class="d-flex justify-end mt-3">
              <v-btn
                type="submit"
                color="primary"
                size="small"
                variant="elevated"
                :loading="submitting"
                prepend-icon="mdi-send"
              >
                {{ t('testimonials.submit') }}
              </v-btn>
            </div>
          </v-form>
        </v-card-text>
      </v-card>
    </v-expand-transition>

    <v-row v-if="testimonials.length">
      <v-col
        v-for="(testimonial, index) in testimonials"
        :key="testimonial._id"
        cols="12"
        sm="6"
        md="4"
      >
        <AnimatedSection animation="fadeInUp" :delay="index * 100">
          <div class="testimonial-card">
            <div class="quote-icon">
              <v-icon size="24" color="primary">mdi-format-quote-open</v-icon>
            </div>
            <div class="testimonial-rating mb-3">
              <v-icon
                v-for="star in 5"
                :key="star"
                size="14"
                :color="star <= testimonial.rating ? 'amber' : 'grey-lighten-2'"
              >
                {{ star <= testimonial.rating ? 'mdi-star' : 'mdi-star-outline' }}
              </v-icon>
            </div>
            <p class="testimonial-text">"{{ testimonial.content }}"</p>
            <div class="testimonial-author">
              <v-avatar size="44" class="testimonial-avatar">
                <img
                  :src="`https://api.dicebear.com/7.x/initials/svg?seed=${testimonial.authorName}&backgroundColor=6366f1,8b5cf6,a855f7`"
                  :alt="testimonial.authorName"
                >
              </v-avatar>
              <div class="author-info">
                <span class="author-name">{{ testimonial.authorName }}</span>
                <span v-if="testimonial.authorEmail" class="author-title">{{ testimonial.authorEmail }}</span>
              </div>
            </div>
          </div>
        </AnimatedSection>
      </v-col>
    </v-row>

    <div v-else-if="!loading" class="text-center py-8">
      <v-icon size="56" color="primary" style="opacity: 0.2" class="mb-3">mdi-comment-quote</v-icon>
      <p class="text-body-2 text-medium-emphasis">{{ t('testimonials.empty') }}</p>
    </div>

    <v-snackbar v-model="snackbar" :color="snackbarColor" :timeout="3000">
      {{ snackbarText }}
    </v-snackbar>
  </div>
</template>

<script setup lang="ts">
interface TestimonialItem {
  _id: string
  authorName: string
  authorEmail?: string
  content: string
  rating: number
  section: string
  createdAt: string
}

const { t } = useI18n()

const formRef = ref()
const testimonials = ref<TestimonialItem[]>([])
const loading = ref(true)
const submitting = ref(false)
const showForm = ref(false)

const snackbar = ref(false)
const snackbarText = ref('')
const snackbarColor = ref('success')

const form = reactive({
  authorName: '',
  authorEmail: '',
  content: '',
  rating: 5,
})

const rules = {
  required: (v: string) => !!v || t('testimonials.required'),
  maxLength: (v: string) => (v?.length || 0) <= 500 || t('testimonials.maxChars'),
}

async function loadTestimonials() {
  loading.value = true
  try {
    const data = await $fetch<TestimonialItem[]>('/api/public/comments', {
      params: { section: 'testimonial' },
    })
    testimonials.value = data
  }
  catch {
    testimonials.value = []
  }
  finally {
    loading.value = false
  }
}

async function submitTestimonial() {
  const { valid } = await formRef.value?.validate()
  if (!valid) return

  submitting.value = true
  try {
    const newTestimonial = await $fetch<TestimonialItem>('/api/public/comments', {
      method: 'POST',
      body: {
        authorName: form.authorName,
        authorEmail: form.authorEmail || undefined,
        content: form.content,
        rating: form.rating,
        section: 'testimonial',
      },
    })
    testimonials.value.unshift(newTestimonial)
    form.content = ''
    form.rating = 5
    form.authorName = ''
    form.authorEmail = ''
    showForm.value = false
    formRef.value?.resetValidation()

    snackbarText.value = t('testimonials.success')
    snackbarColor.value = 'success'
    snackbar.value = true
  }
  catch {
    snackbarText.value = t('testimonials.error')
    snackbarColor.value = 'error'
    snackbar.value = true
  }
  finally {
    submitting.value = false
  }
}

onMounted(loadTestimonials)
</script>

<style scoped>
.testimonial-section {
  padding: 24px 0;
}

.section-heading {
  font-size: clamp(1.6rem, 4vw, 2.2rem);
  font-weight: 800;
  font-family: var(--font-heading);
  margin-bottom: 8px;
}

.section-subheading {
  font-size: 1rem;
  color: rgb(var(--v-theme-on-surface), 0.6);
  max-width: 500px;
  margin: 0 auto;
}

.testimonial-form-card {
  border-color: rgb(var(--v-theme-primary), 0.2) !important;
  border-radius: 16px !important;
}

.rating-stars {
  display: flex;
  gap: 2px;
}

.rating-star-btn {
  cursor: pointer;
  transition: transform 0.2s ease;
}

.rating-star-btn:hover {
  transform: scale(1.2);
}

.testimonial-card {
  position: relative;
  padding: 28px 24px 24px;
  border-radius: 20px;
  background: rgb(var(--v-theme-surface));
  border: 1px solid rgb(var(--v-theme-on-surface), 0.06);
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  height: 100%;
  display: flex;
  flex-direction: column;
}

.testimonial-card:hover {
  transform: translateY(-6px);
  border-color: rgb(var(--v-theme-primary), 0.2);
  box-shadow:
    0 20px 40px rgb(var(--v-theme-primary), 0.08),
    0 8px 16px rgba(0, 0, 0, 0.06);
}

.quote-icon {
  position: absolute;
  top: -12px;
  left: 20px;
  width: 32px;
  height: 32px;
  border-radius: 10px;
  background: rgb(var(--v-theme-primary), 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
}

.testimonial-rating {
  display: flex;
  gap: 1px;
}

.testimonial-text {
  font-size: 0.88rem;
  line-height: 1.7;
  color: rgb(var(--v-theme-on-surface), 0.75);
  font-style: italic;
  flex: 1;
  margin-bottom: 20px;
  display: -webkit-box;
  -webkit-line-clamp: 5;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.testimonial-author {
  display: flex;
  align-items: center;
  gap: 12px;
  padding-top: 16px;
  border-top: 1px solid rgb(var(--v-theme-on-surface), 0.06);
}

.testimonial-avatar {
  border: 2px solid rgb(var(--v-theme-primary), 0.2);
}

.author-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
}

.author-name {
  font-size: 0.88rem;
  font-weight: 700;
  color: rgb(var(--v-theme-on-surface));
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.author-title {
  font-size: 0.72rem;
  color: rgb(var(--v-theme-on-surface), 0.5);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
