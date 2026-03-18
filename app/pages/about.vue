<template>
    <div class="about-page">
        <v-parallax
            src="/images/about/background_009.png"
            height="450"
            class="about-hero-parallax"
        >
            <div class="hero-overlay">
                <AnimatedSection animation="fadeInUp">
                    <div class="text-center">
                        <v-chip
                            color="primary"
                            variant="elevated"
                            size="small"
                            class="mb-4"
                        >
                            <v-icon start size="14">mdi-code-braces</v-icon>
                            {{ t("about.badge") }}
                        </v-chip>
                        <h1 class="hero-title">{{ t("about.title") }}</h1>
                        <p class="hero-subtitle">{{ t("about.subtitle") }}</p>
                        <div class="hero-line" />
                    </div>
                </AnimatedSection>
            </div>
        </v-parallax>

        <section class="about-section personal-section">
            <div class="personal-bg">
                <div class="personal-particles">
                    <div
                        v-for="n in 15"
                        :key="n"
                        class="p-particle"
                        :style="pParticleStyle(n)"
                    />
                </div>
                <div class="personal-grid-overlay" />
            </div>
            <v-container>
                <AnimatedSection animation="fadeInUp">
                    <v-row align="center">
                        <v-col cols="12" md="8">
                            <PersonalInfo :about="aboutData" />
                        </v-col>
                        <v-col cols="12" md="4">
                            <div class="stats-grid">
                                <v-card
                                    v-for="stat in statsData"
                                    :key="stat.label"
                                    variant="outlined"
                                    class="stat-card"
                                    hover
                                >
                                    <v-card-text class="text-center pa-4">
                                        <v-icon
                                            :color="stat.color || 'primary'"
                                            size="32"
                                            class="mb-2"
                                            >{{ stat.icon }}</v-icon
                                        >
                                        <div class="stat-number text-primary">
                                            {{ stat.value }}
                                        </div>
                                        <div class="stat-label">
                                            {{ stat.label }}
                                        </div>
                                    </v-card-text>
                                </v-card>
                            </div>
                        </v-col>
                    </v-row>
                </AnimatedSection>

                <AnimatedSection animation="fadeInUp" :delay="300">
                    <div class="quick-info-row mt-8">
                        <v-chip
                            v-for="info in quickInfoItems"
                            :key="info.text"
                            variant="tonal"
                            :color="info.color"
                            size="small"
                            class="quick-info-chip"
                        >
                            <v-icon start size="14">{{ info.icon }}</v-icon>
                            {{ info.text }}
                        </v-chip>
                    </div>
                </AnimatedSection>
            </v-container>
        </section>

        <section class="about-section tech-stack-section">
            <div class="tech-stack-bg" />
            <v-container>
                <AnimatedSection animation="scaleIn">
                    <div class="text-center mb-8">
                        <v-chip
                            color="primary"
                            variant="elevated"
                            size="small"
                            class="mb-3"
                        >
                            <v-icon start size="14">mdi-radar</v-icon>
                            {{ t("about.techStack") }}
                        </v-chip>
                        <h2 class="section-heading">
                            {{ t("about.techStack") }}
                        </h2>
                        <p class="section-subheading">
                            {{ t("about.techStackSub") }}
                        </p>
                    </div>
                </AnimatedSection>
                <AnimatedSection animation="fadeInUp" :delay="200">
                    <v-row justify="center">
                        <v-col cols="12" md="10" lg="8">
                            <TechRadar />
                        </v-col>
                    </v-row>
                </AnimatedSection>
            </v-container>
        </section>

        <section class="about-section">
            <v-container>
                <AnimatedSection animation="slideInLeft">
                    <div class="text-center mb-8">
                        <v-chip
                            color="secondary"
                            variant="elevated"
                            size="small"
                            class="mb-3"
                        >
                            <v-icon start size="14">mdi-timeline-clock</v-icon>
                            {{ t("about.timelineTitle") }}
                        </v-chip>
                        <h2 class="section-heading">
                            {{ t("about.timelineTitle") }}
                        </h2>
                    </div>
                </AnimatedSection>
                <AnimatedSection animation="fadeInUp" :delay="200">
                    <Timeline
                        :entries="aboutData?.timeline || defaultTimeline"
                    />
                </AnimatedSection>
            </v-container>
        </section>

        <v-parallax
            src="/images/about/background_008.png"
            height="auto"
            class="section-parallax philosophy-parallax"
        >
            <div class="parallax-overlay py-12">
                <v-container>
                    <AnimatedSection animation="fadeIn">
                        <div class="text-center mb-8">
                            <v-chip
                                color="primary"
                                variant="elevated"
                                size="small"
                                class="mb-3"
                            >
                                <v-icon start size="14">mdi-lightbulb</v-icon>
                                {{ t("about.philosophy") }}
                            </v-chip>
                            <h2 class="section-heading">
                                {{ t("about.philosophy") }}
                            </h2>
                            <p class="section-subheading">
                                {{ t("about.philosophySub") }}
                            </p>
                        </div>
                    </AnimatedSection>

                    <v-row>
                        <v-col
                            v-for="(item, i) in philosophyItems"
                            :key="item.title"
                            cols="12"
                            sm="6"
                            md="3"
                        >
                            <AnimatedSection
                                :animation="
                                    i % 2 === 0 ? 'slideInLeft' : 'slideInRight'
                                "
                                :delay="i * 100"
                            >
                                <v-card
                                    class="philosophy-card"
                                    variant="outlined"
                                    hover
                                >
                                    <v-card-text class="text-center pa-5">
                                        <v-avatar
                                            size="56"
                                            :color="item.color"
                                            variant="tonal"
                                            class="mb-3"
                                        >
                                            <v-icon size="28">{{
                                                item.icon
                                            }}</v-icon>
                                        </v-avatar>
                                        <h3
                                            class="text-subtitle-1 font-weight-bold mb-2"
                                        >
                                            {{ item.title }}
                                        </h3>
                                        <p
                                            class="text-body-2 text-medium-emphasis mb-0"
                                        >
                                            {{ item.desc }}
                                        </p>
                                    </v-card-text>
                                </v-card>
                            </AnimatedSection>
                        </v-col>
                    </v-row>
                </v-container>
            </div>
        </v-parallax>

        <section class="about-section">
            <v-container>
                <AnimatedSection animation="fadeInUp">
                    <div class="text-center mb-8">
                        <v-chip
                            color="primary"
                            variant="elevated"
                            size="small"
                            class="mb-3"
                        >
                            <v-icon start size="14">mdi-code-tags</v-icon>
                            {{ t("about.skillsTitle") }}
                        </v-chip>
                        <h2 class="section-heading">
                            {{ t("about.skillsTitle") }}
                        </h2>
                    </div>
                </AnimatedSection>

                <v-row>
                    <v-col cols="12" md="7">
                        <AnimatedSection animation="slideInLeft" :delay="100">
                            <SkillsGrid
                                :categories="
                                    aboutData?.skillCategories || defaultSkills
                                "
                            />
                        </AnimatedSection>
                    </v-col>
                    <v-col cols="12" md="5">
                        <AnimatedSection animation="slideInRight" :delay="200">
                            <EducationCard
                                :education="
                                    aboutData?.education || defaultEducation
                                "
                            />
                        </AnimatedSection>
                    </v-col>
                </v-row>
            </v-container>
        </section>

        <section class="about-section coding-journey-section">
            <div class="coding-journey-bg" />
            <v-container>
                <AnimatedSection animation="fadeInUp">
                    <div class="text-center mb-8">
                        <v-chip
                            color="secondary"
                            variant="elevated"
                            size="small"
                            class="mb-3"
                        >
                            <v-icon start size="14">mdi-rocket-launch</v-icon>
                            {{ t("about.journeyTitle") }}
                        </v-chip>
                        <h2 class="section-heading">
                            {{ t("about.journeyTitle") }}
                        </h2>
                        <p class="section-subheading">
                            {{ t("about.journeySub") }}
                        </p>
                    </div>
                </AnimatedSection>
                <AnimatedSection animation="scaleIn" :delay="200">
                    <CodingJourney />
                </AnimatedSection>
            </v-container>
        </section>

        <v-parallax
            src="/images/about/background_010.png"
            height="auto"
            class="section-parallax"
        >
            <div class="parallax-overlay py-12">
                <v-container>
                    <AnimatedSection animation="scaleIn">
                        <div class="text-center mb-8">
                            <v-chip
                                color="primary"
                                variant="elevated"
                                size="small"
                                class="mb-3"
                            >
                                <v-icon start size="14">mdi-toolbox</v-icon>
                                {{ t("about.tools") }}
                            </v-chip>
                            <h2 class="section-heading">
                                {{ t("about.tools") }}
                            </h2>
                            <p class="section-subheading">
                                {{ t("about.toolsSub") }}
                            </p>
                        </div>
                    </AnimatedSection>
                    <AnimatedSection animation="fadeInUp" :delay="200">
                        <DailyTools />
                    </AnimatedSection>
                </v-container>
            </div>
        </v-parallax>

        <section class="about-section">
            <v-container>
                <AnimatedSection animation="fadeInUp">
                    <div class="text-center mb-8">
                        <v-chip
                            color="primary"
                            variant="elevated"
                            size="small"
                            class="mb-3"
                        >
                            <v-icon start size="14">mdi-github</v-icon>
                            {{ t("about.githubStats") }}
                        </v-chip>
                        <h2 class="section-heading">
                            {{ t("about.githubStats") }}
                        </h2>
                        <p class="section-subheading">
                            {{ t("about.githubStatsSub") }}
                        </p>
                    </div>
                </AnimatedSection>
                <AnimatedSection animation="scaleIn" :delay="200">
                    <GitHubStats />
                </AnimatedSection>
            </v-container>
        </section>

        <v-parallax
            src="https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?w=1920&q=80"
            height="auto"
            class="section-parallax"
        >
            <div class="parallax-overlay py-12">
                <v-container>
                    <AnimatedSection animation="blurIn">
                        <div class="text-center mb-8">
                            <v-chip
                                color="primary"
                                variant="elevated"
                                size="small"
                                class="mb-3"
                            >
                                <v-icon start size="14">mdi-map-marker</v-icon>
                                {{ t("about.locationTitle") }}
                            </v-chip>
                            <h2 class="section-heading">
                                {{ t("about.locationTitle") }}
                            </h2>
                        </div>
                    </AnimatedSection>
                    <AnimatedSection animation="fadeInUp" :delay="200">
                        <MapSection
                            :lat="aboutData?.mapCoordinates?.lat || -23.5505"
                            :lng="aboutData?.mapCoordinates?.lng || -46.6333"
                        />
                    </AnimatedSection>
                </v-container>
            </div>
        </v-parallax>

        <section class="about-section testimonial-bg-section">
            <div class="testimonial-bg" />
            <v-container>
                <AnimatedSection animation="fadeInUp">
                    <TestimonialSection />
                </AnimatedSection>
            </v-container>
        </section>
    </div>
