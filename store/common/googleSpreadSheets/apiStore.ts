import type { GoogleSpreadSheetsAddRequestBody } from '@/infrastructure/rest/nuxt/api/googleSpreadSheet/add'
import { post as postGoogleSpreadSheetRequest } from '@/infrastructure/rest/nuxt/api/googleSpreadSheet/add'

/**
 * Google Spread Sheets 系の API Store
 * @returns Google Spread Sheets 系の API Store
 */
export const commonGoogleSpreadSheetsApiStore = () => {
  const actions = {
    /**
     * googleSpreadSheets に感謝メッセージの情報を追加する
     */
    async addThanksInfoToGoogleSpreadSheets(body: GoogleSpreadSheetsAddRequestBody) {
      await postGoogleSpreadSheetRequest(body)
    },
  }
  return {
    ...actions,
  }
}
