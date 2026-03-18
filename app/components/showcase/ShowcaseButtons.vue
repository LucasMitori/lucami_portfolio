<template>
    <div class="showcase-buttons">
        <h2 class="showcase-section-title">{{ t("components.buttons") }}</h2>

        <h3 class="showcase-group-title">Variants</h3>
        <div class="showcase-grid">
            <div
                v-for="variant in variants"
                :key="variant"
                class="showcase-item"
            >
                <span class="showcase-label">{{ variant }}</span>
                <v-btn :variant="variant" color="primary">{{ variant }}</v-btn>
            </div>
        </div>

        <h3 class="showcase-group-title">Colors</h3>
        <div class="showcase-grid">
            <div v-for="color in colors" :key="color" class="showcase-item">
                <span class="showcase-label">{{ color }}</span>
                <v-btn color="" :class="`bg-${color}`">{{ color }}</v-btn>
            </div>
        </div>

        <h3 class="showcase-group-title">Sizes</h3>
        <div class="showcase-grid align-end">
            <div v-for="size in sizes" :key="size" class="showcase-item">
                <span class="showcase-label">{{ size }}</span>
                <v-btn :size="size" color="primary">{{ size }}</v-btn>
            </div>
        </div>

        <h3 class="showcase-group-title">States</h3>
        <div class="showcase-grid">
            <div class="showcase-item">
                <span class="showcase-label">Loading</span>
                <v-btn color="primary" loading>Loading</v-btn>
            </div>
            <div class="showcase-item">
                <span class="showcase-label">Disabled</span>
                <v-btn color="primary" disabled>Disabled</v-btn>
            </div>
            <div class="showcase-item">
                <span class="showcase-label">Block</span>
                <v-btn color="primary" block>Block Button</v-btn>
            </div>
            <div class="showcase-item">
                <span class="showcase-label">Rounded</span>
                <v-btn color="secondary" rounded="xl">Rounded</v-btn>
            </div>
        </div>

        <h3 class="showcase-group-title">Icon Buttons</h3>
        <div class="showcase-grid">
            <div v-for="icon in icons" :key="icon.icon" class="showcase-item">
                <span class="showcase-label">{{ icon.label }}</span>
                <v-btn
                    :icon="icon.icon"
                    :color="icon.color"
                    :variant="icon.variant"
                />
            </div>
        </div>

        <h3 class="showcase-group-title">Button Group</h3>
        <div class="showcase-grid">
            <div class="showcase-item">
                <v-btn-toggle
                    v-model="toggleValue"
                    color="primary"
                    variant="outlined"
                    divided
                >
                    <v-btn value="left" icon="mdi-format-align-left" />
                    <v-btn value="center" icon="mdi-format-align-center" />
                    <v-btn value="right" icon="mdi-format-align-right" />
                    <v-btn value="justify" icon="mdi-format-align-justify" />
                </v-btn-toggle>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
const { t } = useI18n();
const toggleValue = ref("center");

const variants = [
    "flat",
    "outlined",
    "tonal",
    "elevated",
    "text",
    "plain",
] as const;
const colors = [
    "primary",
    "secondary",
    "accent",
    "error",
    "success",
    "warning",
    "info",
];
const sizes = ["x-small", "small", "default", "large", "x-large"] as const;

const icons = [
    {
        icon: "mdi-heart",
        color: "error",
        variant: "flat" as const,
        label: "Heart",
    },
    {
        icon: "mdi-star",
        color: "warning",
        variant: "tonal" as const,
        label: "Star",
    },
    {
        icon: "mdi-pencil",
        color: "primary",
        variant: "outlined" as const,
        label: "Edit",
    },
    {
        icon: "mdi-delete",
        color: "error",
        variant: "text" as const,
        label: "Delete",
    },
    {
        icon: "mdi-share-variant",
        color: "secondary",
        variant: "elevated" as const,
        label: "Share",
    },
    {
        icon: "mdi-magnify",
        color: "info",
        variant: "tonal" as const,
        label: "Search",
    },
    {
        icon: "mdi-home",
        color: "success",
        variant: "flat" as const,
        label: "Home",
    },
    {
        icon: "mdi-cog",
        color: "primary",
        variant: "outlined" as const,
        label: "Settings",
    },
];
</script>

<style scoped>
.showcase-buttons {
    display: flex;
    flex-direction: column;
    gap: 24px;
}

.showcase-section-title {
    font-size: 1.5rem;
    font-weight: 700;
    font-family: var(--font-heading);
    margin-bottom: 8px;
}

.showcase-group-title {
    font-size: 1rem;
    font-weight: 600;
    color: rgb(var(--v-theme-primary));
    text-transform: uppercase;
    letter-spacing: 1px;
    margin-top: 8px;
}

.showcase-grid {
    display: flex;
    flex-wrap: wrap;
    gap: 16px;
    align-items: center;
}

.showcase-grid.align-end {
    align-items: flex-end;
}

.showcase-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
}

.showcase-label {
    font-size: 0.7rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    color: rgb(var(--v-theme-on-surface), 0.5);
}
</style>
