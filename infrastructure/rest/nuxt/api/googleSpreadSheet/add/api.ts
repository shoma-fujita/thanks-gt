import type { GoogleSpreadSheetsAddRequestBody } from './types'

/**
 * スプレッドシートへの追加リクエスト
 * @param {GoogleSpreadSheetsAddRequestBody} body - リクエストボディ
 * @returns {Promise<Response>} - API レスポンス
 */
export const post = (body: GoogleSpreadSheetsAddRequestBody): Promise<Response> => {
  return fetch('/api/googleSpreadSheets/add', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  })
}
