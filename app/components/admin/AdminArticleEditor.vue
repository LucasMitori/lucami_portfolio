<template>
  <v-dialog
    :model-value="modelValue"
    max-width="800"
    persistent
    scrollable
    @update:model-value="$emit('update:modelValue', $event)"
  >
    <v-card>
      <v-card-title class="d-flex align-center">
        <v-icon start :icon="isEditing ? 'mdi-pencil' : 'mdi-plus'" />
        {{ isEditing ? 'Edit Article' : 'New Article' }}
        <v-spacer />
        <v-btn icon="mdi-close" variant="text" size="small" @click="close" />
      </v-card-title>

      <v-divider />

      <v-card-text class="pa-4">
        <v-form ref="formRef" @submit.prevent="save">
          <v-text-field
            v-model="form.title"
            label="Title"
            variant="outlined"
            :rules="[rules.required]"
            class="mb-2"
            @update:model-value="autoGenerateSlug"
          />

          <v-text-field
            v-model="form.slug"
            label="Slug"
            variant="outlined"
            :rules="[rules.required]"
            hint="Auto-generated from title. You can edit manually."
            persistent-hint
            class="mb-2"
          />

          <v-textarea
            v-model="form.excerpt"
            label="Excerpt"
            variant="outlined"
            rows="2"
            :rules="[rules.required]"
            class="mb-2"
          />

          <v-text-field
            v-model="form.coverImage"
            label="Cover Image URL"
            variant="outlined"
            prepend-inner-icon="mdi-image"
            class="mb-2"
          />

          <v-img
            v-if="form.coverImage"
            :src="form.coverImage"
            max-height="120"
            max-width="200"
            rounded="lg"
            cover
            class="mb-4 border"
          >
            <template #error>
              <v-sheet
                class="d-flex align-center justify-center fill-height text-caption text-medium-emphasis"
                color="surface-variant"
                rounded="lg"
              >
                <v-icon icon="mdi-image-broken" class="mr-1" size="small" />
                Invalid image URL
              </v-sheet>
            </template>
          </v-img>

          <v-combobox
            v-model="form.tags"
            label="Tags"
            variant="outlined"
            multiple
            chips
            closable-chips
            hint="Press Enter to add a tag"
            persistent-hint
            class="mb-2"
          />

          <div class="mb-2">
            <label class="text-caption text-medium-emphasis d-block mb-1">Content</label>
            <RichTextEditor
              v-model="form.content"
              placeholder="Write your article content here..."
            />
            <div v-if="contentError" class="text-error text-caption mt-1">
              {{ contentError }}
            </div>
          </div>

          <v-switch
            v-model="form.published"
            label="Published"
            color="success"
            hide-details
          />
        </v-form>
      </v-card-text>

      <v-divider />

      <v-card-actions class="pa-4">
        <v-spacer />
        <v-btn variant="text" @click="close">
          Cancel
        </v-btn>
        <v-btn
          color="primary"
          variant="elevated"
          :loading="saving"
          @click="save"
        >
          <v-icon start icon="mdi-content-save" />
          {{ isEditing ? 'Update' : 'Create' }}
        </v-btn>
      </v-card-actions>

      <v-alert v-if="saveError" type="error" class="mx-4 mb-4" closable>
        {{ saveError }}
      </v-alert>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import type { Article, ArticleCreatePayload, ArticleUpdatePayload } from '~~/shared/types'

interface Props {
  article: Article | null
  modelValue: boolean
}

const props = defineProps<Props>()

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  'saved': []
}>()

const rules = {
  required: (v: string) => !!v || 'This field is required',
}

const formRef = ref()
const saving = ref(false)
const saveError = ref<string | null>(null)
const slugManuallyEdited = ref(false)
const contentError = ref<string | null>(null)

const form = ref({
  title: '',
  slug: '',
  excerpt: '',
  coverImage: '',
  tags: [] as string[],
  content: '',
  published: false,
})

const isEditing = computed(() => !!props.article)

watch(() => props.modelValue, (open) => {
  if (open) {
    slugManuallyEdited.value = false
    saveError.value = null
    if (props.article) {
      form.value = {
        title: props.article.title,
        slug: props.article.slug,
        excerpt: props.article.excerpt,
        coverImage: props.article.coverImage,
        tags: [...props.article.tags],
        content: props.article.content,
        published: props.article.published,
      }
      slugManuallyEdited.value = true
    } else {
      form.value = {
        title: '',
        slug: '',
        excerpt: '',
        coverImage: '',
        tags: [],
        content: '',
        published: false,
      }
    }
  }
})

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

function autoGenerateSlug(title: string | null) {
  if (!slugManuallyEdited.value && title) {
    form.value.slug = generateSlug(title)
  }
}

function close() {
  emit('update:modelValue', false)
}

async function save() {
  const { valid } = await formRef.value.validate()

  contentError.value = null
  const strippedContent = form.value.content.replace(/<[^>]*>/g, '').trim()
  if (!strippedContent) {
    contentError.value = 'This field is required'
  }

  if (!valid || contentError.value) return

  saving.value = true
  saveError.value = null

  try {
    if (isEditing.value && props.article) {
      const payload: ArticleUpdatePayload = {
        title: form.value.title,
        slug: form.value.slug,
        excerpt: form.value.excerpt,
        coverImage: form.value.coverImage,
        tags: form.value.tags,
        content: form.value.content,
        published: form.value.published,
      }
      await $fetch(`/api/admin/articles/${props.article._id}`, {
        method: 'PUT',
        body: payload,
      })
    } else {
      const payload: ArticleCreatePayload = {
        title: form.value.title,
        excerpt: form.value.excerpt,
        coverImage: form.value.coverImage,
        tags: form.value.tags,
        content: form.value.content,
        published: form.value.published,
      }
      await $fetch('/api/admin/articles', {
        method: 'POST',
        body: payload,
      })
    }
    emit('saved')
    close()
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to save article'
    saveError.value = message
  } finally {
    saving.value = false
  }
}
</script>
