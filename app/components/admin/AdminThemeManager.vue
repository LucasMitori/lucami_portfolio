<template>
    <div class="admin-theme-manager">
        <v-progress-linear v-if="loading" indeterminate class="mb-4" />

        <v-alert v-if="fetchError" type="warning" class="mb-4" closable>
            <template #text>
                <div>
                    <strong>Could not load themes from the database.</strong>
                    <br />
                    Showing default theme configurations. Click "Save Theme" to
                    save them to the database.
                </div>
            </template>
        </v-alert>

        <v-alert
            v-if="!loading && themes.length > 0 && !fetchError"
            type="info"
            variant="tonal"
            class="mb-4"
            density="compact"
            closable
        >
            <template #text>
                <span class="text-caption">
                    Click on a theme card to expand and edit colors, fonts, and
                    settings.
                    <strong>Note:</strong> Color changes are saved to the
                    database for the theme store. Vuetify uses these colors at
                    runtime through the theme store.
                </span>
            </template>
        </v-alert>

        <v-row>
            <v-col v-for="theme in themes" :key="theme.slug" cols="12" md="6">
                <v-card
                    class="theme-card"
                    :variant="
                        expandedTheme === theme.slug ? 'outlined' : 'elevated'
                    "
                    @click="toggleExpand(theme.slug)"
                >
                    <v-card-title class="d-flex align-center gap-2">
                        <v-icon :icon="themeIcons[theme.slug]" size="20" />
                        <span>{{ theme.name }}</span>
                        <v-chip
                            size="small"
                            variant="tonal"
                            :color="theme.isDefault ? 'primary' : undefined"
                        >
                            {{ theme.slug }}
                        </v-chip>
                        <v-spacer />
                        <v-icon
                            :icon="
                                expandedTheme === theme.slug
                                    ? 'mdi-chevron-up'
                                    : 'mdi-chevron-down'
                            "
                        />
                    </v-card-title>

                    <v-card-text>
                        <div class="d-flex align-center gap-2 mb-2">
                            <div
                                v-for="(color, key) in {
                                    primary: theme.colors.primary,
                                    secondary: theme.colors.secondary,
                                    accent: theme.colors.accent,
                                }"
                                :key="key"
                                class="color-preview"
                                :style="{ backgroundColor: color }"
                                :title="key"
                            />
                            <span
                                class="text-caption text-medium-emphasis ml-2"
                            >
                                {{ theme.fonts.heading }} /
                                {{ theme.fonts.body }}
                            </span>
                        </div>
                    </v-card-text>

                    <v-expand-transition>
                        <div v-show="expandedTheme === theme.slug" @click.stop>
                            <v-divider />
                            <v-card-text>
                                <h4
                                    class="text-subtitle-2 mb-3 d-flex align-center gap-1"
                                >
                                    <v-icon size="16">mdi-palette</v-icon>
                                    Colors
                                </h4>
                                <v-row density="comfortable">
                                    <v-col
                                        v-for="colorKey in mainColorKeys"
                                        :key="colorKey"
                                        cols="12"
                                        sm="4"
                                    >
                                        <v-text-field
                                            v-model="
                                                (
                                                    theme.colors as Record<
                                                        string,
                                                        string
                                                    >
                                                )[colorKey]
                                            "
                                            :label="formatLabel(colorKey)"
                                            density="compact"
                                            hide-details
                                        >
                                            <template #prepend>
                                                <input
                                                    type="color"
                                                    :value="
                                                        (
                                                            theme.colors as Record<
                                                                string,
                                                                string
                                                            >
                                                        )[colorKey]
                                                    "
                                                    class="color-input"
                                                    @input="
                                                        (
                                                            theme.colors as Record<
                                                                string,
                                                                string
                                                            >
                                                        )[colorKey] = (
                                                            $event.target as HTMLInputElement
                                                        ).value
                                                    "
                                                />
                                            </template>
                                        </v-text-field>
                                    </v-col>
                                </v-row>

                                <v-divider class="my-4" />

                                <h4
                                    class="text-subtitle-2 mb-3 d-flex align-center gap-1"
                                >
                                    <v-icon size="16">mdi-format-font</v-icon>
                                    Fonts
                                </h4>
                                <v-row density="comfortable">
                                    <v-col cols="12" sm="4">
                                        <v-select
                                            v-model="theme.fonts.heading"
                                            :items="fontOptions"
                                            label="Heading Font"
                                            density="compact"
                                            hide-details
                                        />
                                    </v-col>
                                    <v-col cols="12" sm="4">
                                        <v-select
                                            v-model="theme.fonts.body"
                                            :items="fontOptions"
                                            label="Body Font"
                                            density="compact"
                                            hide-details
                                        />
                                    </v-col>
                                    <v-col cols="12" sm="4">
                                        <v-select
                                            v-model="theme.fonts.mono"
                                            :items="fontOptions"
                                            label="Mono Font"
                                            density="compact"
                                            hide-details
                                        />
                                    </v-col>
                                </v-row>

                                <v-divider class="my-4" />

                                <h4
                                    class="text-subtitle-2 mb-3 d-flex align-center gap-1"
                                >
                                    <v-icon size="16">mdi-cog</v-icon>
                                    Settings
                                </h4>
                                <v-row density="comfortable">
                                    <v-col cols="12" sm="6">
                                        <v-slider
                                            v-model="
                                                borderRadiusNum[theme.slug]
                                            "
                                            :min="0"
                                            :max="24"
                                            :step="1"
                                            label="Border Radius"
                                            thumb-label
                                            hide-details
                                            @update:model-value="
                                                theme.borderRadius = `${$event}px`
                                            "
                                        />
                                    </v-col>
                                    <v-col cols="12" sm="6">
                                        <v-select
                                            v-model="theme.animationPreset"
                                            :items="animationPresets"
                                            label="Animation Preset"
                                            density="compact"
                                            hide-details
                                        />
                                    </v-col>
                                </v-row>

                                <v-alert
                                    type="info"
                                    variant="tonal"
                                    density="compact"
                                    class="mt-4"
                                >
                                    <template #text>
                                        <div class="text-caption">
                                            <strong>Audio files:</strong> Place
                                            files in
                                            <code
                                                >public/audio/{{
                                                    theme.slug
                                                }}/</code
                                            ><br />
                                            <code>background.mp3</code> -
                                            Background music &nbsp;|&nbsp;
                                            <code>typing.mp3</code> - Typing
                                            sound effect
                                        </div>
                                    </template>
                                </v-alert>

                                <div class="d-flex justify-end mt-4">
                                    <v-btn
                                        color="primary"
                                        variant="elevated"
                                        :loading="savingTheme === theme.slug"
                                        @click="saveTheme(theme)"
                                    >
                                        <v-icon start icon="mdi-content-save" />
                                        Save Theme
                                    </v-btn>
                                </div>
                            </v-card-text>
                        </div>
                    </v-expand-transition>
                </v-card>
            </v-col>
        </v-row>

        <v-snackbar v-model="snackbar" :color="snackbarColor" :timeout="3000">
            {{ snackbarText }}
        </v-snackbar>
    </div>
