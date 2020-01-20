import _ from 'lodash'
import {
  db,
  alpaca
} from './exports'

let websocket = alpaca.websocket

let following = db.get('following')

const maxDollarBuy = 100

 export const alp = {
   openOrders: null,
   async init() {
     this.openOrders = await alpaca.getOrders({status: 'open'})
     console.log(this.openOrders)
   },
   async newOrder(sym) {
    if(await alpaca.getAccount().cash < maxDollarBuy) return
    const self = this
    const channel = 'T.' + sym
    websocket.connect()
    websocket.subscribe(channel)
    websocket.onStockTrades(async data => {
      const qty = Math.floor(maxDollarBuy/data.p, 0)
      await alpaca.createOrder({
           symbol: sym,
           qty,
           side: 'buy',
           type: 'market',
           time_in_force: 'ioc'
         }) // TODO: for extended hours must be limit order with TIF 'day'
      self.closeSubscription(channel)
    })
   },
   async newMsgs(userID, since) {
    const user = following.find({id: userID})
    const msgs = user.get('messages').find((o) => o.id > since).value()
    const postitions = await alpaca.getPositions()
    
    if(postitions.legth){
      for(let i in msgs)
      {
        const sym = msgs[i].symbols
        for(let j in sym)
        {
          if(!(_.findIndex(postitions, {symbol: sym}) > 0))
          {
            this.newOrder(sym)
          }
        }
      }
    }
   },
   closeSubscription(channel) {
     websocket.unsubscribe(channel)
   }
 }