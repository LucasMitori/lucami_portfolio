<template>
    <v-dialog v-model="dialogOpen" max-width="600" scrollable>
        <v-card class="skill-dialog-card">
            <div
                class="skill-dialog-header"
                :class="`category-${skill?.category || 'frontend'}`"
            >
                <canvas ref="headerCanvas" class="header-canvas" />
                <div class="header-overlay" />
                <div class="header-content">
                    <v-icon size="48" color="white">{{ skill?.icon }}</v-icon>
                    <h3 class="skill-dialog-title">{{ skill?.name }}</h3>
                    <v-chip
                        size="small"
                        variant="elevated"
                        :color="categoryColor"
                        class="mt-1"
                    >
                        <v-icon size="12" start>{{ categoryIcon }}</v-icon>
                        {{ skill?.category }}
                    </v-chip>
                </div>
                <v-btn
                    icon
                    variant="text"
                    class="close-btn"
                    color="white"
                    @click="dialogOpen = false"
                >
                    <v-icon>mdi-close</v-icon>
                </v-btn>
            </div>

            <v-card-text class="pa-6">
                <div class="chart-section mb-6">
                    <h4 class="section-label mb-3">Proficiency Level</h4>
                    <div class="gauge-wrap">
                        <svg viewBox="0 0 200 110" class="gauge-svg">
                            <path
                                d="M20,100 A80,80 0 0,1 180,100"
                                fill="none"
                                stroke="rgba(var(--v-theme-on-surface), 0.08)"
                                stroke-width="12"
                                stroke-linecap="round"
                            />
                            <path
                                d="M20,100 A80,80 0 0,1 180,100"
                                fill="none"
                                :stroke="
                                    skill?.color ||
                                    'rgb(var(--v-theme-primary))'
                                "
                                stroke-width="12"
                                stroke-linecap="round"
                                :stroke-dasharray="arcLength"
                                :stroke-dashoffset="arcOffset"
                                class="gauge-fill"
                            />
                        </svg>
                        <div class="gauge-value">
                            <span class="gauge-number"
                                >{{ animatedLevel }}%</span
                            >
                            <span class="gauge-label">{{ levelLabel }}</span>
                        </div>
                    </div>
                </div>

                <div class="related-section">
                    <h4 class="section-label mb-3">Related Projects</h4>
                    <div v-if="relatedProjects.length" class="related-grid">
                        <a
                            v-for="project in relatedProjects"
                            :key="project.id"
                            :href="project.html_url"
                            target="_blank"
                            rel="noopener noreferrer"
                            class="related-card"
                        >
                            <div class="d-flex align-center gap-2">
                                <v-icon size="16" color="primary"
                                    >mdi-source-repository</v-icon
                                >
                                <span class="text-body-2 font-weight-bold">{{
                                    project.name
                                }}</span>
                            </div>
                            <p class="text-caption text-medium-emphasis mt-1">
                                {{ project.description || "No description" }}
                            </p>
                            <div class="d-flex gap-3 mt-2">
                                <span class="text-caption"
                                    ><v-icon size="10">mdi-star</v-icon>
                                    {{ project.stargazers_count }}</span
                                >
                                <span
                                    v-if="project.language"
                                    class="text-caption"
                                    >{{ project.language }}</span
                                >
                            </div>
                        </a>
                    </div>
                    <div v-else class="no-projects text-center pa-6">
                        <div class="no-projects-anim">
                            <v-icon size="40" color="primary" class="mb-2"
                                >mdi-rocket-launch</v-icon
                            >
                        </div>
                        <p class="text-body-2 text-medium-emphasis">
                            Exploring new frontiers with this skill!
                        </p>
                    </div>
                </div>
            </v-card-text>
        </v-card>
    </v-dialog>
</template>

<script setup lang="ts">
import type { Project } from "~~/shared/types/project";

interface SkillData {
    name: string;
    icon: string;
    level: number;
    color: string;
    category: string;
}

const props = defineProps<{
    modelValue: boolean;
    skill: SkillData | null;
    projects: Project[];
}>();

const emit = defineEmits<{ "update:modelValue": [value: boolean] }>();

const dialogOpen = computed({
    get: () => props.modelValue,
    set: (val: boolean) => emit("update:modelValue", val),
});

const headerCanvas = ref<HTMLCanvasElement | null>(null);
const animatedLevel = ref(0);
let animFrameId: number | null = null;

const categoryColor = computed(() => {
    switch (props.skill?.category) {
        case "frontend":
            return "#3b82f6";
        case "backend":
            return "#10b981";
        case "tools":
            return "#f59e0b";
        default:
            return "primary";
    }
});

const categoryIcon = computed(() => {
    switch (props.skill?.category) {
        case "frontend":
            return "mdi-monitor";
        case "backend":
            return "mdi-server";
        case "tools":
            return "mdi-wrench";
        default:
            return "mdi-code-braces";
    }
});

const levelLabel = computed(() => {
    const level = props.skill?.level || 0;
    if (level >= 90) return "Expert";
    if (level >= 75) return "Advanced";
    if (level >= 50) return "Intermediate";
    return "Learning";
});

