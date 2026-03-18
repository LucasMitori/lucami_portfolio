<template>
    <div class="comment-section">
        <div class="comment-header">
            <v-icon size="20" color="primary" class="mr-2"
                >mdi-comment-text-multiple</v-icon
            >
            <span class="comment-title">{{ t("comments.title") }}</span>
            <v-chip
                v-if="comments.length"
                size="x-small"
                color="primary"
                variant="tonal"
                class="ml-2"
            >
                {{ comments.length }}
            </v-chip>
            <div class="comment-header-line" />
        </div>

        <div v-if="ratingData.totalRatings > 0" class="rating-summary mb-4">
            <div class="rating-big">{{ ratingData.averageRating }}</div>
            <div class="rating-details">
                <v-rating
                    :model-value="ratingData.averageRating"
                    density="compact"
                    size="small"
                    readonly
                    half-increments
                    color="amber"
                />
                <span class="text-caption text-medium-emphasis">
                    {{ ratingData.totalRatings }} {{ t("comments.ratings") }}
                </span>
            </div>
        </div>

        <v-card variant="outlined" class="mb-4 comment-form-card">
            <v-card-text class="pa-3">
                <v-form ref="formRef" @submit.prevent="submitComment">
                    <v-row density="comfortable">
                        <v-col cols="12" sm="6">
                            <v-text-field
                                v-model="form.authorName"
                                :label="t('comments.name')"
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
                                :label="t('comments.email')"
                                density="compact"
                                variant="outlined"
                                prepend-inner-icon="mdi-email"
                                hide-details="auto"
                            />
                        </v-col>
                    </v-row>

                    <div class="d-flex align-center gap-2 my-2">
                        <span class="text-caption font-weight-medium"
                            >{{ t("comments.yourRating") }}:</span
                        >
                        <v-rating
                            v-model="form.rating"
                            density="compact"
                            size="small"
                            color="amber"
                            active-color="amber"
                            hover
                        />
                    </div>

                    <v-textarea
                        v-model="form.content"
                        :label="t('comments.writeComment')"
                        density="compact"
                        variant="outlined"
                        rows="2"
                        auto-grow
                        :rules="[rules.required, rules.maxLength]"
                        counter="1000"
                        hide-details="auto"
                    />

                    <div class="d-flex justify-end mt-2">
                        <v-btn
                            type="submit"
                            color="primary"
                            size="small"
                            variant="elevated"
                            :loading="submitting"
                            prepend-icon="mdi-send"
                        >
                            {{ t("comments.submit") }}
                        </v-btn>
                    </div>
                </v-form>
            </v-card-text>
        </v-card>

        <TransitionGroup name="comment-list" tag="div" class="comments-list">
            <div
                v-for="comment in comments"
                :key="comment._id"
                class="comment-item"
            >
                <div class="comment-avatar">
                    {{ comment.authorName.charAt(0).toUpperCase() }}
                </div>
                <div class="comment-body">
                    <div class="comment-meta">
                        <span class="comment-author">{{
                            comment.authorName
                        }}</span>
                        <v-rating
                            :model-value="comment.rating"
                            density="compact"
                            size="x-small"
                            readonly
                            color="amber"
                        />
                        <span class="comment-date">{{
                            timeAgo(comment.createdAt)
                        }}</span>
                    </div>
                    <p class="comment-text">{{ comment.content }}</p>
                </div>
            </div>
        </TransitionGroup>

        <div v-if="!loading && comments.length === 0" class="text-center py-4">
            <v-icon size="40" color="primary" class="mb-2" style="opacity: 0.3"
                >mdi-comment-outline</v-icon
            >
            <p class="text-caption text-medium-emphasis">
                {{ t("comments.beFirst") }}
            </p>
        </div>

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
    createdAt: string;
}

interface RatingData {
    averageRating: number;
    totalRatings: number;
}

const props = defineProps<{
    section: string;
    targetId?: string;
}>();

const { t } = useI18n();

const formRef = ref();
const comments = ref<CommentItem[]>([]);
const loading = ref(true);
const submitting = ref(false);
const ratingData = ref<RatingData>({ averageRating: 0, totalRatings: 0 });

const snackbar = ref(false);
const snackbarText = ref("");
const snackbarColor = ref("success");

const form = reactive({
    authorName: "",
    authorEmail: "",
    content: "",
    rating: 5,
});

const rules = {
    required: (v: string) => !!v || t("comments.required"),
    maxLength: (v: string) =>
        (v?.length || 0) <= 1000 || t("comments.maxLength"),
};