</template>

<script setup lang="ts">
import type {
    AboutContent,
    TimelineEntry,
    SkillCategory,
    Education,
} from "~~/shared/types";

const { t } = useI18n();

useHead({ title: t("about.metaTitle") });

const { data: aboutData } = await useFetch<AboutContent>("/api/public/about");

const statsData = computed(() => [
    {
        value: "2+",
        label: t("about.yearsExp"),
        icon: "mdi-briefcase-clock",
        color: "primary",
    },
    {
        value: "15+",
        label: t("about.technologies"),
        icon: "mdi-language-typescript",
        color: "secondary",
    },
    {
        value: "∞",
        label: t("about.passion"),
        icon: "mdi-heart-pulse",
        color: "error",
    },
]);

const quickInfoItems = computed(() => [
    {
        text: t("about.chipFullstack"),
        icon: "mdi-code-braces",
        color: "primary",
    },
    { text: t("about.chipLocation"), icon: "mdi-map-marker", color: "info" },
    { text: t("about.chipVueExpert"), icon: "mdi-vuejs", color: "success" },
    { text: t("about.chipOpenSource"), icon: "mdi-github", color: "default" },
    { text: t("about.chipEngineering"), icon: "mdi-school", color: "warning" },
    {
        text: t("about.chipAvailable"),
        icon: "mdi-briefcase-check",
        color: "secondary",
    },
]);

