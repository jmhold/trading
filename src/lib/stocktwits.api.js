import axios from 'axios'

// StockTwits
const STKTWTS_API_BASE_URL = 'https://api.stocktwits.com/api/2/'
export const STKTWTS_API_ACCESS_TOKEN = '1fe2f9e9b8b0e2dfc94bcb8fdcf3479f24d9474a'
export default axios.create({
    baseURL: STKTWTS_API_BASE_URL
})