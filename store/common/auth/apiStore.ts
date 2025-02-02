import { isNull } from 'es-toolkit'
import type { ApiState } from './types'

/**
 * 認証系の API Store
 * @returns 認証系の API Store
 */
export const commonAuthApiStore = () => {
  /** State */
  const _state = useState<ApiState>('common-auth-api-store', () => {
    return {
      slackUserInfo: null,
    }
  })
  const getters = {
    /**
     * Slack ユーザー情報を取得する
     * @returns Slack ユーザー情報
     */
    slackUserInfoOrThrow(): ApiState['slackUserInfo'] {
      if (isNull(_state.value.slackUserInfo)) {
        throw new Error('slackUserInfo is null')
      }
      return _state.value.slackUserInfo
    },
  }
  const actions = {
    /**
     * ログインした Slack アカウント情報を更新する
     */
    async updateSlackUserInfo(slackName: string, memberId: string) {
      _state.value.slackUserInfo = { slackName, memberId }
    },
  }
  return {
    ...getters,
    ...actions,
  }
}
