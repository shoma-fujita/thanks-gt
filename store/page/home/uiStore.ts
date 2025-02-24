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
      recipientUserInfo: [],
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
    recipientUserInfo: computed<recipientUserInfo[]>(() => {
      return _state.value.recipientUserInfo
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
      const isExist = _state.value.recipientUserInfo.some(
        (user) => {
          return user.slackMemberId === recipientUserInfo.slackMemberId
        },
      )
      if (isExist) {
        _state.value.recipientUserInfo = _state.value.recipientUserInfo.filter((user) => {
          return user.slackMemberId !== recipientUserInfo.slackMemberId
        })
      }
      else {
        _state.value.recipientUserInfo.push(recipientUserInfo)
      }
    },
  }
  return {
    ...getters,
    ...actions,
  } as const
}
