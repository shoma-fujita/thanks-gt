/** 認証系の Common Auth Api State */
export type ApiState = {
  /** ログインした Slack アカウント情報 */
  slackUserInfo: {
    /** slack 名 */
    slackName: string
    /** member ID */
    memberId: string
    /** ユーザーのプロフィール画像 URL */
    profileImageUrl: string
  } | null
}
