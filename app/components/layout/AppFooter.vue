<template>
  <footer class="app-footer">
    <div class="footer-transition" />

    <canvas ref="footerCanvas" class="footer-canvas" />

    <div class="footer-content">
      <div class="tech-ribbon">
        <div class="ribbon-track">
          <span v-for="(item, i) in [...techStack, ...techStack, ...techStack]" :key="`t-${i}`" class="ribbon-item">
            <v-icon size="14">{{ item.icon }}</v-icon>
            {{ item.name }}
          </span>
        </div>
      </div>

      <v-container class="footer-main py-10">
        <div class="footer-cta text-center mb-10">
          <div class="cta-terminal">
            <div class="terminal-header">
              <span class="terminal-dot dot-red" />
              <span class="terminal-dot dot-yellow" />
              <span class="terminal-dot dot-green" />
              <span class="terminal-title">{{ t('footer.terminal') }}</span>
            </div>
            <div class="terminal-body">
              <div class="terminal-line">
                <span class="term-prompt">$</span>
                <span class="term-cmd">echo</span>
                <span class="term-string">"{{ t('footer.ctaTitle') }}"</span>
              </div>
              <div class="terminal-line terminal-output">
                {{ t('footer.ctaSub') }}
              </div>
              <div class="terminal-line">
                <span class="term-prompt">$</span>
                <span class="term-cmd">contact</span>
                <span class="term-flag">--hire</span>
                <span class="term-cursor" />
              </div>
            </div>
          </div>
          <div class="cta-actions mt-6">
            <v-btn
              variant="flat"
              color="primary"
              size="large"
              rounded="lg"
              href="mailto:contact@lucasmitori.dev"
              prepend-icon="mdi-email-fast-outline"
            >
              {{ t('footer.ctaButton') }}
            </v-btn>
            <v-btn
              variant="outlined"
              color="primary"
              size="large"
              rounded="lg"
              href="https://github.com/LucasMitori"
              target="_blank"
              prepend-icon="mdi-github"
            >
              GitHub
            </v-btn>
          </div>
        </div>

        <v-row>
          <v-col cols="12" md="5" class="mb-6">
            <div class="footer-brand">
              <div class="brand-logo">
                <span class="logo-bracket">{</span>
                <span class="logo-name">LM</span>
                <span class="logo-bracket">}</span>
              </div>
              <p class="brand-bio mt-3">{{ t('footer.description') }}</p>
              <div class="brand-location mt-3">
                <v-icon size="14" class="mr-1">mdi-map-marker</v-icon>
                {{ t('footer.location') }}
              </div>
              <div class="brand-status mt-3">
                <span class="status-pulse" />
                <span>{{ t('footer.available') }}</span>
              </div>
              <div class="brand-stack mt-4">
                <code class="stack-line"><span class="code-kw">const</span> <span class="code-var">stack</span> = [<span class="code-str">'Vue'</span>, <span class="code-str">'Nuxt'</span>, <span class="code-str">'Node'</span>, <span class="code-str">'TS'</span>]</code>
              </div>
            </div>
          </v-col>

          <v-col cols="6" md="3">
            <h4 class="col-heading">
              <span class="heading-decorator">//</span> {{ t('footer.navigate') }}
            </h4>
            <nav class="nav-list">
              <NuxtLink
                v-for="link in navLinks"
                :key="link.to"
                :to="localePath(link.to)"
                class="nav-item"
              >
                <span class="nav-arrow">&#8594;</span>
                {{ t(link.label) }}
              </NuxtLink>
            </nav>
          </v-col>

          <v-col cols="6" md="4">
            <h4 class="col-heading">
              <span class="heading-decorator">//</span> {{ t('footer.connect') }}
            </h4>
            <div class="social-grid">
              <a
                v-for="social in socials"
                :key="social.icon"
                :href="social.url"
                target="_blank"
                rel="noopener noreferrer"
                class="social-card"
                :style="{ '--social-color': social.color }"
              >
                <div class="social-icon-ring">
                  <v-icon size="18">{{ social.icon }}</v-icon>
                </div>
                <div class="social-text">
                  <span class="social-name">{{ social.label }}</span>
                  <span class="social-handle">{{ social.handle }}</span>
                </div>
              </a>
            </div>
          </v-col>
        </v-row>

        <div class="footer-signature text-center my-8">
          <TypewriterText :texts="footerTexts" :speed="60" class="text-primary" />
        </div>

        <div class="footer-bottom">
          <div class="bottom-line" />
          <div class="bottom-row">
            <span class="copyright">&copy; {{ currentYear }} Lucas Mitori</span>
            <span class="built-with">
              {{ t('footer.madeWith') }} <v-icon size="12" color="error" class="mx-1">mdi-heart</v-icon> {{ t('footer.using') }} Nuxt 4 + Vuetify
            </span>
            <span class="version">v1.0.0</span>
          </div>
        </div>
      </v-container>
    </div>
  </footer>
