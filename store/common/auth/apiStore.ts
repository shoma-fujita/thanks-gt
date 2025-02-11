import { isNull } from 'es-toolkit'
import type { ApiState, SlackUserInfoGetResponse } from './types'

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
    slackUserInfoOrThrow(): SlackUserInfoGetResponse {
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
    async updateSlackUserInfo(userId: string, slackName: string, memberId: string, profileImageUrl: string) {
      _state.value.slackUserInfo = { userId, slackName, memberId, profileImageUrl }
    },
  }
  return {
    ...getters,
    ...actions,
  }
}
