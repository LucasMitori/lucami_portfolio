<template>
    <section class="hero-section">
        <div class="hero-bg-effects">
            <canvas ref="particleCanvas" class="particle-canvas" />
            <div class="grid-overlay" />
            <div class="gradient-orb orb-1" />
            <div class="gradient-orb orb-2" />
            <div class="gradient-orb orb-3" />
        </div>

        <v-container class="hero-container" fluid>
            <v-row align="center" justify="center" class="hero-row">
                <v-col cols="12" md="6" class="hero-text-col">
                    <div ref="heroContent" class="hero-content">
                        <div class="hero-badge mb-3">
                            <span class="badge-dot" />
                            <span class="badge-text">{{
                                t("home.heroSubtitleStatic")
                            }}</span>
                        </div>

                        <h1 class="hero-title mb-2">
                            <span class="title-line">Lucas</span>
                            <span class="title-line title-accent">Mitori</span>
                        </h1>

                        <div class="hero-typewriter mb-4">
                            <span class="typewriter-prefix">&gt;</span>
                            <TypewriterText
                                :texts="heroSubtitles"
                                :speed="60"
                                :pause-duration="2000"
                            />
                        </div>

                        <p class="hero-description mb-5">
                            {{ t("home.heroDescription") }}
                        </p>

                        <div class="hero-actions d-flex gap-3 flex-wrap">
                            <v-btn
                                color="primary"
                                size="large"
                                prepend-icon="mdi-code-braces"
                                rounded="lg"
                                :to="localePath('/projects')"
                            >
                                {{ t("home.heroCta") }}
                            </v-btn>
                            <v-btn
                                variant="outlined"
                                size="large"
                                prepend-icon="mdi-account"
                                rounded="lg"
                                :to="localePath('/about')"
                            >
                                {{ t("home.heroCtaSecondary") }}
                            </v-btn>
                        </div>

                        <div class="hero-stats d-flex gap-5 mt-6">
                            <div
                                v-for="stat in stats"
                                :key="stat.label"
                                class="stat-item"
                            >
                                <span class="stat-number">{{
                                    stat.value
                                }}</span>
                                <span class="stat-label">{{ stat.label }}</span>
                            </div>
                        </div>
                    </div>
                </v-col>

                <v-col
                    cols="12"
                    md="6"
                    class="hero-visual-col d-none d-md-flex"
                >
                    <div ref="heroVisual" class="hero-visual">
                        <div class="code-window">
                            <div class="code-header">
                                <span class="dot red" /><span
                                    class="dot yellow"
                                /><span class="dot green" />
                                <span class="code-title">portfolio.ts</span>
                            </div>
                            <div class="code-body">
                                <div class="code-line">
                                    <span class="line-num">1</span
                                    ><span class="kw">const</span>
                                    <span class="var">developer</span> = {
                                </div>
                                <div class="code-line">
                                    <span class="line-num">2</span>
                                    <span class="prop">name</span>:
                                    <span class="str">"Lucas Mitori"</span>,
                                </div>
                                <div class="code-line">
                                    <span class="line-num">3</span>
                                    <span class="prop">role</span>:
                                    <span class="str"
                                        >"Fullstack Developer"</span
                                    >,
                                </div>
                                <div class="code-line">
                                    <span class="line-num">4</span>
                                    <span class="prop">location</span>:
                                    <span class="str">"São Paulo, BR"</span>,
                                </div>
                                <div class="code-line">
                                    <span class="line-num">5</span>
                                    <span class="prop">company</span>:
                                    <span class="str">"SaltCode"</span>,
                                </div>
                                <div class="code-line">
                                    <span class="line-num">6</span>
                                    <span class="prop">skills</span>: [<span
                                        class="str"
                                        >"Vue"</span
                                    >, <span class="str">"Nuxt"</span>,
                                    <span class="str">"Node"</span>,
                                    <span class="str">"..."</span>],
                                </div>
                                <div class="code-line">
                                    <span class="line-num">7</span>
                                    <span class="prop">passion</span>:
                                    <span class="bool">true</span>,
                                </div>
                                <div class="code-line">
                                    <span class="line-num">8</span>};
                                </div>
                                <div class="code-line">
                                    <span class="line-num">9</span>
                                </div>
                                <div class="code-line">
                                    <span class="line-num">10</span
                                    ><span class="kw">export default</span>
                                    developer;
                                </div>
                                <div class="code-cursor" />
                            </div>
                        </div>
                        <div class="orbit-ring">
                            <div
                                v-for="(tech, i) in orbitTechs"
                                :key="tech.name"
                                class="orbit-item"
                                :style="getOrbitStyle(i)"
                            >
                                <v-icon size="20" color="primary">{{
                                    tech.icon
                                }}</v-icon>
                            </div>
                        </div>
                        <div class="float-badge badge-1">
                            <v-icon size="14" color="success"
                                >mdi-check-circle</v-icon
                            >
                            <span>Available for hire</span>
                        </div>
                        <div class="float-badge badge-2">
                            <v-icon size="14" color="info">mdi-git</v-icon>
                            <span>50+ repos</span>
                        </div>
                    </div>
                </v-col>
            </v-row>
        </v-container>

        <div class="scroll-indicator" @click="scrollDown">
            <div class="mouse"><div class="wheel" /></div>
            <span class="scroll-text">scroll</span>
        </div>
    </section>
