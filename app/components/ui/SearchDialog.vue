<template>
    <v-dialog
        v-model="dialogOpen"
        max-width="580"
        content-class="search-dialog-wrapper"
        :scrim="true"
        scrim-class="search-scrim"
    >
        <div class="search-dialog">
            <div class="search-input-row">
                <v-icon size="22" color="primary" class="search-icon"
                    >mdi-magnify</v-icon
                >
                <input
                    ref="searchInput"
                    v-model="query"
                    type="text"
                    class="search-field"
                    :placeholder="t('common.searchPlaceholder')"
                    @keydown.escape="dialogOpen = false"
                    @keydown.down.prevent="navigateResults(1)"
                    @keydown.up.prevent="navigateResults(-1)"
                    @keydown.enter.prevent="selectResult"
                />
                <kbd class="search-kbd">ESC</kbd>
            </div>

            <div v-if="query.length >= 2" class="search-results">
                <div v-if="filteredResults.length === 0" class="search-empty">
                    <v-icon size="40" color="primary" class="mb-2"
                        >mdi-file-search-outline</v-icon
                    >
                    <p>{{ t("common.noResults") }}</p>
                </div>

                <div v-else class="search-results-list">
                    <div
                        v-for="(group, gIdx) in groupedResults"
                        :key="group.category"
                        class="search-group"
                    >
                        <div class="search-group-label">
                            <v-icon size="14" class="mr-1">{{
                                group.icon
                            }}</v-icon>
                            {{ group.category }}
                        </div>
                        <a
                            v-for="(result, rIdx) in group.items"
                            :key="result.id"
                            :href="result.url"
                            class="search-result-item"
                            :class="{
                                focused:
                                    focusedIndex === getGlobalIndex(gIdx, rIdx),
                            }"
                            @click.prevent="goToResult(result)"
                            @mouseenter="
                                focusedIndex = getGlobalIndex(gIdx, rIdx)
                            "
                        >
                            <v-icon
                                size="18"
                                :color="result.iconColor || 'primary'"
                                class="result-icon"
                                >{{ result.icon }}</v-icon
                            >
                            <div class="result-text">
                                <span
                                    class="result-title"
                                    v-html="highlight(result.title)"
                                />
                                <span
                                    v-if="result.subtitle"
                                    class="result-subtitle"
                                    >{{ result.subtitle }}</span
                                >
                            </div>
                            <v-icon size="14" class="result-arrow"
                                >mdi-arrow-right</v-icon
                            >
                        </a>
                    </div>
                </div>
            </div>

            <div v-else class="search-quick">
                <div class="search-group-label">
                    <v-icon size="14" class="mr-1">mdi-lightning-bolt</v-icon>
                    {{ t("common.quickLinks") }}
                </div>
                <div class="quick-grid">
                    <NuxtLink
                        v-for="link in quickLinks"
                        :key="link.path"
                        :to="localePath(link.path)"
                        class="quick-link"
                        @click="dialogOpen = false"
                    >
                        <v-icon size="20" color="primary">{{
                            link.icon
                        }}</v-icon>
                        <span>{{ link.label }}</span>
                    </NuxtLink>
                </div>
            </div>

            <div class="search-footer">
                <span class="search-hint">
                    <kbd>&uarr;</kbd><kbd>&darr;</kbd>
                    {{ t("common.navigate") }} <kbd>Enter</kbd>
                    {{ t("common.select") }}
                </span>
            </div>
        </div>
    </v-dialog>
</template>

<script setup lang="ts">
import type { Project } from "~~/shared/types";

const props = defineProps<{
    modelValue: boolean;
}>();

const emit = defineEmits<{ "update:modelValue": [value: boolean] }>();

const dialogOpen = computed({
    get: () => props.modelValue,
    set: (val: boolean) => emit("update:modelValue", val),
});

const { t } = useI18n();
const localePath = useLocalePath();
const router = useRouter();
const searchInput = ref<HTMLInputElement | null>(null);
const query = ref("");
const focusedIndex = ref(0);

// Fetch projects for search
const { data: projects } = await useFetch<Project[]>("/api/github/repos");

