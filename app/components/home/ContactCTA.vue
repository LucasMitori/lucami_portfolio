<template>
    <section class="contact-section">
        <div class="contact-bg-effects">
            <div class="contact-glow" />
            <div class="contact-grid" />
        </div>
        <v-container>
            <v-row align="center">
                <v-col cols="12" md="7">
                    <AnimatedSection animation="fadeInUp">
                        <div class="contact-content">
                            <span class="contact-tag">
                                <v-icon size="14" class="mr-1"
                                    >mdi-code-tags</v-icon
                                >
                                {{ t("nav.contact") }}
                            </span>
                            <h2 class="contact-title">
                                {{ t("home.contactTitle") }}
                            </h2>
                            <p class="contact-subtitle">
                                {{ t("home.contactSubtitle") }}
                            </p>

                            <div
                                class="contact-cards d-flex gap-4 flex-wrap mt-8"
                            >
                                <a
                                    href="mailto:devmitori@gmail.com"
                                    class="contact-card"
                                >
                                    <div class="card-icon-wrap">
                                        <v-icon size="28" color="primary"
                                            >mdi-email-outline</v-icon
                                        >
                                    </div>
                                    <div>
                                        <span class="card-label">Email</span>
                                        <span class="card-value"
                                            >devmitori@gmail.com</span
                                        >
                                    </div>
                                </a>
                                <a
                                    href="https://github.com/LucasMitori"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    class="contact-card"
                                >
                                    <div class="card-icon-wrap">
                                        <v-icon size="28" color="primary"
                                            >mdi-github</v-icon
                                        >
                                    </div>
                                    <div>
                                        <span class="card-label">GitHub</span>
                                        <span class="card-value"
                                            >LucasMitori</span
                                        >
                                    </div>
                                </a>
                                <a
                                    href="https://www.linkedin.com/in/lucas-mitori/"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    class="contact-card"
                                >
                                    <div class="card-icon-wrap">
                                        <v-icon size="28" color="primary"
                                            >mdi-linkedin</v-icon
                                        >
                                    </div>
                                    <div>
                                        <span class="card-label">LinkedIn</span>
                                        <span class="card-value"
                                            >Lucas Mitori</span
                                        >
                                    </div>
                                </a>
                            </div>
                        </div>
                    </AnimatedSection>
                </v-col>

                <v-col cols="12" md="5">
                    <AnimatedSection animation="slideInRight" :delay="200">
                        <div
                            class="flip-container"
                            :class="{ flipped: isFlipped }"
                        >
                            <div class="flip-face flip-front">
                                <div
                                    class="visual-frame"
                                    @click="isFlipped = true"
                                >
                                    <div class="frame-header">
                                        <span class="frame-dot" /><span
                                            class="frame-dot"
                                        /><span class="frame-dot" />
                                        <span class="frame-title"
                                            >coding.gif</span
                                        >
                                        <span class="flip-hint">
                                            <v-icon size="12"
                                                >mdi-rotate-3d-variant</v-icon
                                            >
                                            click to flip
                                        </span>
                                    </div>
                                    <div class="frame-content">
                                        <img
                                            v-if="showcaseExists"
                                            src="/media/coding-showcase.gif"
                                            alt="Coding showcase"
                                            class="showcase-media"
                                            @error="showcaseExists = false"
                                        />
                                        <div v-else class="code-rain">
                                            <div
                                                v-for="n in 15"
                                                :key="n"
                                                class="rain-column"
                                                :style="{
                                                    animationDelay: `${n * 0.3}s`,
                                                    left: `${(n - 1) * 6.66}%`,
                                                }"
                                            >
                                                <span
                                                    v-for="c in 8"
                                                    :key="c"
                                                    class="rain-char"
                                                    >{{ getRandomChar() }}</span
                                                >
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div class="flip-face flip-back">
                                <div class="chat-frame">
                                    <div class="chat-header">
                                        <div class="chat-avatar">
                                            <v-icon size="20" color="primary"
                                                >mdi-robot-happy</v-icon
                                            >
                                        </div>
                                        <div class="chat-header-text">
                                            <span class="chat-bot-name"
                                                >MitoriBot</span
                                            >
                                            <span class="chat-status"
                                                ><span class="status-dot-sm" />
                                                Online</span
                                            >
                                        </div>
                                        <v-btn
                                            icon
                                            variant="text"
                                            size="x-small"
                                            @click.stop="isFlipped = false"
                                        >
                                            <v-icon size="16">mdi-close</v-icon>
                                        </v-btn>
                                    </div>

                                    <div ref="chatMessages" class="chat-body">
                                        <div
                                            v-for="(msg, i) in visibleMessages"
                                            :key="i"
                                            class="chat-msg"
                                            :class="msg.from"
                                        >
                                            <div class="msg-bubble">
                                                {{ msg.text }}
                                            </div>
                                        </div>
                                        <div
                                            v-if="isTyping"
                                            class="chat-msg bot"
                                        >
                                            <div
                                                class="msg-bubble typing-indicator"
                                            >
                                                <span /><span /><span />
                                            </div>
                                        </div>
                                    </div>

                                    <div class="chat-options">
                                        <button
                                            v-for="option in currentOptions"
                                            :key="option.text"
                                            class="chat-option-btn"
                                            @click="selectOption(option)"
                                        >
                                            {{ option.text }}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </AnimatedSection>
                </v-col>
            </v-row>
        </v-container>
    </section>
