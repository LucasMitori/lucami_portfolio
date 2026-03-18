<template>
    <section class="featured-section">
        <canvas ref="canvasRef" class="particle-canvas" />

        <div class="featured-content">
            <AnimatedSection animation="fadeInUp">
                <div class="section-header text-center mb-8">
                    <span class="section-tag">
                        <v-icon size="14" class="mr-1"
                            >mdi-star-four-points</v-icon
                        >
                        Portfolio
                    </span>
                    <h2 class="section-title">{{ t("home.featuredTitle") }}</h2>
                    <p class="section-subtitle">
                        {{ t("home.featuredSubtitle") }}
                    </p>
                    <div class="section-line" />
                </div>
            </AnimatedSection>

            <div class="featured-grid">
                <a
                    v-for="(project, index) in topProjects"
                    :key="project.id"
                    :href="project.html_url"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="project-card"
                    :style="{ '--card-delay': `${index * 100}ms` }"
                >
                    <div class="card-top">
                        <div
                            class="card-lang-dot"
                            :style="{
                                background: getLangColor(project.language),
                            }"
                        />
                        <span class="card-name">{{ project.name }}</span>
                        <v-icon size="16" class="card-arrow"
                            >mdi-arrow-top-right</v-icon
                        >
                    </div>
                    <p class="card-desc">
                        {{ project.description || t("projects.noDescription") }}
                    </p>
                    <div class="card-bottom">
                        <span v-if="project.language" class="card-lang-tag">{{
                            project.language
                        }}</span>
                        <span class="card-stat">
                            <v-icon size="12">mdi-star</v-icon>
                            {{ project.stargazers_count }}
                        </span>
                        <span class="card-stat">
                            <v-icon size="12">mdi-source-fork</v-icon>
                            {{ project.forks_count }}
                        </span>
                        <span class="card-time">{{
                            timeAgo(project.pushed_at)
                        }}</span>
                    </div>
                </a>
            </div>

            <div v-if="latestProjects.length" class="latest-section mt-8">
                <div class="latest-header">
                    <v-icon size="18" color="primary" class="mr-2"
                        >mdi-clock-fast</v-icon
                    >
                    <span class="latest-label">{{
                        t("home.latestProjects")
                    }}</span>
                    <div class="latest-line" />
                </div>
                <div class="latest-scroll">
                    <a
                        v-for="project in latestProjects"
                        :key="project.id"
                        :href="project.html_url"
                        target="_blank"
                        rel="noopener noreferrer"
                        class="latest-pill"
                    >
                        <div class="pill-top">
                            <div
                                class="pill-dot"
                                :style="{
                                    background: getLangColor(project.language),
                                }"
                            />
                            <span class="pill-name">{{ project.name }}</span>
                            <v-icon size="12" class="pill-arrow"
                                >mdi-arrow-top-right</v-icon
                            >
                        </div>
                        <p class="pill-desc">
                            {{ project.description || "No description" }}
                        </p>
                        <div class="pill-meta">
                            <span v-if="project.language" class="pill-lang">{{
                                project.language
                            }}</span>
                            <span class="pill-stars"
                                ><v-icon size="10">mdi-star</v-icon>
                                {{ project.stargazers_count }}</span
                            >
                            <span class="pill-time">{{
                                timeAgo(project.pushed_at)
                            }}</span>
                        </div>
                    </a>
                </div>
            </div>

            <AnimatedSection animation="fadeInUp" :delay="400">
                <div class="text-center mt-8">
                    <v-btn
                        variant="outlined"
                        color="primary"
                        size="large"
                        prepend-icon="mdi-arrow-right"
                        rounded="lg"
                        :to="localePath('/projects')"
                    >
                        {{ t("home.viewAllProjects") }}
                    </v-btn>
                </div>
            </AnimatedSection>
        </div>
    </section>
</template>

<script setup lang="ts">
import type { Project } from "~~/shared/types";

const { t } = useI18n();
const localePath = useLocalePath();
const themeStore = useThemeStore();

const canvasRef = ref<HTMLCanvasElement | null>(null);
let animationId: number | null = null;

const { data: projects } = await useFetch<Project[]>("/api/github/repos");

const topProjects = computed(() => {
    return (projects.value || [])
        .sort((a, b) => b.stargazers_count - a.stargazers_count)
        .slice(0, 3);
});

const latestProjects = computed(() => {
    const topIds = new Set(topProjects.value.map((p) => p.id));
    return (projects.value || [])
        .filter((p) => !topIds.has(p.id))
        .sort(
            (a, b) =>
                new Date(b.pushed_at).getTime() -
                new Date(a.pushed_at).getTime(),
        )
        .slice(0, 6);
});

