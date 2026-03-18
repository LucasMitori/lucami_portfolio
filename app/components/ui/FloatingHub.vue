<template>
    <div class="floating-hub-wrapper">
        <Teleport to="body">
            <Transition name="pulse-fade">
                <div
                    v-if="showPulse"
                    class="theme-pulse-overlay"
                    :style="pulseStyle"
                />
            </Transition>
        </Teleport>

        <Transition name="hub-menu">
            <div v-if="isOpen" class="hub-menu" :style="hubPosition">
                <div
                    v-for="(item, i) in menuItems"
                    :key="item.id"
                    class="hub-menu-item"
                    :style="getItemPosition(i)"
                    @click="handleAction(item)"
                >
                    <div
                        class="hub-item-inner"
                        :class="{ active: item.active?.() }"
                    >
                        <v-icon
                            size="20"
                            :color="item.iconColor || undefined"
                            class="hub-icon"
                            >{{ item.icon }}</v-icon
                        >
                    </div>
                    <span class="hub-item-label">{{ item.label }}</span>
                </div>

                <Transition name="sub-menu">
                    <div v-if="showThemes" class="theme-submenu">
                        <div
                            v-for="theme in themeOptions"
                            :key="theme.slug"
                            class="theme-option"
                            :class="{ active: currentSlug === theme.slug }"
                            :style="{ '--theme-color': theme.color }"
                            @click="switchTheme(theme.slug)"
                        >
                            <div
                                class="theme-dot"
                                :style="{ background: theme.color }"
                            />
                            <span>{{ theme.name }}</span>
                        </div>
                    </div>
                </Transition>
            </div>
        </Transition>

        <div
            ref="fabRef"
            class="floating-fab"
            :class="{ open: isOpen, dragging: isDragging }"
            :style="hubPosition"
            @pointerdown="onPointerDown"
            @click.stop="onFabClick"
        >
            <svg
                v-if="longPressActive"
                class="long-press-ring"
                viewBox="0 0 72 72"
            >
                <circle
                    cx="36"
                    cy="36"
                    r="33"
                    fill="none"
                    stroke="rgba(255,255,255,0.15)"
                    stroke-width="3"
                />
                <circle
                    cx="36"
                    cy="36"
                    r="33"
                    fill="none"
                    stroke="rgb(var(--v-theme-primary))"
                    stroke-width="3"
                    stroke-linecap="round"
                    class="progress-circle"
                    :class="{ animating: longPressActive }"
                />
            </svg>

            <div class="fab-inner">
                <div class="fab-icon-wrap">
                    <v-icon size="24" color="white">{{
                        isOpen ? "mdi-close" : "mdi-lightning-bolt"
                    }}</v-icon>
                </div>
                <div class="fab-ring" />
                <div class="fab-ring ring-2" />
            </div>

            <Transition name="fade">
                <div v-if="isPlaying && !isOpen" class="now-playing-indicator">
                    <div class="eq-bar" />
                    <div class="eq-bar" />
                    <div class="eq-bar" />
                </div>
            </Transition>
        </div>

        <SearchDialog v-model="showSearchDialog" />
    </div>
</template>

<script setup lang="ts">
import type { ThemeSlug } from "~~/shared/types";

const { t, locale, setLocale } = useI18n();
const { toggle: toggleMusic, isPlaying } = useMusic();
const { applyTheme, currentSlug } = useAppTheme();
const { startTour } = useTour();
const musicStore = useMusicStore();
const router = useRouter();
const localePath = useLocalePath();
const { success: toastSuccess, info: toastInfo } = useToast();

// Long-press to admin
const longPressActive = ref(false);
let longPressTimer: ReturnType<typeof setTimeout> | null = null;

const isOpen = ref(false);
const showThemes = ref(false);
const showPulse = ref(false);
const isDragging = ref(false);
const fabRef = ref<HTMLElement | null>(null);

// Draggable position
const position = reactive({ x: 0, y: 0 });
const dragStart = reactive({ x: 0, y: 0, px: 0, py: 0 });
let dragMoved = false;

const hubPosition = computed(() => ({
    left: `${position.x}px`,
    top: `${position.y}px`,
}));

const pulseOrigin = reactive({ x: 0, y: 0 });
const pulseColor = ref("#6366f1");

const pulseStyle = computed(() => ({
    "--pulse-x": `${pulseOrigin.x}px`,
    "--pulse-y": `${pulseOrigin.y}px`,
    "--pulse-color": pulseColor.value,
}));

