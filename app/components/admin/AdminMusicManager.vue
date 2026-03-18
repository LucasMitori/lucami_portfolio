<template>
    <div class="admin-music-manager">
        <v-alert type="info" variant="tonal" class="mb-6">
            <template #text>
                <div>
                    <strong>How to add music:</strong> Place audio files in the
                    <code>public/audio/&lt;theme&gt;/</code> directory.
                    <br />Each theme folder should contain:
                    <ul class="mt-1">
                        <li>
                            <code>background.mp3</code> - Background music that
                            plays while browsing
                        </li>
                        <li>
                            <code>typing.mp3</code> - Sound effect when typing
                            in input fields
                        </li>
                    </ul>
                </div>
            </template>
        </v-alert>

        <v-row>
            <v-col
                v-for="theme in themeConfigs"
                :key="theme.slug"
                cols="12"
                md="6"
            >
                <v-card variant="flat" class="theme-music-card">
                    <v-card-title class="d-flex align-center gap-2">
                        <v-icon :icon="themeIcons[theme.slug]" />
                        <span class="text-capitalize">{{ theme.slug }}</span>
                    </v-card-title>
                    <v-card-text>
                        <div class="mb-4">
                            <h4
                                class="text-subtitle-2 mb-2 d-flex align-center gap-1"
                            >
                                <v-icon size="small" icon="mdi-music" />
                                Background Music
                            </h4>
                            <div class="file-info">
                                <v-icon
                                    size="16"
                                    :color="
                                        theme.hasBgMusic ? 'success' : 'error'
                                    "
                                >
                                    {{
                                        theme.hasBgMusic
                                            ? "mdi-check-circle"
                                            : "mdi-close-circle"
                                    }}
                                </v-icon>
                                <code class="text-caption"
                                    >public/audio/{{
                                        theme.slug
                                    }}/background.mp3</code
                                >
                            </div>
                            <v-slider
                                v-model="theme.musicVolume"
                                :min="0"
                                :max="1"
                                :step="0.05"
                                label="Volume"
                                thumb-label
                                hide-details
                                color="primary"
                                class="mt-2"
                            >
                                <template #prepend>
                                    <v-icon
                                        icon="mdi-volume-low"
                                        size="small"
                                    />
                                </template>
                                <template #append>
                                    <v-icon
                                        icon="mdi-volume-high"
                                        size="small"
                                    />
                                    <span
                                        class="text-caption ml-2"
                                        style="min-width: 36px"
                                    >
                                        {{
                                            Math.round(theme.musicVolume * 100)
                                        }}%
                                    </span>
                                </template>
                            </v-slider>
                        </div>

                        <v-divider class="my-3" />

                        <div>
                            <h4
                                class="text-subtitle-2 mb-2 d-flex align-center gap-1"
                            >
                                <v-icon size="small" icon="mdi-keyboard" />
                                Typing Sound
                            </h4>
                            <div class="file-info">
                                <v-icon
                                    size="16"
                                    :color="
                                        theme.hasTypingSound
                                            ? 'success'
                                            : 'error'
                                    "
                                >
                                    {{
                                        theme.hasTypingSound
                                            ? "mdi-check-circle"
                                            : "mdi-close-circle"
                                    }}
                                </v-icon>
                                <code class="text-caption"
                                    >public/audio/{{
                                        theme.slug
                                    }}/typing.mp3</code
                                >
                            </div>
                            <v-slider
                                v-model="theme.typingSoundVolume"
                                :min="0"
                                :max="1"
                                :step="0.05"
                                label="Volume"
                                thumb-label
                                hide-details
                                color="secondary"
                                class="mt-2"
                            >
                                <template #prepend>
                                    <v-icon
                                        icon="mdi-volume-low"
                                        size="small"
                                    />
                                </template>
                                <template #append>
                                    <v-icon
                                        icon="mdi-volume-high"
                                        size="small"
                                    />
                                    <span
                                        class="text-caption ml-2"
                                        style="min-width: 36px"
                                    >
                                        {{
                                            Math.round(
                                                theme.typingSoundVolume * 100,
                                            )
                                        }}%
                                    </span>
                                </template>
                            </v-slider>
                        </div>
                    </v-card-text>
                </v-card>
            </v-col>
        </v-row>

        <div class="d-flex justify-end mt-4">
            <v-btn
                color="primary"
                variant="elevated"
                size="large"
                :loading="saving"
                @click="saveMusic"
            >
                <v-icon start icon="mdi-content-save" />
                Save Volume Settings
            </v-btn>
        </div>

        <v-snackbar v-model="snackbar" :color="snackbarColor" :timeout="3000">
            {{ snackbarText }}
        </v-snackbar>
    </div>
