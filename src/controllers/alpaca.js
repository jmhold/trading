import _ from 'lodash'
import Alpaca from '../lib/alpaca.sdk'
import Polygon from '../lib/polygon.api'
import Position from '../models/positions.model'
import { APCA_API_KEY } from '../lib/alpaca.vars' 
import {
  db,
  utils
} from '../lib/exports'

let websocket = Alpaca.websocket

const maxDollarBuy = 100

export default {
  openOrders: null,
  positions: null,
  async init() {
     console.log('Alpaca Init')
     console.log('Get Positions Init')
     this.getPositions()
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
        const alpCreateOrder = await Alpaca.createOrder({
             symbol: sym,
             qty: qty,
             side: 'buy',
             type: 'market',
             time_in_force: 'day'
           }) // TODO: for extended hours must be limit order with TIF 'day'
        console.log('After createOrder call')
        console.log(alpCreateOrder)
      } catch (error) {
        utils.handleErrors(error)
      }
    //   self.closeSubscription(channel)
    // })
  },
  async newMsgSymbols(name, symbols) {
    this.positions = await Alpaca.getPositions()
    console.log('Parsing new messages for: ' + name)
      
      for(let j in symbols)
      {
        if(!(_.findIndex(this.positions, {symbol: symbols[j].symbol}) > 0))
        {
          console.log('Symbol: ' + symbols[j].symbol)
          this.newOrder(symbols[j].symbol)
        }
      }
  },
  async getPositions() {
    console.log('Get Positions')
    this.positions = await Alpaca.getPositions()
    this.updatePositions()
  },
  async updatePositions() {
    if(!this.positions) return
    for(let i in this.positions)
    {
      const entry = this.positions[i].avg_entry_price
      const current = this.positions[i].current_price
      const plpc = Math.round(current/entry * 100) / 100
      let pos = null
      try {
        pos = await Position
        .findOne(
          {symbol: this.positions[i].symbol},
          (err, doc) => {
            if(err) { console.log(err); return }
            return doc
          }).exec()
      } catch (error) {
        console.log(error)
      }
      if(!pos) {
        pos = new Position({
          symbol: this.positions[i].symbol,
          max_price: current > entry ? current : entry,
          max_plpc: plpc > 1 ? plpc : 1,
          created: new Date()
        })
      } else {
        pos.max_price = pos.max_price > current ? pos.max_price : current
        pos.max_plpc = pos.max_plpc > plpc ? pos.max_plpc : plpc
      }
      try {
        pos.save()
      } catch (error) {
        console.log(error)
      }
        
      let risk = 0.25
      if(pos.max_plpc > plpc)
      {
        if(pos.max_plpc >= 5)
        {
          risk = 0.03
        } else if(pos.max_plpc >= 4)
        {
          risk = 0.05
        } else if(pos.max_plpc >= 3)
        {
          risk = 0.08
        } else if(pos.max_plpc >= 2)
        {
          risk = 0.10
        } else if(pos.max_plpc >= 1.75)
        {
          risk = 0.13
        } else if(pos.max_plpc >= 1.5)
        {
          risk = 0.15
        } else if(pos.max_plpc >= 1.25)
        {
          risk = 0.18
        }
        if((pos.max_plpc - plpc) > risk){
          this.liquidatePosition(this.positions[i])
        }
      }
    }
  },
  async liquidatePosition(pos) {
    await Alpaca.createOrder({
      symbol: pos.symbol,
      qty: pos.qty,
      side: 'sell',
      type: 'market',
      time_in_force: 'day'
    })
  },
  closeSubscription(channel) {
     websocket.unsubscribe(channel)
  }
 }