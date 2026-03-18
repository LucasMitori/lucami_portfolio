<template>
  <div class="articles-page">
    <section class="page-hero">
      <div class="page-hero-bg" />
      <div class="hero-particles">
        <div v-for="n in 45" :key="n" class="article-particle" :style="particleStyle(n)" />
      </div>
      <div class="hero-ink-drops">
        <div v-for="n in 8" :key="`ink-${n}`" class="ink-drop" :style="inkStyle(n)" />
      </div>
      <div class="hero-lines">
        <div v-for="n in 10" :key="`line-${n}`" class="writing-line" :style="lineStyle(n)" />
      </div>
      <div class="hero-quill-strokes">
        <svg v-for="n in 5" :key="`stroke-${n}`" class="quill-stroke" :style="strokeStyle(n)" viewBox="0 0 200 20" preserveAspectRatio="none">
          <path d="M0,10 Q50,0 100,10 Q150,20 200,10" fill="none" stroke="currentColor" stroke-width="1.5" />
        </svg>
      </div>
      <div class="hero-symbols">
        <span v-for="(sym, i) in symbols" :key="i" class="float-sym" :style="symStyle(i)">{{ sym }}</span>
      </div>
      <v-container class="page-hero-content">
        <v-row align="center" justify="center">
          <v-col cols="12" class="text-center">
            <AnimatedSection>
              <div class="hero-badge">
                <v-icon size="16" class="mr-1">mdi-newspaper-variant</v-icon>
                {{ t('articles.badge') }}
              </div>
              <h1 class="page-title">
                <span class="title-line">{{ t('articles.title') }}</span>
              </h1>
              <p class="page-subtitle">{{ t('articles.subtitle') }}</p>
              <div v-if="articles?.length" class="hero-stats">
                <div class="hero-stat">
                  <span class="stat-number">{{ articles.length }}</span>
                  <span class="stat-label">{{ t('articles.articlesCount') }}</span>
                </div>
              </div>
              <div class="page-line" />
            </AnimatedSection>
          </v-col>
        </v-row>
      </v-container>
      <div class="hero-bottom-fade" />
    </section>

    <v-container class="py-12">
      <v-row v-if="articles?.length">
        <v-col
          v-for="(article, index) in articles"
          :key="article._id"
          cols="12"
          sm="6"
          lg="4"
        >
          <AnimatedSection animation="fadeInUp" :delay="(index % 6) * 80">
            <ArticleCard :article="article" />
          </AnimatedSection>
        </v-col>
      </v-row>

      <div v-else class="empty-state text-center py-16">
        <div class="empty-icon-wrap mb-6">
          <v-icon size="48" color="primary" class="empty-icon">mdi-newspaper-variant-outline</v-icon>
        </div>
        <h3 class="text-h5 font-weight-bold mb-2">{{ t('articles.noArticles') }}</h3>
        <p class="text-body-1 text-medium-emphasis">{{ t('articles.comingSoon') }}</p>
        <div class="empty-decoration mt-6">
          <div class="decoration-line" />
          <v-icon size="16" color="primary">mdi-pen</v-icon>
          <div class="decoration-line" />
        </div>
      </div>
    </v-container>
  </div>
</template>

<script setup lang="ts">
import type { Article } from '~~/shared/types'

const { t } = useI18n()

useHead({ title: t('articles.metaTitle') })

const { data: articles } = await useFetch<Article[]>('/api/public/articles')

const symbols = ['A', 'B', 'C', '{}', '()', '[]', '#', '&', '%', '@', '!', '?', '...', '""', ';']

function particleStyle(n: number) {
  const phi = 1.618033988749895
  return {
    '--x': `${((n * phi * 100) % 100)}%`,
    '--y': `${((n * phi * 61.8) % 100)}%`,
    '--size': `${1.5 + (n % 4) * 1.5}px`,
    '--duration': `${14 + (n % 10) * 2.5}s`,
    '--delay': `${-(n % 14) * 1.5}s`,
    '--opacity': `${0.06 + (n % 6) * 0.035}`,
  }
}

function symStyle(i: number) {
  const phi = 1.618033988749895
  return {
    '--sx': `${((i * phi * 100) % 92) + 4}%`,
    '--sy': `${((i * phi * 61.8) % 82) + 9}%`,
    '--sd': `${18 + (i % 8) * 4}s`,
    '--sdelay': `${-(i % 7) * 2.5}s`,
  }
}

