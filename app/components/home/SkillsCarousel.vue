<template>
    <section class="skills-section">
        <canvas ref="bgCanvas" class="skills-bg-canvas" />
        <div class="skills-bg-overlay" />

        <v-container class="skills-container">
            <AnimatedSection animation="fadeInUp">
                <div class="section-header text-center mb-10">
                    <span class="section-tag">{{ t("home.skillsTitle") }}</span>
                    <h2 class="section-title">
                        {{ t("home.skillsTitle") }}
                    </h2>
                    <div class="section-line" />
                </div>
            </AnimatedSection>

            <AnimatedSection animation="fadeInUp" :delay="100">
                <div
                    class="category-tabs d-flex justify-center gap-2 mb-8 flex-wrap"
                >
                    <v-btn
                        v-for="cat in categories"
                        :key="cat.key"
                        :variant="activeCategory === cat.key ? 'flat' : 'tonal'"
                        :color="
                            activeCategory === cat.key ? 'primary' : undefined
                        "
                        size="small"
                        rounded="lg"
                        :prepend-icon="cat.icon"
                        @click="activeCategory = cat.key"
                    >
                        {{ cat.label }}
                    </v-btn>
                </div>
            </AnimatedSection>

            <div class="skills-grid">
                <TransitionGroup
                    name="skill-card"
                    tag="div"
                    class="skills-grid-inner"
                >
                    <div
                        v-for="(skill, index) in filteredSkills"
                        :key="skill.name"
                        class="skill-card-wrapper"
                        :style="{ animationDelay: `${index * 50}ms` }"
                    >
                        <div
                            class="skill-card"
                            :class="{ 'skill-highlight': skill.featured }"
                            @click="$emit('skill-click', skill)"
                        >
                            <div class="skill-icon-wrap">
                                <v-icon
                                    :color="skill.color || 'primary'"
                                    size="28"
                                    >{{ skill.icon }}</v-icon
                                >
                            </div>
                            <div class="skill-info">
                                <span class="skill-name">{{ skill.name }}</span>
                                <div class="skill-bar">
                                    <div
                                        class="skill-bar-fill"
                                        :style="{
                                            width: `${skill.level}%`,
                                            background:
                                                skill.color ||
                                                'rgb(var(--v-theme-primary))',
                                        }"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </TransitionGroup>
            </div>

            <AnimatedSection animation="fadeInUp" :delay="300">
                <div class="skills-ticker mt-10">
                    <div class="ticker-track">
                        <span
                            v-for="(tech, i) in [
                                ...tickerItems,
                                ...tickerItems,
                            ]"
                            :key="`${tech}-${i}`"
                            class="ticker-item"
                        >
                            {{ tech }}
                            <span class="ticker-dot" />
                        </span>
                    </div>
                </div>
            </AnimatedSection>
        </v-container>
    </section>
</template>

<script setup lang="ts">
const { t } = useI18n();
const themeStore = useThemeStore();

defineEmits<{
    "skill-click": [skill: (typeof skills)[number]];
}>();

const activeCategory = ref("all");
const bgCanvas = ref<HTMLCanvasElement | null>(null);
let animFrameId: number | null = null;

const categories = [
    { key: "all", label: "All", icon: "mdi-apps" },
    { key: "frontend", label: "Frontend", icon: "mdi-monitor" },
    { key: "backend", label: "Backend", icon: "mdi-server" },
    { key: "tools", label: "Tools", icon: "mdi-wrench" },
];

const skills = [
    {
        name: "Vue.js",
        icon: "mdi-vuejs",
        category: "frontend",
        level: 95,
        color: "#4FC08D",
        featured: true,
    },
    {
        name: "Nuxt",
        icon: "mdi-nuxt",
        category: "frontend",
        level: 90,
        color: "#00DC82",
        featured: true,
    },
    {
        name: "React",
        icon: "mdi-react",
        category: "frontend",
        level: 80,
        color: "#61DAFB",
    },
    {
        name: "Angular",
        icon: "mdi-angular",
        category: "frontend",
        level: 70,
        color: "#DD0031",
    },
    {
        name: "TypeScript",
        icon: "mdi-language-typescript",
        category: "frontend",
        level: 90,
        color: "#3178C6",
        featured: true,
    },
    {
        name: "JavaScript",
        icon: "mdi-language-javascript",
        category: "frontend",
        level: 95,
        color: "#F7DF1E",
    },
    {
        name: "HTML5",
        icon: "mdi-language-html5",
        category: "frontend",
        level: 95,
        color: "#E34F26",
    },
    {
        name: "CSS3",
        icon: "mdi-language-css3",
        category: "frontend",
        level: 90,
        color: "#1572B6",
    },
    {
        name: "Node.js",
        icon: "mdi-nodejs",
        category: "backend",
        level: 85,
        color: "#339933",
        featured: true,
    },
    {
        name: "NestJS",
        icon: "mdi-bird",
        category: "backend",
        level: 75,
        color: "#E0234E",
    },
    {
        name: "Python",
        icon: "mdi-language-python",
        category: "backend",
        level: 70,
        color: "#3776AB",
    },
    {
        name: "MongoDB",
        icon: "mdi-database",
        category: "backend",
        level: 85,
        color: "#47A248",
    },
    {
        name: "PostgreSQL",
        icon: "mdi-elephant",
        category: "backend",
        level: 75,
        color: "#4169E1",
    },
    {
        name: "Docker",
        icon: "mdi-docker",
        category: "tools",
        level: 70,
        color: "#2496ED",
    },
    {
        name: "Git",
        icon: "mdi-git",
        category: "tools",
        level: 90,
        color: "#F05032",
    },
    {
        name: "AWS",
        icon: "mdi-aws",
        category: "tools",
        level: 60,
        color: "#FF9900",
    },
];