</template>

<script setup lang="ts">
const { t } = useI18n()
const localePath = useLocalePath()
const currentYear = new Date().getFullYear()
const footerCanvas = ref<HTMLCanvasElement | null>(null)

const footerTexts = computed(() => [
  '> console.log("Thanks for visiting!")',
  '> git commit -m "Built with passion"',
  '> npm run deploy --production',
])

const navLinks = [
  { to: '/', label: 'nav.home' },
  { to: '/about', label: 'nav.about' },
  { to: '/projects', label: 'nav.projects' },
  { to: '/articles', label: 'nav.articles' },
  { to: '/components', label: 'nav.components' },
]

const socials = [
  { icon: 'mdi-github', url: 'https://github.com/LucasMitori', label: 'GitHub', handle: '@LucasMitori', color: '#8b5cf6' },
  { icon: 'mdi-linkedin', url: 'https://linkedin.com/in/', label: 'LinkedIn', handle: 'Lucas Mitori', color: '#0077b5' },
  { icon: 'mdi-email', url: 'mailto:contact@lucasmitori.dev', label: 'Email', handle: 'contact@lucasmitori.dev', color: '#ef4444' },
  { icon: 'mdi-instagram', url: 'https://instagram.com/', label: 'Instagram', handle: '@lucasmitori', color: '#e1306c' },
]

const techStack = [
  { icon: 'mdi-vuejs', name: 'Vue.js' },
  { icon: 'mdi-nuxt', name: 'Nuxt 4' },
  { icon: 'mdi-nodejs', name: 'Node.js' },
  { icon: 'mdi-language-typescript', name: 'TypeScript' },
  { icon: 'mdi-database', name: 'MongoDB' },
  { icon: 'mdi-docker', name: 'Docker' },
  { icon: 'mdi-aws', name: 'AWS' },
  { icon: 'mdi-git', name: 'Git' },
  { icon: 'mdi-vuetify', name: 'Vuetify' },
  { icon: 'mdi-language-python', name: 'Python' },
  { icon: 'mdi-react', name: 'React' },
  { icon: 'mdi-graphql', name: 'GraphQL' },
]

let animId: number | null = null

onMounted(() => {
  const canvas = footerCanvas.value
  if (!canvas) return
  const ctx = canvas.getContext('2d')
  if (!ctx) return

  function resize() {
    if (!canvas || !canvas.parentElement) return
    canvas.width = canvas.parentElement.offsetWidth * 2
    canvas.height = canvas.parentElement.offsetHeight * 2
    ctx!.scale(2, 2)
  }
  resize()

  const w = () => (canvas?.width || 2000) / 2
  const h = () => (canvas?.height || 1000) / 2

  const particles: { x: number; y: number; vx: number; vy: number; r: number }[] = []
  for (let i = 0; i < 80; i++) {
    particles.push({
      x: Math.random() * w(),
      y: Math.random() * h(),
      vx: (Math.random() - 0.5) * 0.2,
      vy: (Math.random() - 0.5) * 0.2,
      r: Math.random() * 1.5 + 0.5,
    })
  }

  function draw() {
    if (!ctx || !canvas) return
    const cw = w()
    const ch = h()
    ctx.clearRect(0, 0, cw, ch)

    const style = getComputedStyle(document.documentElement)
    const primary = style.getPropertyValue('--v-theme-primary').trim() || '99,102,241'

    particles.forEach((p) => {
      p.x += p.vx
      p.y += p.vy
      if (p.x < 0) p.x = cw
      if (p.x > cw) p.x = 0
      if (p.y < 0) p.y = ch
      if (p.y > ch) p.y = 0

      ctx.beginPath()
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
      ctx.fillStyle = `rgba(${primary}, 0.25)`
      ctx.fill()
    })

    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x
        const dy = particles[i].y - particles[j].y
        const dist = Math.sqrt(dx * dx + dy * dy)
        if (dist < 100) {
          ctx.beginPath()
          ctx.moveTo(particles[i].x, particles[i].y)
          ctx.lineTo(particles[j].x, particles[j].y)
          ctx.strokeStyle = `rgba(${primary}, ${0.05 * (1 - dist / 100)})`
          ctx.lineWidth = 0.5
          ctx.stroke()
        }
      }
    }

    animId = requestAnimationFrame(draw)
  }
  draw()
})

