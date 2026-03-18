<template>
    <div class="components-page">
        <section class="page-hero">
            <div class="page-hero-bg" />
            <div class="hero-hex-grid">
                <div
                    v-for="n in 15"
                    :key="n"
                    class="hex-cell"
                    :style="hexStyle(n)"
                />
            </div>
            <div class="hero-orbits">
                <div class="orbit orbit-1"><div class="orbit-dot" /></div>
                <div class="orbit orbit-2"><div class="orbit-dot" /></div>
                <div class="orbit orbit-3"><div class="orbit-dot" /></div>
            </div>
            <v-container class="page-hero-content">
                <v-row align="center" justify="center">
                    <v-col cols="12" class="text-center">
                        <AnimatedSection>
                            <div class="hero-badge">
                                <v-icon size="16" class="mr-1"
                                    >mdi-puzzle</v-icon
                                >
                                {{ t("components.badge") }}
                            </div>
                            <h1 class="page-title">
                                <span class="title-line">{{
                                    t("components.title")
                                }}</span>
                            </h1>
                            <p class="page-subtitle">
                                {{ t("components.subtitle") }}
                            </p>
                            <div class="hero-chips">
                                <v-chip
                                    v-for="item in sidebarItems.slice(0, 4)"
                                    :key="item.value"
                                    size="small"
                                    variant="outlined"
                                    color="primary"
                                    class="hero-chip"
                                >
                                    <v-icon start size="14">{{
                                        item.icon
                                    }}</v-icon>
                                    {{ t(item.titleKey) }}
                                </v-chip>
                            </div>
                            <div class="page-line" />
                        </AnimatedSection>
                    </v-col>
                </v-row>
            </v-container>
            <div class="hero-bottom-fade" />
        </section>

        <v-container class="py-8">
            <div class="d-md-none mb-6">
                <div class="chips-row">
                    <v-chip
                        v-for="item in sidebarItems"
                        :key="item.value"
                        :color="
                            activeDemo === item.value ? 'primary' : undefined
                        "
                        :variant="
                            activeDemo === item.value ? 'flat' : 'outlined'
                        "
                        class="chip-nav"
                        @click="activeDemo = item.value"
                    >
                        <v-icon start size="small">{{ item.icon }}</v-icon>
                        {{ t(item.titleKey) }}
                    </v-chip>
                </div>
            </div>

            <v-row>
                <v-col cols="12" md="2" class="d-none d-md-block">
                    <v-card
                        variant="outlined"
                        class="sidebar-card sticky-sidebar"
                    >
                        <v-list density="compact" nav>
                            <v-list-item
                                v-for="item in sidebarItems"
                                :key="item.value"
                                :prepend-icon="item.icon"
                                :title="t(item.titleKey)"
                                :active="activeDemo === item.value"
                                color="primary"
                                rounded="lg"
                                @click="activeDemo = item.value"
                            />
                        </v-list>
                    </v-card>
                </v-col>

                <v-col cols="12" md="10">
                    <AnimatedSection
                        :key="activeDemo"
                        animation="fadeIn"
                        :duration="400"
                    >
                        <ShowcaseButtons v-if="activeDemo === 'buttons'" />
                        <ShowcaseCards v-if="activeDemo === 'cards'" />
                        <ShowcaseInputs v-if="activeDemo === 'inputs'" />
                        <ShowcaseAnimations
                            v-if="activeDemo === 'animations'"
                        />
                        <ShowcaseCodeBlocks
                            v-if="activeDemo === 'codeBlocks'"
                        />
                        <ShowcaseCharts v-if="activeDemo === 'charts'" />
                        <ShowcaseAudioHowler
                            v-if="activeDemo === 'audioHowler'"
                        />
                        <ShowcaseFlowchart v-if="activeDemo === 'flowcharts'" />
                        <ShowcaseIndexedDB v-if="activeDemo === 'indexedDB'" />
                        <ShowcaseShepherd v-if="activeDemo === 'shepherd'" />
                        <ShowcaseFloatingMenu
                            v-if="activeDemo === 'floatingMenu'"
                        />
                        <ShowcaseInbox v-if="activeDemo === 'inbox'" />
                    </AnimatedSection>
                </v-col>
            </v-row>
        </v-container>
    </div>
</template>

<script setup lang="ts">
const { t } = useI18n();

useHead({ title: t("components.title") });

const activeDemo = ref("buttons");

const sidebarItems = [
    {
        value: "buttons",
        icon: "mdi-gesture-tap-button",
        titleKey: "components.buttons",
    },
    { value: "cards", icon: "mdi-card-outline", titleKey: "components.cards" },
    {
        value: "inputs",
        icon: "mdi-form-textbox",
        titleKey: "components.inputs",
    },
    {
        value: "animations",
        icon: "mdi-animation-play",
        titleKey: "components.animations",
    },
    {
        value: "codeBlocks",
        icon: "mdi-code-tags",
        titleKey: "components.codeBlocks",
    },
    { value: "charts", icon: "mdi-chart-bar", titleKey: "components.charts" },
    {
        value: "audioHowler",
        icon: "mdi-code-tags",
        titleKey: "components.audioHowler",
    },
    {
        value: "flowcharts",
        icon: "mdi-chart-timeline-variant-shimmer",
        titleKey: "components.flowcharts",
    },
    {
        value: "indexedDB",
        icon: "mdi-database",
        titleKey: "components.indexedDB",
    },
    {
        value: "shepherd",
        icon: "mdi-map-marker-path",
        titleKey: "components.shepherd",
    },
    {
        value: "floatingMenu",
        icon: "mdi-menu",
        titleKey: "components.floatingMenu",
    },
    {
        value: "inbox",
        icon: "mdi-inbox",
        titleKey: "components.inbox",
    },
];

