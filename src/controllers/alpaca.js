import _ from 'lodash'
import Alpaca from '../lib/alpaca.sdk'
import Polygon from '../lib/polygon.api'
import Position from '../models/positions.model'
import { APCA_API_KEY } from '../lib/alpaca.vars' 
import {
  utils
} from '../lib/exports'
import { LONG_HOLDS } from './strategies/variable'

let websocket = Alpaca.websocket

const maxDollarBuy = 10

export default {
  openOrders: null,
  positions: null,
  async init() {
     console.log('Alpaca Init')
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
      } catch (error) {
        utils.handleErrors(error)
      }
    //   self.closeSubscription(channel)
    // })
  },
  async newMsgSymbols(name, symbols) {
    this.positions = await Alpaca.getPositions()  
    for(let j in symbols)
    {
      if(!(_.findIndex(this.positions, {symbol: symbols[j].symbol}) > 0))
      {
        this.newOrder(symbols[j].symbol)
      }
    }
  },
  async getPositions() {
    this.positions = await Alpaca.getPositions()
    this.updatePositions()
  },
  async prunePositions() {
    let storedPositions = await Position.find({active:true})
    for(let i in storedPositions)
    {
      if(_.findIndex(this.positions, { symbol: storedPositions[i].symbol}) === -1) {
        try {
          Position.updateOne({ symbol: storedPositions[i].symbol}, { active: false })
        } catch (error) {
          console.log(error)
        }
      }
    }
  },
  async updatePositions() {
    if(!this.positions) return
    this.prunePositions()
    for(let i in this.positions)
    {
      const entry = this.positions[i].avg_entry_price
      const current = this.positions[i].current_price
      const plpc = Math.round(current/entry * 100) / 100
      let pos = null
      try {
        pos = await Position
        .findOne(
          {
            active: true,
            symbol: this.positions[i].symbol
          },
          (err, doc) => {
            if(err) { console.log(err); return }
            return doc
          }).exec()
      } catch (error) {
        console.log(error)
      }
      if(!pos) {
        pos = new Position({
          active: true,
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
      if(_.findIndex(LONG_HOLDS, this.positions[i].symbol) != -1) return
        
      let risk = 0
      if(pos.max_plpc >= 1.1)
      {
        if(pos.max_plpc >= 4)
        {
          risk = 1
        } else if(pos.max_plpc >= 2)
        {
          risk = 0.5
        } else if(pos.max_plpc >= 1.5)
        {
          risk = 0.25
        } else if(pos.max_plpc >= 1.25)
        {
          risk = 0.15
        } else {
          risk = 0.10
        }
      }
      if(plpc < .70 || (risk && (pos.max_plpc - plpc) > risk))
      {
        console.log('**********************')
        console.log('LIQUIDATE')
        console.log('**********************')
        console.log(`SYMBOL             ${this.positions[i].symbol}`)
        console.log(`RISK               ${risk}`)
        console.log(`THIS PNL PERCENT   ${plpc}`)
        console.log(`THIS PNL COND      ${plpc < .70}`)
        console.log(`MAX PNL PERCENT    ${pos.max_plpc}`)
        console.log(`MAX - PNL PERCENT  ${pos.max_plpc - plpc}`)
        console.log(`MAX COND           ${risk && (pos.max_plpc - plpc) > risk}`)
        this.liquidatePosition(this.positions[i])
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