const gradients = [
    "linear-gradient(135deg, #6366f1, #8b5cf6)",
    "linear-gradient(135deg, #06b6d4, #3b82f6)",
    "linear-gradient(135deg, #f59e0b, #ef4444)",
];

function getGradient(index: number) {
    return gradients[index % gradients.length];
}

const langColors: Record<string, string> = {
    TypeScript: "#3178c6",
    JavaScript: "#f1e05a",
    Python: "#3572A5",
    Vue: "#41b883",
    HTML: "#e34c26",
    CSS: "#563d7c",
    Java: "#b07219",
    Go: "#00ADD8",
    Rust: "#dea584",
    Shell: "#89e051",
};

function getLangColor(lang: string | null) {
    return langColors[lang || ""] || "#8b8b8b";
}

function timeAgo(dateStr: string) {
    const diff = Date.now() - new Date(dateStr).getTime();
    const days = Math.floor(diff / 86400000);
    if (days < 1) return "today";
    if (days === 1) return "1d ago";
    if (days < 30) return `${days}d ago`;
    const months = Math.floor(days / 30);
    if (months < 12) return `${months}mo ago`;
    return `${Math.floor(months / 12)}y ago`;
}

// ── Canvas Particle Animation ──

interface Particle {
    x: number;
    y: number;
    vx: number;
    vy: number;
    size: number;
    color: string;
    opacity: number;
    // for retro rotation
    angle?: number;
    rotationSpeed?: number;
    // for coding binary rain
    char?: string;
    speed?: number;
    column?: number;
    trail?: number;
    // for default pulse
    baseSize?: number;
    pulsePhase?: number;
}

function initCanvas() {
    if (animationId !== null) {
        cancelAnimationFrame(animationId);
        animationId = null;
    }

    const canvas = canvasRef.value;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
        const parent = canvas.parentElement;
        if (!parent) return;
        canvas.width = parent.offsetWidth;
        canvas.height = parent.offsetHeight;
    };
    resize();

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(canvas.parentElement!);

    const theme = themeStore.currentThemeSlug;
    let particles: Particle[] = [];

    if (theme === "default") {
        initDefaultParticles(particles, canvas);
        animateDefault(ctx, canvas, particles);
    } else if (theme === "nerd") {
        initNerdParticles(particles, canvas);
        animateNerd(ctx, canvas, particles);
    } else if (theme === "retro") {
        initRetroParticles(particles, canvas);
        animateRetro(ctx, canvas, particles);
    } else if (theme === "coding") {
        initCodingParticles(particles, canvas);
        animateCoding(ctx, canvas, particles);
    } else {
        // Fallback to default
        initDefaultParticles(particles, canvas);
        animateDefault(ctx, canvas, particles);
    }
}

// ── Default: floating gradient orbs ──
function initDefaultParticles(
    particles: Particle[],
    canvas: HTMLCanvasElement,
) {
    const colors = ["#6C63FF", "#2EC4B6", "#8b5cf6", "#06b6d4"];
    for (let i = 0; i < 18; i++) {
        particles.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            vx: (Math.random() - 0.5) * 0.4,
            vy: (Math.random() - 0.5) * 0.4,
            size: Math.random() * 30 + 15,
            baseSize: Math.random() * 30 + 15,
            color: colors[Math.floor(Math.random() * colors.length)],
            opacity: Math.random() * 0.3 + 0.1,
            pulsePhase: Math.random() * Math.PI * 2,
        });
    }
}

function animateDefault(
    ctx: CanvasRenderingContext2D,
    canvas: HTMLCanvasElement,
    particles: Particle[],
) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        p.pulsePhase! += 0.015;
        p.size = p.baseSize! + Math.sin(p.pulsePhase!) * 5;

        if (p.x < -p.size) p.x = canvas.width + p.size;
        if (p.x > canvas.width + p.size) p.x = -p.size;
        if (p.y < -p.size) p.y = canvas.height + p.size;
        if (p.y > canvas.height + p.size) p.y = -p.size;

        const gradient = ctx.createRadialGradient(
            p.x,
            p.y,
            0,
            p.x,
            p.y,
            p.size,
        );
        gradient.addColorStop(0, p.color + hexOpacity(p.opacity));
        gradient.addColorStop(1, p.color + "00");
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();
    }

    animationId = requestAnimationFrame(() =>
        animateDefault(ctx, canvas, particles),
    );
}

