<template>
    <div
        class="wave-divider"
        :class="[`wave-${position}`, { 'wave-flip': flip }]"
    >
        <svg
            :viewBox="`0 0 1440 ${height}`"
            preserveAspectRatio="none"
            xmlns="http://www.w3.org/2000/svg"
            class="wave-svg"
        >
            <defs>
                <linearGradient
                    :id="`wave-grad-${uid}`"
                    x1="0%"
                    y1="0%"
                    x2="100%"
                    y2="0%"
                >
                    <stop offset="0%" class="wave-stop-1" />
                    <stop offset="50%" class="wave-stop-2" />
                    <stop offset="100%" class="wave-stop-1" />
                </linearGradient>
            </defs>
            <path :d="wavePath" class="wave-fill wave-main" />
            <path
                v-if="variant === 'double'"
                :d="secondPath"
                class="wave-fill wave-secondary"
            />
            <path :d="accentPath" class="wave-accent" />
        </svg>
    </div>
</template>

<script setup lang="ts">
type WaveVariant = "smooth" | "jagged" | "double" | "asymmetric";

const props = withDefaults(
    defineProps<{
        position?: "top" | "bottom";
        variant?: WaveVariant;
        flip?: boolean;
        height?: number;
    }>(),
    {
        position: "bottom",
        variant: "smooth",
        flip: false,
        height: 150,
    },
);

// Use useId() for SSR-safe deterministic IDs (prevents hydration mismatch)
const uid = useId();

const wavePaths: Record<WaveVariant, string> = {
    smooth: `M0,50 C120,90 240,20 360,60 C480,100 600,10 720,50 C840,90 960,20 1080,60 C1200,100 1320,30 1440,70 L1440,${props.height} L0,${props.height}Z`,
    jagged: `M0,60L60,35L120,75L180,30L240,70L300,25L360,60L420,20L480,65L540,30L600,70L660,25L720,60L780,20L840,65L900,30L960,70L1020,25L1080,60L1140,20L1200,65L1260,30L1320,70L1380,35L1440,55L1440,${props.height}L0,${props.height}Z`,
    double: `M0,64L60,56C120,48,240,32,360,28C480,24,600,32,720,44C840,56,960,72,1080,76C1200,80,1320,72,1380,68L1440,64L1440,${props.height}L0,${props.height}Z`,
    asymmetric: `M0,90 C180,40 360,70 540,30 C720,0 900,50 1080,20 C1200,5 1350,40 1440,25 L1440,${props.height} L0,${props.height}Z`,
};

const secondPath = `M0,80L60,72C120,64,240,48,360,48C480,48,600,64,720,72C840,80,960,80,1080,72C1200,64,1320,48,1380,40L1440,32L1440,${props.height}L0,${props.height}Z`;

const accentPath = `M0,70 C200,30 400,90 600,50 C800,10 1000,80 1200,40 C1350,20 1400,60 1440,50 L1440,${props.height} L0,${props.height}Z`;

const wavePath = computed(() => wavePaths[props.variant]);
</script>

<style scoped>
.wave-divider {
    width: 100%;
    overflow: hidden;
    line-height: 0;
    position: relative;
    z-index: 3;
    margin-top: -2px;
    margin-bottom: -2px;
}

.wave-svg {
    width: 100%;
    height: auto;
    display: block;
    min-height: 100px;
}

.wave-top {
    transform: rotate(180deg);
}

.wave-flip .wave-svg {
    transform: scaleX(-1);
}

.wave-fill.wave-main {
    fill: rgb(var(--v-theme-surface));
}

.wave-fill.wave-secondary {
    fill: rgb(var(--v-theme-surface));
    opacity: 0.6;
}

.wave-accent {
    fill: rgb(var(--v-theme-primary));
    opacity: 0.06;
    animation: wave-flow 12s ease-in-out infinite alternate;
}

.wave-stop-1 {
    stop-color: rgb(var(--v-theme-surface));
}

.wave-stop-2 {
    stop-color: rgb(var(--v-theme-surface));
}

@keyframes wave-flow {
    0% {
        transform: translateX(0);
    }
    100% {
        transform: translateX(-30px);
    }
}
</style>
