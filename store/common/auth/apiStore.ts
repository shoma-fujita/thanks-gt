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
      googleUserInfo: null,
    }
  })
  const getters = {
    /**
     * Google ユーザー情報を取得する
     * @returns Google ユーザー情報
     */
    googleUserInfoOrThrow(): string {
      if (isNull(_state.value.googleUserInfo)) {
        throw new Error('googleUserInfo is null')
      }
      return _state.value.googleUserInfo
    },
  }
  const actions = {
    /**
     * ログインした Google アカウント情報を更新する
     */
    async updateGoogleUserInfo(userName: string | null) {
      _state.value.googleUserInfo = userName
    },
  }
  return {
    ...getters,
    ...actions,
  }
}
