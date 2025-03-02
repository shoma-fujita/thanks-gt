/** DB に登録されているユーザー情報（削除されていない） */
export type registeredUserInfo = {
  /** ユニーク ID */
  uuid: number
  /** slack 名 */
  name: string
  /** slack のメンバー ID */
  slack_member_id: string
  /** slack のプロフィール画像 URL */
  slack_profile_image: string
}
