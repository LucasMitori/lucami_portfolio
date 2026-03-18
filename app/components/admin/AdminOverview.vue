<template>
    <div class="admin-overview">
        <v-row class="mb-6">
            <v-col
                v-for="stat in statsCards"
                :key="stat.label"
                cols="12"
                sm="6"
                md="3"
            >
                <v-card class="stat-card pa-4" variant="flat">
                    <div class="d-flex align-center gap-3">
                        <div
                            class="stat-icon-wrap"
                            :style="{ '--stat-color': stat.color }"
                        >
                            <v-icon
                                :icon="stat.icon"
                                size="24"
                                :color="stat.color"
                            />
                        </div>
                        <div class="flex-grow-1">
                            <div
                                class="text-h5 font-weight-bold"
                                :style="{ color: stat.color }"
                            >
                                {{ stat.value }}
                            </div>
                            <div
                                class="text-caption text-medium-emphasis font-weight-medium"
                            >
                                {{ stat.label }}
                            </div>
                        </div>
                    </div>
                    <div class="stat-bar mt-3">
                        <div
                            class="stat-bar-fill"
                            :style="{ width: stat.bar, background: stat.color }"
                        />
                    </div>
                </v-card>
            </v-col>
        </v-row>

        <v-row class="mb-6">
            <v-col cols="12">
                <v-card variant="flat" class="pa-4">
                    <h3 class="text-subtitle-1 font-weight-bold mb-3">
                        <v-icon start size="20" color="primary"
                            >mdi-lightning-bolt</v-icon
                        >
                        Quick Actions
                    </h3>
                    <div class="d-flex flex-wrap gap-3">
                        <v-btn
                            v-for="action in quickActions"
                            :key="action.label"
                            variant="tonal"
                            :color="action.color"
                            :prepend-icon="action.icon"
                            size="small"
                            @click="action.action"
                        >
                            {{ action.label }}
                        </v-btn>
                    </div>
                </v-card>
            </v-col>
        </v-row>

        <v-row>
            <v-col cols="12" md="6">
                <v-card variant="flat" class="pa-4">
                    <h3 class="text-subtitle-1 font-weight-bold mb-3">
                        <v-icon start size="20" color="info"
                            >mdi-information</v-icon
                        >
                        System Info
                    </h3>
                    <v-list density="compact" class="bg-transparent">
                        <v-list-item
                            v-for="info in systemInfo"
                            :key="info.label"
                        >
                            <template #prepend>
                                <v-icon
                                    :icon="info.icon"
                                    size="18"
                                    color="primary"
                                    class="mr-3"
                                />
                            </template>
                            <v-list-item-title class="text-body-2">{{
                                info.label
                            }}</v-list-item-title>
                            <template #append>
                                <v-chip
                                    size="x-small"
                                    variant="tonal"
                                    :color="info.chipColor || 'default'"
                                >
                                    {{ info.value }}
                                </v-chip>
                            </template>
                        </v-list-item>
                    </v-list>
                </v-card>
            </v-col>

            <v-col cols="12" md="6">
                <v-card variant="flat" class="pa-4">
                    <h3 class="text-subtitle-1 font-weight-bold mb-3">
                        <v-icon start size="20" color="success"
                            >mdi-check-circle</v-icon
                        >
                        Status
                    </h3>
                    <v-list density="compact" class="bg-transparent">
                        <v-list-item>
                            <template #prepend>
                                <div class="status-dot status-online mr-3" />
                            </template>
                            <v-list-item-title class="text-body-2"
                                >API Server</v-list-item-title
                            >
                            <template #append>
                                <span class="text-caption text-success"
                                    >Online</span
                                >
                            </template>
                        </v-list-item>
                        <v-list-item>
                            <template #prepend>
                                <div class="status-dot status-online mr-3" />
                            </template>
                            <v-list-item-title class="text-body-2"
                                >Database</v-list-item-title
                            >
                            <template #append>
                                <span class="text-caption text-success"
                                    >Connected</span
                                >
                            </template>
                        </v-list-item>
                        <v-list-item>
                            <template #prepend>
                                <div class="status-dot status-online mr-3" />
                            </template>
                            <v-list-item-title class="text-body-2"
                                >GitHub API</v-list-item-title
                            >
                            <template #append>
                                <span class="text-caption text-success"
                                    >Active</span
                                >
                            </template>
                        </v-list-item>
                    </v-list>
                </v-card>
            </v-col>
        </v-row>

        <v-alert
            v-if="error"
            type="error"
            class="mt-4"
            closable
            @click:close="error = null"
        >
            {{ error }}
        </v-alert>
    </div>
