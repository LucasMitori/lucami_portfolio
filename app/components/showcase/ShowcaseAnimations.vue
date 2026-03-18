<template>
    <div class="showcase-animations">
        <h2 class="showcase-section-title">{{ t("components.animations") }}</h2>

        <p class="text-medium-emphasis mb-6">
            Click a button to trigger the corresponding animation. Each card
            resets and replays the animation on click.
        </p>

        <v-row>
            <v-col
                v-for="anim in animations"
                :key="anim.type"
                cols="12"
                sm="6"
                md="4"
            >
                <div class="anim-demo">
                    <v-btn
                        color="primary"
                        variant="tonal"
                        size="small"
                        class="mb-4"
                        @click="triggerAnimation(anim.type)"
                    >
                        <v-icon start>{{ anim.icon }}</v-icon>
                        {{ anim.label }}
                    </v-btn>

                    <AnimatedSection
                        v-if="visibleAnimations[anim.type]"
                        :key="animationKeys[anim.type]"
                        :animation="anim.type"
                        :duration="800"
                    >
                        <v-card variant="outlined" class="anim-card">
                            <v-card-text class="text-center py-6">
                                <v-icon
                                    size="32"
                                    color="primary"
                                    class="mb-2"
                                    >{{ anim.icon }}</v-icon
                                >
                                <div class="font-weight-medium">
                                    {{ anim.label }}
                                </div>
                                <div
                                    class="text-caption text-medium-emphasis mt-1"
                                >
                                    {{ anim.description }}
                                </div>
                            </v-card-text>
                        </v-card>
                    </AnimatedSection>
                </div>
            </v-col>
        </v-row>

        <h3 class="showcase-group-title mt-8 mb-4">Theme-Specific Easing</h3>
        <p class="text-medium-emphasis mb-4">
            Each theme uses a unique easing curve for animations. Switch themes
            to see the difference.
        </p>

        <v-row>
            <v-col
                v-for="theme in themes"
                :key="theme.name"
                cols="12"
                sm="6"
                md="3"
            >
                <v-card variant="outlined" class="pa-4">
                    <div class="text-center">
                        <v-chip
                            :color="theme.color"
                            size="small"
                            class="mb-2"
                            >{{ theme.name }}</v-chip
                        >
                        <div
                            class="text-caption font-weight-medium text-medium-emphasis"
                        >
                            {{ theme.easing }}
                        </div>
                        <div class="text-caption text-medium-emphasis mt-1">
                            {{ theme.description }}
                        </div>
                    </div>
                </v-card>
            </v-col>
        </v-row>

        <h3 class="showcase-group-title mt-8 mb-4">Staggered Delays</h3>
        <v-btn
            color="primary"
            variant="tonal"
            size="small"
            class="mb-4"
            @click="triggerStagger"
        >
            <v-icon start>mdi-play</v-icon>
            Play Stagger
        </v-btn>

        <v-row>
            <v-col
                v-for="(item, index) in 6"
                :key="item"
                cols="6"
                sm="4"
                md="2"
            >
                <AnimatedSection
                    v-if="showStagger"
                    :key="`stagger-${staggerKey}-${index}`"
                    animation="scaleIn"
                    :delay="index * 100"
                    :duration="500"
                >
                    <v-card
                        color="primary"
                        variant="tonal"
                        class="pa-4 text-center"
                    >
                        <div class="text-h5 font-weight-bold">
                            {{ index + 1 }}
                        </div>
                        <div class="text-caption">{{ index * 100 }}ms</div>
                    </v-card>
                </AnimatedSection>
            </v-col>
        </v-row>
    </div>
</template>

<script setup lang="ts">
type AnimationType =
    | "fadeInUp"
    | "fadeIn"
    | "slideInLeft"
    | "slideInRight"
    | "scaleIn"
    | "blurIn";

const { t } = useI18n();

const animations: {
    type: AnimationType;
    label: string;
    icon: string;
    description: string;
}[] = [
    {
        type: "fadeInUp",
        label: "Fade In Up",
        icon: "mdi-arrow-up-bold",
        description: "Fades in while moving up",
    },
    {
        type: "fadeIn",
        label: "Fade In",
        icon: "mdi-eye",
        description: "Simple opacity fade",
    },
    {
        type: "slideInLeft",
        label: "Slide In Left",
        icon: "mdi-arrow-left-bold",
        description: "Slides in from the left",
    },
    {
        type: "slideInRight",
        label: "Slide In Right",
        icon: "mdi-arrow-right-bold",
        description: "Slides in from the right",
    },
    {
        type: "scaleIn",
        label: "Scale In",
        icon: "mdi-resize",
        description: "Scales up from 85%",
    },
    {
        type: "blurIn",
        label: "Blur In",
        icon: "mdi-blur",
        description: "Fades in with blur removal",
    },
];

const themes = [
    {
        name: "Default",
        color: "primary",
        easing: "easeOutCubic",
        description: "Smooth natural deceleration",
    },
    {
        name: "Nerd",
        color: "secondary",
        easing: "easeOutBack",
        description: "Playful overshoot bounce",
    },
    {
        name: "Retro",
        color: "warning",
        easing: "easeInOutQuad",
        description: "Symmetrical acceleration",
    },
    {
        name: "Coding",
        color: "success",
        easing: "easeOutExpo",
        description: "Sharp exponential stop",
    },
];

const visibleAnimations = reactive<Record<string, boolean>>({
    fadeInUp: true,
    fadeIn: true,
    slideInLeft: true,
    slideInRight: true,
    scaleIn: true,
    blurIn: true,
});

const animationKeys = reactive<Record<string, number>>({
    fadeInUp: 0,
    fadeIn: 0,
    slideInLeft: 0,
    slideInRight: 0,
    scaleIn: 0,
    blurIn: 0,
});

function triggerAnimation(type: string) {
    visibleAnimations[type] = false;
    nextTick(() => {
        visibleAnimations[type] = true;
        animationKeys[type]++;
    });
}

const showStagger = ref(true);
const staggerKey = ref(0);

function triggerStagger() {
    showStagger.value = false;
    nextTick(() => {
        showStagger.value = true;
        staggerKey.value++;
    });
}
</script>

<style scoped>
.showcase-animations {
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

.anim-demo {
    display: flex;
    flex-direction: column;
    align-items: center;
}

.anim-card {
    width: 100%;
    transition: border-color 0.3s ease;
}

.anim-card:hover {
    border-color: rgb(var(--v-theme-primary), 0.4);
}
</style>
