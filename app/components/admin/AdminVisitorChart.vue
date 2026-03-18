<template>
    <div class="admin-visitor-chart">
        <v-progress-linear v-if="loading" indeterminate class="mb-4" />

        <v-alert v-if="fetchError" type="error" class="mb-4" closable>
            Failed to load visitor analytics.
        </v-alert>

        <template v-if="stats">
            <v-row class="mb-4">
                <v-col cols="6" md="3">
                    <v-card class="pa-3 text-center" variant="flat">
                        <div class="text-h5 font-weight-bold text-primary">
                            {{ stats.total || 0 }}
                        </div>
                        <div class="text-caption text-medium-emphasis">
                            Total Visitors
                        </div>
                    </v-card>
                </v-col>
                <v-col cols="6" md="3">
                    <v-card class="pa-3 text-center" variant="flat">
                        <div class="text-h5 font-weight-bold text-secondary">
                            {{ uniquePages }}
                        </div>
                        <div class="text-caption text-medium-emphasis">
                            Unique Pages
                        </div>
                    </v-card>
                </v-col>
                <v-col cols="6" md="3">
                    <v-card class="pa-3 text-center" variant="flat">
                        <div
                            class="text-h5 font-weight-bold text-capitalize"
                            style="
                                color: rgb(
                                    var(
                                        --v-theme-accent,
                                        var(--v-theme-primary)
                                    )
                                );
                            "
                        >
                            {{ topTheme }}
                        </div>
                        <div class="text-caption text-medium-emphasis">
                            Top Theme
                        </div>
                    </v-card>
                </v-col>
                <v-col cols="6" md="3">
                    <v-card class="pa-3 text-center" variant="flat">
                        <div class="text-h5 font-weight-bold text-info">
                            {{ topLocale }}
                        </div>
                        <div class="text-caption text-medium-emphasis">
                            Top Locale
                        </div>
                    </v-card>
                </v-col>
            </v-row>

            <v-card class="mb-4" variant="flat">
                <v-card-text>
                    <v-row density="comfortable" align="center">
                        <v-col cols="12" sm="4">
                            <v-text-field
                                v-model="dateFrom"
                                label="From"
                                type="date"
                                variant="outlined"
                                density="compact"
                                hide-details
                                prepend-inner-icon="mdi-calendar"
                            />
                        </v-col>
                        <v-col cols="12" sm="4">
                            <v-text-field
                                v-model="dateTo"
                                label="To"
                                type="date"
                                variant="outlined"
                                density="compact"
                                hide-details
                                prepend-inner-icon="mdi-calendar"
                            />
                        </v-col>
                        <v-col cols="12" sm="4">
                            <v-btn
                                variant="tonal"
                                color="primary"
                                block
                                @click="applyFilter"
                            >
                                <v-icon start icon="mdi-filter" />
                                Apply Filter
                            </v-btn>
                        </v-col>
                    </v-row>
                </v-card-text>
            </v-card>

            <v-card class="mb-4" variant="flat">
                <v-card-title>
                    <v-icon start icon="mdi-chart-bar" />
                    Daily Activity
                </v-card-title>
                <v-card-text>
                    <div v-if="filteredDays.length">
                        <div
                            v-for="day in filteredDays"
                            :key="day.date"
                            class="d-flex align-center gap-3 mb-2"
                        >
                            <span
                                class="text-caption text-medium-emphasis"
                                style="min-width: 90px"
                            >
                                {{ formatDayDate(day.date) }}
                            </span>
                            <v-progress-linear
                                :model-value="(day.count / maxDailyCount) * 100"
                                color="primary"
                                height="20"
                                rounded
                                class="flex-grow-1"
                            >
                                <template #default>
                                    <span
                                        class="text-caption font-weight-bold"
                                        >{{ day.count }}</span
                                    >
                                </template>
                            </v-progress-linear>
                        </div>
                    </div>
                    <div v-else class="text-center pa-4 text-medium-emphasis">
                        No data for the selected date range.
                    </div>
                </v-card-text>
            </v-card>

            <v-row>
                <v-col cols="12" md="6">
                    <v-card variant="flat">
                        <v-card-title>
                            <v-icon start icon="mdi-file-document" />
                            Top Pages
                        </v-card-title>
                        <v-card-text>
                            <v-list density="compact" class="bg-transparent">
                                <v-list-item
                                    v-for="pageEntry in sortedPagesList"
                                    :key="pageEntry.page"
                                >
                                    <template #prepend>
                                        <v-icon
                                            icon="mdi-web"
                                            size="small"
                                            class="mr-2"
                                        />
                                    </template>
                                    <v-list-item-title class="text-body-2">
                                        {{ pageEntry.page }}
                                    </v-list-item-title>
                                    <template #append>
                                        <div
                                            class="d-flex align-center gap-2"
                                            style="min-width: 150px"
                                        >
                                            <v-progress-linear
                                                :model-value="
                                                    maxPageCount > 0
                                                        ? (pageEntry.count /
                                                              maxPageCount) *
                                                          100
                                                        : 0
                                                "
                                                color="secondary"
                                                height="8"
                                                rounded
                                                class="flex-grow-1"
                                            />
                                            <span
                                                class="text-caption font-weight-bold"
                                                style="min-width: 30px"
                                            >
                                                {{ pageEntry.count }}
                                            </span>
                                        </div>
                                    </template>
                                </v-list-item>
                            </v-list>
                            <div
                                v-if="sortedPagesList.length === 0"
                                class="text-center pa-4 text-medium-emphasis"
                            >
                                No page data available.
                            </div>
                        </v-card-text>
                    </v-card>
                </v-col>

                <v-col cols="12" md="6">
                    <v-card variant="flat">
                        <v-card-title>
                            <v-icon start icon="mdi-palette" />
                            Theme Usage
                        </v-card-title>
                        <v-card-text>
                            <v-list density="compact" class="bg-transparent">
                                <v-list-item
                                    v-for="themeEntry in sortedThemesList"
                                    :key="themeEntry.theme"
                                >
                                    <template #prepend>
                                        <v-icon
                                            :icon="
                                                themeIcons[
                                                    themeEntry.theme as ThemeSlug
                                                ] ?? 'mdi-palette'
                                            "
                                            size="small"
                                            class="mr-2"
                                        />
                                    </template>
                                    <v-list-item-title
                                        class="text-body-2 text-capitalize"
                                    >
                                        {{ themeEntry.theme }}
                                    </v-list-item-title>
                                    <template #append>
                                        <div
                                            class="d-flex align-center gap-2"
                                            style="min-width: 150px"
                                        >
                                            <v-progress-linear
                                                :model-value="
                                                    totalThemeCount > 0
                                                        ? (themeEntry.count /
                                                              totalThemeCount) *
                                                          100
                                                        : 0
                                                "
                                                color="primary"
                                                height="8"
                                                rounded
                                                class="flex-grow-1"
                                            />
                                            <span
                                                class="text-caption font-weight-bold"
                                                style="min-width: 40px"
                                            >
                                                {{
                                                    totalThemeCount > 0
                                                        ? Math.round(
                                                              (themeEntry.count /
                                                                  totalThemeCount) *
                                                                  100,
                                                          )
                                                        : 0
                                                }}%
                                            </span>
                                        </div>
                                    </template>
                                </v-list-item>
                            </v-list>
                            <div
                                v-if="sortedThemesList.length === 0"
                                class="text-center pa-4 text-medium-emphasis"
                            >
                                No theme data available.
                            </div>
                        </v-card-text>
                    </v-card>
                </v-col>
            </v-row>
        </template>
    </div>
