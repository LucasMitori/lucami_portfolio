<template>
    <div class="home-page">
        <HeroSection />

        <section
            ref="skillsRef"
            class="page-section skills-section"
            :class="{ revealed: skillsVisible }"
        >
            <div class="section-blend-top" />
            <SkillsCarousel @skill-click="openSkillDialog" />
            <div class="section-blend-bottom" />
        </section>

        <section
            ref="statsRef"
            class="page-section stats-section"
            :class="{ revealed: statsVisible }"
        >
            <StatsCards />
        </section>

        <section
            ref="projectsRef"
            class="page-section projects-section"
            :class="{ revealed: projectsVisible }"
        >
            <div class="section-blend-top" />
            <v-container>
                <v-row>
                    <v-col cols="12" md="8">
                        <FeaturedProjects />
                    </v-col>
                    <v-col cols="12" md="4">
                        <GameZone />
                        <div class="game-explanation mt-4">
                            <v-card variant="outlined" class="game-info-card">
                                <v-card-text class="pa-4">
                                    <div class="d-flex align-center gap-2 mb-2">
                                        <v-icon size="18" color="primary"
                                            >mdi-information</v-icon
                                        >
                                        <span
                                            class="text-subtitle-2 font-weight-bold"
                                            >{{
                                                t("games.explanationTitle")
                                            }}</span
                                        >
                                    </div>
                                    <p
                                        class="text-body-2 text-medium-emphasis mb-0"
                                    >
                                        {{ currentGameDescription }}
                                    </p>
                                </v-card-text>
                            </v-card>
                        </div>
                    </v-col>
                </v-row>

                <v-row class="mt-6">
                    <v-col cols="12">
                        <AnimatedSection animation="fadeInUp" :delay="200">
                            <CommentSection section="games" />
                        </AnimatedSection>
                    </v-col>
                </v-row>
            </v-container>
            <div class="section-blend-bottom" />
        </section>

        <section
            ref="contactRef"
            class="page-section contact-section"
            :class="{ revealed: contactVisible }"
        >
            <ContactCTA />
        </section>

        <SkillDialog
            v-model="showSkillDialog"
            :skill="selectedSkill"
            :projects="projects || []"
        />
    </div>
</template>

<script setup lang="ts">
import type { Project } from "~~/shared/types";

const { t } = useI18n();
const themeStore = useThemeStore();

useHead({ title: t("home.metaTitle") });

const currentGameDescription = computed(() => {
    switch (themeStore.currentThemeSlug) {
        case "retro":
            return t("games.retroRacer");
        case "nerd":
            return t("games.memoryCards");
        case "coding":
            return t("games.codeChess");
        default:
            return t("games.ticTacToe");
    }
});
useSeoMeta({
    title: "Lucas Mitori | Fullstack Developer",
    description:
        "Portfolio of Lucas Mitori - Fullstack Developer based in Sao Paulo, Brazil",
});

const showSkillDialog = ref(false);
const selectedSkill = ref<{
    name: string;
    icon: string;
    level: number;
    color: string;
    category: string;
} | null>(null);
const { data: projects } = await useFetch<Project[]>("/api/github/repos");

function openSkillDialog(skill: {
    name: string;
    icon: string;
    level: number;
    color: string;
    category: string;
}) {
    selectedSkill.value = skill;
    showSkillDialog.value = true;
}

// Scroll-reveal with IntersectionObserver
const skillsRef = ref<HTMLElement | null>(null);
const statsRef = ref<HTMLElement | null>(null);
const projectsRef = ref<HTMLElement | null>(null);
const contactRef = ref<HTMLElement | null>(null);

const skillsVisible = ref(false);
const statsVisible = ref(false);
const projectsVisible = ref(false);
const contactVisible = ref(false);

onMounted(() => {
    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    const el = entry.target as HTMLElement;
                    if (el === skillsRef.value) skillsVisible.value = true;
                    if (el === statsRef.value) statsVisible.value = true;
                    if (el === projectsRef.value) projectsVisible.value = true;
                    if (el === contactRef.value) contactVisible.value = true;
                }
            });
        },
        { threshold: 0.08, rootMargin: "0px 0px -60px 0px" },
    );
    if (skillsRef.value) observer.observe(skillsRef.value);
    if (statsRef.value) observer.observe(statsRef.value);
    if (projectsRef.value) observer.observe(projectsRef.value);
    if (contactRef.value) observer.observe(contactRef.value);
});
</script>

<style scoped>
/* Scroll-reveal sections */
.page-section {
    position: relative;
    opacity: 0;
    transform: translateY(60px);
    transition:
        opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1),
        transform 0.8s cubic-bezier(0.16, 1, 0.3, 1);
}

.page-section.revealed {
    opacity: 1;
    transform: translateY(0);
}

/* Gradient blends between sections */
.section-blend-top {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 120px;
    background: linear-gradient(
        180deg,
        rgb(var(--v-theme-background)) 0%,
        transparent 100%
    );
    z-index: 5;
    pointer-events: none;
}

.section-blend-bottom {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 120px;
    background: linear-gradient(
        0deg,
        rgb(var(--v-theme-background)) 0%,
        transparent 100%
    );
    z-index: 5;
    pointer-events: none;
}

/* Skills section */
.skills-section {
    padding-bottom: 40px;
    background: rgb(var(--v-theme-surface));
    overflow: hidden;
}

/* Stats section */
.stats-section {
    padding: 40px 0;
}

/* Projects section */
.projects-section {
    padding: 60px 0 80px;
    overflow: hidden;
}

.game-info-card {
    border-color: rgb(var(--v-theme-primary), 0.15) !important;
    border-radius: 12px !important;
}

/* Contact section */
.contact-section {
    background: rgb(var(--v-theme-surface));
    overflow: hidden;
}
</style>