const arcLength = 251.2;
const arcOffset = computed(
    () => arcLength * (1 - (animatedLevel.value || 0) / 100),
);

watch(dialogOpen, (open) => {
    if (open && props.skill) {
        animatedLevel.value = 0;
        const target = props.skill.level;
        const start = performance.now();
        function animate(now: number) {
            const progress = Math.min((now - start) / 1200, 1);
            animatedLevel.value = Math.round(
                (1 - Math.pow(1 - progress, 3)) * target,
            );
            if (progress < 1) requestAnimationFrame(animate);
        }
        requestAnimationFrame(animate);
        nextTick(() => initHeaderAnimation());
    } else {
        if (animFrameId) cancelAnimationFrame(animFrameId);
    }
});

function initHeaderAnimation() {
    const canvas = headerCanvas.value;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = canvas.offsetWidth * 2;
    canvas.height = canvas.offsetHeight * 2;
    ctx.scale(2, 2);
    const w = canvas.offsetWidth;
    const h = canvas.offsetHeight;
    const cat = props.skill?.category || "frontend";
    const color = props.skill?.color || "#6366f1";

    if (cat === "frontend") drawFrontendAnim(ctx, w, h, color);
    else if (cat === "backend") drawBackendAnim(ctx, w, h, color);
    else drawToolsAnim(ctx, w, h, color);
}

function drawFrontendAnim(
    ctx: CanvasRenderingContext2D,
    w: number,
    h: number,
    color: string,
) {
    let t = 0;
    function draw() {
        ctx.clearRect(0, 0, w, h);
        t += 0.015;
        const cx = w / 2;
        const cy = h / 2;
        for (let i = 0; i < 3; i++) {
            const angle = t + (i * Math.PI * 2) / 3;
            ctx.save();
            ctx.translate(cx, cy);
            ctx.rotate(i * 0.5);
            ctx.beginPath();
            ctx.ellipse(0, 0, 60 + i * 15, 25 + i * 5, 0, 0, Math.PI * 2);
            ctx.strokeStyle = `${color}22`;
            ctx.lineWidth = 1;
            ctx.stroke();
            ctx.restore();
            const dx = Math.cos(angle) * (60 + i * 15);
            const dy = Math.sin(angle) * (25 + i * 5);
            ctx.beginPath();
            ctx.arc(cx + dx, cy + dy, 4, 0, Math.PI * 2);
            ctx.fillStyle = `${color}99`;
            ctx.fill();
        }
        ctx.beginPath();
        ctx.arc(cx, cy, 8, 0, Math.PI * 2);
        ctx.fillStyle = `${color}55`;
        ctx.fill();
        animFrameId = requestAnimationFrame(draw);
    }
    draw();
}

function drawBackendAnim(
    ctx: CanvasRenderingContext2D,
    w: number,
    h: number,
    color: string,
) {
    let t = 0;
    const nodes = Array.from({ length: 6 }, (_, i) => ({
        x: 30 + (i % 3) * ((w - 60) / 2),
        y: 25 + Math.floor(i / 3) * (h - 50),
    }));
    function draw() {
        ctx.clearRect(0, 0, w, h);
        t += 0.02;
        nodes.forEach((a, i) => {
            nodes.forEach((b, j) => {
                if (j <= i) return;
                const pulse = Math.sin(t + i + j) * 0.5 + 0.5;
                ctx.beginPath();
                ctx.moveTo(a.x, a.y);
                ctx.lineTo(b.x, b.y);
                ctx.strokeStyle = `${color}${Math.round(pulse * 30)
                    .toString(16)
                    .padStart(2, "0")}`;
                ctx.lineWidth = 1;
                ctx.stroke();
                const p = (t * 0.3 + i * 0.2) % 1;
                ctx.beginPath();
                ctx.arc(
                    a.x + (b.x - a.x) * p,
                    a.y + (b.y - a.y) * p,
                    2,
                    0,
                    Math.PI * 2,
                );
                ctx.fillStyle = `${color}88`;
                ctx.fill();
            });
        });
        nodes.forEach((n, i) => {
            const pulse = Math.sin(t * 2 + i) * 3;
            ctx.beginPath();
            ctx.arc(n.x, n.y, 6 + pulse, 0, Math.PI * 2);
            ctx.fillStyle = `${color}33`;
            ctx.fill();
            ctx.beginPath();
            ctx.arc(n.x, n.y, 3, 0, Math.PI * 2);
            ctx.fillStyle = `${color}88`;
            ctx.fill();
        });
        animFrameId = requestAnimationFrame(draw);
    }
    draw();
}

