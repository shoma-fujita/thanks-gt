<script setup lang="ts">
import { isNull } from 'es-toolkit'
import { commonAuthApiStore } from '@/store/common/auth'

const commonAuthApi = commonAuthApiStore()
const supabase = useSupabaseClient()

const user = useSupabaseUser()
if (isNull(user.value)) {
  throw new Error('User is not logged in')
}

await commonAuthApi.updateSlackUserInfo(user.value.user_metadata.full_name, user.value.user_metadata.provider_id, user.value.user_metadata.avatar_url)

const slackUserInfo = commonAuthApi.slackUserInfoOrThrow()

const signOut = async () => {
  await supabase.auth.signOut()
  return navigateTo('/login')
}
</script>

<template>
  <div class="HomeBody">
    <h1 class="HomeBody__Title">
      Home Page
    </h1>
    <p class="HomeBody__Item">
      Welcome, {{ slackUserInfo?.slackName }}
    </p>
    <p class="HomeBody__Item">
      You are member id is {{ slackUserInfo?.memberId }}
    </p>
    <img
      :src="slackUserInfo?.profileImageUrl"
      class="HomeBody__Image"
      alt="ログイン中のユーザーのプロフィール画像"
    >
    <button
      class="HomeBody__Button"
      @click="signOut"
    >
      ログアウト
    </button>
  </div>
</template>

<style lang="scss" scoped>
@use './style.scss';
</style>