</template>

<script setup lang="ts">
const { t } = useI18n();
const localePath = useLocalePath();
const { animateEntrance } = useAnime();

const heroContent = ref<HTMLElement | null>(null);
const heroVisual = ref<HTMLElement | null>(null);
const particleCanvas = ref<HTMLCanvasElement | null>(null);

const heroSubtitles = computed(() => [
    t("home.heroSubtitle1"),
    t("home.heroSubtitle2"),
    t("home.heroSubtitle3"),
]);

const stats = computed(() => [
    { value: "2+", label: t("about.yearsExp") },
    { value: "15+", label: t("about.technologies") },
    { value: "50+", label: "Projects" },
]);

const orbitTechs = [
    { name: "Vue", icon: "mdi-vuejs" },
    { name: "Node", icon: "mdi-nodejs" },
    { name: "TypeScript", icon: "mdi-language-typescript" },
    { name: "Python", icon: "mdi-language-python" },
    { name: "Docker", icon: "mdi-docker" },
    { name: "Database", icon: "mdi-database" },
];

function getOrbitStyle(index: number) {
    const angle = (360 / orbitTechs.length) * index - 90;
    const rad = (angle * Math.PI) / 180;
    const radius = 150;
    return {
        left: `calc(50% + ${Math.cos(rad) * radius}px - 18px)`,
        top: `calc(50% + ${Math.sin(rad) * radius}px - 18px)`,
        animationDelay: `${index * 0.15}s`,
    };
}

function scrollDown() {
    window.scrollTo({ top: window.innerHeight, behavior: "smooth" });
}

let animFrameId: number | null = null;

