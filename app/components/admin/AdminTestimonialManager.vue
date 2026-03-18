<template>
    <div class="admin-testimonial-manager">
        <v-progress-linear v-if="loading" indeterminate class="mb-4" />

        <v-alert
            v-if="!loading && testimonials.length === 0"
            type="info"
            variant="tonal"
            class="mb-4"
        >
            {{ t("testimonials.adminEmpty") }}
        </v-alert>

        <v-row v-if="testimonials.length">
            <v-col
                v-for="testimonial in testimonials"
                :key="testimonial._id"
                cols="12"
                sm="6"
                lg="4"
            >
                <v-card variant="outlined" class="testimonial-admin-card h-100">
                    <v-card-text class="pa-4">
                        <div class="d-flex align-center gap-3 mb-3">
                            <v-avatar
                                size="40"
                                class="testimonial-avatar-admin"
                            >
                                <img
                                    :src="`https://api.dicebear.com/7.x/initials/svg?seed=${testimonial.authorName}&backgroundColor=6366f1,8b5cf6,a855f7`"
                                    :alt="testimonial.authorName"
                                />
                            </v-avatar>
                            <div class="flex-grow-1 min-w-0">
                                <div
                                    class="font-weight-bold text-body-2 text-truncate"
                                >
                                    {{ testimonial.authorName }}
                                </div>
                                <div
                                    v-if="testimonial.authorEmail"
                                    class="text-caption text-medium-emphasis text-truncate"
                                >
                                    {{ testimonial.authorEmail }}
                                </div>
                            </div>
                        </div>

                        <div class="d-flex align-center gap-1 mb-2">
                            <v-icon
                                v-for="star in 5"
                                :key="star"
                                size="14"
                                :color="
                                    star <= testimonial.rating
                                        ? 'amber'
                                        : 'grey-lighten-1'
                                "
                            >
                                {{
                                    star <= testimonial.rating
                                        ? "mdi-star"
                                        : "mdi-star-outline"
                                }}
                            </v-icon>
                            <span class="text-caption text-medium-emphasis ml-1"
                                >{{ testimonial.rating }}/5</span
                            >
                        </div>

                        <p class="text-body-2 mb-3 testimonial-content-preview">
                            "{{ testimonial.content }}"
                        </p>

                        <div class="d-flex align-center justify-space-between">
                            <span class="text-caption text-medium-emphasis">
                                {{
                                    new Date(
                                        testimonial.createdAt,
                                    ).toLocaleDateString()
                                }}
                            </span>
                            <v-btn
                                icon="mdi-delete"
                                size="x-small"
                                color="error"
                                variant="text"
                                @click="confirmDelete(testimonial)"
                            />
                        </div>
                    </v-card-text>
                </v-card>
            </v-col>
        </v-row>

        <v-dialog v-model="deleteDialog" max-width="420">
            <v-card>
                <v-card-title class="d-flex align-center gap-2">
                    <v-icon color="error">mdi-alert-circle</v-icon>
                    Confirm Deletion
                </v-card-title>
                <v-card-text>
                    <p class="mb-2">
                        Are you sure you want to delete this testimonial?
                    </p>
                    <v-card
                        variant="tonal"
                        class="pa-3"
                        v-if="testimonialToDelete"
                    >
                        <div class="font-weight-bold text-body-2 mb-1">
                            {{ testimonialToDelete.authorName }}
                        </div>
                        <p class="text-caption text-medium-emphasis mb-0">
                            "{{ testimonialToDelete.content.substring(0, 100)
                            }}{{
                                testimonialToDelete.content.length > 100
                                    ? "..."
                                    : ""
                            }}"
                        </p>
                    </v-card>
                    <p class="text-caption text-error mt-2 mb-0">
                        This action cannot be undone.
                    </p>
                </v-card-text>
                <v-card-actions>
                    <v-spacer />
                    <v-btn variant="text" @click="deleteDialog = false"
                        >Cancel</v-btn
                    >
                    <v-btn
                        color="error"
                        variant="elevated"
                        :loading="deleting"
                        @click="executeDelete"
                    >
                        <v-icon start>mdi-delete</v-icon>
                        Delete
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

        <v-snackbar v-model="snackbar" :color="snackbarColor" :timeout="3000">
            {{ snackbarText }}
        </v-snackbar>
    </div>
</template>

<script setup lang="ts">
interface TestimonialItem {
    _id: string;
    authorName: string;
    authorEmail?: string;
    content: string;
    rating: number;
    section: string;
    createdAt: string;
}

const testimonials = ref<TestimonialItem[]>([]);
const loading = ref(true);
const deleting = ref(false);
const deleteDialog = ref(false);
const testimonialToDelete = ref<TestimonialItem | null>(null);

const snackbar = ref(false);
const snackbarText = ref("");
const snackbarColor = ref("success");

function showToast(message: string, color = "success") {
    snackbarText.value = message;
    snackbarColor.value = color;
    snackbar.value = true;
}

async function loadTestimonials() {
    loading.value = true;
    try {
        const allComments = await $fetch<TestimonialItem[]>(
            "/api/admin/comments",
        );
        testimonials.value = allComments.filter(
            (c) => c.section === "testimonial",
        );
    } catch {
        testimonials.value = [];
        showToast("Failed to load testimonials", "error");
    } finally {
        loading.value = false;
    }
}

function confirmDelete(testimonial: TestimonialItem) {
    testimonialToDelete.value = testimonial;
    deleteDialog.value = true;
}

async function executeDelete() {
    if (!testimonialToDelete.value) return;
    deleting.value = true;
    try {
        await $fetch(`/api/admin/comments/${testimonialToDelete.value._id}`, {
            method: "DELETE",
        });
        testimonials.value = testimonials.value.filter(
            (t) => t._id !== testimonialToDelete.value!._id,
        );
        deleteDialog.value = false;
        testimonialToDelete.value = null;
        showToast("Testimonial deleted successfully");
    } catch {
        showToast("Failed to delete testimonial", "error");
    } finally {
        deleting.value = false;
    }
}

onMounted(loadTestimonials);
</script>

<style scoped>
.testimonial-admin-card {
    border-radius: 16px !important;
    transition: all 0.2s ease;
}

.testimonial-admin-card:hover {
    border-color: rgb(var(--v-theme-primary), 0.3) !important;
}

.testimonial-avatar-admin {
    border: 2px solid rgb(var(--v-theme-primary), 0.2);
}

.testimonial-content-preview {
    font-style: italic;
    color: rgb(var(--v-theme-on-surface), 0.7);
    line-height: 1.6;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
}

.min-w-0 {
    min-width: 0;
}
</style>
