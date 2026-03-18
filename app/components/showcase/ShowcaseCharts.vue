<template>
    <div class="showcase-charts">
        <h2 class="showcase-section-title">{{ t("components.charts") }}</h2>

        <p class="text-medium-emphasis mb-6">
            Interactive charts built with Chart.js and vue-chartjs. Data is
            sample/demo data.
        </p>

        <v-row>
            <v-col cols="12" md="6">
                <v-card variant="outlined" class="pa-4">
                    <h3 class="showcase-group-title mb-4">Monthly Visitors</h3>
                    <ClientOnly>
                        <Bar :data="barData" :options="barOptions" />
                    </ClientOnly>
                </v-card>
            </v-col>

            <v-col cols="12" md="6">
                <v-card variant="outlined" class="pa-4">
                    <h3 class="showcase-group-title mb-4">
                        Language Distribution
                    </h3>
                    <div class="chart-container-sm">
                        <ClientOnly>
                            <Doughnut
                                :data="doughnutData"
                                :options="doughnutOptions"
                            />
                        </ClientOnly>
                    </div>
                </v-card>
            </v-col>

            <v-col cols="12">
                <v-card variant="outlined" class="pa-4">
                    <h3 class="showcase-group-title mb-4">
                        Performance Over Time
                    </h3>
                    <ClientOnly>
                        <Line :data="lineData" :options="lineOptions" />
                    </ClientOnly>
                </v-card>
            </v-col>
        </v-row>
    </div>
</template>

<script setup lang="ts">
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    LineElement,
    PointElement,
    ArcElement,
    Title,
    Tooltip,
    Legend,
    Filler,
} from "chart.js";
import { Bar, Doughnut, Line } from "vue-chartjs";

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    LineElement,
    PointElement,
    ArcElement,
    Title,
    Tooltip,
    Legend,
    Filler,
);

const { t } = useI18n();

const barData = {
    labels: [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
    ],
    datasets: [
        {
            label: "Visitors",
            data: [
                1200, 1900, 3000, 2500, 2800, 3500, 4200, 3800, 4500, 5200,
                4800, 6100,
            ],
            backgroundColor: "rgba(108, 99, 255, 0.6)",
            borderColor: "rgba(108, 99, 255, 1)",
            borderWidth: 1,
            borderRadius: 6,
        },
    ],
};

const barOptions = {
    responsive: true,
    plugins: {
        legend: { display: false },
    },
    scales: {
        y: {
            beginAtZero: true,
            grid: { color: "rgba(128, 128, 128, 0.1)" },
        },
        x: {
            grid: { display: false },
        },
    },
};

const doughnutData = {
    labels: ["TypeScript", "JavaScript", "Vue", "Python", "CSS", "HTML"],
    datasets: [
        {
            data: [35, 25, 20, 10, 5, 5],
            backgroundColor: [
                "rgba(108, 99, 255, 0.8)",
                "rgba(255, 193, 7, 0.8)",
                "rgba(46, 196, 182, 0.8)",
                "rgba(76, 175, 80, 0.8)",
                "rgba(255, 107, 107, 0.8)",
                "rgba(33, 150, 243, 0.8)",
            ],
            borderWidth: 2,
            borderColor: "rgba(255, 255, 255, 0.1)",
        },
    ],
};

const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
        legend: {
            position: "bottom" as const,
            labels: {
                padding: 16,
                usePointStyle: true,
            },
        },
    },
};

const lineData = {
    labels: [
        "Week 1",
        "Week 2",
        "Week 3",
        "Week 4",
        "Week 5",
        "Week 6",
        "Week 7",
        "Week 8",
    ],
    datasets: [
        {
            label: "Page Load (ms)",
            data: [450, 380, 320, 290, 250, 220, 200, 180],
            borderColor: "rgba(46, 196, 182, 1)",
            backgroundColor: "rgba(46, 196, 182, 0.1)",
            tension: 0.4,
            fill: true,
            pointRadius: 4,
            pointHoverRadius: 6,
        },
        {
            label: "API Response (ms)",
            data: [200, 180, 160, 150, 140, 120, 110, 95],
            borderColor: "rgba(108, 99, 255, 1)",
            backgroundColor: "rgba(108, 99, 255, 0.1)",
            tension: 0.4,
            fill: true,
            pointRadius: 4,
            pointHoverRadius: 6,
        },
    ],
};

const lineOptions = {
    responsive: true,
    plugins: {
        legend: {
            position: "top" as const,
            labels: {
                usePointStyle: true,
                padding: 20,
            },
        },
    },
    scales: {
        y: {
            beginAtZero: true,
            grid: { color: "rgba(128, 128, 128, 0.1)" },
        },
        x: {
            grid: { display: false },
        },
    },
};
</script>

<style scoped>
.showcase-charts {
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.showcase-section-title {
    font-size: 1.5rem;
    font-weight: 700;
    font-family: var(--font-heading);
    margin-bottom: 8px;
}

.showcase-group-title {
    font-size: 0.85rem;
    font-weight: 600;
    color: rgb(var(--v-theme-primary));
    text-transform: uppercase;
    letter-spacing: 1px;
}

.chart-container-sm {
    max-width: 350px;
    margin: 0 auto;
}
</style>