// ── Nerd: connected node network ──
function initNerdParticles(particles: Particle[], canvas: HTMLCanvasElement) {
    for (let i = 0; i < 35; i++) {
        particles.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            vx: (Math.random() - 0.5) * 0.6,
            vy: (Math.random() - 0.5) * 0.6,
            size: Math.random() * 3 + 1.5,
            color: "#00F0FF",
            opacity: Math.random() * 0.6 + 0.3,
        });
    }
}

function animateNerd(
    ctx: CanvasRenderingContext2D,
    canvas: HTMLCanvasElement,
    particles: Particle[],
) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const connectionDist = 120;

    for (const p of particles) {
        // Add jitter
        p.vx += (Math.random() - 0.5) * 0.05;
        p.vy += (Math.random() - 0.5) * 0.05;
        p.vx = Math.max(-1, Math.min(1, p.vx));
        p.vy = Math.max(-1, Math.min(1, p.vy));

        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0) {
            p.x = 0;
            p.vx *= -1;
        }
        if (p.x > canvas.width) {
            p.x = canvas.width;
            p.vx *= -1;
        }
        if (p.y < 0) {
            p.y = 0;
            p.vy *= -1;
        }
        if (p.y > canvas.height) {
            p.y = canvas.height;
            p.vy *= -1;
        }
    }

    // Draw connections
    for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
            const dx = particles[i].x - particles[j].x;
            const dy = particles[i].y - particles[j].y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < connectionDist) {
                const alpha = (1 - dist / connectionDist) * 0.25;
                ctx.beginPath();
                ctx.moveTo(particles[i].x, particles[i].y);
                ctx.lineTo(particles[j].x, particles[j].y);
                ctx.strokeStyle = `rgba(0, 240, 255, ${alpha})`;
                ctx.lineWidth = 0.5;
                ctx.stroke();
            }
        }
    }

    // Draw dots
    for (const p of particles) {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0, 240, 255, ${p.opacity})`;
        ctx.fill();
    }

    animationId = requestAnimationFrame(() =>
        animateNerd(ctx, canvas, particles),
    );
}

// ── Retro: floating vintage stamps/circles ──
function initRetroParticles(particles: Particle[], canvas: HTMLCanvasElement) {
    const colors = ["#8B4513", "#D2691E", "#CD853F", "#A0522D", "#DEB887"];
    for (let i = 0; i < 12; i++) {
        particles.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            vx: (Math.random() - 0.5) * 0.25,
            vy: (Math.random() - 0.5) * 0.25,
            size: Math.random() * 40 + 20,
            color: colors[Math.floor(Math.random() * colors.length)],
            opacity: Math.random() * 0.15 + 0.05,
            angle: Math.random() * Math.PI * 2,
            rotationSpeed: (Math.random() - 0.5) * 0.005,
        });
    }
}

function animateRetro(
    ctx: CanvasRenderingContext2D,
    canvas: HTMLCanvasElement,
    particles: Particle[],
) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        p.angle! += p.rotationSpeed!;

        if (p.x < -p.size) p.x = canvas.width + p.size;
        if (p.x > canvas.width + p.size) p.x = -p.size;
        if (p.y < -p.size) p.y = canvas.height + p.size;
        if (p.y > canvas.height + p.size) p.y = -p.size;

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.angle!);
        ctx.globalAlpha = p.opacity;

        // Draw circle with ring
        ctx.beginPath();
        ctx.arc(0, 0, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.fill();

        ctx.beginPath();
        ctx.arc(0, 0, p.size * 0.7, 0, Math.PI * 2);
        ctx.strokeStyle = p.color;
        ctx.lineWidth = 1.5;
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(0, 0, p.size * 0.4, 0, Math.PI * 2);
        ctx.strokeStyle = p.color;
        ctx.lineWidth = 1;
        ctx.stroke();

        ctx.globalAlpha = 1;
        ctx.restore();
    }

    animationId = requestAnimationFrame(() =>
        animateRetro(ctx, canvas, particles),
    );
}

// ── Coding: binary rain (matrix-style) ──
function initCodingParticles(particles: Particle[], canvas: HTMLCanvasElement) {
    const colors = ["#00FF41", "#008F11", "#39FF14"];
    const columns = Math.floor(canvas.width / 18);
    for (let i = 0; i < columns; i++) {
        const trailLen = Math.floor(Math.random() * 12) + 5;
        for (let j = 0; j < trailLen; j++) {
            particles.push({
                x: 0,
                y: 0,
                vx: 0,
                vy: 0,
                size: 12,
                color: colors[Math.floor(Math.random() * colors.length)],
                opacity: (1 - j / trailLen) * 0.7,
                char: Math.random() > 0.5 ? "1" : "0",
                speed: Math.random() * 1.5 + 0.5,
                column: i,
                trail: -j * 18 - Math.random() * canvas.height,
            });
        }
    }
}

function animateCoding(
    ctx: CanvasRenderingContext2D,
    canvas: HTMLCanvasElement,
    particles: Particle[],
) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.font = "13px monospace";
    ctx.textAlign = "center";

    for (const p of particles) {
        p.trail! += p.speed!;
        const x = p.column! * 18 + 9;
        const y = p.trail!;

        if (y > canvas.height + 20) {
            p.trail = -Math.random() * canvas.height - 18;
            p.char = Math.random() > 0.5 ? "1" : "0";
        }

        if (y < -20 || y > canvas.height + 20) continue;

        ctx.fillStyle = p.color + hexOpacity(p.opacity);
        ctx.fillText(p.char!, x, y);
    }

    animationId = requestAnimationFrame(() =>
        animateCoding(ctx, canvas, particles),
    );
}

function hexOpacity(opacity: number): string {
    const hex = Math.round(opacity * 255).toString(16);
    return hex.length === 1 ? "0" + hex : hex;
}

// Lifecycle and watchers
onMounted(() => {
    initCanvas();
});

onBeforeUnmount(() => {
    if (animationId !== null) {
        cancelAnimationFrame(animationId);
    }
});

watch(
    () => themeStore.currentThemeSlug,
    () => {
        initCanvas();
    },
);
</script>

<style scoped>
.featured-section {
    position: relative;
    padding: 20px 0;
    overflow: hidden;
}

.particle-canvas {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    opacity: 0.2;
    z-index: 0;
}

.featured-content {
    position: relative;
    z-index: 1;
}

/* Section Header */
.section-tag {
    display: inline-flex;
    align-items: center;
    font-size: 0.75rem;
    font-weight: 700;
    letter-spacing: 3px;
    text-transform: uppercase;
    color: rgb(var(--v-theme-primary));
    margin-bottom: 12px;
}

.section-title {
    font-size: clamp(1.8rem, 4vw, 2.5rem);
    font-weight: 800;
    font-family: var(--font-heading);
    margin-bottom: 8px;
}

.section-subtitle {
    color: rgb(var(--v-theme-on-surface), 0.6);
    margin-bottom: 16px;
}

.section-line {
    width: 60px;
    height: 3px;
    background: rgb(var(--v-theme-primary));
    margin: 0 auto;
    border-radius: 2px;
}

/* ── Featured Grid: compact cards ── */
.featured-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 16px;
}

@media (max-width: 960px) {
    .featured-grid {
        grid-template-columns: repeat(2, 1fr);
    }
}

@media (max-width: 600px) {
    .featured-grid {
        grid-template-columns: 1fr;
    }
}

.project-card {
    display: flex;
    flex-direction: column;
    height: 180px;
    padding: 18px 20px;
    border-radius: 14px;
    border: 1px solid rgb(var(--v-theme-on-surface), 0.08);
    background: rgb(var(--v-theme-surface));
    text-decoration: none;
    color: inherit;
    position: relative;
    overflow: hidden;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    animation: card-enter 0.5s ease both;
    animation-delay: var(--card-delay, 0ms);
}

@keyframes card-enter {
    from {
        opacity: 0;
        transform: translateY(16px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.project-card::before {
    content: "";
    position: absolute;
    inset: -1px;
    border-radius: 15px;
    padding: 1px;
    background: linear-gradient(
        135deg,
        rgb(var(--v-theme-primary), 0.5),
        rgb(var(--v-theme-primary), 0.1),
        transparent,
        rgb(var(--v-theme-primary), 0.3)
    );
    -webkit-mask:
        linear-gradient(#fff 0 0) content-box,
        linear-gradient(#fff 0 0);
    -webkit-mask-composite: xor;
    mask-composite: exclude;
    opacity: 0;
    transition: opacity 0.35s ease;
    pointer-events: none;
}

.project-card:hover {
    transform: translateY(-4px);
    border-color: rgb(var(--v-theme-primary), 0.25);
    box-shadow:
        0 12px 32px rgba(0, 0, 0, 0.15),
        0 0 20px rgb(var(--v-theme-primary), 0.08);
}

.project-card:hover::before {
    opacity: 1;
}

.project-card:hover .card-arrow {
    opacity: 1;
    transform: translate(2px, -2px);
}

/* Card Top */
.card-top {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 10px;
}

.card-lang-dot {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    flex-shrink: 0;
}

.card-name {
    font-size: 0.95rem;
    font-weight: 700;
    font-family: var(--font-heading);
    flex: 1;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.card-arrow {
    opacity: 0;
    transition: all 0.25s ease;
    color: rgb(var(--v-theme-primary));
    flex-shrink: 0;
}

/* Card Middle */
.card-desc {
    font-size: 0.78rem;
    color: rgb(var(--v-theme-on-surface), 0.55);
    line-height: 1.45;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    margin: 0;
    flex-grow: 1;
}

/* Card Bottom */
.card-bottom {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-top: auto;
    padding-top: 10px;
    border-top: 1px solid rgb(var(--v-theme-on-surface), 0.06);
}

.card-lang-tag {
    font-size: 0.65rem;
    font-weight: 600;
    padding: 2px 8px;
    border-radius: 4px;
    background: rgb(var(--v-theme-primary), 0.1);
    color: rgb(var(--v-theme-primary));
    font-family: var(--font-mono);
}

.card-stat {
    display: flex;
    align-items: center;
    gap: 3px;
    font-size: 0.7rem;
    color: rgb(var(--v-theme-on-surface), 0.5);
}

.card-time {
    font-size: 0.65rem;
    color: rgb(var(--v-theme-on-surface), 0.35);
    margin-left: auto;
}

/* ── Latest Projects: horizontal scrollable strip ── */
.latest-section {
    margin-top: 32px;
}

.latest-header {
    display: flex;
    align-items: center;
    margin-bottom: 16px;
}

.latest-label {
    font-size: 0.8rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 1.5px;
    color: rgb(var(--v-theme-on-surface), 0.6);
    white-space: nowrap;
}

.latest-line {
    flex: 1;
    height: 1px;
    background: linear-gradient(
        90deg,
        rgb(var(--v-theme-primary), 0.3),
        transparent
    );
    margin-left: 12px;
}

.latest-scroll {
    display: flex;
    gap: 12px;
    overflow-x: auto;
    scroll-snap-type: x mandatory;
    -webkit-overflow-scrolling: touch;
    padding-bottom: 8px;
    scrollbar-width: thin;
    scrollbar-color: rgb(var(--v-theme-primary), 0.2) transparent;
}

.latest-scroll::-webkit-scrollbar {
    height: 4px;
}

.latest-scroll::-webkit-scrollbar-track {
    background: transparent;
}

.latest-scroll::-webkit-scrollbar-thumb {
    background: rgb(var(--v-theme-primary), 0.2);
    border-radius: 4px;
}

.latest-pill {
    display: flex;
    flex-direction: column;
    min-width: 220px;
    max-width: 260px;
    flex-shrink: 0;
    padding: 12px 16px;
    border-radius: 20px;
    border: 1px solid rgb(var(--v-theme-on-surface), 0.08);
    background: rgb(var(--v-theme-surface));
    text-decoration: none;
    color: inherit;
    scroll-snap-align: start;
    transition: all 0.25s ease;
    position: relative;
    overflow: hidden;
}

.latest-pill:hover {
    border-color: rgb(var(--v-theme-primary), 0.35);
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.1);
}

.latest-pill:hover .pill-arrow {
    opacity: 1;
    transform: translate(2px, -2px);
}

.pill-top {
    display: flex;
    align-items: center;
    gap: 6px;
    margin-bottom: 6px;
}

.pill-dot {
    width: 7px;
    height: 7px;
    border-radius: 50%;
    flex-shrink: 0;
}

.pill-name {
    font-size: 0.8rem;
    font-weight: 700;
    font-family: var(--font-heading);
    flex: 1;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.pill-arrow {
    opacity: 0;
    transition: all 0.25s ease;
    color: rgb(var(--v-theme-primary));
}

.pill-desc {
    font-size: 0.68rem;
    color: rgb(var(--v-theme-on-surface), 0.5);
    line-height: 1.4;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    margin: 0 0 8px 0;
    min-height: 2.5em;
}

.pill-meta {
    display: flex;
    align-items: center;
    gap: 8px;
}

.pill-lang {
    font-size: 0.6rem;
    font-weight: 600;
    padding: 1px 6px;
    border-radius: 4px;
    background: rgb(var(--v-theme-primary), 0.1);
    color: rgb(var(--v-theme-primary));
}

.pill-stars {
    font-size: 0.6rem;
    color: rgb(var(--v-theme-on-surface), 0.5);
    display: flex;
    align-items: center;
    gap: 2px;
}

.pill-time {
    font-size: 0.58rem;
    color: rgb(var(--v-theme-on-surface), 0.35);
    margin-left: auto;
}
</style>