const themeOptions = [
    { slug: "default" as ThemeSlug, name: "Default", color: "#6C63FF" },
    { slug: "nerd" as ThemeSlug, name: "Nerd", color: "#00F0FF" },
    { slug: "retro" as ThemeSlug, name: "Retro", color: "#8B4513" },
    { slug: "coding" as ThemeSlug, name: "Coding", color: "#00FF41" },
];

const menuItems = computed(() => [
    {
        id: "theme",
        icon: "mdi-palette",
        label: t("common.theme"),
        action: () => {
            showThemes.value = !showThemes.value;
        },
    },
    {
        id: "music",
        icon: isPlaying.value ? "mdi-music-note" : "mdi-music-note-off",
        label: t("common.music"),
        action: () => {
            toggleMusic();
            nextTick(() =>
                toastInfo(
                    isPlaying.value
                        ? t("common.musicPaused")
                        : t("common.musicPlaying"),
                ),
            );
        },
        active: () => isPlaying.value,
        iconColor: isPlaying.value ? "#00FF41" : "white",
    },
    {
        id: "sound",
        icon: musicStore.typingSoundEnabled
            ? "mdi-volume-high"
            : "mdi-volume-off",
        label: t("common.typingSound"),
        action: () => {
            musicStore.typingSoundEnabled = !musicStore.typingSoundEnabled;
            toastInfo(
                musicStore.typingSoundEnabled
                    ? t("common.typingSoundEnabled")
                    : t("common.typingSoundMuted"),
            );
        },
        active: () => musicStore.typingSoundEnabled,
    },
    {
        id: "language",
        icon: "mdi-translate",
        label: locale.value === "pt-BR" ? "EN" : "PT-BR",
        action: () => setLocale(locale.value === "pt-BR" ? "en" : "pt-BR"),
    },
    {
        id: "tour",
        icon: "mdi-compass",
        label: t("common.tour"),
        action: () => {
            isOpen.value = false;
            nextTick(() => startTour());
        },
    },
    {
        id: "search",
        icon: "mdi-magnify",
        label: t("common.search"),
        action: () => {
            isOpen.value = false;
            showSearchDialog.value = true;
        },
    },
]);

const showSearchDialog = ref(false);

function getItemPosition(index: number) {
    const total = menuItems.value.length;
    const angleStep = 360 / total;
    const angle = (angleStep * index - 90) * (Math.PI / 180);
    const radius = 100;
    return {
        "--item-x": `${Math.cos(angle) * radius}px`,
        "--item-y": `${Math.sin(angle) * radius}px`,
        transitionDelay: `${index * 40}ms`,
    };
}

function handleAction(item: { action: () => void }) {
    if (item.action) item.action();
}

function switchTheme(slug: ThemeSlug) {
    const themeOpt = themeOptions.find((t) => t.slug === slug);
    if (themeOpt) {
        pulseColor.value = themeOpt.color;
        pulseOrigin.x = position.x + 28;
        pulseOrigin.y = position.y + 28;
        showPulse.value = true;
        setTimeout(() => {
            applyTheme(slug);
            toastSuccess(t("common.themeChanged", { name: themeOpt.name }));
            setTimeout(() => {
                showPulse.value = false;
            }, 600);
        }, 300);
    }
    showThemes.value = false;
    isOpen.value = false;
}

function onFabClick() {
    if (dragMoved) return;
    showThemes.value = false;
    isOpen.value = !isOpen.value;
}

function startLongPress() {
    longPressActive.value = true;
    longPressTimer = setTimeout(() => {
        longPressActive.value = false;
        longPressTimer = null;
        if (navigator.vibrate) navigator.vibrate(100);
        router.push(localePath("/admin/login"));
    }, 5000);
}

function cancelLongPress() {
    if (longPressTimer) {
        clearTimeout(longPressTimer);
        longPressTimer = null;
    }
    longPressActive.value = false;
}

function onPointerDown(e: PointerEvent) {
    dragMoved = false;
    isDragging.value = true;
    dragStart.x = e.clientX;
    dragStart.y = e.clientY;
    dragStart.px = position.x;
    dragStart.py = position.y;
    (e.target as HTMLElement)?.setPointerCapture?.(e.pointerId);
    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", onPointerUp);
    startLongPress();
}

