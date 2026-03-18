<template>
  <div>
    <h3 class="text-h5 font-weight-bold mb-6">
      <v-icon start color="primary">mdi-map-marker</v-icon>
      {{ t('about.locationTitle') }}
    </h3>

    <ClientOnly>
      <div ref="mapContainer" class="map-container rounded-lg" />
      <template #fallback>
        <v-skeleton-loader type="image" height="300" />
      </template>
    </ClientOnly>
  </div>
</template>

<script setup lang="ts">
const { t } = useI18n()
const themeStore = useThemeStore()

const props = withDefaults(defineProps<{
  lat?: number
  lng?: number
}>(), {
  lat: -23.5475,
  lng: -46.7158,
})

const mapContainer = ref<HTMLElement | null>(null)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let mapInstance: any = null

onMounted(async () => {
  if (!import.meta.client) return

  // Wait for next tick to ensure DOM is ready
  await nextTick()

  if (!mapContainer.value) return

  const L = await import('leaflet')

  // Inject leaflet CSS into document head if not already present
  if (!document.querySelector('link[href*="leaflet"]')) {
    const link = document.createElement('link')
    link.rel = 'stylesheet'
    link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css'
    link.crossOrigin = ''
    document.head.appendChild(link)
    // Wait for CSS to load
    await new Promise(resolve => {
      link.onload = resolve
      setTimeout(resolve, 1000) // fallback timeout
    })
  }

  const isDark = themeStore.currentThemeSlug === 'nerd' || themeStore.currentThemeSlug === 'coding'
  const tileUrl = isDark
    ? 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
    : 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png'

  mapInstance = L.map(mapContainer.value, {
    center: [props.lat, props.lng],
    zoom: 14,
    zoomControl: true,
    scrollWheelZoom: false,
  })

  L.tileLayer(tileUrl, {
    maxZoom: 19,
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/">CARTO</a>',
    subdomains: 'abcd',
  }).addTo(mapInstance)

  // Custom marker icon to avoid default icon issues
  const markerIcon = L.divIcon({
    className: 'custom-map-marker',
    html: '<div style="width:20px;height:20px;background:rgb(var(--v-theme-primary, 99,102,241));border-radius:50%;border:3px solid white;box-shadow:0 2px 8px rgba(0,0,0,0.3);"></div>',
    iconSize: [20, 20],
    iconAnchor: [10, 10],
  })

  L.marker([props.lat, props.lng], { icon: markerIcon }).addTo(mapInstance)
    .bindPopup('<b>São Paulo, BR</b><br>Alto de Pinheiros')

  // Force map to recalculate size after render
  setTimeout(() => {
    mapInstance?.invalidateSize()
  }, 250)
})

onUnmounted(() => {
  mapInstance?.remove()
})
</script>

<style scoped>
.map-container {
  height: 300px;
  width: 100%;
  min-height: 300px;
  border: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
  z-index: 0;
}

/* Fix leaflet z-index issues with Vuetify */
.map-container :deep(.leaflet-pane) {
  z-index: 1;
}

.map-container :deep(.leaflet-control) {
  z-index: 2;
}
</style>