</template>

<script setup lang="ts">
const { t } = useI18n();
const localePath = useLocalePath();
const router = useRouter();
const showcaseExists = ref(true);
const isFlipped = ref(false);
const chatMessages = ref<HTMLElement | null>(null);
const isTyping = ref(false);

function getRandomChar() {
    const chars = "01{}[]<>/\\|;:=+-_&%$#@!~`";
    return chars[Math.floor(Math.random() * chars.length)];
}

interface ChatMessage {
    text: string;
    from: "bot" | "user";
}

interface ChatOption {
    text: string;
    reply: string;
    next?: ChatOption[];
}

const messages = ref<ChatMessage[]>([]);
const visibleMessages = ref<ChatMessage[]>([]);
const currentOptions = ref<ChatOption[]>([]);

const projectsLink = localePath("/projects");
const aboutLink = localePath("/about");
const componentsLink = localePath("/components");

const initialOptions: ChatOption[] = [
    {
        text: t("home.chatWhatDoYouDo") || "What do you do?",
        reply: "I'm Lucas Mitori, a Fullstack Developer specializing in Vue.js, Nuxt, Node.js and TypeScript. I build modern, performant web apps from frontend to backend with a focus on clean architecture and great UX!",
        next: [
            {
                text: "Tell me about your tech stack",
                reply: `My core stack:\n\n Frontend: Vue 3, Nuxt 4, React, Angular, TypeScript\n Backend: Node.js, NestJS, Python, Django\n Database: MongoDB, PostgreSQL, MySQL\n DevOps: Docker, AWS, Vercel\n\nCheck my full skills at the About page!`,
                next: [
                    {
                        text: "Show me your projects",
                        reply: `I have multiple repositories on GitHub! From fullstack apps to open-source tools. Visit my Projects page to see them all with live demos and source code.`,
                        next: [
                            {
                                text: "Go to Projects",
                                reply: `Here you go! Redirecting you to the Projects page...`,
                            },
                        ],
                    },
                    {
                        text: "What about your experience?",
                        reply: "I started as a Frontend Developer at NossBank in 2022, then moved to SaltCode as a Fullstack Developer in 2023 where I work with Vue, Nuxt, NestJS, and cloud services. I also hold a Software Engineering degree from UNINTER.",
                        next: [
                            {
                                text: "Go to About page",
                                reply: "Taking you to my About page where you can see my full timeline, skills radar, and more!",
                            },
                        ],
                    },
                ],
            },
            {
                text: "Are you available for hire?",
                reply: "Yes! I'm currently open to new opportunities - both freelance projects and full-time positions. I specialize in building scalable web applications. Feel free to reach out at devmitori@gmail.commitori.dev!",
                next: [
                    {
                        text: "What kind of projects do you take?",
                        reply: "I work on:\n SaaS platforms & dashboards\n E-commerce solutions\n API development & integrations\n UI/UX redesigns with modern frameworks\n Custom admin panels\n\nBasically anything web - from MVP to production!",
                    },
                ],
            },
        ],
    },
    {
        text: t("home.chatShowProjects") || "Show me your projects",
        reply: "I have various projects on GitHub covering different technologies! Here are some highlights:\n\n Full-stack apps with Vue/Nuxt\n Backend APIs with NestJS\n React & Angular projects\n Python/Django services\n\nWant to explore a specific category?",
        next: [
            {
                text: "Frontend projects",
                reply: "My frontend work includes this portfolio (Nuxt 4 + Vuetify), React dashboards, and Angular enterprise apps. Each project showcases responsive design, animations, and modern patterns.",
            },
            {
                text: "Backend projects",
                reply: "On the backend, I've built REST APIs with NestJS, microservices with Docker, and data pipelines with Python. Check the Projects page to see repos with full documentation!",
            },
            {
                text: "Go to Projects page",
                reply: "Great choice! Let me take you to the Projects page where you can browse, filter, and read README docs for each repo.",
            },
        ],
    },
    {
        text: t("home.chatContact") || "How can I contact you?",
        reply: "Multiple ways to reach me!\n\n Email: devmitori@gmail.commitori.dev\n GitHub: github.com/LucasMitori\n LinkedIn: Lucas Mitori\n\nI usually respond within 24 hours. For urgent matters, email is best!",
        next: [
            {
                text: "Send an email",
                reply: "Opening your email client to compose a message to devmitori@gmail.commitori.dev...",
            },
            {
                text: "View GitHub profile",
                reply: "Great! My GitHub has all my open-source work. You can see contribution graphs, pinned repos, and more at github.com/LucasMitori",
            },
        ],
    },
    {
        text: t("home.chatExplore") || "Explore this portfolio",
        reply: "This portfolio is packed with cool features!\n\n 4 unique themes (Default, Nerd, Retro, Coding)\n Background music per theme\n Interactive component showcase\n Animated transitions everywhere\n Smart chatbot (that's me!)\n\nWhat would you like to explore?",
        next: [
            {
                text: "Switch themes",
                reply: "Use the floating button (bottom-right) to open the radial menu, then click the palette icon to see all 4 themes. Each has unique colors, sounds, and visual effects! The Nerd theme has a cyberpunk vibe, and Coding theme has matrix-style rain!",
            },
            {
                text: "See component showcase",
                reply: "The Components page has live demos of buttons, cards, inputs, animations, code blocks, and charts - all styled per theme. It's a great way to see the design system in action!",
            },
            {
                text: "About the tech",
                reply: "This portfolio runs on:\n Nuxt 4 + Vue 3\n Vuetify 4 (Material Design)\n MongoDB Atlas\n Howler.js for audio\n Anime.js for animations\n i18n (PT-BR & English)\n\nEvery component is hand-crafted!",
            },
        ],
    },
];

