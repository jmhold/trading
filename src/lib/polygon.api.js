import axios from 'axios'
import {APCA_API_KEY} from './alpaca.vars'

// Polygon API
const PLY_API_BASE_URL = 'https://api.polygon.io/'
export default axios.create({
                    baseURL: PLY_API_BASE_URL
                })

const Polygon = axios.create({
        baseURL: PLY_API_BASE_URL
    })

export const polygonSDK = {
    allTickers(date) {
        // return this.polygonGet(`/v2/aggs/grouped/locale/US/market/STOCKS/${date}`)
        return this.polygonGet(`/v2/snapshot/locale/us/markets/stocks/tickers`)
    },
    dailyAgg(ticker, from, to) {
        return this.polygonGet(`/v2/aggs/ticker/${ticker}/range/1/day/${from}/${to}`)
    },
    snapshot(ticker) {
        return this.polygonGet(`/v2/snapshot/locale/us/markets/stocks/tickers/${ticker}`)
    },
    polygonGet(endpoint) {
        return Polygon.get(endpoint, {
            params: {
                apiKey: APCA_API_KEY
            }
        })
    }
}