function pParticleStyle(n: number) {
    const seed = n * 7.9;
    return {
        "--px": `${(seed * 13.7) % 100}%`,
        "--py": `${(seed * 11.3) % 100}%`,
        "--ps": `${2 + (n % 4) * 2}px`,
        "--pd": `${12 + (n % 8) * 3}s`,
        "--pdelay": `${-(n % 10) * 1.5}s`,
    };
}

const philosophyItems = computed(() => [
    {
        icon: "mdi-broom",
        title: t("about.cleanCode"),
        desc: t("about.cleanCodeDesc"),
        color: "primary",
    },
    {
        icon: "mdi-speedometer",
        title: t("about.performance"),
        desc: t("about.performanceDesc"),
        color: "warning",
    },
    {
        icon: "mdi-account-heart",
        title: t("about.userFirst"),
        desc: t("about.userFirstDesc"),
        color: "success",
    },
    {
        icon: "mdi-school",
        title: t("about.continuousLearning"),
        desc: t("about.continuousLearningDesc"),
        color: "info",
    },
    {
        icon: "mdi-shield-check",
        title: t("about.securityFirst"),
        desc: t("about.securityFirstDesc"),
        color: "error",
    },
    {
        icon: "mdi-puzzle",
        title: t("about.modularDesign"),
        desc: t("about.modularDesignDesc"),
        color: "secondary",
    },
    {
        icon: "mdi-test-tube",
        title: t("about.testDriven"),
        desc: t("about.testDrivenDesc"),
        color: "primary",
    },
    {
        icon: "mdi-earth",
        title: t("about.accessibilityTitle"),
        desc: t("about.accessibilityDesc"),
        color: "info",
    },
]);

