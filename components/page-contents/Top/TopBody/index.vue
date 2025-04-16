<script setup lang="ts">
import { z } from 'zod'
import { isNull } from 'es-toolkit'
import type { registeredUserInfo } from './types'
import { commonAuthApiStore } from '@/store/common/auth'
import { pageUiStore } from '@/store/page/top'
import { commonGoogleSpreadSheetsApiStore } from '@/store/common/googleSpreadSheets'

/** Supabase Client */
const client = useSupabaseClient()

/** Common Auth API */
const commonAuthApi = commonAuthApiStore()

/** Common Google Spread Sheets API */
const commonGoogleSpreadSheetsApi = commonGoogleSpreadSheetsApiStore()

/** page ui store */
const uiStore = pageUiStore()

/** ログイン中の Slack ユーザー情報 */
const slackUserInfo = commonAuthApi.slackUserInfoOrThrow()

/** ドロップダウンが開いているかどうか */
const isDropdownOpen = ref<boolean>(false)

/** ドロップダウンの参照 */
const dropdownRef = ref<HTMLElement | null>(null)

/** ユーザー選択の参照 */
const selectContentRef = ref<HTMLElement | null>(null)

/** 感謝メッセージ */
const message = ref<string>('')

/** ローディング中かどうか */
const isLoading = ref<boolean>(false)

/** 送信成功メッセージ */
const successMessage = ref<'ありがとうを伝える' | 'ありがとうを伝えました'>('ありがとうを伝える')

/** Storage に保管している fileNames */
const fileNames = [
  'item',
  'item2',
  'item3',
  'item4',
]

/** エラーメッセージの状態 */
const errorMessages = ref<{ recipientUserInfo: string, thanksMessage: string }>({
  recipientUserInfo: '',
  thanksMessage: '',
})

// recipientUser のスキーマ
const recipientUserInfoSchema = z.object({
  slackName: z.string(),
  slackMemberId: z.string(),
  slackProfileImage: z.string(),
})

/** バリデーションスキーマの定義 */
const validationSchemas = {
  recipientUserInfo: z.array(recipientUserInfoSchema).nonempty({ message: '感謝を伝える相手を選択してください' }),
  thanksMessage: z.string().min(1, { message: '感謝メッセージを入力してください' }),
}

await useAsyncData('users-upsert', async () => {
  await client.from('users').upsert(
    {
      uuid: slackUserInfo.userId,
      name: slackUserInfo.slackName,
      slack_member_id: slackUserInfo.memberId,
      slack_profile_image: slackUserInfo.profileImageUrl,
    },
    { onConflict: 'uuid' },
  )

  const { data } = await client.from('users').select() as { data: registeredUserInfo[] }
  if (!isNull(data)) {
    const transformedData = data.map(userInfo => ({
      uuid: userInfo.uuid,
      name: userInfo.name,
      slackMemberId: userInfo.slack_member_id,
      slackProfileImage: userInfo.slack_profile_image,
    }))
    // 登録済みのユーザー情報を更新
    uiStore.updateRegisteredUserInfo(transformedData)
  }
  // ログイン中のユーザー情報を更新
  uiStore.updateSenderUserInfo({ slackName: slackUserInfo.slackName, slackMemberId: slackUserInfo.memberId })
})

await useAsyncData('fetch-memory-image', async () => {
  const { data } = await client.storage.from('memory-image').createSignedUrls(fileNames, 60 * 60)
  if (!isNull(data)) {
    const transformedData = data.map((item: { path: string | null, signedUrl: string }) => ({
      path: item.path ?? item.signedUrl,
      signedUrl: item.signedUrl,
    }))
    uiStore.updateMemoryImage(transformedData)
  }
})

/** 登録済みのユーザー情報 */
const registeredUserInfo = uiStore.registeredUserInfo.value

/** 送信者のユーザー情報 */
const senderUserInfo = uiStore.senderUserInfo.value

/** 選択中のユーザー情報 */
const recipientUserInfo = uiStore.recipientUserInfo

/** 思い出の写真一覧 */
const memoryImages = uiStore.memoryImage

/** ドロップダウンの開閉 */
const toggleDropdown = () => {
  isDropdownOpen.value = !isDropdownOpen.value
}

/** ドロップダウン外のクリックを検知して閉じる処理 */
const closeDropdownWhenClickedOutside = (event: MouseEvent) => {
  if (
    (dropdownRef.value && dropdownRef.value.contains(event.target as Node))
    || (selectContentRef.value && selectContentRef.value.contains(event.target as Node))
  ) {
    return
  }

  isDropdownOpen.value = false
}

/** ユーザーの選択 */
const selectUser = (slackName: string, slackMemberId: string, slackProfileImage: string) => {
  uiStore.updateRecipientUserInfo({ slackName, slackMemberId, slackProfileImage })
}

/** 選択済みのユーザーかどうかの判定 */
const isSelectedUser = (slackMemberId: string) => {
  return recipientUserInfo.value.some((userInfo) => {
    return userInfo.slackMemberId === slackMemberId
  })
}