function inkStyle(n: number) {
  const phi = 1.618033988749895
  return {
    '--ix': `${((n * phi * 100) % 90) + 5}%`,
    '--iy': `${((n * phi * 50) % 80) + 10}%`,
    '--isize': `${30 + (n % 4) * 25}px`,
    '--idur': `${6 + (n % 5) * 3}s`,
    '--idelay': `${-(n % 4) * 2}s`,
  }
}

function lineStyle(n: number) {
  return {
    '--ly': `${(n * 10) + 5}%`,
    '--lwidth': `${15 + (n % 4) * 15}%`,
    '--lx': `${(n * 7.3 * 13) % 80}%`,
    '--ldur': `${10 + (n % 5) * 4}s`,
    '--ldelay': `${-(n % 6) * 2}s`,
  }
}

function strokeStyle(n: number) {
  return {
    '--stx': `${10 + (n * 18)}%`,
    '--sty': `${15 + (n * 15) % 70}%`,
    '--stdur': `${8 + (n % 3) * 4}s`,
    '--stdelay': `${-(n % 4) * 3}s`,
  }
}
</script>

<style scoped>
.page-hero {
  position: relative;
  min-height: 55vh;
  display: flex;
  align-items: center;
  overflow: hidden;
}

.page-hero-bg {
  position: absolute;
  inset: 0;
  background:
    radial-gradient(ellipse at 30% 40%, rgb(var(--v-theme-primary), 0.14) 0%, transparent 50%),
    radial-gradient(ellipse at 70% 60%, rgb(var(--v-theme-secondary), 0.10) 0%, transparent 50%),
    radial-gradient(ellipse at 50% 50%, rgb(var(--v-theme-primary), 0.04) 0%, transparent 70%),
    linear-gradient(180deg, rgb(var(--v-theme-background)) 0%, rgb(var(--v-theme-surface)) 100%);
}

.page-hero-bg::before {
  content: '';
  position: absolute;
  inset: 0;
  background-image:
    repeating-linear-gradient(
      0deg,
      transparent,
      transparent 28px,
      rgb(var(--v-theme-primary), 0.025) 28px,
      rgb(var(--v-theme-primary), 0.025) 29px
    );
  animation: lines-scroll 20s linear infinite;
}

@keyframes lines-scroll {
  0% { transform: translateY(0); }
  100% { transform: translateY(29px); }
}

.hero-particles {
  position: absolute;
  inset: 0;
  overflow: hidden;
  pointer-events: none;
}

.article-particle {
  position: absolute;
  left: var(--x);
  top: var(--y);
  width: var(--size);
  height: var(--size);
  border-radius: 50%;
  background: rgb(var(--v-theme-primary));
  opacity: var(--opacity);
  animation: article-float var(--duration) ease-in-out infinite;
  animation-delay: var(--delay);
}

@keyframes article-float {
  0%, 100% { transform: translate(0, 0) scale(1); }
  25% { transform: translate(25px, -35px) scale(1.4); }
  50% { transform: translate(-20px, -70px) scale(0.8); }
  75% { transform: translate(30px, -25px) scale(1.2); }
}

.hero-ink-drops {
  position: absolute;
  inset: 0;
  pointer-events: none;
  overflow: hidden;
}

.ink-drop {
  position: absolute;
  left: var(--ix);
  top: var(--iy);
  width: var(--isize);
  height: var(--isize);
  border-radius: 50%;
  background: radial-gradient(circle, rgb(var(--v-theme-primary), 0.08) 0%, transparent 70%);
  animation: ink-spread var(--idur) ease-in-out infinite;
  animation-delay: var(--idelay);
}

@keyframes ink-spread {
  0%, 100% { transform: scale(0.5); opacity: 0; }
  50% { transform: scale(1.5); opacity: 1; }
}

.hero-lines {
  position: absolute;
  inset: 0;
  pointer-events: none;
  overflow: hidden;
}

.writing-line {
  position: absolute;
  left: var(--lx);
  top: var(--ly);
  width: var(--lwidth);
  height: 1px;
  background: linear-gradient(90deg, transparent, rgb(var(--v-theme-primary), 0.1), transparent);
  animation: line-write var(--ldur) ease-in-out infinite;
  animation-delay: var(--ldelay);
}

