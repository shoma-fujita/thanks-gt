<script setup lang="ts">
import ClientHeader from '@/components/layout/ClientHeader/index.vue'
</script>

<template>
  <div class="Client">
    <ClientHeader class="Client__Header" />
    <div class="Client__Main">
      <slot />
    </div>
  </div>
</template>

<style lang="scss" scoped>
@use './style.scss';
</style>