</template>

<script setup lang="ts">
import type { Article, SiteSettings, VisitorStats } from "~~/shared/types";

const { t } = useI18n();
const router = useRouter();

const error = ref<string | null>(null);

const { data: visitorStats } = useFetch<VisitorStats>("/api/admin/visitors", {
    onResponseError() {
        error.value = "Failed to load visitor stats";
    },
});

const { data: articles } = useFetch<Article[]>("/api/admin/articles", {
    onResponseError() {
        error.value = "Failed to load articles";
    },
});

const { data: settings } = useFetch<SiteSettings>("/api/admin/settings", {
    onResponseError() {
        error.value = "Failed to load settings";
    },
});

const formattedDate = computed(() => {
    const date = settings.value?.updatedAt;
    if (!date) return "...";
    return new Date(date).toLocaleDateString(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
    });
});

const statsCards = computed(() => [
    {
        icon: "mdi-account-group",
        label: t("admin.overview.totalVisitors"),
        value: visitorStats.value?.total ?? "...",
        color: "#7C6EF6",
        bar: "75%",
    },
    {
        icon: "mdi-file-document-multiple",
        label: t("admin.overview.totalArticles"),
        value: articles.value?.length ?? "...",
        color: "#38BDF8",
        bar: "45%",
    },
    {
        icon: "mdi-palette",
        label: t("admin.overview.defaultTheme"),
        value: settings.value?.defaultTheme ?? "...",
        color: "#F472B6",
        bar: "60%",
    },
    {
        icon: "mdi-clock-outline",
        label: t("admin.overview.lastUpdated"),
        value: formattedDate.value,
        color: "#22C55E",
        bar: "90%",
    },
]);

const quickActions = [
    {
        label: "New Article",
        icon: "mdi-plus",
        color: "primary",
        action: () =>
            router.push({ path: "/admin", query: { tab: "articles" } }),
    },
    {
        label: "Edit Themes",
        icon: "mdi-palette",
        color: "secondary",
        action: () => router.push({ path: "/admin", query: { tab: "themes" } }),
    },
    {
        label: "Music Config",
        icon: "mdi-music",
        color: "accent",
        action: () => router.push({ path: "/admin", query: { tab: "music" } }),
    },
    {
        label: "View Comments",
        icon: "mdi-comment-multiple",
        color: "info",
        action: () =>
            router.push({ path: "/admin", query: { tab: "comments" } }),
    },
];

const systemInfo = computed(() => [
    {
        icon: "mdi-language-typescript",
        label: "Framework",
        value: "Nuxt 4",
        chipColor: "primary",
    },
    {
        icon: "mdi-vuejs",
        label: "UI Library",
        value: "Vuetify 4",
        chipColor: "success",
    },
    {
        icon: "mdi-database",
        label: "Database",
        value: "MongoDB",
        chipColor: "info",
    },
    {
        icon: "mdi-translate",
        label: "Default Locale",
        value: settings.value?.defaultLocale || "pt-BR",
        chipColor: "warning",
    },
]);
</script>

<style scoped>
.stat-card {
    border: 1px solid rgb(var(--v-theme-on-surface), 0.06);
    border-radius: 16px;
    transition: all 0.2s ease;
}

.stat-card:hover {
    border-color: rgb(var(--v-theme-primary), 0.2);
    transform: translateY(-2px);
    box-shadow: 0 4px 20px rgb(var(--v-theme-on-surface), 0.05);
}

.stat-icon-wrap {
    width: 48px;
    height: 48px;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: color-mix(
        in srgb,
        var(--stat-color, currentColor) 12%,
        transparent
    );
}

.stat-bar {
    height: 4px;
    border-radius: 2px;
    background: rgb(var(--v-theme-on-surface), 0.06);
    overflow: hidden;
}

.stat-bar-fill {
    height: 100%;
    border-radius: 2px;
    transition: width 1s ease;
    opacity: 0.6;
}

.status-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
}

.status-online {
    background: #22c55e;
    box-shadow: 0 0 8px rgba(34, 197, 94, 0.5);
}
</style>
