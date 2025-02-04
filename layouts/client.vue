<script setup lang="ts">
import ClientHeader from '@/components/layout/ClientHeader/index.vue'
import AppFooter from '@/components/layout/AppFooter/index.vue'
</script>

<template>
  <div class="Layouts">
    <ClientHeader />
    <slot />
    <AppFooter />
  </div>
</template>