</template>

<script setup lang="ts">
import type { ThemeConfig, ThemeSlug } from "~~/shared/types";

const fontOptions = [
    "Inter",
    "Orbitron",
    "Rajdhani",
    "Special Elite",
    "Courier Prime",
    "Fira Code",
    "JetBrains Mono",
    "Courier New",
];

const animationPresets = [
    { title: "Smooth", value: "smooth" },
    { title: "Glitch", value: "glitch" },
    { title: "Typewriter", value: "typewriter" },
    { title: "Terminal", value: "terminal" },
];

const mainColorKeys = [
    "primary",
    "secondary",
    "accent",
    "background",
    "surface",
    "onBackground",
    "onSurface",
];

const themeIcons: Record<ThemeSlug, string> = {
    default: "mdi-palette",
    nerd: "mdi-controller",
    retro: "mdi-typewriter",
    coding: "mdi-code-braces",
};

// Fallback themes if DB is empty
const fallbackThemes: ThemeConfig[] = [
    {
        slug: "default",
        name: "Default",
        colors: {
            primary: "#6366F1",
            secondary: "#8B5CF6",
            accent: "#EC4899",
            background: "#FFFFFF",
            surface: "#F8FAFC",
            onPrimary: "#FFFFFF",
            onSecondary: "#FFFFFF",
            onBackground: "#1E293B",
            onSurface: "#334155",
        },
        fonts: { heading: "Inter", body: "Inter", mono: "JetBrains Mono" },
        borderRadius: "8px",
        parallaxImages: [],
        musicUrl: "",
        typingSoundUrl: "",
        animationPreset: "smooth",
        isDefault: true,
    },
    {
        slug: "nerd",
        name: "Nerd",
        colors: {
            primary: "#00D4FF",
            secondary: "#FF6B00",
            accent: "#00FF87",
            background: "#0A0A1A",
            surface: "#12122A",
            onPrimary: "#0A0A1A",
            onSecondary: "#FFFFFF",
            onBackground: "#E0E0FF",
            onSurface: "#B0B0D0",
        },
        fonts: { heading: "Orbitron", body: "Rajdhani", mono: "Fira Code" },
        borderRadius: "0px",
        parallaxImages: [],
        musicUrl: "",
        typingSoundUrl: "",
        animationPreset: "glitch",
        isDefault: false,
    },
    {
        slug: "retro",
        name: "Retro",
        colors: {
            primary: "#8B4513",
            secondary: "#A0522D",
            accent: "#CD853F",
            background: "#F5E6C8",
            surface: "#FFF8EE",
            onPrimary: "#FFFFFF",
            onSecondary: "#FFFFFF",
            onBackground: "#3E2723",
            onSurface: "#5D4037",
        },
        fonts: {
            heading: "Special Elite",
            body: "Courier Prime",
            mono: "Courier Prime",
        },
        borderRadius: "2px",
        parallaxImages: [],
        musicUrl: "",
        typingSoundUrl: "",
        animationPreset: "typewriter",
        isDefault: false,
    },
    {
        slug: "coding",
        name: "Coding",
        colors: {
            primary: "#00FF41",
            secondary: "#00CC33",
            accent: "#39FF14",
            background: "#0D0D0D",
            surface: "#1A1A1A",
            onPrimary: "#0D0D0D",
            onSecondary: "#0D0D0D",
            onBackground: "#00FF41",
            onSurface: "#00CC33",
        },
        fonts: { heading: "Fira Code", body: "Fira Code", mono: "Fira Code" },
        borderRadius: "0px",
        parallaxImages: [],
        musicUrl: "",
        typingSoundUrl: "",
        animationPreset: "terminal",
        isDefault: false,
    },
];

