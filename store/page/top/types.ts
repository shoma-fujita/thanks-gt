/** DB に登録されているユーザー情報（削除されていない） */
export type registeredUserInfo = {
  /** ユニーク ID */
  uuid: number
  /** slack 名 */
  name: string
  /** slack のメンバー ID */
  slackMemberId: string
  /** slack のプロフィール画像 URL */
  slackProfileImage: string
}

/** 感謝メッセージの送信者の情報 */
export type senderUserInfo = {
  /** slack 名 */
  slackName: string
  /** slack のメンバー ID */
  slackMemberId: string
}

/** 感謝メッセージを受け取る人の情報 */
export type recipientUserInfo = {
  /** slack 名 */
  slackName: string
  /** slack のメンバー ID */
  slackMemberId: string
  /** slack のプロフィール画像 URL */
  slackProfileImage: string
}

/** 思い出の写真 */
export type memoryImage = {
  /** path */
  path: string
  /** 写真 URL */
  signedUrl: string
}

/** ホーム画面 UI State */
export type UiState = {
  /** DB に登録されているユーザー情報（削除されていない */
  registeredUserInfo: registeredUserInfo[] | null
  /** 感謝メッセージの送信者の情報 */
  senderUserInfo: senderUserInfo | null
  /** 感謝メッセージを受け取る人の情報 */
  recipientUserInfo: recipientUserInfo[]
  /** 思い出の写真 */
  memoryImage: memoryImage[]
}
