import type { UiState, registeredUserInfo, senderUserInfo, recipientUserInfo } from './types'

/**
 * ホーム画面の UI Store
 * @returns ホーム画面の UI Store
 */
export const pageUiStore = () => {
  /** State */
  const _state = useState<UiState>('page-ui-home-store', () => {
    return {
      registeredUserInfo: null,
      senderUserInfo: null,
      recipientUserInfo: null,
      thanksMessage: null,
    }
  })
  /** Getters */
  const getters = {
    /** DB に登録されているユーザー情報（削除されていない） */
    registeredUserInfo: computed<registeredUserInfo[] | null>(() => {
      return _state.value.registeredUserInfo
    }),
    /** 感謝メッセージの送信者の情報 */
    senderUserInfo: computed<senderUserInfo | null>(() => {
      return _state.value.senderUserInfo
    }),
    /** 感謝メッセージを受け取る人の情報 */
    recipientUserInfo: computed<recipientUserInfo | null>(() => {
      return _state.value.recipientUserInfo
    }),
    /** 感謝メッセージ */
    thanksMessage: computed<string | null>(() => {
      return _state.value.thanksMessage
    }),
  }
  /** Actions */
  const actions = {
    /**
     * DB に登録されているユーザー情報（削除されていない）の更新
     *
     * @param {registeredUserInfo} registeredUserInfo DB に登録されているユーザー情報（削除されていない）
     */
    updateRegisteredUserInfo(registeredUserInfo: registeredUserInfo[]): void {
      _state.value.registeredUserInfo = registeredUserInfo
    },
    /**
     * 感謝メッセージの送信者の情報の更新
     *
     * @param {senderUserInfo} senderUserInfo 感謝メッセージの送信者の情報
     */
    updateSenderUserInfo(senderUserInfo: senderUserInfo): void {
      _state.value.senderUserInfo = senderUserInfo
    },
    /**
     * 感謝メッセージを受け取る人の情報の更新
     *
     * @param {recipientUserInfo} recipientUserInfo 感謝メッセージを受け取る人の情報
     */
    updateRecipientUserInfo(recipientUserInfo: recipientUserInfo): void {
      _state.value.recipientUserInfo = recipientUserInfo
    },
    /**
     * 感謝メッセージの更新
     *
     * @param {string} message 感謝メッセージ
     */
    updateConditionName(message: string): void {
      _state.value.thanksMessage = message
    },
  }
  return {
    ...getters,
    ...actions,
  } as const
}
