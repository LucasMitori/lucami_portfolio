<template>
  <span class="typewriter-wrapper">
    <span class="typewriter-text">{{ displayText }}</span>
    <span class="typewriter-cursor" :class="cursorClass">|</span>
  </span>
</template>

<script setup lang="ts">
const props = withDefaults(defineProps<{
  texts: string[]
  speed?: number
  deleteSpeed?: number
  pauseDuration?: number
}>(), {
  speed: 80,
  deleteSpeed: 40,
  pauseDuration: 2000,
})

const themeStore = useThemeStore()
const { playKeystroke } = useTypingSound()

const displayText = ref('')
const cursorClass = computed(() => {
  switch (themeStore.currentThemeSlug) {
    case 'retro': return 'cursor-retro'
    case 'coding': return 'cursor-coding'
    case 'nerd': return 'cursor-nerd'
    default: return 'cursor-default'
  }
})

let currentTextIndex = 0
let currentCharIndex = 0
let isDeleting = false
let timeout: ReturnType<typeof setTimeout> | null = null

function type() {
  const currentFullText = props.texts[currentTextIndex] || ''

  if (isDeleting) {
    displayText.value = currentFullText.substring(0, currentCharIndex - 1)
    currentCharIndex--
  } else {
    displayText.value = currentFullText.substring(0, currentCharIndex + 1)
    currentCharIndex++
    if (import.meta.client) {
      playKeystroke()
    }
  }

  let delay = isDeleting ? props.deleteSpeed : props.speed

  if (!isDeleting && currentCharIndex === currentFullText.length) {
    delay = props.pauseDuration
    isDeleting = true
  } else if (isDeleting && currentCharIndex === 0) {
    isDeleting = false
    currentTextIndex = (currentTextIndex + 1) % props.texts.length
    delay = 300
  }

  timeout = setTimeout(type, delay)
}

onMounted(() => {
  if (props.texts.length > 0) {
    timeout = setTimeout(type, 500)
  }
})

onUnmounted(() => {
  if (timeout) clearTimeout(timeout)
})
</script>

<style scoped>
.typewriter-wrapper {
  display: inline;
}

.typewriter-cursor {
  animation: blink 1s step-end infinite;
  font-weight: 100;
}

.cursor-retro {
  font-weight: 900;
  font-family: 'Courier New', monospace;
}

.cursor-coding {
  color: #00FF41;
  font-family: 'Fira Code', monospace;
}

.cursor-nerd {
  color: #00F0FF;
  text-shadow: 0 0 10px rgba(0, 240, 255, 0.7);
}

@keyframes blink {
  50% { opacity: 0; }
}
</style>
