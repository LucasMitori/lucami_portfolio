<template>
    <div class="stats-section">
        <v-container>
            <div class="stats-strip">
                <div
                    v-for="(stat, index) in stats"
                    :key="stat.label"
                    class="stat-item"
                    :style="{
                        '--delay': `${index * 100}ms`,
                        '--stat-color': stat.color,
                    }"
                >
                    <div class="stat-ring-wrap">
                        <svg viewBox="0 0 100 100" class="stat-ring-svg">
                            <circle cx="50" cy="50" r="42" class="ring-bg" />
                            <circle
                                cx="50"
                                cy="50"
                                r="42"
                                class="ring-fill"
                                :style="{
                                    strokeDasharray: `${circumference}`,
                                    strokeDashoffset: `${circumference - (circumference * stat.animatedProgress) / 100}`,
                                    stroke: stat.color,
                                }"
                            />
                        </svg>
                        <div class="ring-icon">
                            <v-icon :size="20" :color="stat.color">{{
                                stat.icon
                            }}</v-icon>
                        </div>
                    </div>

                    <div class="stat-text">
                        <span
                            class="stat-value"
                            :style="{ color: stat.color }"
                            >{{ stat.displayValue }}</span
                        >
                        <span class="stat-label">{{ stat.label }}</span>
                        <span class="stat-desc">{{ stat.desc }}</span>
                    </div>

                    <div
                        v-if="index < stats.length - 1"
                        class="stat-separator"
                    />
                </div>
            </div>
        </v-container>
    </div>
</template>

<script setup lang="ts">
const { t } = useI18n();
const circumference = 2 * Math.PI * 42; // ~263.9

const stats = reactive([
    {
        value: 2,
        suffix: "+",
        displayValue: "0+",
        label: t("about.yearsExp"),
        desc: "SaltCode",
        icon: "mdi-briefcase-clock",
        color: "#6366f1",
        progress: 65,
        animatedProgress: 0,
    },
    {
        value: 15,
        suffix: "+",
        displayValue: "0+",
        label: t("about.technologies"),
        desc: "Full Stack",
        icon: "mdi-code-braces-box",
        color: "#06b6d4",
        progress: 80,
        animatedProgress: 0,
    },
    {
        value: 50,
        suffix: "+",
        displayValue: "0+",
        label: "Projects",
        desc: "Open Source",
        icon: "mdi-source-repository-multiple",
        color: "#f59e0b",
        progress: 90,
        animatedProgress: 0,
    },
    {
        value: 1000,
        suffix: "+",
        displayValue: "0+",
        label: "Commits",
        desc: "Daily coder",
        icon: "mdi-source-commit",
        color: "#10b981",
        progress: 95,
        animatedProgress: 0,
    },
]);

onMounted(() => {
    const duration = 2000;
    const startTime = performance.now();

    function animate(currentTime: number) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);

        stats.forEach((stat) => {
            const current = Math.floor(eased * stat.value);
            stat.displayValue = `${current}${stat.suffix}`;
            stat.animatedProgress = eased * stat.progress;
        });

        if (progress < 1) requestAnimationFrame(animate);
    }
    requestAnimationFrame(animate);
});
</script>

<style scoped>
.stats-section {
    padding: 0;
}

.stats-strip {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0;
    padding: 28px 16px;
    border-radius: 20px;
    background: rgb(var(--v-theme-surface), 0.6);
    backdrop-filter: blur(16px);
    border: 1px solid rgb(var(--v-theme-on-surface), 0.06);
    box-shadow: 0 8px 40px rgba(0, 0, 0, 0.06);
    flex-wrap: wrap;
}

.stat-item {
    display: flex;
    align-items: center;
    gap: 14px;
    padding: 8px 24px;
    animation: stat-appear 0.6s ease both;
    animation-delay: var(--delay);
    position: relative;
    flex: 1;
    min-width: 200px;
    justify-content: center;
}

@keyframes stat-appear {
    from {
        opacity: 0;
        transform: translateY(15px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

/* Ring */
.stat-ring-wrap {
    position: relative;
    width: 60px;
    height: 60px;
    flex-shrink: 0;
}

.stat-ring-svg {
    width: 100%;
    height: 100%;
    transform: rotate(-90deg);
}

.ring-bg {
    fill: none;
    stroke: rgb(var(--v-theme-on-surface), 0.06);
    stroke-width: 5;
}

.ring-fill {
    fill: none;
    stroke-width: 5;
    stroke-linecap: round;
    transition: stroke-dashoffset 2s cubic-bezier(0.4, 0, 0.2, 1);
}

.ring-icon {
    position: absolute;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
}

/* Text */
.stat-text {
    display: flex;
    flex-direction: column;
    gap: 1px;
}

.stat-value {
    font-size: 1.6rem;
    font-weight: 900;
    font-family: var(--font-heading);
    line-height: 1.1;
}

.stat-label {
    font-size: 0.7rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 1px;
    color: rgb(var(--v-theme-on-surface), 0.5);
}

.stat-desc {
    font-size: 0.6rem;
    color: rgb(var(--v-theme-on-surface), 0.3);
    font-family: var(--font-mono);
}

/* Separator */
.stat-separator {
    width: 1px;
    height: 50px;
    background: linear-gradient(
        180deg,
        transparent,
        rgb(var(--v-theme-on-surface), 0.1),
        transparent
    );
    margin: 0 8px;
}

@media (max-width: 960px) {
    .stats-strip {
        gap: 8px;
        padding: 20px 12px;
    }

    .stat-item {
        padding: 8px 12px;
        min-width: 160px;
    }

    .stat-separator {
        display: none;
    }
}

@media (max-width: 600px) {
    .stat-item {
        min-width: 140px;
        flex: 0 0 calc(50% - 8px);
    }

    .stat-ring-wrap {
        width: 48px;
        height: 48px;
    }

    .stat-value {
        font-size: 1.3rem;
    }
}
</style>