</template>

<script setup lang="ts">
import type { ThemeSlug } from "~~/shared/types";

interface VisitorStats {
    total: number;
    byPage: Record<string, number> | Array<{ page: string; count: number }>;
    byTheme: Record<string, number> | Array<{ theme: string; count: number }>;
    byLocale: Record<string, number> | Array<{ locale: string; count: number }>;
    byDay: Array<{ date: string; count: number }>;
}

const themeIcons: Record<ThemeSlug, string> = {
    default: "mdi-palette",
    nerd: "mdi-controller",
    retro: "mdi-typewriter",
    coding: "mdi-code-braces",
};

const stats = ref<VisitorStats | null>(null);
const loading = ref(true);
const fetchError = ref(false);
const dateFrom = ref("");
const dateTo = ref("");

// Extract a clean string from a value that might be a nested object
function extractKey(value: unknown): string {
    if (typeof value === "string") return value;
    if (typeof value === "object" && value !== null) {
        // Handle cases like { currentThemeSlug: "nerd" } — extract the first string value
        const vals = Object.values(value);
        for (const v of vals) {
            if (typeof v === "string") return v;
        }
        return JSON.stringify(value);
    }
    return String(value ?? "");
}

// Normalize data that could come as array of objects OR as a plain Record
function normalizeToRecord(
    data:
        | Record<string, number>
        | Array<{ [key: string]: unknown }>
        | undefined,
    keyField: string,
    valueField: string,
): Record<string, number> {
    if (!data) return {};
    if (Array.isArray(data)) {
        const result: Record<string, number> = {};
        for (const item of data) {
            // Try the specified keyField first, fall back to common alternatives
            let rawKey = item[keyField];
            if (rawKey === undefined) {
                // Try common alternative field names
                const alternatives: Record<string, string[]> = {
                    theme: ["theme", "currentThemeSlug", "themeSlug", "_id"],
                    page: ["page", "url", "path", "_id"],
                    locale: ["locale", "language", "lang", "_id"],
                };
                for (const alt of alternatives[keyField] || ["_id"]) {
                    if (item[alt] !== undefined) {
                        rawKey = item[alt];
                        break;
                    }
                }
            }
            const key = extractKey(rawKey);
            const val = Number(item[valueField] || 0);
            if (key && !isNaN(val)) {
                result[key] = (result[key] || 0) + val;
            }
        }
        return result;
    }
    // Handle Record<string, number> where keys might be JSON strings
    const result: Record<string, number> = {};
    for (const [key, val] of Object.entries(data)) {
        const cleanKey = extractKey(tryParseJSON(key) ?? key);
        result[cleanKey] = (result[cleanKey] || 0) + (val as number);
    }
    return result;
}

