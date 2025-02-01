<script setup>
import { useAuth } from '@/composables/useAuth'

const { signInWithGoogle, signOut } = useAuth()
</script>

<template>
  <div class="Login">
    <h1>login Page</h1>
    <button
      @click="signInWithGoogle"
    >
      Googleでログイン
    </button>
    <button @click="signOut">
      ログアウト
    </button>
  </div>
</template>
