<template>
  <div class="daily-tools-section">
    <div class="tools-bg" />
    <div class="tools-content">
      <div class="tools-grid">
        <v-tooltip
          v-for="tool in tools"
          :key="tool.name"
          :text="tool.name"
          location="top"
        >
          <template #activator="{ props }">
            <div
              v-bind="props"
              class="tool-item"
            >
              <div class="tool-icon-wrap" :style="{ '--tool-color': tool.color }">
                <v-icon :icon="tool.icon" size="28" />
              </div>
              <span class="tool-name">{{ tool.name }}</span>
            </div>
          </template>
        </v-tooltip>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const { t } = useI18n()

const tools = [
  { name: 'VS Code', icon: 'mdi-microsoft-visual-studio-code', color: '#007ACC' },
  { name: 'Docker', icon: 'mdi-docker', color: '#2496ED' },
  { name: 'Git', icon: 'mdi-git', color: '#F05032' },
  { name: 'GitHub', icon: 'mdi-github', color: '#8b5cf6' },
  { name: 'Figma', icon: 'mdi-pencil-ruler', color: '#F24E1E' },
  { name: 'Postman', icon: 'mdi-api', color: '#FF6C37' },
  { name: 'MongoDB', icon: 'mdi-database', color: '#47A248' },
  { name: 'Chrome DevTools', icon: 'mdi-google-chrome', color: '#4285F4' },
  { name: 'Terminal', icon: 'mdi-console', color: '#22c55e' },
  { name: 'Linux', icon: 'mdi-linux', color: '#FCC624' },
]
</script>

<style scoped>
.daily-tools-section {
  position: relative;
  padding: 32px;
  border-radius: 20px;
  overflow: hidden;
}

.tools-bg {
  position: absolute;
  inset: 0;
  background:
    radial-gradient(ellipse at 20% 50%, rgb(var(--v-theme-primary), 0.15) 0%, transparent 60%),
    radial-gradient(ellipse at 80% 50%, rgb(var(--v-theme-secondary), 0.12) 0%, transparent 60%),
    radial-gradient(ellipse at 50% 100%, rgb(var(--v-theme-accent, var(--v-theme-primary)), 0.08) 0%, transparent 50%),
    linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.02) 100%);
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 20px;
  backdrop-filter: blur(12px);
}

/* Circuit board pattern overlay */
.tools-bg::before {
  content: '';
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(rgb(var(--v-theme-primary), 0.04) 1px, transparent 1px),
    linear-gradient(90deg, rgb(var(--v-theme-primary), 0.04) 1px, transparent 1px),
    radial-gradient(circle at 25% 25%, rgb(var(--v-theme-primary), 0.06) 2px, transparent 2px),
    radial-gradient(circle at 75% 75%, rgb(var(--v-theme-secondary), 0.06) 2px, transparent 2px),
    radial-gradient(circle at 50% 50%, rgb(var(--v-theme-primary), 0.03) 3px, transparent 3px);
  background-size: 30px 30px, 30px 30px, 60px 60px, 60px 60px, 90px 90px;
  border-radius: 20px;
  animation: circuit-drift 20s linear infinite;
}

@keyframes circuit-drift {
  0% { background-position: 0 0, 0 0, 0 0, 0 0, 0 0; }
  100% { background-position: 30px 30px, 30px 30px, 60px 60px, 60px 60px, 90px 90px; }
}

/* Floating decorative dots + glow */
.tools-bg::after {
  content: '';
  position: absolute;
  top: -20px;
  right: -20px;
  width: 160px;
  height: 160px;
  background: radial-gradient(circle, rgb(var(--v-theme-primary), 0.12) 1px, transparent 1px),
    radial-gradient(circle at center, rgb(var(--v-theme-primary), 0.08) 0%, transparent 70%);
  background-size: 12px 12px, 100% 100%;
  opacity: 0.8;
  border-radius: 50%;
  animation: dots-pulse 6s ease-in-out infinite;
}

@keyframes dots-pulse {
  0%, 100% { opacity: 0.5; transform: scale(1); }
  50% { opacity: 0.9; transform: scale(1.05); }
}

.tools-content {
  position: relative;
  z-index: 1;
}

.tools-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
  gap: 16px;
}

.tool-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 16px 8px;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(8px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  cursor: default;
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
}

.tool-item:hover {
  transform: translateY(-4px);
  border-color: var(--tool-color, rgb(var(--v-theme-primary)));
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
  background: rgba(255, 255, 255, 0.15);
}

.tool-item:hover .tool-icon-wrap {
  color: var(--tool-color, rgb(var(--v-theme-primary)));
  transform: scale(1.15);
}

.tool-icon-wrap {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.08);
  transition: all 0.3s ease;
  color: rgba(255, 255, 255, 0.7);
}

.tool-name {
  font-size: 0.75rem;
  font-weight: 600;
  text-align: center;
  color: rgba(255, 255, 255, 0.8);
  line-height: 1.2;
}
</style>
