<script setup lang="ts">
import AppHeader from '@/components/layout/AppHeader/index.vue'
</script>

<template>
  <div class="Layouts">
    <AppHeader class="Layouts__Header" />
    <div class="Layouts__Main">
      <slot />
    </div>
  </div>
</template>

<style lang="scss" scoped>
@use './style.scss';
</style>