onUnmounted(() => {
  if (animId) cancelAnimationFrame(animId)
})
</script>

<style scoped>
.app-footer {
  position: relative;
  overflow: hidden;
  background: rgb(var(--v-theme-background));
}

.footer-transition {
  height: 80px;
  background: linear-gradient(180deg, transparent 0%, rgb(var(--v-theme-background), 0.5) 50%, rgb(var(--v-theme-background)) 100%);
}

.footer-canvas {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 0;
}

.footer-content {
  position: relative;
  z-index: 1;
}

.tech-ribbon {
  overflow: hidden;
  mask-image: linear-gradient(90deg, transparent, black 8%, black 92%, transparent);
  padding: 14px 0;
  border-bottom: 1px solid rgb(var(--v-theme-on-surface), 0.04);
}

.ribbon-track {
  display: flex;
  width: max-content;
  animation: ribbon-scroll 45s linear infinite;
}

.ribbon-track:hover { animation-play-state: paused; }

@keyframes ribbon-scroll {
  0% { transform: translateX(0); }
  100% { transform: translateX(-33.33%); }
}

.ribbon-item {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 18px;
  margin: 0 6px;
  font-size: 0.7rem;
  font-weight: 600;
  letter-spacing: 0.5px;
  white-space: nowrap;
  color: rgb(var(--v-theme-on-surface), 0.4);
  border: 1px solid rgb(var(--v-theme-on-surface), 0.05);
  border-radius: 100px;
  transition: all 0.3s ease;
}

.ribbon-item:hover {
  color: rgb(var(--v-theme-primary));
  border-color: rgb(var(--v-theme-primary), 0.3);
  background: rgb(var(--v-theme-primary), 0.05);
}

.footer-cta { position: relative; }

.cta-terminal {
  max-width: 520px;
  margin: 0 auto;
  border-radius: var(--border-radius, 8px);
  overflow: hidden;
  border: 1px solid rgb(var(--v-theme-on-surface), 0.1);
  background: rgb(var(--v-theme-surface), 0.8);
  backdrop-filter: blur(10px);
}

.terminal-header {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 10px 14px;
  background: rgb(var(--v-theme-on-surface), 0.04);
  border-bottom: 1px solid rgb(var(--v-theme-on-surface), 0.06);
}

.terminal-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
}

.dot-red { background: #ff5f57; }
.dot-yellow { background: #ffbd2e; }
.dot-green { background: #28ca41; }

.terminal-title {
  font-family: var(--font-mono);
  font-size: 0.65rem;
  color: rgb(var(--v-theme-on-surface), 0.35);
  margin-left: 8px;
}

.terminal-body {
  padding: 16px;
  font-family: var(--font-mono);
  font-size: 0.82rem;
  line-height: 2;
}

.terminal-line {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}

.term-prompt {
  color: rgb(var(--v-theme-primary));
  font-weight: 700;
}

.term-cmd {
  color: rgb(var(--v-theme-on-surface), 0.8);
  font-weight: 600;
}

.term-string {
  color: #f59e0b;
}

.term-flag {
  color: #10b981;
}

.terminal-output {
  color: rgb(var(--v-theme-on-surface), 0.5);
  font-style: italic;
  padding-left: 16px;
}

.term-cursor {
  display: inline-block;
  width: 8px;
  height: 16px;
  background: rgb(var(--v-theme-primary));
  animation: cursor-blink 1s step-end infinite;
}

@keyframes cursor-blink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0; }
}

.cta-actions {
  display: flex;
  gap: 12px;
  justify-content: center;
  flex-wrap: wrap;
}

.footer-brand { max-width: 360px; }

.brand-logo {
  font-family: var(--font-mono);
  font-size: 1.8rem;
  font-weight: 900;
}

.logo-bracket {
  color: rgb(var(--v-theme-primary));
  font-weight: 400;
}

.logo-name { color: rgb(var(--v-theme-on-surface)); }

.brand-bio {
  font-size: 0.85rem;
  line-height: 1.7;
  color: rgb(var(--v-theme-on-surface), 0.45);
}

.brand-location {
  font-size: 0.75rem;
  color: rgb(var(--v-theme-on-surface), 0.4);
  display: flex;
  align-items: center;
}

.brand-status {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 4px 12px;
  border-radius: 100px;
  background: rgba(16, 185, 129, 0.06);
  border: 1px solid rgba(16, 185, 129, 0.15);
  font-size: 0.7rem;
  font-weight: 700;
  color: #10b981;
}

.status-pulse {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #10b981;
  animation: pulse-blink 2s ease-in-out infinite;
}

@keyframes pulse-blink {
  0%, 100% { opacity: 1; box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.4); }
  50% { opacity: 0.5; box-shadow: 0 0 0 6px rgba(16, 185, 129, 0); }
}