const defaultTimeline: TimelineEntry[] = [
    {
        year: "2023",
        title: "Desenvolvedor Junior",
        description:
            "Inicio da carreira como desenvolvedor fullstack na SaltCode, desde 21/11/2023",
        company: "SaltCode",
        icon: "mdi-briefcase",
        type: "work",
    },
    {
        year: "2022",
        title: "Desenvolvedor Frontend Junior",
        description: "1 ano de experiencia em desenvolvimento frontend",
        company: "NossBank",
        icon: "mdi-briefcase",
        type: "work",
    },
    {
        year: "2022",
        title: "Engenharia de Software",
        description: "Inicio do bacharelado em Engenharia de Software",
        company: "UNINTER",
        icon: "mdi-school",
        type: "education",
    },
];

const defaultSkills: SkillCategory[] = [
    {
        name: "Frontend",
        icon: "mdi-monitor",
        skills: [
            "HTML",
            "CSS",
            "JavaScript",
            "TypeScript",
            "Angular",
            "React",
            "React Native",
            "Next.js",
            "Vue 2/3",
            "Nuxt 3/4",
        ],
    },
    {
        name: "Backend",
        icon: "mdi-server",
        skills: [
            "Node.js",
            "NestJS",
            "Python",
            "Django",
            "MongoDB",
            "AWS",
            "PostgreSQL",
            "SQL",
            "REST API",
            "Docker",
            "MySQL",
            "TypeORM",
            "Knex.js",
        ],
    },
    {
        name: "Tools",
        icon: "mdi-wrench",
        skills: ["Git", "GitHub", "VS Code", "Docker", "Vercel"],
    },
];

const defaultEducation: Education[] = [
    {
        institution: "UNINTER",
        degree: "Bacharelado em Engenharia de Software",
        period: "2022 - Present",
        status: "in-progress",
        description:
            "Focusing on software architecture, algorithms, databases, and modern development practices. Combining theoretical knowledge with hands-on project experience.",
    },
];
</script>

<style scoped>
.about-page {
    overflow-x: hidden;
}

/* Hero Parallax */
.about-hero-parallax {
    position: relative;
}

.hero-overlay {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
    background: linear-gradient(
        180deg,
        rgba(0, 0, 0, 0.5) 0%,
        rgba(0, 0, 0, 0.7) 100%
    );
    padding: 80px 24px;
}

.hero-title {
    font-size: clamp(2.5rem, 6vw, 4rem);
    font-weight: 900;
    font-family: var(--font-heading);
    color: #ffffff;
    margin-bottom: 8px;
    text-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
}

.hero-subtitle {
    font-size: 1.2rem;
    color: rgba(255, 255, 255, 0.8);
    margin-bottom: 20px;
}

.hero-line {
    width: 80px;
    height: 4px;
    background: rgb(var(--v-theme-primary));
    margin: 0 auto;
    border-radius: 2px;
    box-shadow: 0 0 20px rgb(var(--v-theme-primary), 0.5);
}

/* Section Parallax */
.section-parallax {
    position: relative;
}

.parallax-overlay {
    min-height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    background: linear-gradient(
        180deg,
        rgba(0, 0, 0, 0.65) 0%,
        rgba(0, 0, 0, 0.75) 100%
    );
    padding: 60px 0;
}

.parallax-overlay .section-heading,
.parallax-overlay .section-subheading {
    color: #ffffff !important;
}

.parallax-overlay .section-subheading {
    opacity: 0.75;
}

/* About sections */
.about-section {
    padding: 60px 0;
    position: relative;
    overflow: visible;
}

/* Personal section animated background */
.personal-section {
    overflow: hidden;
}

.personal-bg {
    position: absolute;
    inset: 0;
    pointer-events: none;
}

.personal-particles {
    position: absolute;
    inset: 0;
}

.p-particle {
    position: absolute;
    left: var(--px);
    top: var(--py);
    width: var(--ps);
    height: var(--ps);
    border-radius: 50%;
    background: rgb(var(--v-theme-primary));
    opacity: 0.08;
    animation: p-float var(--pd) ease-in-out infinite;
    animation-delay: var(--pdelay);
}