/** メッセージの送信 */
const submitMessage = async () => {
  const validationResults = {
    recipientUserInfo: validationSchemas.recipientUserInfo.safeParse(recipientUserInfo.value),
    thanksMessage: validationSchemas.thanksMessage.safeParse(message.value),
  }
  errorMessages.value = {
    recipientUserInfo: validationResults.recipientUserInfo.success ? '' : validationResults.recipientUserInfo.error.errors[0].message,
    thanksMessage: validationResults.thanksMessage.success ? '' : validationResults.thanksMessage.error.errors[0].message,
  }
  if (errorMessages.value.recipientUserInfo || errorMessages.value.thanksMessage) {
    return
  }
  isLoading.value = true

  /** 選択中のユーザー名の文字列 */
  const recipientUserNameText = uiStore.recipientUserInfo.value.map(user => user.slackName).join(', ')

  /** 選択中のユーザーのメンバー ID の文字列 */
  const recipientUserMemberIdText = uiStore.recipientUserInfo.value.map(user => user.slackMemberId).join(', ')

  const payload = {
    from: senderUserInfo.slackName,
    fromMemberId: senderUserInfo.slackMemberId,
    to: recipientUserNameText,
    toMemberIds: recipientUserMemberIdText,
    message: message.value,
  }

  // Google Spread Sheets に感謝情報を追加
  await commonGoogleSpreadSheetsApi.addThanksInfoToGoogleSpreadSheets(payload)

  isLoading.value = false
  uiStore.clearRecipientUserInfo()
  message.value = ''
  isDropdownOpen.value = false
  successMessage.value = 'ありがとうを伝えました'
  setTimeout(() => {
    successMessage.value = 'ありがとうを伝える'
  }, 3000)
}

onMounted(() => {
  document.addEventListener('click', closeDropdownWhenClickedOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', closeDropdownWhenClickedOutside)
})
</script>

<template>
  <div class="TopBody">
    <div class="TopBody__SecondaryContent">
      <img
        v-for="(memoryImage, index) in memoryImages"
        :key="memoryImage.path"
        :src="memoryImage.signedUrl"
        class="TopBody__Image TopBody__Image--Huge TopBody__Image--Slide TopBody__Image--SmallRadius"
        :style="{ '--index': index }"
      >
    </div>
    <div class="TopBody__MainContent">
      <div class="TopBody__MainContentHead">
        <div class="TopBody__TitleDelimiter">
          <img
            src="@/assets/img/cherry-blossoms-icon.png"
            alt="桜の画像"
            class="TopBody__Image TopBody__Image--Large"
          >
          <h1 class="TopBody__Title">
            ありがとうを伝える
          </h1>
        </div>
        <p class="TopBody__Description">
          送信したメッセージは、平日毎日 18:00 に slack に通知します
        </p>
      </div>
      <div class="TopBody__HeadContent">
        <div class="TopBody__DropDownContent">
          <div
            class="TopBody__DropDown"
          >
            <template v-if="recipientUserInfo[0]">
              <div
                v-for="recipientUser in recipientUserInfo"
                :key="recipientUser.slackMemberId"
                class="TopBody__DropDownUserInfoDelimiter"
              >
                <img
                  :src="recipientUser.slackProfileImage"
                  alt="slackのプロフィール画像"
                  class="TopBody__Image TopBody__Image--Medium TopBody__Image--MediumRadius"
                >
                <span class="TopBody__DropDownItem">{{ recipientUser.slackName }}</span>
                <img
                  src="@/assets/img/cancel-icon.png"
                  alt="キャンセルの画像"
                  class="TopBody__DropDownImage TopBody__Image TopBody__Image--Medium TopBody__Image--MediumRadius"
                  @click.stop="selectUser(recipientUser.slackName, recipientUser.slackMemberId, recipientUser.slackProfileImage)"
                >
              </div>
            </template>
            <button
              ref="dropdownRef"
              class="TopBody__DropDownButton"
              type="button"
              @click="toggleDropdown"
            >
              相手を選択
            </button>
          </div>
        </div>
        <div
          v-if="isDropdownOpen"
          ref="selectContentRef"
          class="TopBody__SelectContent"
        >
          <div
            v-for="user in registeredUserInfo"
            :key="user.uuid"
            class="TopBody__SelectItemList"
            @click="selectUser(user.name, user.slackMemberId, user.slackProfileImage)"
          >
            <div class="TopBody__SelectUserInfoDelimiter">
              <img
                :src="user.slackProfileImage"
                alt="slackのプロフィール画像"
                class="TopBody__Image TopBody__Image--Large TopBody__Image--MediumRadius"
              >
              <span class="TopBody__SelectItem">{{ user.name }}</span>
            </div>
            <img
              v-if="isSelectedUser(user.slackMemberId)"
              src="@/assets/img/check-icon.png"
              alt="選択済みの画像"
              class="TopBody__Image TopBody__Image--Medium"
            >
          </div>
        </div>
      </div>
      <p
        v-if="errorMessages.recipientUserInfo"
        class="TopBody__ErrorMessage"
      >
        {{ errorMessages.recipientUserInfo }}
      </p>
      <div class="TopBody__TextContent">
        <textarea
          v-model="message"
          class="TopBody__Text"
          placeholder="感謝の言葉を入力"
        />
      </div>
      <p
        v-if="errorMessages.thanksMessage"
        class="TopBody__ErrorMessage"
      >
        {{ errorMessages.thanksMessage }}
      </p>
      <button
        class="TopBody__SubmitButton"
        :disabled="isLoading"
        :class="{ 'TopBody__SubmitButton--Disabled': isLoading }"
        @click="submitMessage"
      >
        <template v-if="isLoading">
          送信中...
        </template>
        <template v-else>
          <img
            src="@/assets/img/love-icon.png"
            alt="いいね画像"
            class="TopBody__Image TopBody__Image--Medium"
          >
          {{ successMessage }}
        </template>
      </button>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@use './style.scss';
</style>