function hexStyle(n: number) {
    const seed = n * 11.7;
    return {
        "--hx": `${((seed * 13.3) % 90) + 5}%`,
        "--hy": `${((seed * 7.9) % 80) + 10}%`,
        "--hsize": `${40 + (n % 5) * 20}px`,
        "--hdelay": `${(n % 8) * 1.5}s`,
        "--hdur": `${10 + (n % 6) * 3}s`,
    };
}
</script>

<style scoped>
.page-hero {
    position: relative;
    min-height: 50vh;
    display: flex;
    align-items: center;
    overflow: hidden;
}

.page-hero-bg {
    position: absolute;
    inset: 0;
    background:
        radial-gradient(
            ellipse at 30% 20%,
            rgb(var(--v-theme-secondary), 0.12) 0%,
            transparent 50%
        ),
        radial-gradient(
            ellipse at 70% 80%,
            rgb(var(--v-theme-primary), 0.1) 0%,
            transparent 50%
        ),
        linear-gradient(
            180deg,
            rgb(var(--v-theme-background)) 0%,
            rgb(var(--v-theme-surface)) 100%
        );
}

.page-hero-bg::before {
    content: "";
    position: absolute;
    inset: 0;
    background-image: repeating-linear-gradient(
        45deg,
        transparent,
        transparent 40px,
        rgb(var(--v-theme-primary), 0.02) 40px,
        rgb(var(--v-theme-primary), 0.02) 41px
    );
    animation: diag-scroll 25s linear infinite;
}

@keyframes diag-scroll {
    0% {
        transform: translate(0, 0);
    }
    100% {
        transform: translate(56px, 56px);
    }
}

.hero-hex-grid {
    position: absolute;
    inset: 0;
    overflow: hidden;
    pointer-events: none;
}

.hex-cell {
    position: absolute;
    left: var(--hx);
    top: var(--hy);
    width: var(--hsize);
    height: var(--hsize);
    clip-path: polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%);
    background: rgb(var(--v-theme-primary), 0.06);
    border: 1px solid rgb(var(--v-theme-primary), 0.08);
    animation: hex-pulse var(--hdur) ease-in-out infinite;
    animation-delay: var(--hdelay);
}

@keyframes hex-pulse {
    0%,
    100% {
        opacity: 0.3;
        transform: scale(1);
    }
    50% {
        opacity: 0.7;
        transform: scale(1.1);
    }
}

.hero-orbits {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    pointer-events: none;
}

.orbit {
    position: absolute;
    border-radius: 50%;
    border: 1px solid rgb(var(--v-theme-primary), 0.08);
}

.orbit-1 {
    width: 200px;
    height: 200px;
    top: -100px;
    left: -100px;
    animation: orbit-spin 20s linear infinite;
}

.orbit-2 {
    width: 350px;
    height: 350px;
    top: -175px;
    left: -175px;
    animation: orbit-spin 30s linear infinite reverse;
}

.orbit-3 {
    width: 500px;
    height: 500px;
    top: -250px;
    left: -250px;
    animation: orbit-spin 40s linear infinite;
}

.orbit-dot {
    position: absolute;
    top: -4px;
    left: 50%;
    transform: translateX(-50%);
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: rgb(var(--v-theme-primary));
    box-shadow: 0 0 12px rgb(var(--v-theme-primary), 0.5);
}

@keyframes orbit-spin {
    0% {
        transform: rotate(0deg);
    }
    100% {
        transform: rotate(360deg);
    }
}

.page-hero-content {
    position: relative;
    z-index: 2;
    padding: 120px 24px 80px;
}

.hero-badge {
    display: inline-flex;
    align-items: center;
    font-size: 0.75rem;
    font-weight: 700;
    letter-spacing: 3px;
    text-transform: uppercase;
    color: rgb(var(--v-theme-primary));
    margin-bottom: 16px;
    padding: 6px 16px;
    border-radius: 20px;
    background: rgb(var(--v-theme-primary), 0.08);
    border: 1px solid rgb(var(--v-theme-primary), 0.15);
}

.page-title {
    font-size: clamp(2.5rem, 6vw, 4rem);
    font-weight: 900;
    font-family: var(--font-heading);
    margin-bottom: 12px;
    line-height: 1.1;
}

.title-line {
    background: linear-gradient(
        135deg,
        rgb(var(--v-theme-on-surface)),
        rgb(var(--v-theme-secondary))
    );
    background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
}

.page-subtitle {
    font-size: 1.15rem;
    color: rgb(var(--v-theme-on-surface), 0.6);
    margin-bottom: 20px;
    max-width: 500px;
    margin-left: auto;
    margin-right: auto;
}

.hero-chips {
    display: inline-flex;
    gap: 8px;
    flex-wrap: wrap;
    justify-content: center;
    margin-bottom: 24px;
}

.hero-chip {
    backdrop-filter: blur(8px);
}

.page-line {
    width: 60px;
    height: 3px;
    background: linear-gradient(
        90deg,
        rgb(var(--v-theme-primary)),
        rgb(var(--v-theme-secondary))
    );
    margin: 0 auto;
    border-radius: 2px;
}

.hero-bottom-fade {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 80px;
    background: linear-gradient(
        to bottom,
        transparent,
        rgb(var(--v-theme-background))
    );
    z-index: 3;
}

.chips-row {
    display: flex;
    gap: 8px;
    overflow-x: auto;
    padding-bottom: 4px;
    scrollbar-width: thin;
}

.chip-nav {
    flex-shrink: 0;
}

.sidebar-card {
    border-color: rgb(var(--v-theme-on-surface), 0.08);
}

.sticky-sidebar {
    position: sticky;
    top: 80px;
}
</style>