function timeAgo(dateStr: string) {
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return t("comments.justNow");
    if (mins < 60) return `${mins}m`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours}h`;
    const days = Math.floor(hours / 24);
    if (days < 30) return `${days}d`;
    return `${Math.floor(days / 30)}mo`;
}

async function loadComments() {
    loading.value = true;
    try {
        const params: Record<string, string> = { section: props.section };
        if (props.targetId) params.targetId = props.targetId;

        const [commentsData, ratingsData] = await Promise.all([
            $fetch<CommentItem[]>("/api/public/comments", { params }),
            $fetch<RatingData>("/api/public/ratings", { params }),
        ]);
        comments.value = commentsData;
        ratingData.value = ratingsData;
    } catch {
        comments.value = [];
    } finally {
        loading.value = false;
    }
}

async function submitComment() {
    const { valid } = await formRef.value?.validate();
    if (!valid) return;

    submitting.value = true;
    try {
        const newComment = await $fetch<CommentItem>("/api/public/comments", {
            method: "POST",
            body: {
                authorName: form.authorName,
                authorEmail: form.authorEmail || undefined,
                content: form.content,
                rating: form.rating,
                section: props.section,
                targetId: props.targetId,
            },
        });
        comments.value.unshift(newComment);
        ratingData.value.totalRatings++;
        ratingData.value.averageRating =
            Math.round(
                ((ratingData.value.averageRating *
                    (ratingData.value.totalRatings - 1) +
                    form.rating) /
                    ratingData.value.totalRatings) *
                    10,
            ) / 10;

        form.content = "";
        form.rating = 5;
        formRef.value?.resetValidation();

        snackbarText.value = t("comments.success");
        snackbarColor.value = "success";
        snackbar.value = true;
    } catch {
        snackbarText.value = t("comments.error");
        snackbarColor.value = "error";
        snackbar.value = true;
    } finally {
        submitting.value = false;
    }
}

onMounted(loadComments);
</script>

<style scoped>
.comment-section {
    padding: 24px 0;
}

.comment-header {
    display: flex;
    align-items: center;
    margin-bottom: 16px;
}

.comment-title {
    font-size: 0.85rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 1.5px;
    color: rgb(var(--v-theme-on-surface), 0.7);
}

.comment-header-line {
    flex: 1;
    height: 1px;
    background: linear-gradient(
        90deg,
        rgb(var(--v-theme-primary), 0.3),
        transparent
    );
    margin-left: 12px;
}

.rating-summary {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 12px 16px;
    border-radius: 12px;
    background: rgb(var(--v-theme-primary), 0.05);
    border: 1px solid rgb(var(--v-theme-primary), 0.1);
}

.rating-big {
    font-size: 2rem;
    font-weight: 900;
    font-family: var(--font-heading);
    color: rgb(var(--v-theme-primary));
}

.rating-details {
    display: flex;
    flex-direction: column;
    gap: 2px;
}

.comment-form-card {
    border-color: rgb(var(--v-theme-primary), 0.15) !important;
}

.comments-list {
    display: flex;
    flex-direction: column;
    gap: 12px;
}

.comment-item {
    display: flex;
    gap: 12px;
    padding: 12px;
    border-radius: 12px;
    background: rgb(var(--v-theme-surface));
    border: 1px solid rgb(var(--v-theme-on-surface), 0.06);
    transition: all 0.2s ease;
}

.comment-item:hover {
    border-color: rgb(var(--v-theme-primary), 0.15);
}

.comment-avatar {
    width: 36px;
    height: 36px;
    border-radius: 50%;
    background: linear-gradient(
        135deg,
        rgb(var(--v-theme-primary)),
        rgb(var(--v-theme-secondary))
    );
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 700;
    font-size: 0.8rem;
    color: white;
    flex-shrink: 0;
}

.comment-body {
    flex: 1;
    min-width: 0;
}

.comment-meta {
    display: flex;
    align-items: center;
    gap: 8px;
    flex-wrap: wrap;
    margin-bottom: 4px;
}

.comment-author {
    font-weight: 700;
    font-size: 0.8rem;
}

.comment-date {
    font-size: 0.65rem;
    color: rgb(var(--v-theme-on-surface), 0.4);
    margin-left: auto;
}

.comment-text {
    font-size: 0.82rem;
    line-height: 1.5;
    color: rgb(var(--v-theme-on-surface), 0.75);
    margin: 0;
    word-break: break-word;
}

.comment-list-enter-active {
    transition: all 0.3s ease;
}

.comment-list-enter-from {
    opacity: 0;
    transform: translateY(-10px);
}

/* Fix rating star styling across all themes */
.comment-section :deep(.v-rating) .v-btn::before,
.comment-section :deep(.v-rating) .v-btn::after {
    content: none !important;
}

.comment-section
    :deep(.v-rating .v-rating__wrapper > span:not(.v-rating__item)) {
    display: none !important;
}

.comment-section :deep(.v-rating__wrapper) {
    gap: 0 !important;
}

/* Hide any stray text nodes in rating */
.comment-section :deep(.v-rating__wrapper > .v-btn + span),
.comment-section :deep(.v-rating > span:first-child) {
    display: none !important;
    font-size: 0 !important;
}

/* Remove borders from rating star buttons in all themes (especially retro) */
.comment-section :deep(.v-rating .v-btn) {
    border: none !important;
    outline: none !important;
    box-shadow: none !important;
    background: transparent !important;
}

.comment-section :deep(.v-rating .v-btn--variant-outlined) {
    border: none !important;
}

.comment-section :deep(.v-rating .v-btn .v-btn__overlay),
.comment-section :deep(.v-rating .v-btn .v-btn__underlay) {
    display: none !important;
}
</style>