.brand-stack {
  font-family: var(--font-mono);
}

.stack-line {
  font-size: 0.7rem;
  color: rgb(var(--v-theme-on-surface), 0.3);
  background: rgb(var(--v-theme-on-surface), 0.03);
  padding: 6px 12px;
  border-radius: 6px;
  display: inline-block;
}

.code-kw { color: rgb(var(--v-theme-primary), 0.7); }
.code-var { color: rgb(var(--v-theme-on-surface), 0.6); }
.code-str { color: #f59e0b; }

.col-heading {
  font-size: 0.7rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 2px;
  color: rgb(var(--v-theme-on-surface), 0.5);
  margin-bottom: 18px;
  font-family: var(--font-mono);
  position: relative;
  padding-bottom: 10px;
}

.heading-decorator {
  color: rgb(var(--v-theme-primary));
  margin-right: 6px;
}

.col-heading::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 24px;
  height: 2px;
  background: rgb(var(--v-theme-primary));
  border-radius: 1px;
}

.nav-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.82rem;
  color: rgb(var(--v-theme-on-surface), 0.45);
  text-decoration: none;
  transition: all 0.2s ease;
}

.nav-item:hover {
  color: rgb(var(--v-theme-primary));
  transform: translateX(4px);
}

.nav-arrow {
  font-family: var(--font-mono);
  color: rgb(var(--v-theme-primary));
  opacity: 0;
  transform: translateX(-6px);
  transition: all 0.2s ease;
}

.nav-item:hover .nav-arrow {
  opacity: 1;
  transform: translateX(0);
}

.social-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
}

.social-card {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 12px;
  border-radius: 10px;
  border: 1px solid rgb(var(--v-theme-on-surface), 0.06);
  text-decoration: none;
  color: inherit;
  transition: all 0.25s ease;
}

.social-card:hover {
  border-color: var(--social-color, rgb(var(--v-theme-primary)));
  background: rgb(var(--v-theme-surface), 0.5);
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

.social-icon-ring {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgb(var(--v-theme-on-surface), 0.04);
  flex-shrink: 0;
  transition: all 0.25s ease;
}

.social-card:hover .social-icon-ring {
  background: rgb(var(--v-theme-primary), 0.1);
  color: rgb(var(--v-theme-primary));
}

.social-text { min-width: 0; }

.social-name {
  display: block;
  font-size: 0.72rem;
  font-weight: 700;
}

.social-handle {
  display: block;
  font-size: 0.58rem;
  color: rgb(var(--v-theme-on-surface), 0.35);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.footer-signature {
  font-family: var(--font-mono);
  font-size: 0.85rem;
}

.bottom-line {
  height: 1px;
  background: linear-gradient(90deg, transparent, rgb(var(--v-theme-on-surface), 0.08), transparent);
  margin-bottom: 16px;
}

.bottom-row {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  gap: 16px;
}

.copyright,
.built-with {
  font-size: 0.7rem;
  color: rgb(var(--v-theme-on-surface), 0.3);
}

.version {
  font-size: 0.6rem;
  font-family: var(--font-mono);
  padding: 2px 8px;
  border-radius: 4px;
  background: rgb(var(--v-theme-primary), 0.06);
  color: rgb(var(--v-theme-primary), 0.5);
}

@media (max-width: 600px) {
  .social-grid {
    grid-template-columns: 1fr;
  }

  .cta-terminal {
    margin: 0 -8px;
  }

  .terminal-body {
    font-size: 0.72rem;
  }

  .brand-stack {
    display: none;
  }
}
</style>
