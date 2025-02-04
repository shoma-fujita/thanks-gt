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
  <div class="ClientHeader">
    <div class="ClientHeader__Heading">
      <img
        src="@/assets/img/app-icon.jpg"
        class="ClientHeader__ApplicationImage"
        alt="アプリケーションの画像"
      >
      <NuxtLink
        to="/home"
        class="ClientHeader__Link"
      >
        Thanks GT
      </NuxtLink>
    </div>
    <div class="ClientHeader__UserInformationDelimiter">
      <img
        :src="slackUserInfo?.profileImageUrl"
        class="ClientHeader__Avatar"
        alt="ログイン中のユーザーのプロフィール画像"
      >
      <p class="ClientHeader__Item">
        {{ slackUserInfo?.slackName }}
      </p>
      <button
        class="ClientHeader__Button"
        @click="signOut"
      >
        ログアウト
      </button>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@use './style.scss';
</style>
