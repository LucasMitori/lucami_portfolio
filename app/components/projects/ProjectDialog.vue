<template>
    <v-dialog
        :model-value="!!project"
        max-width="900"
        scrollable
        @update:model-value="$emit('close')"
    >
        <v-card v-if="project">
            <v-toolbar flat>
                <v-toolbar-title>
                    <v-icon start>mdi-source-repository</v-icon>
                    {{ project.name }}
                </v-toolbar-title>
                <template #append>
                    <v-btn
                        :href="project.html_url"
                        target="_blank"
                        variant="text"
                        icon
                    >
                        <v-icon>mdi-github</v-icon>
                    </v-btn>
                    <v-btn
                        v-if="project.homepage"
                        :href="project.homepage"
                        target="_blank"
                        variant="text"
                        icon
                    >
                        <v-icon>mdi-open-in-new</v-icon>
                    </v-btn>
                    <v-btn icon variant="text" @click="$emit('close')">
                        <v-icon>mdi-close</v-icon>
                    </v-btn>
                </template>
            </v-toolbar>

            <v-divider />

            <v-card-text class="pa-6">
                <div class="d-flex flex-wrap gap-3 mb-6">
                    <v-chip
                        v-if="project.language"
                        variant="tonal"
                        color="primary"
                        prepend-icon="mdi-code-tags"
                    >
                        {{ project.language }}
                    </v-chip>
                    <v-chip variant="tonal" prepend-icon="mdi-star">
                        {{ project.stargazers_count }} {{ t("projects.stars") }}
                    </v-chip>
                    <v-chip variant="tonal" prepend-icon="mdi-source-fork">
                        {{ project.forks_count }} {{ t("projects.forks") }}
                    </v-chip>
                    <v-chip
                        v-if="project.category"
                        :color="categoryColor"
                        variant="tonal"
                    >
                        {{ project.category }}
                    </v-chip>
                </div>

                <p v-if="project.description" class="text-body-1 mb-6">
                    {{ project.description }}
                </p>

                <v-divider class="mb-6" />

                <div
                    v-if="readme"
                    class="readme-content"
                    v-html="renderedReadme"
                />
                <div v-else-if="loadingReadme" class="text-center py-8">
                    <v-progress-circular indeterminate color="primary" />
                    <p class="mt-2 text-medium-emphasis">
                        {{ t("common.loading") }}
                    </p>
                </div>
                <div v-else class="no-readme-container">
                    <div class="futuristic-grid">
                        <div
                            class="grid-line"
                            v-for="n in 12"
                            :key="n"
                            :style="{ '--i': n }"
                        />
                    </div>
                    <div class="futuristic-content">
                        <div class="hologram-icon">
                            <v-icon
                                size="48"
                                color="primary"
                                class="hologram-pulse"
                                >mdi-code-braces-box</v-icon
                            >
                            <div class="hologram-ring" />
                            <div class="hologram-ring ring-2" />
                        </div>
                        <p class="futuristic-text">
                            {{ t("projects.noDescription") }}
                        </p>
                        <v-btn
                            :href="project?.html_url"
                            target="_blank"
                            variant="outlined"
                            color="primary"
                            size="small"
                            prepend-icon="mdi-github"
                            class="mt-2"
                        >
                            View on GitHub
                        </v-btn>
                    </div>
                </div>

                <v-divider class="my-6" />

                <CommentSection
                    v-if="project"
                    section="project"
                    :target-id="project.name"
                />
            </v-card-text>
        </v-card>
    </v-dialog>
</template>

<script setup lang="ts">
import { marked } from "marked";
import DOMPurify from "dompurify";
import type { Project } from "~~/shared/types";

const { t } = useI18n();

const props = defineProps<{
    project: Project | null;
}>();

defineEmits<{
    close: [];
}>();

const readme = ref("");
const loadingReadme = ref(false);
const { fetchReadme, username } = useGitHub();

const renderedReadme = computed(() => {
    if (!readme.value) return "";
    const html = marked(readme.value) as string;
    return DOMPurify.sanitize(html);
});

const categoryColor = computed(() => {
    switch (props.project?.category) {
        case "frontend":
            return "info";
        case "backend":
            return "success";
        case "fullstack":
            return "primary";
        default:
            return "default";
    }
});

watch(
    () => props.project,
    async (newProject) => {
        if (newProject) {
            loadingReadme.value = true;
            readme.value = "";
            try {
                readme.value = await fetchReadme(username, newProject.name);
            } catch {
                readme.value = "";
            } finally {
                loadingReadme.value = false;
            }
        }
    },
);
</script>

<style scoped>
.readme-content :deep(h1),
.readme-content :deep(h2),
.readme-content :deep(h3) {
    margin-top: 24px;
    margin-bottom: 12px;
}

.readme-content :deep(pre) {
    background: rgba(0, 0, 0, 0.05);
    padding: 16px;
    border-radius: 8px;
    overflow-x: auto;
    margin: 16px 0;
}

.readme-content :deep(code) {
    font-family: "Fira Code", monospace;
    font-size: 0.9em;
}

.readme-content :deep(img) {
    max-width: 100%;
    border-radius: 8px;
}

.readme-content :deep(a) {
    color: rgb(var(--v-theme-primary));
}

/* Futuristic no-readme animation */
.no-readme-container {
    position: relative;
    min-height: 200px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 16px;
    overflow: hidden;
    background: rgb(var(--v-theme-surface));
    border: 1px solid rgb(var(--v-theme-primary), 0.1);
}

.futuristic-grid {
    position: absolute;
    inset: 0;
    overflow: hidden;
    opacity: 0.15;
}

.grid-line {
    position: absolute;
    background: linear-gradient(
        90deg,
        transparent,
        rgb(var(--v-theme-primary)),
        transparent
    );
    height: 1px;
    width: 100%;
    top: calc(var(--i) * 8.33%);
    animation: grid-scan 4s ease-in-out infinite;
    animation-delay: calc(var(--i) * 0.3s);
    opacity: 0;
}

@keyframes grid-scan {
    0%,
    100% {
        opacity: 0;
        transform: scaleX(0);
    }
    50% {
        opacity: 1;
        transform: scaleX(1);
    }
}

.futuristic-content {
    position: relative;
    z-index: 1;
    text-align: center;
    padding: 32px;
}

.hologram-icon {
    position: relative;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 16px;
}

.hologram-pulse {
    animation: hologram-float 3s ease-in-out infinite;
}

@keyframes hologram-float {
    0%,
    100% {
        transform: translateY(0);
        opacity: 0.8;
    }
    50% {
        transform: translateY(-8px);
        opacity: 1;
    }
}

.hologram-ring {
    position: absolute;
    width: 80px;
    height: 80px;
    border-radius: 50%;
    border: 2px solid rgb(var(--v-theme-primary), 0.2);
    animation: ring-expand 3s ease-in-out infinite;
}

.hologram-ring.ring-2 {
    animation-delay: 1.5s;
}

@keyframes ring-expand {
    0% {
        transform: scale(0.5);
        opacity: 0.8;
    }
    100% {
        transform: scale(2);
        opacity: 0;
    }
}

.futuristic-text {
    font-size: 0.9rem;
    color: rgb(var(--v-theme-on-surface), 0.5);
    font-family: var(--font-mono);
}
</style>