const filteredSkills = computed(() => {
    if (activeCategory.value === "all") return skills;
    return skills.filter((s) => s.category === activeCategory.value);
});

const tickerItems = [
    "REST API",
    "GraphQL",
    "WebSockets",
    "CI/CD",
    "TDD",
    "Agile",
    "Microservices",
    "Serverless",
    "OAuth",
    "JWT",
    "Redis",
    "Nginx",
    "Linux",
    "Figma",
    "Storybook",
    "Vitest",
    "Playwright",
    "Prisma",
];

// === Theme-specific canvas animations ===
function initBgAnimation() {
    if (animFrameId) cancelAnimationFrame(animFrameId);
    const canvas = bgCanvas.value;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = canvas.offsetWidth * 2;
    canvas.height = canvas.offsetHeight * 2;
    ctx.scale(2, 2);
    const w = canvas.offsetWidth;
    const h = canvas.offsetHeight;

    const theme = themeStore.currentThemeSlug;

    if (theme === "coding") drawCodingBg(ctx, w, h);
    else if (theme === "nerd") drawNerdBg(ctx, w, h);
    else if (theme === "retro") drawRetroBg(ctx, w, h);
    else drawDefaultBg(ctx, w, h);
}

// Default: floating gradient orbs
function drawDefaultBg(ctx: CanvasRenderingContext2D, w: number, h: number) {
    const orbs = Array.from({ length: 8 }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        r: 40 + Math.random() * 80,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        hue: Math.random() * 60 + 220, // blue-purple range
    }));

    function draw() {
        ctx.clearRect(0, 0, w, h);
        orbs.forEach((orb) => {
            orb.x += orb.vx;
            orb.y += orb.vy;
            if (orb.x < -orb.r) orb.x = w + orb.r;
            if (orb.x > w + orb.r) orb.x = -orb.r;
            if (orb.y < -orb.r) orb.y = h + orb.r;
            if (orb.y > h + orb.r) orb.y = -orb.r;

            const gradient = ctx.createRadialGradient(
                orb.x,
                orb.y,
                0,
                orb.x,
                orb.y,
                orb.r,
            );
            gradient.addColorStop(0, `hsla(${orb.hue}, 70%, 60%, 0.08)`);
            gradient.addColorStop(1, `hsla(${orb.hue}, 70%, 60%, 0)`);
            ctx.fillStyle = gradient;
            ctx.fillRect(orb.x - orb.r, orb.y - orb.r, orb.r * 2, orb.r * 2);
        });
        animFrameId = requestAnimationFrame(draw);
    }
    draw();
}