function onPointerMove(e: PointerEvent) {
    const dx = e.clientX - dragStart.x;
    const dy = e.clientY - dragStart.y;
    if (Math.abs(dx) > 5 || Math.abs(dy) > 5) {
        dragMoved = true;
        cancelLongPress();
    }
    if (!dragMoved) return;
    const newX = Math.max(
        10,
        Math.min(window.innerWidth - 66, dragStart.px + dx),
    );
    const newY = Math.max(
        10,
        Math.min(window.innerHeight - 66, dragStart.py + dy),
    );
    position.x = newX;
    position.y = newY;
}

function onPointerUp() {
    isDragging.value = false;
    cancelLongPress();
    window.removeEventListener("pointermove", onPointerMove);
    window.removeEventListener("pointerup", onPointerUp);
}

// Click outside to close
function onClickOutside(e: MouseEvent) {
    if (!fabRef.value?.contains(e.target as Node) && isOpen.value) {
        const hubMenu = document.querySelector(".hub-menu");
        const themeMenu = document.querySelector(".theme-submenu");
        if (
            hubMenu?.contains(e.target as Node) ||
            themeMenu?.contains(e.target as Node)
        )
            return;
        isOpen.value = false;
        showThemes.value = false;
    }
}

onMounted(() => {
    // Position inward enough so all radial menu items (radius=100) are visible
    position.x = window.innerWidth - 140;
    position.y = window.innerHeight - 160;
    document.addEventListener("click", onClickOutside);
});

onUnmounted(() => {
    document.removeEventListener("click", onClickOutside);
});
</script>

<style scoped>
.floating-hub-wrapper {
    position: fixed;
    inset: 0;
    pointer-events: none;
    z-index: 9990;
}

.floating-fab {
    position: fixed;
    width: 56px;
    height: 56px;
    border-radius: 50%;
    cursor: grab;
    pointer-events: all;
    z-index: 9999;
    transform: translate(-50%, -50%);
    transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
    touch-action: none;
    user-select: none;
}

.floating-fab.dragging {
    cursor: grabbing;
    transform: translate(-50%, -50%) scale(1.1);
}

.floating-fab.open .fab-inner {
    transform: rotate(180deg);
}

/* Long-press progress ring */
.long-press-ring {
    position: absolute;
    width: 72px;
    height: 72px;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 3;
    pointer-events: none;
}

.progress-circle {
    stroke-dasharray: 207.35;
    stroke-dashoffset: 207.35;
    transform: rotate(-90deg);
    transform-origin: center;
}

.progress-circle.animating {
    animation: long-press-fill 5s linear forwards;
}

@keyframes long-press-fill {
    from {
        stroke-dashoffset: 207.35;
    }
    to {
        stroke-dashoffset: 0;
    }
}

.fab-inner {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    background: linear-gradient(
        135deg,
        rgb(var(--v-theme-primary)),
        rgb(var(--v-theme-secondary))
    );
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    transition: transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
    box-shadow:
        0 4px 20px rgb(var(--v-theme-primary), 0.4),
        0 0 40px rgb(var(--v-theme-primary), 0.15);
}

.fab-icon-wrap {
    z-index: 2;
    transition: transform 0.3s ease;
}

.fab-ring {
    position: absolute;
    inset: -4px;
    border-radius: 50%;
    border: 2px solid rgb(var(--v-theme-primary), 0.3);
    animation: fab-pulse 3s ease-in-out infinite;
}

.fab-ring.ring-2 {
    inset: -10px;
    border-color: rgb(var(--v-theme-primary), 0.15);
    animation-delay: -1.5s;
}

@keyframes fab-pulse {
    0%,
    100% {
        transform: scale(1);
        opacity: 0.6;
    }
    50% {
        transform: scale(1.15);
        opacity: 0;
    }
}

/* Now playing */
.now-playing-indicator {
    position: absolute;
    bottom: -8px;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    gap: 2px;
    align-items: flex-end;
    height: 12px;
}

.eq-bar {
    width: 3px;
    background: rgb(var(--v-theme-primary));
    border-radius: 1px;
    animation: eq-bounce 0.8s ease-in-out infinite;
}

.eq-bar:nth-child(1) {
    height: 60%;
    animation-delay: 0s;
}
.eq-bar:nth-child(2) {
    height: 100%;
    animation-delay: 0.2s;
}
.eq-bar:nth-child(3) {
    height: 40%;
    animation-delay: 0.4s;
}

@keyframes eq-bounce {
    0%,
    100% {
        transform: scaleY(0.3);
    }
    50% {
        transform: scaleY(1);
    }
}