function addBotMessage(text: string) {
    isTyping.value = true;
    scrollChat();
    setTimeout(
        () => {
            isTyping.value = false;
            const msg = { text, from: "bot" as const };
            messages.value.push(msg);
            visibleMessages.value.push(msg);
            scrollChat();
        },
        800 + Math.random() * 600,
    );
}

function selectOption(option: ChatOption) {
    // Add user message
    const userMsg = { text: option.text, from: "user" as const };
    messages.value.push(userMsg);
    visibleMessages.value.push(userMsg);
    scrollChat();

    // Handle navigation actions
    const lowerText = option.text.toLowerCase();
    if (
        lowerText.includes("go to projects") ||
        lowerText.includes("show me your projects")
    ) {
        addBotMessage(option.reply);
        setTimeout(() => router.push(localePath("/projects")), 2000);
    } else if (lowerText.includes("go to about")) {
        addBotMessage(option.reply);
        setTimeout(() => router.push(localePath("/about")), 2000);
    } else if (
        lowerText.includes("see component") ||
        lowerText.includes("go to component")
    ) {
        addBotMessage(option.reply);
        setTimeout(() => router.push(localePath("/components")), 2000);
    } else if (lowerText.includes("send an email")) {
        addBotMessage(option.reply);
        setTimeout(
            () => window.open("mailto:devmitori@gmail.commitori.dev", "_blank"),
            1500,
        );
    } else if (lowerText.includes("view github")) {
        addBotMessage(option.reply);
        setTimeout(
            () => window.open("https://github.com/LucasMitori", "_blank"),
            1500,
        );
    } else {
        addBotMessage(option.reply);
    }

    // Update options
    setTimeout(() => {
        if (option.next && option.next.length) {
            currentOptions.value = option.next;
        } else {
            currentOptions.value = [
                {
                    text: "Start over",
                    reply: "Hey there! I'm MitoriBot. What would you like to know about Lucas?",
                    next: initialOptions,
                },
            ];
        }
    }, 1500);
}