// Nerd: circuit board traces with glowing nodes
function drawNerdBg(ctx: CanvasRenderingContext2D, w: number, h: number) {
    const nodes: { x: number; y: number; connections: number[] }[] = [];
    const gridSize = 60;
    for (let x = gridSize; x < w; x += gridSize) {
        for (let y = gridSize; y < h; y += gridSize) {
            if (Math.random() > 0.5) {
                nodes.push({
                    x: x + (Math.random() - 0.5) * 20,
                    y: y + (Math.random() - 0.5) * 20,
                    connections: [],
                });
            }
        }
    }
    // Connect nearby nodes
    nodes.forEach((n, i) => {
        nodes.forEach((m, j) => {
            if (j <= i) return;
            const dist = Math.sqrt((n.x - m.x) ** 2 + (n.y - m.y) ** 2);
            if (dist < gridSize * 2 && Math.random() > 0.4) {
                n.connections.push(j);
            }
        });
    });

    let t = 0;
    function draw() {
        ctx.clearRect(0, 0, w, h);
        t += 0.008;

        // Draw connections
        nodes.forEach((n) => {
            n.connections.forEach((j) => {
                const m = nodes[j];
                const pulse =
                    Math.sin(t * 2 + n.x * 0.01 + m.y * 0.01) * 0.5 + 0.5;
                ctx.beginPath();
                // Right-angle circuit traces
                const midX = n.x + (m.x - n.x) * 0.5;
                ctx.moveTo(n.x, n.y);
                ctx.lineTo(midX, n.y);
                ctx.lineTo(midX, m.y);
                ctx.lineTo(m.x, m.y);
                ctx.strokeStyle = `rgba(0, 240, 255, ${0.04 + pulse * 0.06})`;
                ctx.lineWidth = 1;
                ctx.stroke();

                // Traveling data pulse
                const p = (t + n.x * 0.005) % 1;
                let px: number, py: number;
                if (p < 0.33) {
                    px = n.x + (midX - n.x) * (p / 0.33);
                    py = n.y;
                } else if (p < 0.66) {
                    px = midX;
                    py = n.y + (m.y - n.y) * ((p - 0.33) / 0.33);
                } else {
                    px = midX + (m.x - midX) * ((p - 0.66) / 0.34);
                    py = m.y;
                }
                ctx.beginPath();
                ctx.arc(px, py, 2, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(0, 240, 255, ${0.3 + pulse * 0.4})`;
                ctx.fill();
            });
        });

        // Draw nodes
        nodes.forEach((n, i) => {
            const pulse = Math.sin(t * 3 + i * 0.5) * 0.5 + 0.5;
            ctx.beginPath();
            ctx.arc(n.x, n.y, 3 + pulse * 2, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(0, 240, 255, ${0.1 + pulse * 0.15})`;
            ctx.fill();
            ctx.beginPath();
            ctx.arc(n.x, n.y, 1.5, 0, Math.PI * 2);
            ctx.fillStyle = "rgba(0, 240, 255, 0.4)";
            ctx.fill();
        });

        animFrameId = requestAnimationFrame(draw);
    }
    draw();
}

// Retro: falling typewriter characters on sepia paper
function drawRetroBg(ctx: CanvasRenderingContext2D, w: number, h: number) {
    const chars =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789<>{}[]();:.,!?/\\|";
    const columns = Math.floor(w / 18);
    const drops = Array.from({ length: columns }, () => ({
        y: Math.random() * h,
        speed: 0.2 + Math.random() * 0.4,
        char: chars[Math.floor(Math.random() * chars.length)],
        opacity: 0.03 + Math.random() * 0.05,
    }));

    function draw() {
        // Semi-transparent clear for trail effect
        ctx.fillStyle = "rgba(var(--bg, 0), 0, 0, 0.04)";
        ctx.clearRect(0, 0, w, h);

        ctx.font = '13px "Courier New", monospace';
        drops.forEach((drop, i) => {
            ctx.fillStyle = `rgba(139, 90, 43, ${drop.opacity})`;
            ctx.fillText(drop.char, i * 18, drop.y);
            drop.y += drop.speed;
            if (drop.y > h) {
                drop.y = -20;
                drop.char = chars[Math.floor(Math.random() * chars.length)];
            }
        });

        animFrameId = requestAnimationFrame(draw);
    }
    draw();
}

// Coding: matrix-style falling characters in multiple colors
function drawCodingBg(ctx: CanvasRenderingContext2D, w: number, h: number) {
    const chars =
        "01{}[]<>/\\=+-*&|!?.,:;()const let var function return import export async await";
    const columns = Math.floor(w / 14);
    const colors = ["#00FF41", "#00D4FF", "#FFB000", "#FF00AA"];
    const drops = Array.from({ length: columns }, () => ({
        y: Math.random() * h,
        speed: 0.5 + Math.random() * 1.5,
        color: colors[Math.floor(Math.random() * colors.length)],
        opacity: 0.04 + Math.random() * 0.08,
    }));

    function draw() {
        ctx.clearRect(0, 0, w, h);
        ctx.font = '12px "Fira Code", monospace';

        drops.forEach((drop, i) => {
            const char = chars[Math.floor(Math.random() * chars.length)];
            ctx.fillStyle = drop.color
                .replace(")", `, ${drop.opacity})`)
                .replace("rgb", "rgba")
                .replace("#", "");
            // Convert hex to rgba
            const r = parseInt(drop.color.slice(1, 3), 16);
            const g = parseInt(drop.color.slice(3, 5), 16);
            const b = parseInt(drop.color.slice(5, 7), 16);
            ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${drop.opacity})`;
            ctx.fillText(char, i * 14, drop.y);

            drop.y += drop.speed;
            if (drop.y > h) {
                drop.y = -14;
                drop.speed = 0.5 + Math.random() * 1.5;
                drop.color = colors[Math.floor(Math.random() * colors.length)];
            }
        });

        animFrameId = requestAnimationFrame(draw);
    }
    draw();
}

// Watch theme changes to reinit animation
watch(
    () => themeStore.currentThemeSlug,
    () => {
        nextTick(() => initBgAnimation());
    },
);

onMounted(() => {
    initBgAnimation();
    // Resize handler
    const onResize = () => initBgAnimation();
    window.addEventListener("resize", onResize);
    onUnmounted(() => {
        window.removeEventListener("resize", onResize);
        if (animFrameId) cancelAnimationFrame(animFrameId);
    });
});
</script>

<style scoped>
.skills-section {
    padding: 100px 0;
    position: relative;
    overflow: hidden;
}

.skills-bg-canvas {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    z-index: 0;
}

.skills-bg-overlay {
    position: absolute;
    inset: 0;
    background: linear-gradient(
        180deg,
        rgb(var(--v-theme-background)) 0%,
        rgb(var(--v-theme-background), 0.85) 15%,
        rgb(var(--v-theme-background), 0.7) 50%,
        rgb(var(--v-theme-background), 0.85) 85%,
        rgb(var(--v-theme-background)) 100%
    );
    z-index: 0;
}

.skills-container {
    position: relative;
    z-index: 1;
}

.section-header {
    position: relative;
}

.section-tag {
    display: inline-block;
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
    margin-bottom: 16px;
}

.section-line {
    width: 60px;
    height: 3px;
    background: rgb(var(--v-theme-primary));
    margin: 0 auto;
    border-radius: 2px;
}

.skills-grid-inner {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 12px;
}

.skill-card {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 14px 16px;
    border-radius: var(--border-radius);
    background: rgb(var(--v-theme-surface), 0.6);
    backdrop-filter: blur(12px);
    border: 1px solid rgb(var(--v-theme-on-surface), 0.08);
    transition: all var(--transition-speed) ease;
    cursor: pointer;
}

.skill-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 32px rgb(var(--v-theme-primary), 0.15);
    border-color: rgb(var(--v-theme-primary), 0.3);
    background: rgb(var(--v-theme-surface), 0.8);
}

.skill-highlight {
    border-color: rgb(var(--v-theme-primary), 0.2);
    background: rgb(var(--v-theme-primary), 0.06);
    backdrop-filter: blur(16px);
}

.skill-icon-wrap {
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 10px;
    background: rgb(var(--v-theme-on-surface), 0.04);
    flex-shrink: 0;
}

.skill-info {
    flex: 1;
    min-width: 0;
}

.skill-name {
    font-size: 0.85rem;
    font-weight: 600;
    display: block;
    margin-bottom: 6px;
}

.skill-bar {
    height: 3px;
    background: rgb(var(--v-theme-on-surface), 0.08);
    border-radius: 2px;
    overflow: hidden;
}

.skill-bar-fill {
    height: 100%;
    border-radius: 2px;
    transition: width 1s ease-out;
}

/* Ticker */
.skills-ticker {
    overflow: hidden;
    padding: 12px 0;
    mask-image: linear-gradient(
        90deg,
        transparent,
        black 8%,
        black 92%,
        transparent
    );
    opacity: 0.4;
}

.ticker-track {
    display: flex;
    width: max-content;
    animation: ticker-scroll 40s linear infinite;
}

.ticker-item {
    display: flex;
    align-items: center;
    gap: 16px;
    white-space: nowrap;
    font-size: 0.8rem;
    font-weight: 500;
    letter-spacing: 1px;
    text-transform: uppercase;
    padding: 0 16px;
    font-family: var(--font-mono);
}

.ticker-dot {
    width: 4px;
    height: 4px;
    border-radius: 50%;
    background: rgb(var(--v-theme-primary));
}

@keyframes ticker-scroll {
    0% {
        transform: translateX(0);
    }
    100% {
        transform: translateX(-50%);
    }
}

/* Transitions */
.skill-card-enter-active {
    transition: all 0.4s ease;
}
.skill-card-leave-active {
    transition: all 0.3s ease;
}
.skill-card-enter-from {
    opacity: 0;
    transform: translateY(20px) scale(0.9);
}
.skill-card-leave-to {
    opacity: 0;
    transform: translateY(-10px) scale(0.95);
}
.skill-card-move {
    transition: transform 0.4s ease;
}
</style>
