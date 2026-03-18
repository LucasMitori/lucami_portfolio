export const useMusicStore = defineStore('music', () => {
  const isPlaying = ref(false)
  const volume = ref(0.3)
  const isMuted = ref(false)
  const typingSoundEnabled = ref(true)
  const currentTrackName = ref('')

  function play() {
    isPlaying.value = true
  }

  function pause() {
    isPlaying.value = false
  }

  function toggle() {
    isPlaying.value = !isPlaying.value
  }

  function toggleMute() {
    isMuted.value = !isMuted.value
  }

  function setVolume(v: number) {
    volume.value = Math.max(0, Math.min(1, v))
    if (volume.value > 0 && isMuted.value) {
      isMuted.value = false
    }
  }

  return {
    isPlaying,
    volume,
    isMuted,
    typingSoundEnabled,
    currentTrackName,
    play,
    pause,
    toggle,
    toggleMute,
    setVolume,
  }
}, {
  persist: {
    pick: ['volume', 'isMuted', 'typingSoundEnabled'],
  },
})
