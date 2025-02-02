<script setup>
import { commonAuthApiStore } from '@/store/common/auth'

definePageMeta({
  middleware: 'auth',
})
const commonAuthApi = commonAuthApiStore()
const supabase = useSupabaseClient()

const user = useSupabaseUser()
await commonAuthApi.updateGoogleUserInfo(user.value.user_metadata.full_name)

const googleUserInfo = commonAuthApi.googleUserInfoOrThrow()

const signOut = async () => {
  await supabase.auth.signOut()
  return navigateTo('/login')
}
</script>

<template>
  <div class="Home">
    <h1>Home Page</h1>
    <p>Welcome, {{ googleUserInfo }}</p>
    <p>Welcome to the Home page</p>
    <button @click="signOut">
      ログアウト
    </button>
  </div>
</template>
