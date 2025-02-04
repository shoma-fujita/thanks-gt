<script setup lang="ts">
definePageMeta({
  layout: 'default',
})
</script>

<template>
  <div class="Top">
    <h1>Top Page</h1>
    <p>Welcome to the top page</p>
    <NuxtLink to="/login">ログインページへ</NuxtLink>
    <NuxtLink to="/home">ホームページへ</NuxtLink>
  </div>
</template>
