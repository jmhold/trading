import _ from 'lodash'
import Alpaca from './lib/alpaca.sdk'
import Polygon from './lib/polygon.api'
import { APCA_API_KEY } from './lib/alpaca.vars' 
import {
  db,
  utils
} from './exports'

let websocket = Alpaca.websocket

const maxDollarBuy = 100

 export default {
   openOrders: null,
   async init() {
     console.log('Alpaca Init')
    //  this.openOrders = await Alpaca.getOrders({status: 'open'})
   },
   async newOrder(sym) {
    if(await Alpaca.getAccount().cash < maxDollarBuy) return
    const self = this
    const channel = 'T.' + sym
    // websocket.connect()
    // websocket.subscribe(channel)
    // websocket.onStockTrades(async data => {
      // const qty = Math.floor(maxDollarBuy/data.p, 0)
      try {
        const lastTrade = await 
        Polygon.get('v1/last/stocks/' + sym,
        {
          params: {
            apiKey: APCA_API_KEY
          }
        })
        const price = lastTrade.data.last.price
        const qty = Math.floor(maxDollarBuy/price, 0)
        console.log('New Order For: ' + sym + ': ' + qty + ' shares at ' + price + ' per share')
        await Alpaca.createOrder({
             symbol: sym,
             qty: qty,
             side: 'buy',
             type: 'market',
             time_in_force: 'ioc'
           }) // TODO: for extended hours must be limit order with TIF 'day'
      } catch (error) {
        utils.handleErrors(error)
      }
    //   self.closeSubscription(channel)
    // })
   },
   async newMsgSymbols(name, symbols) {
    const postitions = await Alpaca.getPositions()
    console.log('Parsing new messages for: ' + name)
      
      for(let j in symbols)
      {
        if(!(_.findIndex(postitions, {symbol: symbols[j].symbol}) > 0))
        {
          console.log('Symbol: ' + symbols[j].symbol)
          this.newOrder(symbols[j].symbol)
        }
      }
   },
   closeSubscription(channel) {
     websocket.unsubscribe(channel)
   }
 }