function scrollChat() {
    nextTick(() => {
        if (chatMessages.value) {
            chatMessages.value.scrollTop = chatMessages.value.scrollHeight;
        }
    });
}

// Init chat when flipped
watch(isFlipped, (flipped) => {
    if (flipped && visibleMessages.value.length === 0) {
        addBotMessage(
            "Hey! I'm MitoriBot. What would you like to know about Lucas?",
        );
        setTimeout(() => {
            currentOptions.value = initialOptions;
        }, 1500);
    }
});
</script>

<style scoped>
.contact-section {
    padding: 100px 0;
    position: relative;
    overflow: hidden;
}

.contact-bg-effects {
    position: absolute;
    inset: 0;
    pointer-events: none;
}

.contact-glow {
    position: absolute;
    width: 700px;
    height: 700px;
    border-radius: 50%;
    background: radial-gradient(
        circle,
        rgb(var(--v-theme-primary), 0.08),
        transparent 70%
    );
    top: 50%;
    left: 30%;
    transform: translate(-50%, -50%);
}

.contact-grid {
    position: absolute;
    inset: 0;
    background-image:
        linear-gradient(
            rgb(var(--v-theme-on-surface), 0.02) 1px,
            transparent 1px
        ),
        linear-gradient(
            90deg,
            rgb(var(--v-theme-on-surface), 0.02) 1px,
            transparent 1px
        );
    background-size: 60px 60px;
}

.contact-content {
    position: relative;
    z-index: 2;
}

.contact-tag {
    display: inline-flex;
    align-items: center;
    font-size: 0.75rem;
    font-weight: 700;
    letter-spacing: 3px;
    text-transform: uppercase;
    color: rgb(var(--v-theme-primary));
    padding: 6px 16px;
    border-radius: 999px;
    border: 1px solid rgb(var(--v-theme-primary), 0.2);
    background: rgb(var(--v-theme-primary), 0.05);
    margin-bottom: 16px;
}

.contact-title {
    font-size: clamp(2rem, 5vw, 3rem);
    font-weight: 900;
    font-family: var(--font-heading);
    margin-bottom: 12px;
    line-height: 1.2;
}

.contact-subtitle {
    font-size: 1.1rem;
    color: rgb(var(--v-theme-on-surface), 0.6);
    max-width: 500px;
}

