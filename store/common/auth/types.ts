/** 認証系の Common Auth Api State */
export type ApiState = {
  /** ログインした Slack アカウント情報 */
  slackUserInfo: SlackUserInfoGetResponse | null
}

/** Slack ユーザー情報取得 API レスポンス */
export type SlackUserInfoGetResponse = {
  /** ユーザー ID */
  userId: string
  /** slack 名 */
  slackName: string
  /** member ID */
  memberId: string
  /** ユーザーのプロフィール画像 URL */
  profileImageUrl: string
}
