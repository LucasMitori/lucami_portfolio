// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    compatibilityDate: "2025-07-15",
    devtools: { enabled: true },

    modules: [
        "vuetify-nuxt-module",
        "@pinia/nuxt",
        "pinia-plugin-persistedstate/nuxt",
        "@nuxtjs/i18n",
        "@nuxt/eslint",
        "@vueuse/motion/nuxt",
    ],

    components: [
        { path: '~/components/layout', pathPrefix: false },
        { path: '~/components/ui', pathPrefix: false },
        { path: '~/components/home', pathPrefix: false },
        { path: '~/components/about', pathPrefix: false },
        { path: '~/components/projects', pathPrefix: false },
        { path: '~/components/articles', pathPrefix: false },
        { path: '~/components/admin', pathPrefix: false },
        { path: '~/components/showcase', pathPrefix: false },
    ],

    css: ["~/assets/scss/main.scss"],

    vuetify: {
        moduleOptions: {
            styles: {
                configFile: "assets/scss/vuetify-settings.scss",
            },
            includeTransformAssetsUrls: true,
            ssrClientHints: {
                reloadOnFirstRequest: false,
                viewportSize: true,
            },
        },
        vuetifyOptions: {
            icons: {
                defaultSet: "mdi",
            },
            theme: {
                defaultTheme: "default",
                themes: {
                    default: {
                        dark: false,
                        colors: {
                            primary: "#6C63FF",
                            secondary: "#2EC4B6",
                            accent: "#FF6B6B",
                            background: "#FAFAFA",
                            surface: "#FFFFFF",
                            "on-primary": "#FFFFFF",
                            "on-secondary": "#FFFFFF",
                            "on-background": "#1A1A2E",
                            "on-surface": "#1A1A2E",
                            error: "#FF5252",
                            info: "#2196F3",
                            success: "#4CAF50",
                            warning: "#FFC107",
                        },
                    },
                    nerd: {
                        dark: true,
                        colors: {
                            primary: "#00F0FF",
                            secondary: "#FF00FF",
                            accent: "#FFE600",
                            background: "#0D0221",
                            surface: "#150734",
                            "on-primary": "#0D0221",
                            "on-secondary": "#0D0221",
                            "on-background": "#E0E0FF",
                            "on-surface": "#E0E0FF",
                            error: "#FF1744",
                            info: "#00E5FF",
                            success: "#00E676",
                            warning: "#FFEA00",
                        },
                    },
                    retro: {
                        dark: false,
                        colors: {
                            primary: "#8B4513",
                            secondary: "#D2691E",
                            accent: "#CD853F",
                            background: "#F5E6D3",
                            surface: "#FFF8F0",
                            "on-primary": "#FFF8F0",
                            "on-secondary": "#FFF8F0",
                            "on-background": "#3E2723",
                            "on-surface": "#3E2723",
                            error: "#B71C1C",
                            info: "#5D4037",
                            success: "#558B2F",
                            warning: "#F57F17",
                        },
                    },
                    coding: {
                        dark: true,
                        colors: {
                            primary: "#00FF41",
                            secondary: "#008F11",
                            accent: "#00FF41",
                            background: "#0A0A0A",
                            surface: "#111111",
                            "on-primary": "#0A0A0A",
                            "on-secondary": "#00FF41",
                            "on-background": "#00FF41",
                            "on-surface": "#00FF41",
                            error: "#FF0000",
                            info: "#00FF41",
                            success: "#00FF41",
                            warning: "#FFB000",
                        },
                    },
                    adminDark: {
                        dark: true,
                        colors: {
                            primary: "#7C6EF6",
                            secondary: "#38BDF8",
                            accent: "#F472B6",
                            background: "#0F172A",
                            surface: "#1E293B",
                            "on-primary": "#FFFFFF",
                            "on-secondary": "#0F172A",
                            "on-background": "#E2E8F0",
                            "on-surface": "#E2E8F0",
                            error: "#EF4444",
                            info: "#38BDF8",
                            success: "#22C55E",
                            warning: "#F59E0B",
                        },
                    },
                    adminLight: {
                        dark: false,
                        colors: {
                            primary: "#6D5DD3",
                            secondary: "#0EA5E9",
                            accent: "#EC4899",
                            background: "#F8FAFC",
                            surface: "#FFFFFF",
                            "on-primary": "#FFFFFF",
                            "on-secondary": "#FFFFFF",
                            "on-background": "#1E293B",
                            "on-surface": "#334155",
                            error: "#EF4444",
                            info: "#0EA5E9",
                            success: "#22C55E",
                            warning: "#F59E0B",
                        },
                    },
                },
            },
            locale: {
                locale: "en",
                messages: {
                    en: {
                        input: { clear: "Clear", prependAction: "Prepend action", appendAction: "Append action" },
                        close: "Close",
                        open: "Open",
                        loading: "Loading...",
                        carousel: { prev: "Previous", next: "Next", ariaLabel: { delimiter: "Slide {0} of {1}" } },
                        dataIterator: { noResultsText: "No matching records found", loadingText: "Loading items..." },
                        pagination: { ariaLabel: { root: "Pagination", previous: "Previous page", next: "Next page", currentPage: "Page {0}", page: "Go to page {0}" } },
                        rating: { ariaLabel: { item: "Rating {0} of {1}" } },
                    },
                    "pt-BR": {
                        input: { clear: "Limpar", prependAction: "Ação anterior", appendAction: "Ação posterior" },
                        close: "Fechar",
                        open: "Abrir",
                        loading: "Carregando...",
                        carousel: { prev: "Anterior", next: "Próximo", ariaLabel: { delimiter: "Slide {0} de {1}" } },
                        dataIterator: { noResultsText: "Nenhum registro encontrado", loadingText: "Carregando itens..." },
                        pagination: { ariaLabel: { root: "Paginação", previous: "Página anterior", next: "Próxima página", currentPage: "Página {0}", page: "Ir para página {0}" } },
                        rating: { ariaLabel: { item: "Avaliação {0} de {1}" } },
                    },
                },
            },
            defaults: {
                VBtn: {
                    variant: "flat",
                },
                VCard: {
                    elevation: 2,
                },
                VTextField: {
                    variant: "outlined",
                    density: "comfortable",
                },
            },
        },
    },

    i18n: {
        locales: [
            { code: "pt-BR", name: "Portugues", file: "pt-BR.json" },
            { code: "en", name: "English", file: "en.json" },
        ],
        defaultLocale: "pt-BR",
        strategy: "prefix_except_default",
        langDir: "locales",
        detectBrowserLanguage: {
            useCookie: true,
            cookieKey: "i18n_redirected",
            redirectOn: "root",
        },
    },

    pinia: {
        storesDirs: ["./stores"],
    },

    runtimeConfig: {
        mongodbUri: process.env.MONGODB_URI || "",
        jwtSecret: process.env.JWT_SECRET || "dev-secret-change-in-production",
        githubToken: process.env.GITHUB_TOKEN || "",
        cloudinaryCloudName: process.env.CLOUDINARY_CLOUD_NAME || "",
        cloudinaryApiKey: process.env.CLOUDINARY_API_KEY || "",
        cloudinaryApiSecret: process.env.CLOUDINARY_API_SECRET || "",
        public: {
            githubUsername:
                process.env.NUXT_PUBLIC_GITHUB_USERNAME || "LucasMitori",
            appName: "Lucas Mitori | Portfolio",
            cloudinaryCloudName: process.env.CLOUDINARY_CLOUD_NAME || "",
        },
    },

    vite: {
        optimizeDeps: {
            include: [
                'prismjs',
                'prismjs/components/prism-javascript',
                'prismjs/components/prism-typescript',
                'prismjs/components/prism-python',
                'prismjs/components/prism-bash',
                'prismjs/components/prism-json',
                'prismjs/components/prism-css',
                'prismjs/components/prism-markup',
                'howler',
                'animejs',
                'shepherd.js',
            ],
        },
    },

    nitro: {
        plugins: ["~~/server/plugins/mongodb.ts"],
    },

    app: {
        head: {
            title: "Lucas Mitori | Fullstack Developer",
            charset: "utf-8",
            viewport: "width=device-width, initial-scale=1",
            meta: [
                {
                    name: "description",
                    content:
                        "Portfolio of Lucas Mitori - Fullstack Developer based in Sao Paulo, BR",
                },
                { name: "theme-color", content: "#6C63FF" },
            ],
            link: [
                { rel: "preconnect", href: "https://fonts.googleapis.com" },
                {
                    rel: "preconnect",
                    href: "https://fonts.gstatic.com",
                    crossorigin: "",
                },
                {
                    rel: "stylesheet",
                    href: "https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Orbitron:wght@400;500;600;700&family=Rajdhani:wght@300;400;500;600;700&family=Special+Elite&family=Fira+Code:wght@300;400;500;600;700&display=swap",
                },
            ],
        },
        pageTransition: { name: "page", mode: "out-in" },
    },
});
