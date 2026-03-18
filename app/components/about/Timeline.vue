<template>
    <div>
        <h3 class="text-h5 font-weight-bold mb-6">
            <v-icon start color="primary">mdi-timeline-clock</v-icon>
            {{ t("about.timelineTitle") }}
        </h3>

        <v-timeline side="end" density="comfortable">
            <v-timeline-item
                v-for="(entry, index) in sortedEntries"
                :key="index"
                :dot-color="getColor(entry.type)"
                :icon="entry.icon"
                size="small"
            >
                <template #opposite>
                    <span class="text-h6 font-weight-bold text-primary">{{
                        entry.year
                    }}</span>
                </template>

                <div
                    class="flip-card"
                    :class="{ flipped: flippedIndex === index }"
                    @click="
                        flippedIndex = flippedIndex === index ? null : index
                    "
                >
                    <div class="flip-card-inner">
                        <div class="flip-card-front">
                            <v-card variant="tonal" class="timeline-card pa-4">
                                <div class="timeline-card-header">
                                    <div class="flex-grow-1 min-w-0">
                                        <h4 class="timeline-title">
                                            {{ entry.title }}
                                        </h4>
                                        <div class="timeline-company mt-1">
                                            <v-icon size="12" class="mr-1"
                                                >mdi-office-building</v-icon
                                            >
                                            {{ entry.company }}
                                        </div>
                                    </div>
                                    <v-chip
                                        size="x-small"
                                        :color="getColor(entry.type)"
                                        variant="tonal"
                                        class="timeline-type-chip"
                                    >
                                        {{ entry.type }}
                                    </v-chip>
                                </div>
                                <div class="flip-hint mt-2">
                                    <v-icon size="12" class="mr-1"
                                        >mdi-rotate-3d-variant</v-icon
                                    >
                                    <span>{{ t("about.clickToFlip") }}</span>
                                </div>
                            </v-card>
                        </div>

                        <div class="flip-card-back">
                            <v-card
                                variant="tonal"
                                class="timeline-card timeline-card-back pa-4"
                            >
                                <div class="back-header">
                                    <v-icon
                                        size="16"
                                        color="primary"
                                        class="mr-1"
                                        >mdi-information</v-icon
                                    >
                                    <span
                                        class="text-caption font-weight-bold text-primary"
                                        >{{ entry.title }}</span
                                    >
                                </div>
                                <p
                                    v-if="entry.description"
                                    class="timeline-description mt-2 mb-0"
                                >
                                    {{ entry.description }}
                                </p>
                                <p
                                    v-else
                                    class="timeline-description mt-2 mb-0 text-medium-emphasis"
                                >
                                    {{ entry.title }} — {{ entry.company }} ({{
                                        entry.year
                                    }})
                                </p>
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
import type { TimelineEntry } from "~~/shared/types";

const { t } = useI18n();

const props = defineProps<{
    entries: TimelineEntry[];
}>();

const flippedIndex = ref<number | null>(null);

// Sort by year — oldest first (top), newest last (bottom)
const sortedEntries = computed(() => {
    return [...props.entries].sort((a, b) => {
        const yearA = parseInt(a.year) || 0;
        const yearB = parseInt(b.year) || 0;
        return yearA - yearB;
    });
});

function getColor(type: string) {
    switch (type) {
        case "work":
            return "primary";
        case "education":
            return "info";
        case "achievement":
            return "success";
        default:
            return "primary";
    }
}
</script>

<style scoped>
/* ── Flip Card ── */
.flip-card {
    perspective: 1200px;
    width: 100%;
    cursor: pointer;
}

.flip-card-inner {
    display: grid;
    transition: transform 0.7s cubic-bezier(0.4, 0, 0.2, 1);
    transform-style: preserve-3d;
}

.flip-card.flipped .flip-card-inner {
    transform: rotateX(-180deg);
}

/* Both faces overlap in the same grid cell — container grows to taller face */
.flip-card-front,
.flip-card-back {
    grid-area: 1 / 1;
    backface-visibility: hidden;
    -webkit-backface-visibility: hidden;
}

.flip-card-front {
    z-index: 2;
}

.flip-card-back {
    transform: rotateX(180deg);
    z-index: 1;
}

/* ── Timeline Card ── */
.timeline-card {
    border-radius: 12px !important;
    transition: box-shadow 0.3s ease;
    height: 100%;
    display: flex;
    flex-direction: column;
}

.timeline-card-back {
    background: rgb(var(--v-theme-primary), 0.06) !important;
    border: 1px solid rgb(var(--v-theme-primary), 0.18) !important;
}

.flip-card:hover .timeline-card {
    box-shadow: 0 4px 24px rgb(var(--v-theme-primary), 0.15);
}

.timeline-card-header {
    display: flex;
    align-items: flex-start;
    gap: 10px;
}

.timeline-title {
    font-size: 0.95rem;
    font-weight: 700;
    line-height: 1.3;
}

.timeline-company {
    font-size: 0.78rem;
    color: rgb(var(--v-theme-on-surface), 0.6);
    display: flex;
    align-items: center;
}

.timeline-type-chip {
    flex-shrink: 0;
    margin-top: 2px;
    text-transform: capitalize;
}

.min-w-0 {
    min-width: 0;
}

/* ── Flip hint ── */
.flip-hint {
    display: flex;
    align-items: center;
    font-size: 0.65rem;
    color: rgb(var(--v-theme-on-surface), 0.28);
    font-style: italic;
    margin-top: auto !important;
    padding-top: 4px;
}

/* ── Back card ── */
.back-header {
    display: flex;
    align-items: center;
}

.timeline-description {
    font-size: 0.84rem;
    line-height: 1.7;
    color: rgb(var(--v-theme-on-surface), 0.85);
    white-space: pre-line;
    flex: 1;
}

/* ── Responsive ── */
@media (max-width: 600px) {
    .timeline-title {
        font-size: 0.85rem;
    }

    .timeline-description {
        font-size: 0.78rem;
        line-height: 1.5;
    }
}
</style>
