<template>
    <v-app :theme="adminTheme">
        <v-app-bar v-if="isMobile" color="surface" flat class="admin-appbar">
            <v-app-bar-nav-icon @click="drawer = !drawer" />
            <v-app-bar-title class="d-flex align-center gap-2">
                <v-icon color="primary" size="20">mdi-lightning-bolt</v-icon>
                <span class="text-body-1 font-weight-bold">{{
                    t("admin.panel")
                }}</span>
            </v-app-bar-title>
            <v-btn icon variant="text" @click="toggleAdminTheme">
                <v-icon>{{
                    darkMode ? "mdi-weather-sunny" : "mdi-weather-night"
                }}</v-icon>
            </v-btn>
        </v-app-bar>

        <v-navigation-drawer
            v-model="drawer"
            :rail="!isMobile && rail"
            :permanent="!isMobile"
            :temporary="isMobile"
            class="admin-drawer"
            color="surface"
        >
            <div class="drawer-header pa-4">
                <div class="d-flex align-center gap-3">
                    <v-avatar color="primary" size="42" class="admin-avatar">
                        <span class="text-white font-weight-bold">{{
                            userInitial
                        }}</span>
                    </v-avatar>
                    <div v-if="!rail || isMobile" class="flex-grow-1">
                        <div class="text-body-2 font-weight-bold">
                            {{ user?.name || "Admin" }}
                        </div>
                        <div class="text-caption text-medium-emphasis">
                            {{ user?.email || "" }}
                        </div>
                    </div>
                    <v-btn
                        v-if="!isMobile"
                        icon
                        variant="text"
                        size="small"
                        @click="rail = !rail"
                    >
                        <v-icon size="18">{{
                            rail ? "mdi-chevron-right" : "mdi-chevron-left"
                        }}</v-icon>
                    </v-btn>
                </div>
            </div>

            <v-divider class="mx-3" />

            <v-list density="compact" nav class="pa-2 mt-1">
                <v-list-item
                    v-for="item in navItems"
                    :key="item.tab"
                    :prepend-icon="item.icon"
                    :title="item.title"
                    :active="currentTab === item.tab"
                    :class="{ 'nav-active': currentTab === item.tab }"
                    rounded="lg"
                    class="mb-1 nav-item"
                    @click="navigateTo(item.tab)"
                >
                    <template v-if="item.badge" #append>
                        <v-badge
                            v-if="!rail || isMobile"
                            :content="item.badge"
                            color="error"
                            inline
                        />
                    </template>
                </v-list-item>
            </v-list>

            <template #append>
                <div class="pa-3">
                    <v-divider class="mb-3" />
                    <v-btn
                        block
                        variant="text"
                        color="default"
                        prepend-icon="mdi-home"
                        :text="!rail || isMobile ? t('nav.home') : ''"
                        size="small"
                        class="mb-2"
                        to="/"
                    />
                    <v-btn
                        block
                        variant="text"
                        color="default"
                        :prepend-icon="
                            darkMode ? 'mdi-weather-sunny' : 'mdi-weather-night'
                        "
                        :text="
                            !rail || isMobile
                                ? darkMode
                                    ? t('admin.lightMode')
                                    : t('admin.darkMode')
                                : ''
                        "
                        size="small"
                        class="mb-2"
                        @click="toggleAdminTheme"
                    />
                    <v-btn
                        block
                        variant="tonal"
                        color="error"
                        prepend-icon="mdi-logout"
                        :text="!rail || isMobile ? t('admin.logout') : ''"
                        size="small"
                        @click="handleLogout"
                    />
                </div>
            </template>
        </v-navigation-drawer>

        <v-main class="admin-main">
            <div class="admin-content-wrapper">
                <div class="admin-page-header mb-6">
                    <div>
                        <h1
                            class="text-h5 font-weight-bold d-flex align-center gap-2"
                        >
                            <v-icon
                                :icon="currentNavItem?.icon"
                                color="primary"
                            />
                            {{ currentNavItem?.title || t("admin.dashboard") }}
                        </h1>
                        <p class="text-body-2 text-medium-emphasis mt-1">
                            {{ currentNavItem?.description || "" }}
                        </p>
                    </div>
                </div>

                <slot />
            </div>
        </v-main>
    </v-app>
