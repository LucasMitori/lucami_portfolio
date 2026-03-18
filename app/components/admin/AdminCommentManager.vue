<template>
    <div>
        <v-progress-linear v-if="loading" indeterminate class="mb-4" />

        <v-alert
            v-if="!loading && comments.length === 0"
            type="info"
            variant="tonal"
            class="mb-4"
        >
            No comments yet.
        </v-alert>

        <v-card
            v-for="comment in comments"
            :key="comment._id"
            class="mb-3"
            variant="outlined"
        >
            <v-card-text>
                <div class="d-flex align-center justify-space-between mb-2">
                    <div class="d-flex align-center gap-2">
                        <v-avatar size="32" color="primary" variant="tonal">
                            <span class="text-caption font-weight-bold">{{
                                comment.authorName.charAt(0).toUpperCase()
                            }}</span>
                        </v-avatar>
                        <div>
                            <span class="font-weight-bold text-body-2">{{
                                comment.authorName
                            }}</span>
                            <span
                                v-if="comment.authorEmail"
                                class="text-caption text-medium-emphasis ml-2"
                                >{{ comment.authorEmail }}</span
                            >
                        </div>
                    </div>
                    <div class="d-flex align-center gap-2">
                        <v-chip
                            size="x-small"
                            :color="sectionColor(comment.section)"
                            variant="tonal"
                        >
                            {{ comment.section }}
                        </v-chip>
                        <div class="admin-rating-display">
                            <v-icon
                                v-for="star in 5"
                                :key="star"
                                size="14"
                                :color="
                                    star <= comment.rating
                                        ? 'amber'
                                        : 'grey-lighten-1'
                                "
                            >
                                {{
                                    star <= comment.rating
                                        ? "mdi-star"
                                        : "mdi-star-outline"
                                }}
                            </v-icon>
                        </div>
                    </div>
                </div>
                <p class="text-body-2 mb-2">{{ comment.content }}</p>
                <div class="d-flex align-center justify-space-between">
                    <span class="text-caption text-medium-emphasis">
                        {{ new Date(comment.createdAt).toLocaleDateString() }}
                        <span v-if="comment.targetId" class="ml-2">
                            <v-chip size="x-small" variant="outlined">{{
                                comment.targetId
                            }}</v-chip>
                        </span>
                    </span>
                    <v-btn
                        icon="mdi-delete"
                        size="x-small"
                        color="error"
                        variant="text"
                        @click="confirmDelete(comment)"
                    />
                </div>
            </v-card-text>
        </v-card>

        <v-dialog v-model="deleteDialog" max-width="420">
            <v-card>
                <v-card-title class="d-flex align-center gap-2">
                    <v-icon color="error">mdi-alert-circle</v-icon>
                    Confirm Deletion
                </v-card-title>
                <v-card-text>
                    <p class="mb-2">
                        Are you sure you want to delete this comment?
                    </p>
                    <v-card variant="tonal" class="pa-3" v-if="commentToDelete">
                        <div class="font-weight-bold text-body-2 mb-1">
                            {{ commentToDelete.authorName }}
                        </div>
                        <p class="text-caption text-medium-emphasis mb-0">
                            "{{ commentToDelete.content.substring(0, 100)
                            }}{{
                                commentToDelete.content.length > 100
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
                        :loading="deleting === commentToDelete?._id"
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
interface CommentItem {
    _id: string;
    authorName: string;
    authorEmail?: string;
    content: string;
    rating: number;
    section: string;
    targetId?: string;
    createdAt: string;
}

const comments = ref<CommentItem[]>([]);
const loading = ref(true);
const deleting = ref<string | null>(null);
const deleteDialog = ref(false);
const commentToDelete = ref<CommentItem | null>(null);

const snackbar = ref(false);
const snackbarText = ref("");
const snackbarColor = ref("success");

function showToast(message: string, color = "success") {
    snackbarText.value = message;
    snackbarColor.value = color;
    snackbar.value = true;
}

function sectionColor(section: string) {
    const colors: Record<string, string> = {
        games: "purple",
        projects: "blue",
        project: "blue",
        articles: "green",
        general: "grey",
        testimonial: "amber",
    };
    return colors[section] || "grey";
}

async function loadComments() {
    loading.value = true;
    try {
        const allComments = await $fetch<CommentItem[]>("/api/admin/comments");
        // Filter out testimonials — those have their own manager
        comments.value = allComments.filter((c) => c.section !== "testimonial");
    } catch {
        comments.value = [];
        showToast("Failed to load comments", "error");
    } finally {
        loading.value = false;
    }
}

function confirmDelete(comment: CommentItem) {
    commentToDelete.value = comment;
    deleteDialog.value = true;
}

async function executeDelete() {
    if (!commentToDelete.value) return;
    const id = commentToDelete.value._id;
    deleting.value = id;
    try {
        await $fetch(`/api/admin/comments/${id}`, { method: "DELETE" });
        comments.value = comments.value.filter((c) => c._id !== id);
        deleteDialog.value = false;
        commentToDelete.value = null;
        showToast("Comment deleted successfully");
    } catch {
        showToast("Failed to delete comment", "error");
    } finally {
        deleting.value = null;
    }
}

onMounted(loadComments);
</script>

<style scoped>
.admin-rating-display {
    display: inline-flex;
    gap: 1px;
    align-items: center;
}
</style>
