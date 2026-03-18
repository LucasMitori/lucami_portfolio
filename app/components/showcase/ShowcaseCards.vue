<template>
    <div class="showcase-cards">
        <h2 class="showcase-section-title">{{ t("components.cards") }}</h2>

        <v-row>
            <v-col cols="12" sm="6" md="4">
                <h3 class="showcase-group-title mb-3">Basic Card</h3>
                <v-card>
                    <v-card-title>Card Title</v-card-title>
                    <v-card-subtitle>Card Subtitle</v-card-subtitle>
                    <v-card-text>
                        This is a basic card with title, subtitle, text content,
                        and action buttons below.
                    </v-card-text>
                    <v-card-actions>
                        <v-btn color="primary" variant="text">Action</v-btn>
                        <v-btn color="secondary" variant="text">Cancel</v-btn>
                    </v-card-actions>
                </v-card>
            </v-col>

            <v-col cols="12" sm="6" md="4">
                <h3 class="showcase-group-title mb-3">Image Card</h3>
                <v-card>
                    <div class="card-gradient-img" />
                    <v-card-title>Gradient Hero</v-card-title>
                    <v-card-text>
                        A card with a gradient placeholder image at the top,
                        useful for project showcases.
                    </v-card-text>
                    <v-card-actions>
                        <v-btn color="primary" variant="tonal" size="small"
                            >View</v-btn
                        >
                        <v-spacer />
                        <v-btn
                            icon="mdi-heart-outline"
                            variant="text"
                            size="small"
                        />
                        <v-btn
                            icon="mdi-share-variant"
                            variant="text"
                            size="small"
                        />
                    </v-card-actions>
                </v-card>
            </v-col>

            <v-col cols="12" sm="6" md="4">
                <h3 class="showcase-group-title mb-3">Outlined Card</h3>
                <v-card variant="outlined">
                    <v-card-item>
                        <template #prepend>
                            <v-icon color="primary" size="40"
                                >mdi-code-braces</v-icon
                            >
                        </template>
                        <v-card-title>Code Review</v-card-title>
                        <v-card-subtitle>3 pending reviews</v-card-subtitle>
                    </v-card-item>
                    <v-card-text>
                        An outlined card with an icon prepended to the card item
                        header area.
                    </v-card-text>
                    <v-card-actions>
                        <v-btn color="primary" variant="flat" block
                            >Review Now</v-btn
                        >
                    </v-card-actions>
                </v-card>
            </v-col>

            <v-col cols="12" md="6">
                <h3 class="showcase-group-title mb-3">Horizontal Layout</h3>
                <v-card class="d-flex flex-row">
                    <div class="card-gradient-side" />
                    <div>
                        <v-card-title>Horizontal Card</v-card-title>
                        <v-card-subtitle>Side-by-side layout</v-card-subtitle>
                        <v-card-text>
                            A card with a horizontal layout combining a gradient
                            side panel with content.
                        </v-card-text>
                        <v-card-actions>
                            <v-btn color="primary" variant="text" size="small"
                                >Learn More</v-btn
                            >
                        </v-card-actions>
                    </div>
                </v-card>
            </v-col>

            <v-col cols="12" sm="6" md="3">
                <h3 class="showcase-group-title mb-3">Hover Effect</h3>
                <v-card
                    class="hover-card"
                    :elevation="hovered ? 12 : 2"
                    @mouseenter="hovered = true"
                    @mouseleave="hovered = false"
                >
                    <v-card-text class="text-center py-8">
                        <v-icon size="48" color="primary"
                            >mdi-cursor-default-click</v-icon
                        >
                        <div class="mt-4 font-weight-medium">Hover over me</div>
                        <div class="text-caption text-medium-emphasis">
                            Elevation changes on hover
                        </div>
                    </v-card-text>
                </v-card>
            </v-col>

            <v-col cols="12" sm="6" md="3">
                <h3 class="showcase-group-title mb-3">Glow Border</h3>
                <v-card class="glow-card">
                    <v-card-text class="text-center py-8">
                        <v-icon size="48" color="primary">mdi-shimmer</v-icon>
                        <div class="mt-4 font-weight-medium">Glow Effect</div>
                        <div class="text-caption text-medium-emphasis">
                            Theme-aware glow border
                        </div>
                    </v-card-text>
                </v-card>
            </v-col>
        </v-row>
    </div>
</template>

<script setup lang="ts">
const { t } = useI18n();
const hovered = ref(false);
</script>

<style scoped>
.showcase-cards {
    display: flex;
    flex-direction: column;
    gap: 16px;
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

.card-gradient-img {
    height: 140px;
    background: linear-gradient(
        135deg,
        rgb(var(--v-theme-primary)),
        rgb(var(--v-theme-secondary))
    );
    border-radius: 4px 4px 0 0;
}

.card-gradient-side {
    width: 100px;
    min-height: 100%;
    background: linear-gradient(
        180deg,
        rgb(var(--v-theme-primary)),
        rgb(var(--v-theme-secondary))
    );
    border-radius: 4px 0 0 4px;
    flex-shrink: 0;
}

.hover-card {
    transition: all 0.3s cubic-bezier(0.33, 1, 0.68, 1);
    cursor: pointer;
}

.hover-card:hover {
    transform: translateY(-4px);
}

.glow-card {
    position: relative;
    overflow: visible;
    border: 1px solid rgb(var(--v-theme-primary), 0.3);
    transition: all 0.3s ease;
}

.glow-card:hover {
    border-color: rgb(var(--v-theme-primary), 0.6);
    box-shadow:
        0 0 15px rgb(var(--v-theme-primary), 0.15),
        0 0 30px rgb(var(--v-theme-primary), 0.08);
}
</style>
