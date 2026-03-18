<script setup lang="ts">
import FloatMenu from "./FloatMenu/FloatingMenu.vue";

useHead({
    title: `Floating Menu`,
    meta: [{ property: "og:title", content: `Dashboard` }],
});
</script>

<template>
    <v-container fluid>
        <FloatMenu />
    </v-container>
</template>

<style lang="css" scoped>
/* Add your styles here */
</style>