@keyframes line-write {
  0%, 100% { transform: scaleX(0); opacity: 0; transform-origin: left; }
  30% { transform: scaleX(1); opacity: 1; transform-origin: left; }
  60% { transform: scaleX(1); opacity: 1; transform-origin: right; }
  90% { transform: scaleX(0); opacity: 0; transform-origin: right; }
}

.hero-quill-strokes {
  position: absolute;
  inset: 0;
  pointer-events: none;
  overflow: hidden;
}

.quill-stroke {
  position: absolute;
  left: var(--stx);
  top: var(--sty);
  width: 120px;
  height: 12px;
  color: rgb(var(--v-theme-primary), 0.08);
  animation: stroke-draw var(--stdur) ease-in-out infinite;
  animation-delay: var(--stdelay);
}

@keyframes stroke-draw {
  0%, 100% { opacity: 0; transform: translateX(-20px); }
  30%, 70% { opacity: 1; transform: translateX(0); }
}

.hero-symbols {
  position: absolute;
  inset: 0;
  overflow: hidden;
  pointer-events: none;
}

.float-sym {
  position: absolute;
  left: var(--sx);
  top: var(--sy);
  font-family: var(--font-mono, 'Fira Code', monospace);
  font-size: 0.85rem;
  color: rgb(var(--v-theme-primary));
  opacity: 0.06;
  animation: sym-float var(--sd) ease-in-out infinite;
  animation-delay: var(--sdelay);
  user-select: none;
}

@keyframes sym-float {
  0%, 100% { transform: translate(0, 0) rotate(0deg); opacity: 0.04; }
  50% { transform: translate(18px, -28px) rotate(8deg); opacity: 0.14; }
}

.page-hero-content {
  position: relative;
  z-index: 2;
  padding: 120px 24px 80px;
}

.hero-badge {
  display: inline-flex;
  align-items: center;
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 3px;
  text-transform: uppercase;
  color: rgb(var(--v-theme-primary));
  margin-bottom: 16px;
  padding: 6px 16px;
  border-radius: 20px;
  background: rgb(var(--v-theme-primary), 0.08);
  border: 1px solid rgb(var(--v-theme-primary), 0.15);
}

.page-title {
  font-size: clamp(2.5rem, 6vw, 4rem);
  font-weight: 900;
  font-family: var(--font-heading);
  margin-bottom: 12px;
  line-height: 1.1;
}

.title-line {
  background: linear-gradient(135deg, rgb(var(--v-theme-on-surface)), rgb(var(--v-theme-primary)));
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.page-subtitle {
  font-size: 1.15rem;
  color: rgb(var(--v-theme-on-surface), 0.6);
  margin-bottom: 24px;
  max-width: 500px;
  margin-left: auto;
  margin-right: auto;
}

.hero-stats {
  display: inline-flex;
  align-items: center;
  gap: 20px;
  padding: 10px 24px;
  border-radius: 14px;
  background: rgb(var(--v-theme-surface), 0.6);
  backdrop-filter: blur(10px);
  border: 1px solid rgb(var(--v-theme-on-surface), 0.06);
  margin-bottom: 24px;
}

.hero-stat {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
}

.stat-number {
  font-size: 1.3rem;
  font-weight: 900;
  font-family: var(--font-heading);
  color: rgb(var(--v-theme-primary));
}

.stat-label {
  font-size: 0.65rem;
  font-weight: 600;
  letter-spacing: 1px;
  text-transform: uppercase;
  color: rgb(var(--v-theme-on-surface), 0.5);
}

.page-line {
  width: 60px;
  height: 3px;
  background: linear-gradient(90deg, rgb(var(--v-theme-primary)), rgb(var(--v-theme-secondary)));
  margin: 0 auto;
  border-radius: 2px;
}

.hero-bottom-fade {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 80px;
  background: linear-gradient(to bottom, transparent, rgb(var(--v-theme-background)));
  z-index: 3;
}

.empty-icon-wrap {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: rgb(var(--v-theme-primary), 0.08);
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto;
}

.empty-decoration {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
}

.decoration-line {
  width: 40px;
  height: 1px;
  background: rgb(var(--v-theme-on-surface), 0.15);
}
</style>
