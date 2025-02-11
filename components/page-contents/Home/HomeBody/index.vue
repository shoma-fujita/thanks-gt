<script setup lang="ts">
import { commonAuthApiStore } from '@/store/common/auth'

const client = useSupabaseClient()
const commonAuthApi = commonAuthApiStore()
const slackUserInfo = commonAuthApi.slackUserInfoOrThrow()
const isDropdownOpen = ref(false)
const selectedUsers = ref(new Set<string>())

const { data: users } = await useAsyncData('users-upsert', async () => {
  await client.from('users').upsert(
    {
      uuid: slackUserInfo.userId,
      name: slackUserInfo.slackName,
      slack_member_id: slackUserInfo.memberId,
      slack_profile_image: slackUserInfo.profileImageUrl,
    },
    { onConflict: 'uuid' },
  )

  const { data } = await client.from('users').select()
  return data
})

const toggleDropdown = () => {
  isDropdownOpen.value = !isDropdownOpen.value
}

const toggleOption = (option: string) => {
  if (selectedUsers.value.has(option)) {
    selectedUsers.value.delete(option)
  }
  else {
    selectedUsers.value.add(option)
  }
}

const selectedUsersText = computed(() =>
  selectedUsers.value.size ? Array.from(selectedUsers.value).join(', ') : '相手を選択',
)
</script>

<template>
  <div class="HomeBody">
    <h1 class="HomeBody__Title">
      誰に感謝を伝えますか？
    </h1>
    <div class="HomeBody__SelectWrapper">
      <button
        class="HomeBody__SelectButton"
        type="button"
        @click="toggleDropdown"
      >
        <span class="HomeBody__Text">{{ selectedUsersText }}</span>
        <img
          src="@/assets/img/select-icon.png"
          alt="選択用の画像"
          class="HomeBody__Image"
          :class="{ 'HomeBody__Image--Rotate': isDropdownOpen }"
        >
      </button>
      <div
        v-if="isDropdownOpen"
        class="HomeBody__DropDownWrapper"
      >
        <div
          v-for="user in users"
          :key="user.uuid"
          class="HomeBody__DropDown"
          @click="toggleOption(user.name)"
        >
          <span>{{ user.name }}</span>
        </div>
      </div>
    </div>
    <div class="HomeBody__TextAreaWrapper">
      <textarea
        class="HomeBody__TextArea"
        placeholder="感謝の言葉を入力してください"
      />
    </div>
    <button class="HomeBody__SubmitButton">
      感謝を伝える
    </button>
  </div>
</template>

<style lang="scss" scoped>
@use './style.scss';
</style>