// Skills data for search
const skills = [
    { name: "Vue.js", icon: "mdi-vuejs", category: "frontend" },
    { name: "React", icon: "mdi-react", category: "frontend" },
    {
        name: "TypeScript",
        icon: "mdi-language-typescript",
        category: "frontend",
    },
    {
        name: "JavaScript",
        icon: "mdi-language-javascript",
        category: "frontend",
    },
    { name: "Nuxt", icon: "mdi-nuxt", category: "frontend" },
    { name: "Node.js", icon: "mdi-nodejs", category: "backend" },
    { name: "Python", icon: "mdi-language-python", category: "backend" },
    { name: "MongoDB", icon: "mdi-database", category: "backend" },
    { name: "PostgreSQL", icon: "mdi-database", category: "backend" },
    { name: "Docker", icon: "mdi-docker", category: "tools" },
    { name: "Git", icon: "mdi-git", category: "tools" },
    { name: "AWS", icon: "mdi-aws", category: "tools" },
];

// Pages for search
const pages = [
    { name: "Home", path: "/", icon: "mdi-home" },
    { name: "About", path: "/about", icon: "mdi-account" },
    { name: "Projects", path: "/projects", icon: "mdi-folder-multiple" },
    { name: "Articles", path: "/articles", icon: "mdi-newspaper" },
];

const quickLinks = [
    { path: "/", icon: "mdi-home", label: "Home" },
    { path: "/about", icon: "mdi-account", label: "About" },
    { path: "/projects", icon: "mdi-folder-multiple", label: "Projects" },
    { path: "/articles", icon: "mdi-newspaper", label: "Articles" },
];

interface SearchResult {
    id: string;
    title: string;
    subtitle?: string;
    icon: string;
    iconColor?: string;
    url: string;
    category: string;
    categoryIcon: string;
}

const filteredResults = computed<SearchResult[]>(() => {
    if (query.value.length < 2) return [];
    const q = query.value.toLowerCase();
    const results: SearchResult[] = [];

    // Search pages
    pages.forEach((page) => {
        if (page.name.toLowerCase().includes(q)) {
            results.push({
                id: `page-${page.path}`,
                title: page.name,
                subtitle: `Go to ${page.name}`,
                icon: page.icon,
                url: page.path,
                category: "Pages",
                categoryIcon: "mdi-file-document",
            });
        }
    });

    // Search skills
    skills.forEach((skill) => {
        if (skill.name.toLowerCase().includes(q)) {
            results.push({
                id: `skill-${skill.name}`,
                title: skill.name,
                subtitle: skill.category,
                icon: skill.icon,
                iconColor:
                    skill.category === "frontend"
                        ? "#3b82f6"
                        : skill.category === "backend"
                          ? "#10b981"
                          : "#f59e0b",
                url: "/#skills",
                category: "Skills",
                categoryIcon: "mdi-code-braces",
            });
        }
    });

    // Search projects
    const allProjects = projects.value || [];
    allProjects.forEach((project) => {
        const match =
            project.name.toLowerCase().includes(q) ||
            (project.description &&
                project.description.toLowerCase().includes(q)) ||
            (project.language && project.language.toLowerCase().includes(q)) ||
            project.topics?.some((t) => t.toLowerCase().includes(q));

        if (match) {
            results.push({
                id: `project-${project.id}`,
                title: project.name,
                subtitle: project.description || project.language || "",
                icon: "mdi-source-repository",
                url: project.html_url,
                category: "Projects",
                categoryIcon: "mdi-github",
            });
        }
    });

    return results.slice(0, 12);
});

const groupedResults = computed(() => {
    const groups: Record<
        string,
        { category: string; icon: string; items: SearchResult[] }
    > = {};
    filteredResults.value.forEach((r) => {
        if (!groups[r.category]) {
            groups[r.category] = {
                category: r.category,
                icon: r.categoryIcon,
                items: [],
            };
        }
        groups[r.category].items.push(r);
    });
    return Object.values(groups);
});

function getGlobalIndex(groupIndex: number, itemIndex: number): number {
    let idx = 0;
    for (let g = 0; g < groupIndex; g++) {
        idx += groupedResults.value[g].items.length;
    }
    return idx + itemIndex;
}

function navigateResults(dir: number) {
    const total = filteredResults.value.length;
    if (total === 0) return;
    focusedIndex.value = (focusedIndex.value + dir + total) % total;
}

function selectResult() {
    const result = filteredResults.value[focusedIndex.value];
    if (result) goToResult(result);
}

function goToResult(result: SearchResult) {
    dialogOpen.value = false;
    query.value = "";
    if (result.url.startsWith("http")) {
        window.open(result.url, "_blank");
    } else {
        router.push(localePath(result.url));
    }
}

function highlight(text: string): string {
    if (!query.value) return text;
    const regex = new RegExp(
        `(${query.value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`,
        "gi",
    );
    return text.replace(regex, '<mark class="search-mark">$1</mark>');
}