@keyframes p-float {
    0%,
    100% {
        transform: translate(0, 0);
    }
    50% {
        transform: translate(15px, -25px);
    }
}

.personal-grid-overlay {
    position: absolute;
    inset: 0;
    background-image:
        radial-gradient(
            circle at 20% 80%,
            rgb(var(--v-theme-primary), 0.04) 0%,
            transparent 50%
        ),
        radial-gradient(
            circle at 80% 20%,
            rgb(var(--v-theme-secondary), 0.04) 0%,
            transparent 50%
        );
}

.quick-info-row {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    justify-content: center;
}

.quick-info-chip {
    transition: all 0.2s ease;
}

.quick-info-chip:hover {
    transform: translateY(-2px);
}

/* Tech stack section - no parallax to prevent clipping */
.tech-stack-section {
    overflow: hidden;
}

.tech-stack-bg {
    position: absolute;
    inset: 0;
    background:
        radial-gradient(
            ellipse at 30% 50%,
            rgb(var(--v-theme-primary), 0.06) 0%,
            transparent 60%
        ),
        radial-gradient(
            ellipse at 70% 50%,
            rgb(var(--v-theme-secondary), 0.04) 0%,
            transparent 60%
        ),
        linear-gradient(
            180deg,
            rgb(var(--v-theme-background)) 0%,
            rgb(var(--v-theme-surface), 0.5) 50%,
            rgb(var(--v-theme-background)) 100%
        );
    pointer-events: none;
}

.section-heading {
    font-size: clamp(1.6rem, 4vw, 2.2rem);
    font-weight: 800;
    font-family: var(--font-heading);
    margin-bottom: 8px;
}

.section-subheading {
    font-size: 1rem;
    color: rgb(var(--v-theme-on-surface), 0.6);
    max-width: 500px;
    margin: 0 auto;
}

/* Stats Grid */
.stats-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 12px;
}

.stat-card {
    border-color: rgb(var(--v-theme-primary), 0.15) !important;
    border-radius: 16px !important;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
}

.stat-card:hover {
    border-color: rgb(var(--v-theme-primary), 0.4) !important;
    transform: translateY(-4px);
    box-shadow: 0 12px 32px rgb(var(--v-theme-primary), 0.12) !important;
}

.stat-number {
    font-size: 2rem;
    font-weight: 900;
    font-family: var(--font-heading);
}

.stat-label {
    font-size: 0.75rem;
    text-transform: uppercase;
    letter-spacing: 1px;
    color: rgb(var(--v-theme-on-surface), 0.5);
    margin-top: 2px;
}

/* Philosophy Cards */
.philosophy-card {
    border-color: rgba(255, 255, 255, 0.1) !important;
    background: rgba(255, 255, 255, 0.06) !important;
    backdrop-filter: blur(12px);
    border-radius: 16px !important;
    transition: all 0.3s ease !important;
    height: 100%;
}

.philosophy-card:hover {
    border-color: rgb(var(--v-theme-primary), 0.4) !important;
    transform: translateY(-6px);
    box-shadow: 0 16px 40px rgba(0, 0, 0, 0.3) !important;
}

.philosophy-card h3,
.philosophy-card p {
    color: #ffffff !important;
}

.philosophy-card p {
    opacity: 0.7;
}

/* Testimonial section background */
.coding-journey-section {
    overflow: hidden;
}

.coding-journey-bg {
    position: absolute;
    inset: 0;
    background:
        radial-gradient(
            ellipse at 50% 30%,
            rgb(var(--v-theme-secondary), 0.05) 0%,
            transparent 50%
        ),
        radial-gradient(
            ellipse at 30% 80%,
            rgb(var(--v-theme-primary), 0.04) 0%,
            transparent 50%
        ),
        linear-gradient(
            180deg,
            rgb(var(--v-theme-background)) 0%,
            rgb(var(--v-theme-surface), 0.3) 50%,
            rgb(var(--v-theme-background)) 100%
        );
    pointer-events: none;
}

.testimonial-bg-section {
    overflow: hidden;
}

.testimonial-bg {
    position: absolute;
    inset: 0;
    background:
        radial-gradient(
            ellipse at 20% 20%,
            rgb(var(--v-theme-primary), 0.04) 0%,
            transparent 50%
        ),
        radial-gradient(
            ellipse at 80% 80%,
            rgb(var(--v-theme-secondary), 0.04) 0%,
            transparent 50%
        ),
        linear-gradient(
            180deg,
            rgb(var(--v-theme-surface), 0.3) 0%,
            rgb(var(--v-theme-background)) 50%,
            rgb(var(--v-theme-surface), 0.3) 100%
        );
    pointer-events: none;
}
</style>