/* Radial menu */
.hub-menu {
    position: fixed;
    pointer-events: all;
    z-index: 9998;
    transform: translate(-50%, -50%);
}

.hub-menu-item {
    position: absolute;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 4px;
    cursor: pointer;
    transform: translate(
        calc(-50% + var(--item-x)),
        calc(-50% + var(--item-y))
    );
    opacity: 1;
    transition:
        opacity 0.3s ease,
        transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.hub-item-inner {
    width: 44px;
    height: 44px;
    border-radius: 50%;
    background: rgb(var(--v-theme-primary));
    border: 2px solid rgb(var(--v-theme-primary), 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.25s ease;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
}

.hub-icon {
    color: rgb(var(--v-theme-on-primary)) !important;
}

.hub-item-inner:hover {
    border-color: rgb(var(--v-theme-primary));
    transform: scale(1.15);
    box-shadow: 0 0 20px rgb(var(--v-theme-primary), 0.4);
    background: rgb(var(--v-theme-primary));
}

.hub-item-inner.active {
    background: rgb(var(--v-theme-secondary));
    border-color: rgb(var(--v-theme-secondary));
}

.hub-item-label {
    font-size: 0.6rem;
    font-weight: 700;
    letter-spacing: 0.5px;
    text-transform: uppercase;
    color: rgb(var(--v-theme-on-surface));
    white-space: nowrap;
    text-shadow:
        0 1px 4px rgb(var(--v-theme-background)),
        0 0px 8px rgb(var(--v-theme-background));
    pointer-events: none;
}

/* Theme submenu */
.theme-submenu {
    position: absolute;
    top: -180px;
    left: 50%;
    transform: translateX(-50%);
    background: rgb(var(--v-theme-surface));
    border: 1px solid rgb(var(--v-theme-primary), 0.3);
    border-radius: 12px;
    padding: 8px;
    display: flex;
    flex-direction: column;
    gap: 4px;
    min-width: 140px;
    box-shadow: 0 8px 30px rgba(0, 0, 0, 0.3);
}

.theme-option {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 8px 12px;
    border-radius: 8px;
    cursor: pointer;
    font-size: 0.8rem;
    font-weight: 600;
    color: rgb(var(--v-theme-on-surface));
    transition: all 0.2s ease;
}

.theme-option:hover {
    background: rgb(var(--v-theme-primary), 0.1);
}

.theme-option.active {
    background: rgb(var(--v-theme-primary), 0.15);
    color: rgb(var(--v-theme-primary));
}

.theme-dot {
    width: 16px;
    height: 16px;
    border-radius: 50%;
    box-shadow: 0 0 8px var(--theme-color, transparent);
}

/* Theme pulse overlay */
.theme-pulse-overlay {
    position: fixed;
    inset: 0;
    z-index: 99999;
    pointer-events: none;
    background: var(--pulse-color);
    clip-path: circle(150vmax at var(--pulse-x) var(--pulse-y));
    animation: pulse-expand 0.9s cubic-bezier(0.4, 0, 0.2, 1) forwards;
    opacity: 0.85;
}

@keyframes pulse-expand {
    0% {
        clip-path: circle(0 at var(--pulse-x) var(--pulse-y));
        opacity: 0.85;
    }
    60% {
        opacity: 0.4;
    }
    100% {
        clip-path: circle(150vmax at var(--pulse-x) var(--pulse-y));
        opacity: 0;
    }
}

.pulse-fade-enter-active {
    animation: pulse-expand 0.9s cubic-bezier(0.4, 0, 0.2, 1) forwards;
}
.pulse-fade-leave-active {
    transition: opacity 0.3s ease;
}
.pulse-fade-leave-to {
    opacity: 0;
}

/* Hub menu transitions */
.hub-menu-enter-active {
    transition: opacity 0.3s ease;
}
.hub-menu-leave-active {
    transition: opacity 0.2s ease;
}
.hub-menu-enter-from,
.hub-menu-leave-to {
    opacity: 0;
}

.sub-menu-enter-active {
    transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}
.sub-menu-leave-active {
    transition: all 0.2s ease;
}
.sub-menu-enter-from {
    opacity: 0;
    transform: translateX(-50%) translateY(10px) scale(0.9);
}
.sub-menu-leave-to {
    opacity: 0;
    transform: translateX(-50%) scale(0.9);
}

.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}
</style>
