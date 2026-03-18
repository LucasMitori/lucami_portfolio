<template>
    <div>
        <h3 class="text-h5 font-weight-bold mb-2">
            <v-icon start color="primary">mdi-github</v-icon>
            {{ t("about.githubStats") }}
        </h3>
        <p class="text-body-2 text-medium-emphasis mb-6">
            {{ t("about.githubStatsSub") }}
        </p>

        <v-row>
            <v-col cols="12" sm="4">
                <v-card
                    variant="outlined"
                    class="stats-card pa-5 text-center h-100"
                    rounded="lg"
                >
                    <v-icon
                        icon="mdi-source-repository"
                        size="36"
                        color="primary"
                        class="mb-3"
                    />
                    <div v-if="pending" class="d-flex justify-center">
                        <v-progress-circular
                            indeterminate
                            size="24"
                            width="2"
                            color="primary"
                        />
                    </div>
                    <template v-else>
                        <div class="text-h4 font-weight-bold text-primary mb-1">
                            {{ totalRepos }}
                        </div>
                        <div class="text-body-2 text-medium-emphasis">
                            Repositories
                        </div>
                    </template>
                </v-card>
            </v-col>

            <v-col cols="12" sm="4">
                <v-card
                    variant="outlined"
                    class="stats-card pa-5 text-center h-100"
                    rounded="lg"
                >
                    <v-icon
                        icon="mdi-star"
                        size="36"
                        color="warning"
                        class="mb-3"
                    />
                    <div v-if="pending" class="d-flex justify-center">
                        <v-progress-circular
                            indeterminate
                            size="24"
                            width="2"
                            color="primary"
                        />
                    </div>
                    <template v-else-if="mostStarred">
                        <div class="text-h4 font-weight-bold text-warning mb-1">
                            {{ mostStarred.stargazers_count }}
                        </div>
                        <div
                            class="text-body-2 text-medium-emphasis text-truncate"
                        >
                            {{ mostStarred.name }}
                        </div>
                    </template>
                    <template v-else>
                        <div class="text-body-2 text-medium-emphasis">--</div>
                    </template>
                </v-card>
            </v-col>

            <v-col cols="12" sm="4">
                <v-card
                    variant="outlined"
                    class="stats-card pa-5 text-center h-100"
                    rounded="lg"
                >
                    <v-icon
                        icon="mdi-code-tags"
                        size="36"
                        color="info"
                        class="mb-3"
                    />
                    <div v-if="pending" class="d-flex justify-center">
                        <v-progress-circular
                            indeterminate
                            size="24"
                            width="2"
                            color="primary"
                        />
                    </div>
                    <template v-else>
                        <div class="text-h4 font-weight-bold text-info mb-1">
                            {{ topLanguages.length }}
                        </div>
                        <div class="text-body-2 text-medium-emphasis">
                            Languages
                        </div>
                    </template>
                </v-card>
            </v-col>

            <v-col v-if="!pending && topLanguages.length" cols="12">
                <div class="d-flex flex-wrap gap-2 justify-center">
                    <v-chip
                        v-for="lang in topLanguages"
                        :key="lang.name"
                        variant="tonal"
                        :color="lang.color"
                        size="default"
                    >
                        <template #prepend>
                            <span
                                class="lang-dot"
                                :style="{ background: lang.hex }"
                            />
                        </template>
                        {{ lang.name }}
                        <template #append>
                            <span class="text-caption font-weight-bold ml-1"
                                >({{ lang.count }})</span
                            >
                        </template>
                    </v-chip>
                </div>
            </v-col>
        </v-row>
    </div>
</template>

<script setup lang="ts">
interface RepoData {
    name: string;
    language: string;
    stargazers_count: number;
    forks_count: number;
}

const { t } = useI18n();

const { data: repos, pending } = await useFetch<RepoData[]>(
    "/api/github/repos",
    {
        default: () => [],
    },
);

const languageColors: Record<string, { color: string; hex: string }> = {
    TypeScript: { color: "info", hex: "#3178C6" },
    JavaScript: { color: "warning", hex: "#F7DF1E" },
    Python: { color: "success", hex: "#3572A5" },
    Vue: { color: "success", hex: "#42b883" },
    HTML: { color: "error", hex: "#E34F26" },
    CSS: { color: "primary", hex: "#563D7C" },
    Java: { color: "error", hex: "#B07219" },
    Dart: { color: "info", hex: "#00B4AB" },
    Shell: { color: "success", hex: "#89E051" },
    Go: { color: "info", hex: "#00ADD8" },
};

const totalRepos = computed(() => repos.value?.length || 0);

const mostStarred = computed(() => {
    if (!repos.value?.length) return null;
    return [...repos.value].sort(
        (a, b) => b.stargazers_count - a.stargazers_count,
    )[0];
});

const topLanguages = computed(() => {
    if (!repos.value?.length) return [];
    const langMap = new Map<string, number>();
    for (const repo of repos.value) {
        if (repo.language) {
            langMap.set(repo.language, (langMap.get(repo.language) || 0) + 1);
        }
    }
    return [...langMap.entries()]
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([name, count]) => ({
            name,
            count,
            color: languageColors[name]?.color || "primary",
            hex: languageColors[name]?.hex || "#888",
        }));
});
</script>

<style scoped>
.stats-card {
    border-color: rgb(var(--v-theme-on-surface), 0.08);
    transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
}

.stats-card:hover {
    transform: translateY(-3px);
    border-color: rgb(var(--v-theme-primary), 0.3);
    box-shadow: 0 8px 24px rgb(var(--v-theme-primary), 0.08);
}

.lang-dot {
    display: inline-block;
    width: 10px;
    height: 10px;
    border-radius: 50%;
    margin-right: 4px;
}
</style>
