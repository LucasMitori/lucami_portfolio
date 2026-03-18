<template>
    <div class="skills-universe">
        <h3 class="text-h5 font-weight-bold mb-2">
            <v-icon start color="primary">mdi-lightbulb</v-icon>
            {{ t("about.skillsTitle") }}
        </h3>
        <p class="text-body-2 text-medium-emphasis mb-5">
            {{ t("about.skillClickExplore") }}
        </p>

        <div class="category-tabs mb-5">
            <button
                v-for="(category, idx) in categories"
                :key="category.name"
                class="cat-tab"
                :class="{ active: activeCategory === idx }"
                @click="activeCategory = idx"
            >
                <v-icon size="16" class="mr-1">{{ category.icon }}</v-icon>
                {{ category.name }}
                <span class="cat-count">{{ category.skills.length }}</span>
            </button>
        </div>

        <div class="skills-ribbon-wrapper">
            <div class="skills-ribbon" ref="ribbonRef">
                <TransitionGroup
                    name="skill-item"
                    tag="div"
                    class="skills-ribbon-inner"
                >
                    <div
                        v-for="(skill, i) in currentSkills"
                        :key="`${activeCategory}-${skill}`"
                        class="skill-pill"
                        :class="{ expanded: expandedSkill === skill }"
                        :style="{ '--idx': i, '--hue': (i * 37) % 360 }"
                        @click="
                            expandedSkill =
                                expandedSkill === skill ? null : skill
                        "
                    >
                        <div class="pill-bg" />

                        <div class="pill-content">
                            <div class="pill-icon">
                                <span class="pill-letter">{{
                                    skill.charAt(0)
                                }}</span>
                            </div>
                            <span class="pill-name">{{ skill }}</span>

                            <Transition name="detail-expand">
                                <div
                                    v-if="expandedSkill === skill"
                                    class="pill-detail"
                                >
                                    <div class="detail-bar">
                                        <div
                                            class="detail-bar-fill"
                                            :style="{
                                                width: `${getSkillLevel(skill)}%`,
                                            }"
                                        />
                                    </div>
                                    <span class="detail-level">{{
                                        getSkillLabel(skill)
                                    }}</span>
                                </div>
                            </Transition>
                        </div>

                        <div class="pill-corner tl" />
                        <div class="pill-corner br" />
                    </div>
                </TransitionGroup>
            </div>
        </div>

        <div class="skills-nav mt-4">
            <div class="nav-dots">
                <div
                    v-for="(category, idx) in categories"
                    :key="idx"
                    class="nav-dot"
                    :class="{ active: activeCategory === idx }"
                    @click="activeCategory = idx"
                />
            </div>
            <span class="text-caption text-medium-emphasis">
                {{ currentSkills.length }} {{ t("about.skillTechnologies") }}
            </span>
        </div>
    </div>
</template>

<script setup lang="ts">
import type { SkillCategory } from "~~/shared/types";

const { t } = useI18n();

const props = defineProps<{
    categories: SkillCategory[];
}>();

const activeCategory = ref(0);
const expandedSkill = ref<string | null>(null);
const ribbonRef = ref<HTMLElement | null>(null);

// Reset expanded skill BEFORE category switch so items leave without expanded state
watch(
    activeCategory,
    (_newVal, oldVal) => {
        // Immediately collapse any expanded skill so leave transition doesn't show it
        expandedSkill.value = null;
    },
    { flush: "sync" },
);

const currentSkills = computed(() => {
    return props.categories[activeCategory.value]?.skills || [];
});

// Simulated skill levels based on name hash
function getSkillLevel(skill: string): number {
    let hash = 0;
    for (const char of skill) hash = (hash << 5) - hash + char.charCodeAt(0);
    return 60 + (Math.abs(hash) % 35); // 60-95%
}

function getSkillLabel(skill: string): string {
    const level = getSkillLevel(skill);
    if (level >= 90) return t("about.skillExpert");
    if (level >= 75) return t("about.skillAdvanced");
    return t("about.skillProficient");
}
</script>