function tryParseJSON(str: string): unknown {
    try {
        if (str.startsWith("{")) return JSON.parse(str);
    } catch {
        /* not JSON */
    }
    return null;
}

async function loadStats(params?: { from?: string; to?: string }) {
    loading.value = true;
    fetchError.value = false;
    try {
        const query = new URLSearchParams();
        if (params?.from) query.set("from", params.from);
        if (params?.to) query.set("to", params.to);
        const url = `/api/admin/visitors${query.toString() ? `?${query.toString()}` : ""}`;
        stats.value = await $fetch<VisitorStats>(url);
    } catch {
        fetchError.value = true;
    } finally {
        loading.value = false;
    }
}

function applyFilter() {
    loadStats({
        from: dateFrom.value || undefined,
        to: dateTo.value || undefined,
    });
}

// Normalized page data
const normalizedPages = computed(() => {
    if (!stats.value) return {};
    return normalizeToRecord(stats.value.byPage, "page", "count");
});

// Normalized theme data
const normalizedThemes = computed(() => {
    if (!stats.value) return {};
    return normalizeToRecord(stats.value.byTheme, "theme", "count");
});

// Normalized locale data
const normalizedLocales = computed(() => {
    if (!stats.value) return {};
    return normalizeToRecord(stats.value.byLocale, "locale", "count");
});

const uniquePages = computed(() => {
    return Object.keys(normalizedPages.value).length;
});

const topTheme = computed(() => {
    const themes = normalizedThemes.value;
    const entries = Object.entries(themes);
    if (!entries.length) return "-";
    entries.sort(([, a], [, b]) => b - a);
    return entries[0][0];
});

const topLocale = computed(() => {
    const locales = normalizedLocales.value;
    const entries = Object.entries(locales);
    if (!entries.length) return "-";
    entries.sort(([, a], [, b]) => b - a);
    return entries[0][0];
});

// Sorted pages as array for v-for (filter out audio/asset files)
const sortedPagesList = computed(() => {
    const pages = normalizedPages.value;
    return Object.entries(pages)
        .filter(
            ([page]) =>
                !page.includes("/audio/") &&
                !page.includes(".mp3") &&
                !page.includes(".wav"),
        )
        .sort(([, a], [, b]) => b - a)
        .slice(0, 15)
        .map(([page, count]) => ({ page, count }));
});

const maxPageCount = computed(() => {
    if (!sortedPagesList.value.length) return 1;
    return Math.max(...sortedPagesList.value.map((p) => p.count), 1);
});

// Sorted themes as array
const sortedThemesList = computed(() => {
    const themes = normalizedThemes.value;
    return Object.entries(themes)
        .sort(([, a], [, b]) => b - a)
        .map(([theme, count]) => ({ theme, count }));
});

const totalThemeCount = computed(() => {
    return sortedThemesList.value.reduce((sum, t) => sum + t.count, 0);
});

const filteredDays = computed(() => {
    if (!stats.value) return [];
    let days = stats.value.byDay || [];
    if (dateFrom.value) {
        days = days.filter((d) => d.date >= dateFrom.value);
    }
    if (dateTo.value) {
        days = days.filter((d) => d.date <= dateTo.value);
    }
    return days.slice(-30);
});

const maxDailyCount = computed(() => {
    const counts = filteredDays.value.map((d) => d.count);
    return counts.length ? Math.max(...counts, 1) : 1;
});

function formatDayDate(dateStr: string): string {
    return new Date(dateStr + "T00:00:00").toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
    });
}

onMounted(() => loadStats());
</script>