function initParticles() {
    const canvas = particleCanvas.value;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles: Array<{
        x: number;
        y: number;
        vx: number;
        vy: number;
        size: number;
        alpha: number;
    }> = [];
    for (let i = 0; i < 60; i++) {
        particles.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            vx: (Math.random() - 0.5) * 0.5,
            vy: (Math.random() - 0.5) * 0.5,
            size: Math.random() * 2 + 0.5,
            alpha: Math.random() * 0.5 + 0.1,
        });
    }

    function draw() {
        if (!ctx || !canvas) return;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        const style = getComputedStyle(document.documentElement);
        const primaryRaw = style.getPropertyValue("--v-theme-primary").trim();

        particles.forEach((p, i) => {
            p.x += p.vx;
            p.y += p.vy;
            if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
            if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${primaryRaw || "99, 102, 241"}, ${p.alpha})`;
            ctx.fill();

            for (let j = i + 1; j < particles.length; j++) {
                const dx = p.x - particles[j].x;
                const dy = p.y - particles[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 120) {
                    ctx.beginPath();
                    ctx.moveTo(p.x, p.y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.strokeStyle = `rgba(${primaryRaw || "99, 102, 241"}, ${0.06 * (1 - dist / 120)})`;
                    ctx.lineWidth = 0.5;
                    ctx.stroke();
                }
            }
        });
        animFrameId = requestAnimationFrame(draw);
    }
    draw();

    window.addEventListener("resize", () => {
        if (canvas) {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        }
    });
}

onMounted(() => {
    initParticles();
    if (heroContent.value) animateEntrance(heroContent.value, { delay: 200 });
    if (heroVisual.value) animateEntrance(heroVisual.value, { delay: 500 });
});

onUnmounted(() => {
    if (animFrameId) cancelAnimationFrame(animFrameId);
});
</script>

<style scoped>
.hero-section {
    position: relative;
    min-height: 100vh;
    display: flex;
    align-items: center;
    overflow: hidden;
}

.hero-bg-effects {
    position: absolute;
    inset: 0;
    z-index: 0;
}

.particle-canvas {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
}

.grid-overlay {
    position: absolute;
    inset: 0;
    background-image: radial-gradient(
        circle at 1px 1px,
        rgb(var(--v-theme-primary), 0.04) 1px,
        transparent 0
    );
    background-size: 40px 40px;
}

.gradient-orb {
    position: absolute;
    border-radius: 50%;
    filter: blur(80px);
    opacity: 0.15;
    pointer-events: none;
}

.orb-1 {
    width: 400px;
    height: 400px;
    top: -100px;
    right: -80px;
    background: rgb(var(--v-theme-primary));
    animation: orb-float-1 18s ease-in-out infinite;
}

.orb-2 {
    width: 300px;
    height: 300px;
    bottom: 10%;
    left: -60px;
    background: rgb(var(--v-theme-secondary));
    animation: orb-float-2 22s ease-in-out infinite;
}

.orb-3 {
    width: 250px;
    height: 250px;
    top: 50%;
    left: 40%;
    background: rgb(var(--v-theme-primary));
    opacity: 0.08;
    animation: orb-float-3 25s ease-in-out infinite;
}

@keyframes orb-float-1 {
    0%,
    100% {
        transform: translate(0, 0) scale(1);
    }
    33% {
        transform: translate(30px, 40px) scale(1.1);
    }
    66% {
        transform: translate(-20px, -30px) scale(0.95);
    }
}

@keyframes orb-float-2 {
    0%,
    100% {
        transform: translate(0, 0) scale(1);
    }
    33% {
        transform: translate(-25px, -35px) scale(1.05);
    }
    66% {
        transform: translate(15px, 25px) scale(0.9);
    }
}

@keyframes orb-float-3 {
    0%,
    100% {
        transform: translate(0, 0) scale(1);
    }
    50% {
        transform: translate(40px, -20px) scale(1.15);
    }
}

.hero-container {
    position: relative;
    z-index: 1;
    max-width: 1400px;
    margin: 0 auto;
    padding: 60px 24px 30px;
}

.hero-row {
    min-height: calc(100vh - 100px);
}

.hero-badge {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 6px 16px;
    border-radius: 100px;
    background: rgb(var(--v-theme-primary), 0.1);
    border: 1px solid rgb(var(--v-theme-primary), 0.2);
}

.badge-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: rgb(var(--v-theme-primary));
    animation: pulse-dot 2s ease-in-out infinite;
}

@keyframes pulse-dot {
    0%,
    100% {
        opacity: 1;
        transform: scale(1);
    }
    50% {
        opacity: 0.5;
        transform: scale(0.8);
    }
}

.badge-text {
    font-size: 0.8rem;
    font-weight: 600;
    letter-spacing: 1px;
    text-transform: uppercase;
    color: rgb(var(--v-theme-primary));
}

.hero-title {
    font-size: clamp(2.5rem, 6vw, 4.5rem);
    font-weight: 900;
    line-height: 1.05;
    font-family: var(--font-heading);
}

.title-accent {
    color: rgb(var(--v-theme-primary));
    text-shadow: 0 0 40px rgb(var(--v-theme-primary), 0.3);
}

.hero-typewriter {
    font-size: 1.15rem;
    color: rgb(var(--v-theme-on-surface), 0.7);
    font-family: var(--font-mono);
}

.typewriter-prefix {
    color: rgb(var(--v-theme-primary));
    margin-right: 8px;
    font-weight: bold;
}

.hero-description {
    font-size: 1rem;
    line-height: 1.7;
    max-width: 500px;
    color: rgb(var(--v-theme-on-surface), 0.65);
}

.hero-stats {
    padding-top: 16px;
    border-top: 1px solid rgb(var(--v-theme-on-surface), 0.1);
}

.stat-item {
    display: flex;
    flex-direction: column;
    margin-right: 30px;
}

.stat-number {
    font-size: 1.4rem;
    font-weight: 800;
    color: rgb(var(--v-theme-primary));
    font-family: var(--font-heading);
}

.stat-label {
    font-size: 0.7rem;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    color: rgb(var(--v-theme-on-surface), 0.5);
    max-width: 80px;
}

/* Code window */
.hero-visual {
    position: relative;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
}

.code-window {
    width: 400px;
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 25px 60px rgba(0, 0, 0, 0.3);
    border: 1px solid rgb(var(--v-theme-on-surface), 0.1);
    background: rgb(var(--v-theme-surface));
    z-index: 2;
}

.code-header {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 10px 14px;
    background: rgb(var(--v-theme-on-surface), 0.05);
    border-bottom: 1px solid rgb(var(--v-theme-on-surface), 0.08);
}

.dot {
    width: 10px;
    height: 10px;
    border-radius: 50%;
}
.dot.red {
    background: #ff5f57;
}
.dot.yellow {
    background: #ffbd2e;
}
.dot.green {
    background: #28c840;
}

.code-title {
    margin-left: 8px;
    font-size: 0.75rem;
    opacity: 0.5;
    font-family: var(--font-mono);
}

.code-body {
    padding: 16px;
    font-family: var(--font-mono);
    font-size: 0.8rem;
    line-height: 1.8;
}

.code-line {
    white-space: nowrap;
    display: flex;
    align-items: baseline;
}

.line-num {
    display: inline-block;
    width: 28px;
    text-align: right;
    margin-right: 12px;
    color: rgb(var(--v-theme-on-surface), 0.25);
    font-size: 0.7rem;
    user-select: none;
    flex-shrink: 0;
}

.kw {
    color: rgb(var(--v-theme-primary));
    font-weight: 600;
}
.var {
    color: rgb(var(--v-theme-secondary));
}
.prop {
    color: rgb(var(--v-theme-on-surface));
}
.str {
    color: #e8a86e;
}
.bool {
    color: #7ec8e3;
}

.code-cursor {
    display: inline-block;
    width: 8px;
    height: 16px;
    background: rgb(var(--v-theme-primary));
    animation: cursor-blink 1.2s step-end infinite;
    margin-top: 4px;
}

@keyframes cursor-blink {
    50% {
        opacity: 0;
    }
}

/* Orbit ring */
.orbit-ring {
    position: absolute;
    width: 340px;
    height: 340px;
    border-radius: 50%;
    border: 1px dashed rgb(var(--v-theme-primary), 0.15);
    animation: orbit-spin 40s linear infinite;
}

.orbit-item {
    position: absolute;
    width: 36px;
    height: 36px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    background: rgb(var(--v-theme-surface));
    border: 1px solid rgb(var(--v-theme-primary), 0.3);
    box-shadow: 0 4px 12px rgb(var(--v-theme-primary), 0.15);
    animation: orbit-counter-spin 40s linear infinite;
}

@keyframes orbit-spin {
    to {
        transform: rotate(360deg);
    }
}
@keyframes orbit-counter-spin {
    to {
        transform: rotate(-360deg);
    }
}

/* Floating status badges */
.float-badge {
    position: absolute;
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 6px 12px;
    border-radius: 20px;
    background: rgb(var(--v-theme-surface), 0.9);
    backdrop-filter: blur(8px);
    border: 1px solid rgb(var(--v-theme-on-surface), 0.1);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
    font-size: 0.7rem;
    font-weight: 600;
    white-space: nowrap;
    z-index: 3;
    animation: float-badge 6s ease-in-out infinite;
}

.badge-1 {
    top: 10%;
    right: 5%;
    animation-delay: 0s;
}

.badge-2 {
    bottom: 15%;
    left: 5%;
    animation-delay: -3s;
}

@keyframes float-badge {
    0%,
    100% {
        transform: translateY(0);
    }
    50% {
        transform: translateY(-8px);
    }
}

/* Scroll indicator */
.scroll-indicator {
    position: absolute;
    bottom: 30px;
    left: 50%;
    transform: translateX(-50%);
    z-index: 3;
    cursor: pointer;
    opacity: 0.5;
    transition: opacity 0.3s;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 6px;
}
.scroll-indicator:hover {
    opacity: 1;
}

.mouse {
    width: 24px;
    height: 38px;
    border: 2px solid currentColor;
    border-radius: 12px;
    position: relative;
}

.wheel {
    width: 3px;
    height: 8px;
    background: currentColor;
    border-radius: 2px;
    position: absolute;
    top: 6px;
    left: 50%;
    transform: translateX(-50%);
    animation: scroll-wheel 2s ease-in-out infinite;
}

@keyframes scroll-wheel {
    0% {
        opacity: 1;
        transform: translateX(-50%) translateY(0);
    }
    100% {
        opacity: 0;
        transform: translateX(-50%) translateY(12px);
    }
}

.scroll-text {
    font-size: 0.6rem;
    text-transform: uppercase;
    letter-spacing: 2px;
    opacity: 0.6;
    font-family: var(--font-mono);
}

@media (max-width: 960px) {
    .hero-container {
        padding-top: 80px;
    }
    .hero-text-col {
        text-align: center;
    }
    .hero-actions {
        justify-content: center;
    }
    .hero-stats {
        justify-content: center;
    }
    .hero-description {
        margin: 0 auto;
    }
}
</style>
