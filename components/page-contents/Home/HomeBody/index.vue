<script setup lang="ts">
import { commonAuthApiStore } from '@/store/common/auth'

const client = useSupabaseClient()
const commonAuthApi = commonAuthApiStore()
const slackUserInfo = commonAuthApi.slackUserInfoOrThrow()
const isDropdownOpen = ref(false)
const selectedUsers = ref(new Set<string>())
const selectedUsersMemberIds = ref(new Set<string>())
const message = ref<string>('')

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

const toggleOption = (name: string, memberId: string) => {
  if (selectedUsers.value.has(name)) {
    selectedUsers.value.delete(name)
    selectedUsersMemberIds.value.delete(memberId)
  }
  else {
    selectedUsers.value.add(name)
    selectedUsersMemberIds.value.add(memberId)
  }
}

const selectedUsersText = computed(() =>
  selectedUsers.value.size ? Array.from(selectedUsers.value).join(', ') : '相手を選択',
)

const selectedUsersMemberIdsText = computed(() =>
  selectedUsersMemberIds.value.size ? Array.from(selectedUsersMemberIds.value).join(', ') : '',
)

const submitMessage = async () => {
  const payload = {
    from: slackUserInfo.slackName,
    fromMemberId: slackUserInfo.memberId,
    to: selectedUsersText.value,
    toMemberIds: selectedUsersMemberIdsText.value,
    message: message.value,
  }

  await useFetch('/api/googleSpredsheet/add', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}
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
          @click="toggleOption(user.name, user.slack_member_id)"
        >
          <span>{{ user.name }}</span>
        </div>
      </div>
    </div>
    <div class="HomeBody__TextAreaWrapper">
      <textarea
        v-model="message"
        class="HomeBody__TextArea"
        placeholder="感謝の言葉を入力してください"
      />
    </div>
    <button
      class="HomeBody__SubmitButton"
      @click="submitMessage"
    >
      感謝を伝える
    </button>
  </div>
</template>

<style lang="scss" scoped>
@use './style.scss';
</style>