// Focus input on open
watch(dialogOpen, (open) => {
    if (open) {
        query.value = "";
        focusedIndex.value = 0;
        nextTick(() => searchInput.value?.focus());
    }
});

// Keyboard shortcut (Ctrl+K)
function onGlobalKeydown(e: KeyboardEvent) {
    if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        dialogOpen.value = !dialogOpen.value;
    }
}

onMounted(() => window.addEventListener("keydown", onGlobalKeydown));
onUnmounted(() => window.removeEventListener("keydown", onGlobalKeydown));
</script>

<style scoped>
.search-dialog {
    background: rgb(var(--v-theme-surface));
    border: 1px solid rgb(var(--v-theme-on-surface), 0.1);
    border-radius: 16px;
    overflow: hidden;
    box-shadow: 0 25px 60px rgba(0, 0, 0, 0.4);
}

.search-input-row {
    display: flex;
    align-items: center;
    padding: 14px 18px;
    gap: 12px;
    border-bottom: 1px solid rgb(var(--v-theme-on-surface), 0.08);
}

.search-icon {
    flex-shrink: 0;
}

.search-field {
    flex: 1;
    background: transparent;
    border: none;
    outline: none;
    font-size: 1rem;
    color: rgb(var(--v-theme-on-surface));
    font-family: inherit;
}

.search-field::placeholder {
    color: rgb(var(--v-theme-on-surface), 0.35);
}

.search-kbd {
    font-size: 0.6rem;
    padding: 2px 6px;
    border-radius: 4px;
    border: 1px solid rgb(var(--v-theme-on-surface), 0.15);
    color: rgb(var(--v-theme-on-surface), 0.4);
    font-family: var(--font-mono);
}

/* Results */
.search-results {
    max-height: 360px;
    overflow-y: auto;
    padding: 8px;
}

.search-empty {
    text-align: center;
    padding: 32px 16px;
    color: rgb(var(--v-theme-on-surface), 0.4);
}

.search-empty p {
    font-size: 0.85rem;
}

.search-group {
    margin-bottom: 8px;
}

.search-group-label {
    display: flex;
    align-items: center;
    font-size: 0.65rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 1px;
    color: rgb(var(--v-theme-on-surface), 0.4);
    padding: 6px 12px 4px;
}

.search-result-item {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 10px 12px;
    border-radius: 10px;
    cursor: pointer;
    text-decoration: none;
    color: inherit;
    transition: all 0.15s ease;
}

.search-result-item:hover,
.search-result-item.focused {
    background: rgb(var(--v-theme-primary), 0.08);
}

.search-result-item.focused .result-arrow {
    opacity: 1;
    transform: translateX(0);
}

.result-icon {
    flex-shrink: 0;
}

.result-text {
    flex: 1;
    min-width: 0;
    display: flex;
    flex-direction: column;
}

.result-title {
    font-size: 0.85rem;
    font-weight: 600;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.result-subtitle {
    font-size: 0.7rem;
    color: rgb(var(--v-theme-on-surface), 0.4);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.result-arrow {
    flex-shrink: 0;
    opacity: 0;
    transform: translateX(-4px);
    transition: all 0.2s ease;
    color: rgb(var(--v-theme-primary));
}

:deep(.search-mark) {
    background: rgb(var(--v-theme-primary), 0.2);
    color: rgb(var(--v-theme-primary));
    border-radius: 2px;
    padding: 0 1px;
}

/* Quick links */
.search-quick {
    padding: 8px;
}

.quick-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 6px;
    padding: 4px;
}

.quick-link {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 10px 14px;
    border-radius: 10px;
    text-decoration: none;
    color: rgb(var(--v-theme-on-surface));
    font-size: 0.85rem;
    font-weight: 600;
    transition: all 0.15s ease;
    border: 1px solid transparent;
}

.quick-link:hover {
    background: rgb(var(--v-theme-primary), 0.08);
    border-color: rgb(var(--v-theme-primary), 0.2);
}

/* Footer */
.search-footer {
    padding: 10px 18px;
    border-top: 1px solid rgb(var(--v-theme-on-surface), 0.06);
    display: flex;
    justify-content: center;
}

.search-hint {
    font-size: 0.65rem;
    color: rgb(var(--v-theme-on-surface), 0.3);
    display: flex;
    align-items: center;
    gap: 6px;
}

.search-hint kbd {
    font-size: 0.6rem;
    padding: 1px 5px;
    border-radius: 3px;
    border: 1px solid rgb(var(--v-theme-on-surface), 0.12);
    color: rgb(var(--v-theme-on-surface), 0.4);
    font-family: var(--font-mono);
}
</style>