</template>

<script setup lang="ts">
const { t } = useI18n();
const { user, logout } = useAuth();
const route = useRoute();
const router = useRouter();

const drawer = ref(true);
const rail = ref(false);
const darkMode = ref(true);
const isMobile = ref(false);

const adminTheme = computed(() =>
    darkMode.value ? "adminDark" : "adminLight",
);

const userInitial = computed(() => {
    const name = user.value?.name || "A";
    return name.charAt(0).toUpperCase();
});

const currentTab = computed(() => route.query.tab?.toString() || "overview");

const navItems = computed(() => [
    {
        tab: "overview",
        icon: "mdi-view-dashboard",
        title: t("admin.tabs.overview"),
        description: t("admin.descriptions.overview"),
    },
    {
        tab: "themes",
        icon: "mdi-palette",
        title: t("admin.tabs.themes"),
        description: t("admin.descriptions.themes"),
    },
    {
        tab: "projects",
        icon: "mdi-source-repository",
        title: t("admin.tabs.projects"),
        description: t("admin.descriptions.projects"),
    },
    {
        tab: "articles",
        icon: "mdi-newspaper",
        title: t("admin.tabs.articles"),
        description: t("admin.descriptions.articles"),
    },
    {
        tab: "about",
        icon: "mdi-account-details",
        title: t("admin.tabs.about"),
        description: t("admin.descriptions.about"),
    },
    {
        tab: "music",
        icon: "mdi-music",
        title: t("admin.tabs.music"),
        description: t("admin.descriptions.music"),
    },
    {
        tab: "visitors",
        icon: "mdi-chart-bar",
        title: t("admin.tabs.visitors"),
        description: t("admin.descriptions.visitors"),
    },
    {
        tab: "comments",
        icon: "mdi-comment-multiple",
        title: t("admin.tabs.comments"),
        description: t("admin.descriptions.comments"),
    },
    {
        tab: "testimonials",
        icon: "mdi-format-quote-close",
        title: t("admin.tabs.testimonials"),
        description: t("admin.descriptions.testimonials"),
    },
    {
        tab: "settings",
        icon: "mdi-cog",
        title: t("admin.tabs.settings"),
        description: t("admin.descriptions.settings"),
    },
]);

const currentNavItem = computed(() =>
    navItems.value.find((n) => n.tab === currentTab.value),
);

function navigateTo(tab: string) {
    router.push({ path: "/admin", query: { tab } });
    if (isMobile.value) drawer.value = false;
}

function toggleAdminTheme() {
    darkMode.value = !darkMode.value;
}

function checkMobile() {
    isMobile.value = window.innerWidth < 960;
    if (isMobile.value) {
        rail.value = false;
        drawer.value = false;
    }
}

async function handleLogout() {
    await logout();
}

onMounted(() => {
    checkMobile();
    window.addEventListener("resize", checkMobile);
});

onUnmounted(() => {
    window.removeEventListener("resize", checkMobile);
});
</script>

<style scoped>
.admin-drawer {
    border-right: 1px solid rgba(var(--v-border-color), 0.08) !important;
}

.drawer-header {
    min-height: 72px;
    display: flex;
    align-items: center;
}

.admin-avatar {
    background: linear-gradient(
        135deg,
        rgb(var(--v-theme-primary)),
        rgb(var(--v-theme-secondary, var(--v-theme-primary)))
    );
}

.nav-item {
    transition: all 0.2s ease;
}

.nav-active {
    background: rgb(var(--v-theme-primary), 0.12) !important;
}

.nav-active :deep(.v-list-item-title) {
    color: rgb(var(--v-theme-primary)) !important;
    font-weight: 700 !important;
}

.nav-active :deep(.v-icon) {
    color: rgb(var(--v-theme-primary)) !important;
}

.admin-main {
    background: rgb(var(--v-theme-background));
}

.admin-content-wrapper {
    max-width: 1400px;
    margin: 0 auto;
    padding: 24px;
}

.admin-page-header {
    border-bottom: 1px solid rgb(var(--v-theme-on-surface), 0.06);
    padding-bottom: 16px;
}

.admin-appbar {
    border-bottom: 1px solid rgb(var(--v-theme-on-surface), 0.06) !important;
}
</style>