function drawToolsAnim(
    ctx: CanvasRenderingContext2D,
    w: number,
    h: number,
    color: string,
) {
    let t = 0;
    function drawGear(
        cx: number,
        cy: number,
        r: number,
        teeth: number,
        rot: number,
    ) {
        ctx.save();
        ctx.translate(cx, cy);
        ctx.rotate(rot);
        ctx.beginPath();
        for (let i = 0; i < teeth; i++) {
            const a1 = (i / teeth) * Math.PI * 2;
            const a2 = ((i + 0.3) / teeth) * Math.PI * 2;
            const a3 = ((i + 0.5) / teeth) * Math.PI * 2;
            const a4 = ((i + 0.8) / teeth) * Math.PI * 2;
            const ri = r * 0.75;
            if (i === 0) ctx.moveTo(Math.cos(a1) * ri, Math.sin(a1) * ri);
            ctx.lineTo(Math.cos(a2) * r, Math.sin(a2) * r);
            ctx.lineTo(Math.cos(a3) * r, Math.sin(a3) * r);
            ctx.lineTo(Math.cos(a4) * ri, Math.sin(a4) * ri);
        }
        ctx.closePath();
        ctx.strokeStyle = `${color}55`;
        ctx.lineWidth = 1.5;
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(0, 0, r * 0.3, 0, Math.PI * 2);
        ctx.strokeStyle = `${color}44`;
        ctx.stroke();
        ctx.restore();
    }
    function draw() {
        ctx.clearRect(0, 0, w, h);
        t += 0.01;
        drawGear(w * 0.35, h * 0.45, 28, 8, t);
        drawGear(w * 0.6, h * 0.35, 20, 6, -t * 1.33);
        drawGear(w * 0.7, h * 0.65, 15, 5, t * 1.8);
        animFrameId = requestAnimationFrame(draw);
    }
    draw();
}

const languageMap: Record<string, string[]> = {
    "Vue.js": ["Vue", "vue"],
    Nuxt: ["Nuxt", "nuxt"],
    React: ["React", "react"],
    Angular: ["Angular", "angular"],
    TypeScript: ["TypeScript", "typescript"],
    JavaScript: ["JavaScript", "javascript"],
    "Node.js": ["JavaScript", "TypeScript"],
    Python: ["Python", "python"],
    MongoDB: ["MongoDB"],
    PostgreSQL: ["PostgreSQL"],
    Docker: ["Dockerfile"],
    Git: [],
    AWS: [],
};

const relatedProjects = computed(() => {
    if (!props.skill) return [];
    const langs = languageMap[props.skill.name] || [props.skill.name];
    return (props.projects || [])
        .filter((p) =>
            langs.some(
                (l) =>
                    p.language?.toLowerCase() === l.toLowerCase() ||
                    p.topics?.some((tp) =>
                        tp.toLowerCase().includes(l.toLowerCase()),
                    ),
            ),
        )
        .slice(0, 4);
});

onUnmounted(() => {
    if (animFrameId) cancelAnimationFrame(animFrameId);
});
</script>

<style scoped>
.skill-dialog-card {
    border-radius: 16px !important;
    overflow: hidden;
    border: 1px solid rgb(var(--v-theme-on-surface), 0.1);
}
.skill-dialog-header {
    position: relative;
    height: 160px;
    overflow: hidden;
}
.category-frontend {
    background: linear-gradient(135deg, #1e3a5f, #0f172a);
}
.category-backend {
    background: linear-gradient(135deg, #064e3b, #0f172a);
}
.category-tools {
    background: linear-gradient(135deg, #78350f, #0f172a);
}
.header-canvas {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
}
.header-overlay {
    position: absolute;
    inset: 0;
    background: linear-gradient(
        180deg,
        transparent 30%,
        rgba(0, 0, 0, 0.4) 100%
    );
}
.header-content {
    position: relative;
    z-index: 2;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100%;
    gap: 6px;
}
.skill-dialog-title {
    font-size: 1.5rem;
    font-weight: 800;
    font-family: var(--font-heading);
    color: white;
}
.close-btn {
    position: absolute !important;
    top: 8px;
    right: 8px;
    z-index: 3;
}
.section-label {
    font-size: 0.8rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 1px;
    color: rgb(var(--v-theme-on-surface), 0.6);
}
.gauge-wrap {
    position: relative;
    width: 200px;
    height: 110px;
    margin: 0 auto;
}
.gauge-svg {
    width: 100%;
    height: 100%;
}
.gauge-fill {
    transition: stroke-dashoffset 1.2s cubic-bezier(0.4, 0, 0.2, 1);
}
.gauge-value {
    position: absolute;
    bottom: 8px;
    left: 50%;
    transform: translateX(-50%);
    text-align: center;
}
.gauge-number {
    display: block;
    font-size: 1.8rem;
    font-weight: 900;
    font-family: var(--font-heading);
}
.gauge-label {
    font-size: 0.65rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 1px;
    color: rgb(var(--v-theme-on-surface), 0.4);
}
.related-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
    gap: 10px;
}
.related-card {
    display: block;
    padding: 12px;
    border-radius: 10px;
    border: 1px solid rgb(var(--v-theme-on-surface), 0.06);
    background: rgb(var(--v-theme-on-surface), 0.02);
    text-decoration: none;
    color: inherit;
    transition: all 0.2s ease;
}
.related-card:hover {
    border-color: rgb(var(--v-theme-primary), 0.3);
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}
.no-projects-anim {
    animation: float-rocket 3s ease-in-out infinite;
}
@keyframes float-rocket {
    0%,
    100% {
        transform: translateY(0);
    }
    50% {
        transform: translateY(-6px);
    }
}
</style>
