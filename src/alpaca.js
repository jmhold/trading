import * as $ from './exports'

const Alpaca = require('@alpacahq/alpaca-trade-api')

const APCA_API_BASE_URL= 'https://paper-api.alpaca.markets'
const API_KEY = 'PKOJ3SKL2S0C8U13OXUH'
const API_SECRET = 'HWpjGn5fsfisnNCeZbl3Q/ycFO7oDce7MLW1akjG'
const PAPER = true

let alpaca = new Alpaca({
    keyId: API_KEY, 
    secretKey: API_SECRET, 
    paper: PAPER
  })

 