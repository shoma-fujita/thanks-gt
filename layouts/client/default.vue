<script setup lang="ts">
import ClientHeader from '@/components/layout/ClientHeader/index.vue'
import AppFooter from '@/components/layout/AppFooter/index.vue'
</script>

<template>
  <div class="Client">
    <ClientHeader class="Client__Header" />
    <div class="Client__Main">
      <slot />
    </div>
    <AppFooter class="Client__Footer" />
  </div>
</template>

<style lang="scss" scoped>
@use './style.scss';
</style>
