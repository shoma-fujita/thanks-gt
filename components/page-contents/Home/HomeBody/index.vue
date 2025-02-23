<script setup lang="ts">
import { z } from 'zod'
import { commonAuthApiStore } from '@/store/common/auth'

/** Supabase Client */
const client = useSupabaseClient()

/** Common Auth API */
const commonAuthApi = commonAuthApiStore()

/** ログイン中の Slack ユーザー情報 */
const slackUserInfo = commonAuthApi.slackUserInfoOrThrow()

/** ドロップダウンが開いているかどうか */
const isDropdownOpen = ref<boolean>(false)

/** 選択されたユーザー */
const selectedUsers = ref(new Set<string>())

/** 選択されたユーザーのメンバー ID */
const selectedUsersMemberIds = ref(new Set<string>())

/** 感謝メッセージ */
const message = ref<string>('')

/** ローディング中かどうか */
const isLoading = ref<boolean>(false)

/** 送信成功メッセージ */
const successMessage = ref<'感謝を伝える' | '感謝を伝えました'>('感謝を伝える')

const validationSchema = z.object({
  to: z.string().refine(value => value !== '相手を選択', {
    message: '相手を選択してください',
  }),
  message: z.string().min(1, {
    message: '感謝の言葉を入力してください',
  }),
})

const validationResult = computed(() => {
  const result = validationSchema.safeParse({
    to: selectedUsersText.value,
    message: message.value,
  })
  return result.success ? {} : result.error.flatten().fieldErrors
})

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

/** ドロップダウンの開閉 */
const toggleDropdown = () => {
  isDropdownOpen.value = !isDropdownOpen.value
}

/** 洗濯中のユーザー情報取得 */
const checkUser = (name: string, memberId: string) => {
  if (selectedUsers.value.has(name)) {
    selectedUsers.value.delete(name)
    selectedUsersMemberIds.value.delete(memberId)
  }
  else {
    selectedUsers.value.add(name)
    selectedUsersMemberIds.value.add(memberId)
  }
}

/** 選択されたユーザーのテキスト */
const selectedUsersText = computed<string>(() =>
  selectedUsers.value.size ? Array.from(selectedUsers.value).join(', ') : '相手を選択',
)

/** 選択されたユーザーのメンバー ID のテキスト */
const selectedUsersMemberIdsText = computed<string>(() =>
  selectedUsersMemberIds.value.size ? Array.from(selectedUsersMemberIds.value).join(', ') : '',
)

/** メッセージの送信 */
const submitMessage = async () => {
  if (!validationSchema.safeParse({
    to: selectedUsersText.value,
    message: message.value,
  }).success) {
    return
  }
  isLoading.value = true

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

  isLoading.value = false
  successMessage.value = '感謝を伝えました'
  setTimeout(() => {
    successMessage.value = '感謝を伝える'
  }, 3000)
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
          @click="checkUser(user.name, user.slack_member_id)"
        >
          <div class="HomeBody__UserInfoDelimiter">
            <img
              :src="user.slack_profile_image"
              alt="slackのプロフィール画像"
              class="HomeBody__Image"
            >
            <span class="HomeBody__Item">{{ user.name }}</span>
          </div>
          <img
            v-if="selectedUsers.has(user.name)"
            src="@/assets/img/check-icon.png"
            alt="チェック画像"
            class="HomeBody__Image"
          >
        </div>
      </div>
      <p
        v-if="validationResult.to"
        class="HomeBody__ErrorMessage"
      >
        {{ validationResult.to[0] }}
      </p>
    </div>
    <div class="HomeBody__TextAreaWrapper">
      <textarea
        v-model="message"
        class="HomeBody__TextArea"
        placeholder="感謝の言葉を入力してください"
      />
      <p
        v-if="validationResult.message"
        class="HomeBody__ErrorMessage"
      >
        {{ validationResult.message[0] }}
      </p>
    </div>
    <button
      class="HomeBody__SubmitButton"
      :disabled="isLoading"
      :class="{ 'HomeBody__SubmitButton--Disabled': isLoading }"
      @click="submitMessage"
    >
      <template v-if="isLoading">
        送信中...
      </template>
      <template v-else>
        <img
          src="@/assets/img/love-icon.png"
          alt="いいね画像"
          class="HomeBody__Image"
        >
        {{ successMessage }}
      </template>
    </button>
  </div>
</template>

<style lang="scss" scoped>
@use './style.scss';
</style>
