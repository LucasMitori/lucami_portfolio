import { animate, stagger, utils } from 'animejs'

export type AnimationPreset = 'fadeInUp' | 'fadeIn' | 'slideInLeft' | 'slideInRight' | 'scaleIn' | 'staggerIn' | 'glitch' | 'typeReveal' | 'terminalReveal'

interface AnimeOptions {
  delay?: number | ReturnType<typeof stagger>
  duration?: number
  easing?: string
  opacity?: [number, number]
  translateY?: [number, number]
  translateX?: [number, number] | (() => [number, number])
  scale?: [number, number]
}

export function useAnime() {
  const themeStore = useThemeStore()

  function getThemePreset(): 'smooth' | 'glitch' | 'typewriter' | 'terminal' {
    return themeStore.animationPreset
  }

  function runAnimation(targets: string | HTMLElement | HTMLElement[], preset: AnimationPreset, options: AnimeOptions = {}) {
    const defaults: Record<AnimationPreset, AnimeOptions> = {
      fadeInUp: {
        opacity: [0, 1],
        translateY: [40, 0],
        duration: 800,
        easing: 'easeOutQuad',
      },
      fadeIn: {
        opacity: [0, 1],
        duration: 600,
        easing: 'easeOutQuad',
      },
      slideInLeft: {
        opacity: [0, 1],
        translateX: [-60, 0],
        duration: 700,
        easing: 'easeOutCubic',
      },
      slideInRight: {
        opacity: [0, 1],
        translateX: [60, 0],
        duration: 700,
        easing: 'easeOutCubic',
      },
      scaleIn: {
        opacity: [0, 1],
        scale: [0.8, 1],
        duration: 600,
        easing: 'easeOutBack',
      },
      staggerIn: {
        opacity: [0, 1],
        translateY: [30, 0],
        delay: stagger(100),
        duration: 600,
        easing: 'easeOutQuad',
      },
      glitch: {
        opacity: [0, 1],
        translateX: () => [utils.random(-20, 20), 0],
        duration: 400,
        easing: 'easeInOutQuad',
      },
      typeReveal: {
        opacity: [0, 1],
        duration: 50,
        delay: stagger(50),
        easing: 'linear',
      },
      terminalReveal: {
        opacity: [0, 1],
        duration: 30,
        delay: stagger(30),
        easing: 'linear',
      },
    }

    const config = { ...defaults[preset], ...options }
    return animate(targets, config)
  }

  function getEntranceAnimation(): AnimationPreset {
    const preset = getThemePreset()
    switch (preset) {
      case 'glitch': return 'glitch'
      case 'typewriter': return 'typeReveal'
      case 'terminal': return 'terminalReveal'
      default: return 'fadeInUp'
    }
  }

  function animateEntrance(targets: string | HTMLElement | HTMLElement[], options: AnimeOptions = {}) {
    return runAnimation(targets, getEntranceAnimation(), options)
  }

  function staggerEntrance(targets: string | HTMLElement | HTMLElement[], options: AnimeOptions = {}) {
    return runAnimation(targets, 'staggerIn', options)
  }

  return {
    animate: runAnimation,
    animateEntrance,
    staggerEntrance,
    getEntranceAnimation,
    getThemePreset,
  }
}
