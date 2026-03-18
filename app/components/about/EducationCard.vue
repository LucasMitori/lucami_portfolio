<template>
    <div>
        <h3 class="text-h5 font-weight-bold mb-6">
            <v-icon start color="primary">mdi-school</v-icon>
            {{ t("about.educationTitle") }}
        </h3>

        <v-timeline side="end" density="comfortable" line-color="primary">
            <v-timeline-item
                v-for="(edu, index) in sortedEducation"
                :key="index"
                :dot-color="
                    edu.status === 'in-progress' ? 'warning' : 'success'
                "
                size="small"
            >
                <template #opposite>
                    <v-chip
                        :color="
                            edu.status === 'in-progress' ? 'warning' : 'success'
                        "
                        variant="tonal"
                        size="small"
                        class="font-weight-bold"
                    >
                        <v-icon start size="12">mdi-calendar</v-icon>
                        {{ edu.period }}
                    </v-chip>
                </template>

                <div
                    class="flip-card"
                    :class="{ flipped: flippedIndex === index }"
                    @click="
                        flippedIndex = flippedIndex === index ? null : index
                    "
                >
                    <div class="flip-card-inner">
                        <div class="flip-card-face flip-card-front">
                            <v-card variant="tonal" class="edu-card pa-4">
                                <div class="edu-card-header">
                                    <h4
                                        class="edu-title"
                                        :title="edu.institution"
                                    >
                                        {{ edu.institution }}
                                    </h4>
                                    <v-chip
                                        :color="
                                            edu.status === 'in-progress'
                                                ? 'warning'
                                                : 'success'
                                        "
                                        size="x-small"
                                        variant="elevated"
                                        class="edu-status-chip"
                                    >
                                        {{
                                            edu.status === "in-progress"
                                                ? t("about.inProgress")
                                                : t("about.completed")
                                        }}
                                    </v-chip>
                                </div>
                                <p
                                    class="text-body-2 text-medium-emphasis mb-0 mt-2"
                                >
                                    <v-icon size="14" class="mr-1"
                                        >mdi-certificate</v-icon
                                    >
                                    {{ edu.degree }}
                                </p>
                                <div class="flip-hint mt-3">
                                    <v-icon size="12" class="mr-1"
                                        >mdi-rotate-3d-variant</v-icon
                                    >
                                    <span>{{
                                        t("about.clickToFlip") ||
                                        "Click to see details"
                                    }}</span>
                                </div>
                            </v-card>
                        </div>

                        <div class="flip-card-face flip-card-back">
                            <v-card
                                variant="tonal"
                                class="edu-card edu-card-back pa-4"
                            >
                                <div
                                    v-if="edu.description"
                                    class="edu-back-scroll"
                                >
                                    <p class="edu-description mb-0">
                                        {{ edu.description }}
                                    </p>
                                </div>
                                <div v-else class="edu-no-description">
                                    <v-icon
                                        size="28"
                                        color="primary"
                                        class="mb-2"
                                        >mdi-school-outline</v-icon
                                    >
                                    <p
                                        class="text-body-2 text-medium-emphasis mb-1"
                                    >
                                        {{ edu.degree }}
                                    </p>
                                    <p class="text-caption text-disabled mb-0">
                                        {{ edu.institution }} · {{ edu.period }}
                                    </p>
                                </div>
                                <div class="flip-hint mt-2">
                                    <v-icon size="12" class="mr-1"
                                        >mdi-rotate-3d-variant</v-icon
                                    >
                                    <span>{{
                                        t("about.clickToFlipBack")
                                    }}</span>
                                </div>
                            </v-card>
                        </div>
                    </div>
                </div>
            </v-timeline-item>
        </v-timeline>
    </div>
</template>

<script setup lang="ts">
import type { Education } from "~~/shared/types";

const { t } = useI18n();

const props = defineProps<{
    education: Education[];
}>();

const flippedIndex = ref<number | null>(null);

const sortedEducation = computed(() => {
    return [...props.education].sort((a, b) => {
        const yearA = extractStartYear(a.period);
        const yearB = extractStartYear(b.period);
        return yearA - yearB;
    });
});

function extractStartYear(period: string): number {
    const match = period.match(/(\d{4})/);
    return match ? parseInt(match[1]) : 0;
}
</script>

<style scoped>
/* ── Flip Card ── */
.flip-card {
    perspective: 1200px;
    width: 100%;
    min-width: 380px;
    cursor: pointer;
}

.flip-card-inner {
    display: grid;
    max-height: 250px;
    transition: transform 0.7s cubic-bezier(0.4, 0, 0.2, 1);
    transform-style: preserve-3d;
}

.flip-card.flipped .flip-card-inner {
    transform: rotateX(-180deg);
}

/* Both faces overlap in the same grid cell */
.flip-card-face {
    grid-area: 1 / 1;
    backface-visibility: hidden;
    -webkit-backface-visibility: hidden;
    max-height: 250px;
}

.flip-card-front {
    z-index: 2;
}

.flip-card-back {
    transform: rotateX(180deg);
    z-index: 1;
}

/* ── Card styling ── */
.edu-card {
    border-radius: var(--border-radius, 12px) !important;
    transition: box-shadow 0.3s ease;
    height: 100%;
    max-height: 400px;
    display: flex;
    flex-direction: column;
}

.flip-card:hover .edu-card {
    box-shadow: 0 4px 24px rgb(var(--v-theme-primary), 0.15);
}

.edu-card-back {
    background: rgb(var(--v-theme-primary), 0.06) !important;
    border: 1px solid rgb(var(--v-theme-primary), 0.18) !important;
}

/* ── Front header ── */
.edu-card-header {
    display: flex;
    align-items: flex-start;
    gap: 12px;
}

.edu-title {
    font-size: 0.95rem;
    font-weight: 700;
    line-height: 1.3;
    flex: 1;
    min-width: 0;
}

.edu-status-chip {
    flex-shrink: 0;
    margin-top: 2px;
}

/* ── Back scrollable area ── */
.edu-back-scroll {
    flex: 1;
    min-height: 0;
    overflow-y: auto;
    padding-right: 4px;

    /* Fade-out at the bottom when content overflows */
    mask-image: linear-gradient(
        to bottom,
        black 0%,
        black 85%,
        transparent 100%
    );
    -webkit-mask-image: linear-gradient(
        to bottom,
        black 0%,
        black 85%,
        transparent 100%
    );
}

.edu-description {
    font-size: 0.84rem;
    line-height: 1.7;
    color: rgb(var(--v-theme-on-surface), 0.85);
    white-space: pre-line;
}

.edu-no-description {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    padding: 8px 0;
}

/* ── Flip hint ── */
.flip-hint {
    display: flex;
    align-items: center;
    font-size: 0.65rem;
    color: rgb(var(--v-theme-on-surface), 0.28);
    font-style: italic;
    flex-shrink: 0;
    padding-top: 4px;
}

/* ── Responsive ── */
@media (max-width: 600px) {
    .flip-card {
        min-width: unset;
    }

    .flip-card-inner,
    .flip-card-face,
    .edu-card {
        max-height: 350px;
    }

    .edu-title {
        font-size: 0.85rem;
    }

    .edu-description {
        font-size: 0.78rem;
        line-height: 1.5;
    }
}
</style>
