// LowDB
const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')
const adapter = new FileSync('db.json')
export const db = low(adapter)
db.defaults({ following: [] }).write()


// API Connections
import axios from 'axios'

// StockTwits
const STKTWTS_API_BASE_URL= 'https://api.stocktwits.com/api/2/'
export const STKTWTS_API_ACCESS_TOKEN= '1fe2f9e9b8b0e2dfc94bcb8fdcf3479f24d9474a'
export const stkAPI = axios.create({
    baseURL: STKTWTS_API_BASE_URL
})

// Alpaca API
const APCA_API_BASE_URL= 'https://paper-api.alpaca.markets/v2/'
const APCA_API_KEY = 'PKOJ3SKL2S0C8U13OXUH'
const APCA_API_SECRET = 'HWpjGn5fsfisnNCeZbl3Q/ycFO7oDce7MLW1akjG'
export const alpAPI = axios.create({
    baseURL: APCA_API_BASE_URL,
    headers: {
        "APCA-API-KEY-ID": APCA_API_KEY,
        "APCA-API-SECRET-KEY": APCA_API_SECRET
    }
})

// Alpaca SDK
import Alpaca from '@alpacahq/alpaca-trade-api'
const PAPER = true
export const alpaca = new Alpaca({
    keyId: APCA_API_KEY, 
    secretKey: APCA_API_SECRET, 
    paper: PAPER
  })

