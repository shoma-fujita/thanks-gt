<script setup lang="ts">
import { commonAuthApiStore } from '@/store/common/auth'

const client = useSupabaseClient()

const commonAuthApi = commonAuthApiStore()
const slackUserInfo = commonAuthApi.slackUserInfoOrThrow()

await useAsyncData('users-upsert', async () => {
  await client.from('users').upsert(
    { uuid: slackUserInfo.userId, name: slackUserInfo.slackName, slack_member_id: slackUserInfo.memberId, slack_profile_image: slackUserInfo.profileImageUrl },
    { onConflict: 'uuid' },
  ).select()
})
</script>

<template>
  <div class="HomeBody">
    <h1 class="HomeBody__Title">
      誰に感謝を伝えますか？
    </h1>
  </div>
</template>

<style lang="scss" scoped>
@use './style.scss';
</style>
