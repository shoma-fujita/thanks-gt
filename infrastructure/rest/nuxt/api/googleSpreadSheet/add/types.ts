/** スプレッドーシートへの追加リクエストボディ */
export type GoogleSpreadSheetsAddRequestBody = {
  /** 感謝を送る人 */
  from: string
  /** 感謝を送る人の member id */
  fromMemberId: string
  /** 感謝を受け取る人 */
  to: string
  /** 感謝を受け取る人の member id */
  toMemberIds: string
  /** 感謝内容 */
  message: string
}