const themes = ref<ThemeConfig[]>([]);
const loading = ref(true);
const fetchError = ref(false);
const expandedTheme = ref<ThemeSlug | null>(null);
const savingTheme = ref<ThemeSlug | null>(null);
const borderRadiusNum = ref<Record<string, number>>({});

const snackbar = ref(false);
const snackbarText = ref("");
const snackbarColor = ref("success");

function formatLabel(key: string): string {
    return key.replace(/([A-Z])/g, " $1").replace(/^./, (s) => s.toUpperCase());
}

async function loadThemes() {
    loading.value = true;
    fetchError.value = false;
    try {
        const data = await $fetch<ThemeConfig[]>("/api/admin/themes");
        if (data && data.length > 0) {
            themes.value = data;
        } else {
            // DB is empty — use fallback defaults
            themes.value = JSON.parse(JSON.stringify(fallbackThemes));
            fetchError.value = true;
        }
    } catch {
        // API failed — use fallback defaults
        themes.value = JSON.parse(JSON.stringify(fallbackThemes));
        fetchError.value = true;
    } finally {
        for (const theme of themes.value) {
            borderRadiusNum.value[theme.slug] =
                parseInt(theme.borderRadius) || 0;
        }
        loading.value = false;
    }
}

function toggleExpand(slug: ThemeSlug) {
    expandedTheme.value = expandedTheme.value === slug ? null : slug;
}

async function saveTheme(theme: ThemeConfig) {
    savingTheme.value = theme.slug;
    try {
        // Try updating existing theme by slug
        await $fetch(`/api/admin/themes/${theme._id || theme.slug}`, {
            method: "PUT",
            body: theme,
        });
        snackbarText.value = `Theme "${theme.name}" saved successfully`;
        snackbarColor.value = "success";
        snackbar.value = true;
    } catch {
        // If PUT fails (theme doesn't exist in DB yet), it may need to be created
        // Try re-fetching after a seed
        try {
            await $fetch("/api/seed", { method: "POST" });
            await $fetch(`/api/admin/themes/${theme.slug}`, {
                method: "PUT",
                body: theme,
            });
            snackbarText.value = `Theme "${theme.name}" created and saved`;
            snackbarColor.value = "success";
            snackbar.value = true;
            fetchError.value = false;
        } catch {
            snackbarText.value = `Failed to save theme "${theme.name}"`;
            snackbarColor.value = "error";
            snackbar.value = true;
        }
    } finally {
        savingTheme.value = null;
    }
}

onMounted(loadThemes);
</script>

<style scoped>
.color-preview {
    width: 20px;
    height: 20px;
    border-radius: 50%;
    border: 1px solid rgba(128, 128, 128, 0.3);
}

.color-input {
    width: 32px;
    height: 32px;
    padding: 0;
    border: none;
    cursor: pointer;
    background: transparent;
}

.color-input::-webkit-color-swatch-wrapper {
    padding: 0;
}

.color-input::-webkit-color-swatch {
    border: 1px solid rgba(128, 128, 128, 0.3);
    border-radius: 4px;
}

.theme-card {
    transition: all 0.2s ease;
    border-radius: 16px !important;
}
</style>
