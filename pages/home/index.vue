<script setup lang="ts">
import { isNull } from 'es-toolkit'
import { commonAuthApiStore } from '@/store/common/auth'

const commonAuthApi = commonAuthApiStore()
const supabase = useSupabaseClient()

const user = useSupabaseUser()
if (isNull(user.value)) {
  throw new Error('User is not logged in')
}

await commonAuthApi.updateSlackUserInfo(user.value.user_metadata.full_name, user.value.user_metadata.provider_id)

const slackUserInfo = commonAuthApi.slackUserInfoOrThrow()

const signOut = async () => {
  await supabase.auth.signOut()
  return navigateTo('/login')
}
</script>

<template>
  <div class="Home">
    <h1>Home Page</h1>
    <p>Welcome, {{ slackUserInfo?.slackName }}</p>
    <p>You are slack id is {{ slackUserInfo?.memberId }}</p>
    <p>Welcome to the Home page</p>
    <button @click="signOut">
      ログアウト
    </button>
  </div>
</template>