<style scoped>
.skills-universe {
    position: relative;
}

/* Category Tabs */
.category-tabs {
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
}

.cat-tab {
    display: inline-flex;
    align-items: center;
    padding: 8px 16px;
    border-radius: 24px;
    border: 1px solid rgb(var(--v-theme-on-surface), 0.1);
    background: rgb(var(--v-theme-surface));
    color: rgb(var(--v-theme-on-surface), 0.6);
    font-size: 0.8rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.cat-tab:hover {
    border-color: rgb(var(--v-theme-primary), 0.3);
    color: rgb(var(--v-theme-primary));
}

.cat-tab.active {
    background: rgb(var(--v-theme-primary));
    color: rgb(var(--v-theme-on-primary));
    border-color: rgb(var(--v-theme-primary));
    box-shadow: 0 4px 16px rgb(var(--v-theme-primary), 0.3);
}

.cat-count {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-width: 20px;
    height: 20px;
    border-radius: 10px;
    background: rgb(var(--v-theme-on-surface), 0.1);
    font-size: 0.65rem;
    font-weight: 700;
    margin-left: 6px;
    padding: 0 6px;
}

.cat-tab.active .cat-count {
    background: rgb(var(--v-theme-on-primary), 0.2);
}

/* Skills Ribbon - horizontal flow, wraps naturally */
.skills-ribbon-wrapper {
    position: relative;
    max-height: 340px;
    overflow-y: auto;
    overflow-x: hidden;
    scrollbar-width: thin;
    scrollbar-color: rgb(var(--v-theme-primary), 0.15) transparent;
}

.skills-ribbon-wrapper::-webkit-scrollbar {
    width: 3px;
}

.skills-ribbon-wrapper::-webkit-scrollbar-thumb {
    background: rgb(var(--v-theme-primary), 0.15);
    border-radius: 3px;
}

.skills-ribbon-inner {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    padding: 4px;
}

/* Skill Pill */
.skill-pill {
    position: relative;
    display: inline-flex;
    border-radius: 14px;
    cursor: pointer;
    overflow: hidden;
    animation: pill-enter 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) both;
    animation-delay: calc(var(--idx) * 40ms);
    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

@keyframes pill-enter {
    from {
        opacity: 0;
        transform: translateY(12px) scale(0.9);
    }
    to {
        opacity: 1;
        transform: translateY(0) scale(1);
    }
}

/* Pill background */
.pill-bg {
    position: absolute;
    inset: 0;
    background: rgb(var(--v-theme-surface));
    border: 1px solid rgb(var(--v-theme-on-surface), 0.08);
    border-radius: 14px;
    transition: all 0.4s ease;
}

.skill-pill:hover .pill-bg {
    border-color: rgb(var(--v-theme-primary), 0.4);
    box-shadow:
        0 0 20px rgb(var(--v-theme-primary), 0.1),
        inset 0 0 20px rgb(var(--v-theme-primary), 0.03);
}

.skill-pill.expanded .pill-bg {
    background: rgb(var(--v-theme-primary), 0.08);
    border-color: rgb(var(--v-theme-primary), 0.3);
    box-shadow: 0 8px 32px rgb(var(--v-theme-primary), 0.15);
}

/* Corner accents */
.pill-corner {
    position: absolute;
    width: 8px;
    height: 8px;
    opacity: 0;
    transition: all 0.3s ease;
}

.pill-corner.tl {
    top: 3px;
    left: 3px;
    border-top: 2px solid rgb(var(--v-theme-primary));
    border-left: 2px solid rgb(var(--v-theme-primary));
    border-radius: 3px 0 0 0;
}

.pill-corner.br {
    bottom: 3px;
    right: 3px;
    border-bottom: 2px solid rgb(var(--v-theme-primary));
    border-right: 2px solid rgb(var(--v-theme-primary));
    border-radius: 0 0 3px 0;
}

.skill-pill:hover .pill-corner {
    opacity: 0.5;
}

.skill-pill.expanded .pill-corner {
    opacity: 0.8;
}

/* Pill content */
.pill-content {
    position: relative;
    z-index: 1;
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 10px 16px;
    min-height: 44px;
}

.pill-icon {
    width: 28px;
    height: 28px;
    border-radius: 8px;
    background: linear-gradient(
        135deg,
        rgb(var(--v-theme-primary), 0.15),
        rgb(var(--v-theme-secondary), 0.15)
    );
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    transition: all 0.3s ease;
}

.skill-pill:hover .pill-icon {
    transform: rotate(-8deg) scale(1.1);
    background: linear-gradient(
        135deg,
        rgb(var(--v-theme-primary), 0.25),
        rgb(var(--v-theme-secondary), 0.25)
    );
}

.skill-pill.expanded .pill-icon {
    transform: rotate(0) scale(1.15);
    background: rgb(var(--v-theme-primary), 0.2);
}

.pill-letter {
    font-size: 0.75rem;
    font-weight: 800;
    font-family: var(--font-heading);
    background: linear-gradient(
        135deg,
        rgb(var(--v-theme-primary)),
        rgb(var(--v-theme-secondary))
    );
    background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
}

.pill-name {
    font-size: 0.82rem;
    font-weight: 600;
    color: rgb(var(--v-theme-on-surface), 0.8);
    white-space: nowrap;
    transition: color 0.3s ease;
}

.skill-pill:hover .pill-name {
    color: rgb(var(--v-theme-primary));
}

.skill-pill.expanded .pill-name {
    color: rgb(var(--v-theme-primary));
    font-weight: 700;
}

/* Expanded detail section */
.pill-detail {
    display: flex;
    align-items: center;
    gap: 8px;
    padding-left: 8px;
    border-left: 1px solid rgb(var(--v-theme-primary), 0.2);
    margin-left: 4px;
}

.detail-bar {
    width: 48px;
    height: 4px;
    border-radius: 2px;
    background: rgb(var(--v-theme-on-surface), 0.08);
    overflow: hidden;
}

.detail-bar-fill {
    height: 100%;
    border-radius: 2px;
    background: linear-gradient(
        90deg,
        rgb(var(--v-theme-primary)),
        rgb(var(--v-theme-secondary))
    );
    transition: width 0.6s cubic-bezier(0.4, 0, 0.2, 1);
}

.detail-level {
    font-size: 0.65rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    color: rgb(var(--v-theme-primary));
    white-space: nowrap;
}

/* Detail expand transition */
.detail-expand-enter-active {
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.detail-expand-leave-active {
    transition: all 0.2s ease-in;
}

.detail-expand-enter-from,
.detail-expand-leave-to {
    opacity: 0;
    max-width: 0;
    padding-left: 0;
    margin-left: 0;
}

/* TransitionGroup */
.skill-item-enter-active {
    transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.skill-item-leave-active {
    /* Instant removal — no lingering expanded pills */
    display: none;
}

.skill-item-enter-from {
    opacity: 0;
    transform: scale(0.8) translateY(8px);
}

/* Navigation */
.skills-nav {
    display: flex;
    align-items: center;
    justify-content: space-between;
}

.nav-dots {
    display: flex;
    gap: 6px;
}

.nav-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: rgb(var(--v-theme-on-surface), 0.15);
    cursor: pointer;
    transition: all 0.3s ease;
}

.nav-dot:hover {
    background: rgb(var(--v-theme-primary), 0.4);
}

.nav-dot.active {
    background: rgb(var(--v-theme-primary));
    width: 24px;
    border-radius: 4px;
}

/* Responsive */
@media (max-width: 600px) {
    .skills-ribbon-wrapper {
        max-height: 260px;
    }

    .pill-content {
        padding: 8px 12px;
    }

    .pill-name {
        font-size: 0.75rem;
    }
}
</style>
