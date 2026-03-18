<template>
    <v-app :theme="themeStore.currentThemeSlug">
        <v-app-bar
            class="app-topbar"
            flat
            color="transparent"
            :elevation="0"
            height="56"
            :style="{
                backdropFilter: scrolled ? 'blur(20px) saturate(1.8)' : 'none',
                background: scrolled
                    ? 'rgb(var(--v-theme-surface), 0.75)'
                    : 'transparent',
                borderBottom: scrolled
                    ? '1px solid rgb(var(--v-theme-primary), 0.1)'
                    : 'none',
                transform: hideBar ? 'translateY(-100%)' : 'translateY(0)',
                transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
            }"
        >
            <NuxtLink
                to="/"
                class="topbar-brand text-decoration-none"
                style="color: inherit"
            >
                <div class="brand-logo">
                    <span class="brand-bracket">&lt;</span>
                    <span class="brand-name">LM</span>
                    <span class="brand-bracket">/&gt;</span>
                </div>
            </NuxtLink>

            <v-spacer />

            <nav class="topbar-nav d-none d-md-flex">
                <NuxtLink
                    v-for="link in navLinks"
                    :key="link.to"
                    :to="localePath(link.to)"
                    class="nav-link"
                    :class="{ active: isActive(link.to) }"
                >
                    <span class="nav-link-text">{{ t(link.title) }}</span>
                    <span class="nav-link-line" />
                </NuxtLink>
            </nav>

            <v-spacer />

            <Transition name="fade">
                <div
                    v-if="isPlaying && scrolled"
                    class="now-playing-mini d-none d-sm-flex"
                >
                    <div class="mini-eq"><span /><span /><span /></div>
                    <span class="mini-label">Playing</span>
                </div>
            </Transition>
        </v-app-bar>

        <v-main>
            <slot />
        </v-main>

        <AppFooter />
        <FloatingHub />
        <GlobalToast />
    </v-app>
</template>

<script setup lang="ts">
const themeStore = useThemeStore();
const { t } = useI18n();
const localePath = useLocalePath();
const route = useRoute();
const { isPlaying } = useMusic();

const scrolled = ref(false);
const hideBar = ref(false);
let lastScroll = 0;

const navLinks = [
    { to: "/", title: "nav.home" },
    { to: "/about", title: "nav.about" },
    { to: "/projects", title: "nav.projects" },
    { to: "/articles", title: "nav.articles" },
    { to: "/components", title: "nav.components" },
];

function isActive(to: string) {
    if (to === "/") return route.path === "/" || route.path === "/pt-BR";
    return route.path.includes(to);
}

function onScroll() {
    const y = window.scrollY;
    scrolled.value = y > 60;
    hideBar.value = y > lastScroll && y > 300;
    lastScroll = y;
}

onMounted(() => {
    window.addEventListener("scroll", onScroll, { passive: true });
});

onUnmounted(() => {
    window.removeEventListener("scroll", onScroll);
});
</script>

<style scoped>
.app-topbar {
    z-index: 1006 !important;
}

.app-topbar :deep(.v-toolbar__content) {
    max-width: 1400px;
    margin: 0 auto;
    width: 100%;
    padding: 0 24px;
}

.topbar-brand {
    display: flex;
    align-items: center;
}

.brand-logo {
    font-family: var(--font-mono);
    font-size: 1.1rem;
    font-weight: 700;
    display: flex;
    align-items: center;
    gap: 2px;
}

.brand-bracket {
    color: rgb(var(--v-theme-primary));
    opacity: 0.7;
}

.brand-name {
    color: rgb(var(--v-theme-on-surface));
    letter-spacing: 2px;
}

.topbar-nav {
    display: flex;
    align-items: center;
    gap: 8px;
}

.nav-link {
    position: relative;
    padding: 6px 16px;
    font-size: 0.8rem;
    font-weight: 600;
    letter-spacing: 0.5px;
    text-transform: uppercase;
    text-decoration: none;
    color: rgb(var(--v-theme-on-surface), 0.6);
    transition: color 0.3s ease;
    font-family: var(--font-mono);
}

.nav-link:hover,
.nav-link.active {
    color: rgb(var(--v-theme-primary));
}

.nav-link-line {
    position: absolute;
    bottom: 0;
    left: 50%;
    width: 0;
    height: 2px;
    background: rgb(var(--v-theme-primary));
    transition: all 0.3s ease;
    transform: translateX(-50%);
    box-shadow: 0 0 8px rgb(var(--v-theme-primary), 0.5);
}

.nav-link:hover .nav-link-line,
.nav-link.active .nav-link-line {
    width: 80%;
}

.now-playing-mini {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 4px 12px;
    border-radius: 100px;
    background: rgb(var(--v-theme-primary), 0.1);
    border: 1px solid rgb(var(--v-theme-primary), 0.2);
}

.mini-eq {
    display: flex;
    align-items: flex-end;
    gap: 2px;
    height: 14px;
}

.mini-eq span {
    width: 2px;
    background: rgb(var(--v-theme-primary));
    border-radius: 1px;
    animation: mini-eq 0.8s ease-in-out infinite;
}

.mini-eq span:nth-child(1) {
    height: 40%;
    animation-delay: 0s;
}
.mini-eq span:nth-child(2) {
    height: 70%;
    animation-delay: 0.2s;
}
.mini-eq span:nth-child(3) {
    height: 50%;
    animation-delay: 0.4s;
}

@keyframes mini-eq {
    0%,
    100% {
        transform: scaleY(0.3);
    }
    50% {
        transform: scaleY(1);
    }
}

.mini-label {
    font-size: 0.65rem;
    font-weight: 600;
    color: rgb(var(--v-theme-primary));
    letter-spacing: 1px;
    text-transform: uppercase;
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
