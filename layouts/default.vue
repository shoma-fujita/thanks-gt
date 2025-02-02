<script setup lang="ts">
import AppHeader from '@/components/layout/AppHeader/index.vue'
import AppFooter from '@/components/layout/AppFooter/index.vue'
</script>

<template>
  <div class="Layouts">
    <AppHeader class="Layouts__Header" />
    <slot />
    <AppFooter class="Layouts__Footer" />
  </div>
</template>

<style lang="scss" scoped>
 @use './style.scss'
</style>