</template>

<script setup lang="ts">
import type { SiteSettings, ThemeSlug } from "~~/shared/types";

interface ThemeMusicConfig {
    slug: ThemeSlug;
    musicVolume: number;
    typingSoundVolume: number;
    hasBgMusic: boolean;
    hasTypingSound: boolean;
}

const themeSlugs: ThemeSlug[] = ["default", "nerd", "retro", "coding"];

const themeIcons: Record<ThemeSlug, string> = {
    default: "mdi-palette",
    nerd: "mdi-controller",
    retro: "mdi-typewriter",
    coding: "mdi-code-braces",
};

const settings = ref<SiteSettings | null>(null);
const themeConfigs = ref<ThemeMusicConfig[]>([]);
const loading = ref(true);
const saving = ref(false);

const snackbar = ref(false);
const snackbarText = ref("");
const snackbarColor = ref("success");

async function checkFileExists(path: string): Promise<boolean> {
    try {
        const response = await fetch(path, { method: "HEAD" });
        return response.ok;
    } catch {
        return false;
    }
}

async function loadSettings() {
    loading.value = true;
    try {
        const data = await $fetch<SiteSettings>("/api/admin/settings");
        settings.value = data;

        const configs: ThemeMusicConfig[] = [];
        for (const slug of themeSlugs) {
            const musicConfig = data.musicConfig?.find(
                (m: { themeSlug: ThemeSlug }) => m.themeSlug === slug,
            );
            const typingConfig = data.typingSoundConfig?.find(
                (t: { themeSlug: ThemeSlug }) => t.themeSlug === slug,
            );

            const hasBg = await checkFileExists(
                `/audio/${slug}/background.mp3`,
            );
            const hasTyping = await checkFileExists(
                `/audio/${slug}/typing.mp3`,
            );

            configs.push({
                slug,
                musicVolume: musicConfig?.volume ?? 0.5,
                typingSoundVolume: typingConfig?.volume ?? 0.3,
                hasBgMusic: hasBg,
                hasTypingSound: hasTyping,
            });
        }
        themeConfigs.value = configs;
    } catch {
        // Error handled silently
    } finally {
        loading.value = false;
    }
}

async function saveMusic() {
    saving.value = true;
    try {
        const musicConfig = themeConfigs.value.map((tc) => ({
            themeSlug: tc.slug,
            url: `/audio/${tc.slug}/background.mp3`,
            volume: tc.musicVolume,
        }));
        const typingSoundConfig = themeConfigs.value.map((tc) => ({
            themeSlug: tc.slug,
            url: `/audio/${tc.slug}/typing.mp3`,
            volume: tc.typingSoundVolume,
        }));

        await $fetch("/api/admin/music", {
            method: "PUT",
            body: { musicConfig, typingSoundConfig },
        });

        snackbarText.value = "Volume settings saved successfully";
        snackbarColor.value = "success";
        snackbar.value = true;
    } catch {
        snackbarText.value = "Failed to save volume settings";
        snackbarColor.value = "error";
        snackbar.value = true;
    } finally {
        saving.value = false;
    }
}

onMounted(loadSettings);
</script>

<style scoped>
.theme-music-card {
    border: 1px solid rgb(var(--v-theme-on-surface), 0.06);
    border-radius: 16px;
}

.file-info {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 6px 10px;
    border-radius: 8px;
    background: rgb(var(--v-theme-on-surface), 0.03);
}
</style>