.contact-card {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 16px 20px;
    border-radius: 16px;
    border: 1px solid rgb(var(--v-theme-on-surface), 0.08);
    background: rgb(var(--v-theme-surface), 0.6);
    backdrop-filter: blur(12px);
    text-decoration: none;
    color: inherit;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.contact-card:hover {
    transform: translateY(-4px);
    border-color: rgb(var(--v-theme-primary), 0.3);
    box-shadow: 0 12px 30px rgb(var(--v-theme-primary), 0.12);
}

.card-icon-wrap {
    width: 48px;
    height: 48px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgb(var(--v-theme-primary), 0.1);
    flex-shrink: 0;
}

.card-label {
    display: block;
    font-size: 0.7rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 1px;
    color: rgb(var(--v-theme-on-surface), 0.5);
    margin-bottom: 2px;
}

.card-value {
    display: block;
    font-size: 0.9rem;
    color: rgb(var(--v-theme-on-surface), 0.8);
}

/* === Flip Card === */
.flip-container {
    position: relative;
    z-index: 2;
    perspective: 1200px;
    min-height: 480px;
}

.flip-face {
    position: absolute;
    inset: 0;
    backface-visibility: hidden;
    transition: transform 0.7s cubic-bezier(0.4, 0, 0.2, 1);
}

.flip-front {
    transform: rotateY(0deg);
}
.flip-back {
    transform: rotateY(180deg);
}

.flipped .flip-front {
    transform: rotateY(-180deg);
}
.flipped .flip-back {
    transform: rotateY(0deg);
}

/* Front face: visual frame */
.visual-frame {
    border-radius: 16px;
    border: 1px solid rgb(var(--v-theme-on-surface), 0.1);
    overflow: hidden;
    background: rgb(var(--v-theme-surface));
    box-shadow: 0 20px 60px rgb(0 0 0 / 0.15);
    cursor: pointer;
    transition: box-shadow 0.3s;
    height: 100%;
}

.visual-frame:hover {
    box-shadow: 0 20px 60px rgb(var(--v-theme-primary), 0.15);
}

.frame-header {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 12px 16px;
    background: rgb(var(--v-theme-on-surface), 0.03);
    border-bottom: 1px solid rgb(var(--v-theme-on-surface), 0.06);
}

.frame-dot {
    width: 10px;
    height: 10px;
    border-radius: 50%;
}
.frame-dot:nth-child(1) {
    background: #ff5f57;
}
.frame-dot:nth-child(2) {
    background: #febc2e;
}
.frame-dot:nth-child(3) {
    background: #28c840;
}

.frame-title {
    margin-left: 8px;
    font-size: 0.75rem;
    font-family: var(--font-mono);
    color: rgb(var(--v-theme-on-surface), 0.4);
    flex: 1;
}

.flip-hint {
    font-size: 0.6rem;
    color: rgb(var(--v-theme-primary), 0.5);
    display: flex;
    align-items: center;
    gap: 4px;
    animation: hint-pulse 2s ease-in-out infinite;
}

@keyframes hint-pulse {
    0%,
    100% {
        opacity: 0.5;
    }
    50% {
        opacity: 1;
    }
}

.frame-content {
    aspect-ratio: 4 / 3;
    overflow: hidden;
    position: relative;
    background: rgb(var(--v-theme-on-surface), 0.02);
}

.showcase-media {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
}

.code-rain {
    position: absolute;
    inset: 0;
    overflow: hidden;
    background: linear-gradient(
        180deg,
        rgb(var(--v-theme-surface)),
        rgb(var(--v-theme-primary), 0.03)
    );
}

.rain-column {
    position: absolute;
    top: -100%;
    display: flex;
    flex-direction: column;
    gap: 8px;
    animation: rain-fall 6s linear infinite;
}

@keyframes rain-fall {
    0% {
        transform: translateY(0);
    }
    100% {
        transform: translateY(250%);
    }
}

.rain-char {
    display: block;
    font-family: var(--font-mono);
    font-size: 0.85rem;
    color: rgb(var(--v-theme-primary), 0.3);
    text-align: center;
    line-height: 1.6;
}

.rain-column:nth-child(odd) .rain-char {
    color: rgb(var(--v-theme-primary), 0.15);
}

/* === Chat Bot Back Face === */
.chat-frame {
    border-radius: 16px;
    border: 1px solid rgb(var(--v-theme-on-surface), 0.1);
    overflow: hidden;
    background: rgb(var(--v-theme-surface));
    box-shadow: 0 20px 60px rgb(0 0 0 / 0.15);
    height: 100%;
    display: flex;
    flex-direction: column;
}

.chat-header {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 12px 16px;
    background: rgb(var(--v-theme-primary), 0.06);
    border-bottom: 1px solid rgb(var(--v-theme-on-surface), 0.06);
}

.chat-avatar {
    width: 36px;
    height: 36px;
    border-radius: 50%;
    background: rgb(var(--v-theme-primary), 0.12);
    display: flex;
    align-items: center;
    justify-content: center;
}

.chat-header-text {
    flex: 1;
}

.chat-bot-name {
    display: block;
    font-size: 0.85rem;
    font-weight: 700;
    font-family: var(--font-heading);
}

.chat-status {
    display: flex;
    align-items: center;
    gap: 4px;
    font-size: 0.6rem;
    color: #10b981;
}

.status-dot-sm {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: #10b981;
}

.chat-body {
    flex: 1;
    overflow-y: auto;
    padding: 16px;
    display: flex;
    flex-direction: column;
    gap: 10px;
    min-height: 200px;
    max-height: 280px;
}

.chat-msg {
    display: flex;
    max-width: 85%;
    animation: msg-in 0.3s ease;
}

@keyframes msg-in {
    from {
        opacity: 0;
        transform: translateY(8px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.chat-msg.bot {
    align-self: flex-start;
}
.chat-msg.user {
    align-self: flex-end;
}

.msg-bubble {
    padding: 10px 14px;
    border-radius: 14px;
    font-size: 0.8rem;
    line-height: 1.5;
}

.bot .msg-bubble {
    background: rgb(var(--v-theme-on-surface), 0.06);
    border-bottom-left-radius: 4px;
    color: rgb(var(--v-theme-on-surface), 0.8);
}

.user .msg-bubble {
    background: rgb(var(--v-theme-primary));
    color: white;
    border-bottom-right-radius: 4px;
}

/* Typing indicator */
.typing-indicator {
    display: flex;
    gap: 4px;
    padding: 12px 18px !important;
}

.typing-indicator span {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: rgb(var(--v-theme-on-surface), 0.3);
    animation: typing-bounce 1.4s ease-in-out infinite;
}

.typing-indicator span:nth-child(2) {
    animation-delay: 0.2s;
}
.typing-indicator span:nth-child(3) {
    animation-delay: 0.4s;
}

@keyframes typing-bounce {
    0%,
    60%,
    100% {
        transform: translateY(0);
    }
    30% {
        transform: translateY(-6px);
    }
}

/* Chat options */
.chat-options {
    padding: 12px 16px;
    border-top: 1px solid rgb(var(--v-theme-on-surface), 0.06);
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
}

.chat-option-btn {
    padding: 6px 14px;
    border-radius: 100px;
    border: 1px solid rgb(var(--v-theme-primary), 0.3);
    background: rgb(var(--v-theme-primary), 0.05);
    color: rgb(var(--v-theme-primary));
    font-size: 0.72rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s ease;
}

.chat-option-btn:hover {
    background: rgb(var(--v-theme-primary), 0.15);
    border-color: rgb(var(--v-theme-primary));
    transform: translateY(-1px);
}
</style>
