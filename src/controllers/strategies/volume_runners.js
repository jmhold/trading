
import _ from 'lodash'
import "core-js"
import "regenerator-runtime/runtime"
import { polygonSDK } from '../../lib/polygon.api'
import alpacaSdk, { PaperAlpaca } from '../../lib/alpaca.sdk'
import Comparisons from '../../lib/utils'

// import Alpaca from '../../lib/alpaca.sdk'

const Symbol = {
    symbol: null,
    price: null,
    highOfDay: null,
    openOfDay: null,
    currentVolume: null,
    addedStrategies: [],
    averageVolume: null,
    entries: [],
    exits: [],
    poller: null,
    async update(self) {
        try{
            if(!self.symbol) return
            let response = await polygonSDK.snapshot(self.symbol)
            self.price = response.data.ticker.lastTrade['p']
            self.highOfDay = response.data.ticker.day['h']
            self.openOfDay = response.data.ticker.day['o']
            self.currentVolume = response.data.ticker.day['v']
        } catch (err) {
            console.log(err)
        }
        if(self.addedStrategies.length) {
            for(let strategy of self.addedStrategies) {
                self.lookforExit(strategy)
            }
        }
    },
    async getAverageVolume(period) {
        period = period || 40
        period = period + (Math.ceil(period/7)*2) // Fuzzy math here to account for weekends
        
        let to = new Date()
        let from = new Date()
        from.setDate(to.getDate()-period)

        let dailyBars, totalVolume = 0
        try {
            let response = await polygonSDK.dailyAgg(this.symbol, from.getTime(), to.getTime())
            dailyBars = response.data.results
            if(!dailyBars) return
            for(let bar of dailyBars) {
                totalVolume += bar['v']
            }
            return Math.floor(totalVolume/period)
        } catch (err) {
            console.log(err)
        }
    },
    async setAverageVolume() {
        if(this.averageVolume.then && typeof this.averageVolume.then === 'function') {
            await this.averageVolume
                .then(val => this.averageVolume = val)
        }
    },
    get relativeVolume() {
        return this.currentVolume/this.averageVolume
    },
    get isHOD() {
        return this.price > this.highOfDay*.99
    },
    get position() {
        return 0
        // return (async () => {
        //     try{
        //         return await PaperAlpaca.getPosition(this.symbol)
        //     } catch (err) {
        //         console.log(err)
        //         return null
        //     }
        // })()
    },
    async makeOrder(qty, side) {
        try {
            return await PaperAlpaca.createOrder({
                symbol: this.symbol,
                qty,
                side,
                type: 'market',
                time_in_force: 'day'
              }) // TODO: for extended hours must be limit order with TIF 'day'
        } catch (err) {
            console.log(err)
            return null
        }
    },
    lookForEntry(strategy) {
        const entries = strategy.triggers.entry
        for(let key in entries) {
            const value = typeof entries[key].value === 'string' ? this[entries[key].value] : entries[key].value
            if(!Comparisons.compare(entries[key].condition, this[key], value)) return
        }
        console.log(`Adding ${this.symbol} to ${strategy.name}`)
        this.addedStrategies.push(strategy)
        this.addEntry()
    },
    lookforExit(strategy) {
        const exits = strategy.triggers.exit
        for(let key in exits) {
            const value = typeof exit[key].value === 'string' ? this[value] : exit[key].value
            if(!Comparisons.compare(exit[key].condition, this[key], value)) return
        }
        console.log(`Closing ${this.symbol} to ${strategy.name}`)
        this.addedStrategies.filter(item => item.name != strategy.name)
        this.addExit()
    },
    async addEntry(costBasis) {
        try {
            let side = 'buy'
            let qty = Math.floor(costBasis/this.price)

            let order = await makeOrder(qty, side)
            if(order && order.status === 'filled') {
                this.entries.push({
                    dateTime: new Date(),
                    price: order.filled_avg_price,
                    qty
                })
                this.startPolling(1000)
                return true
            } else {
                return false
            }
        } catch (err) {
            console.log(err)
        }
        
    },
    async addExit() {
        try{
            let side = 'sell'
            let position = positions.find(sym => sym.symbol === this.symbol)
            let qty = position.qty
            let order = await makeOrder(qty, side)

            if(order && order.status == 'filled') {
                this.exits.push({
                    dateTime: new Date(),
                    entryPrice: position.avg_entry_price, // bought at
                    exitPrice: order.filled_avg_price, // sold at
                    qty
                })
            }
        } catch (err) {
            console.log(err)
        }
    },
    startPolling(delay) {
        delay = delay || 10000
        
        if(this.poller) {this.stopPolling()}
        
        this.poller = setInterval(() => this.update(this), delay)
    },
    stopPolling() {
        clearInterval(this.poller)
    },
    async init(symbol) {
        this.symbol = symbol
        try {
            this.averageVolume = this.getAverageVolume()
        } catch (err) {
            console.log(err)
        }
    },
}

const pdtCash = 25000,
minPrice = 1,
maxPrice = 10,
minAverageVolume = 250000,
costBasis = 1000

let cash = 30000,
tradableSymbols = [],
positions

let VolumeRunnerStrategy = {
    scanner: null,
    strategy: {
        name: 'VolumeRunner',
        triggers: {
            entry: [
                {relativeVolume:    {condition: 'gte', value: 1}},
                {isHOD:             {condition: 'is', value: true}},
            ],
            exit: [
                {price: {condition: 'lt', value: 'highOfDay'}}
            ]
        }
    },
    async createTradableSymbols() {
        let polyTickers, alpTickers
        let averageVolumePromises = []
        
        try{
            console.log('Getting current ticker data...')
            let response = await polygonSDK.allTickers()
            polyTickers = response.data
        } catch (err) {
            console.log(err)
        }
        console.log('Success.')
        
        try{
            console.log('Getting current asset data...')
            alpTickers = await PaperAlpaca.getAssets()
        } catch (err) {
            console.log(err)
        }
        console.log('Success.')
        console.log('Filtering symbols...')
        for(let ticker of polyTickers.tickers) {
            let index = alpTickers.findIndex((el) => el.symbol == ticker.ticker)
            if(
                index > -1 && 
                alpTickers[index].tradable &&
                ticker.lastTrade['p'] >= minPrice &&
                ticker.lastTrade['p'] <= maxPrice &&
                ticker.prevDay['v'] >= 200000 // TODO: This number isn't based on anything
            ) {
                let newSymbol = _.cloneDeep(Symbol)
                try {
                    newSymbol.init(alpTickers[index].symbol)
                } catch (err) {
                    console.log(err)
                }
                averageVolumePromises.push(newSymbol.averageVolume)
                tradableSymbols.push(newSymbol)
            }
        }
        
        await Promise.all(averageVolumePromises)
        for(let symbol of tradableSymbols) {
            try {
                await symbol.setAverageVolume()
                if(symbol.averageVolume >= minAverageVolume) {
                    symbol.startPolling()
                }
            } catch (err) {
                console.log(err)
            }
        }
        console.log('Success.')
    },
    get tradableFunds() {
        return cash - pdtCash
    },
    async symbolScanner(self) {
        if(self.tradableFunds < costBasis) return
        try {
            let response = await alpacaSdk.getClock()
            if(!response.is_open) {
                console.log('NOT OPEN')
                return
            }
        } catch (err) {
            console.log(err)
        }
        console.log(`Scanning for ${self.strategy.name}`)
        for(let symbol of tradableSymbols) {
            symbol.lookForEntry(self.strategy)
        }
        console.log('Finished scanning for Volume Runners')
    },
    async init() {
        await this.createTradableSymbols()
        this.scanner = setInterval(() => this.symbolScanner(this), 3000)
    },
}

setInterval(async () => {
    try {
        positions = await alpacaSdk.getPositions()
    } catch (err) {
        console.log(err)
    }
}, 1000)

VolumeRunnerStrategy.init()


// const strategy = {
//     volume_runner: {
//         name:                       'volume_runner',
//         properties: {
//             symbols:                '',             // Array of symbol objects
//             status:                 'out',          // Should be either in or out
//             previous_trigger:       null,           // Should be either 'first_entry' or the price that triggered the action
//         },
//         screen_conditions: {
//             min_price: .5,
//             maxPrice: 5
//         },
//         triggers: {
//             first_entry: {
//                 price:              {condition: 'lte', value: 1},
//                 relative_volume:    {condition: 'gte', value: 1},
//                 average_volume:     {condition: 'gte', value: 250000},
//                 high_of_day:        'true'
//             },
//             exit: {
//                 price: {condition: 'lte', value: 'max_price - 0.1'} // '-0.1'
//             },
//             entry: {
//                 price: {condition: 'gte', value: 1},
//             },
//         },
//     }
// }

// const symbol = {
//     ticker: '',
//     price: 0,
//     max_price: 0,
//     in_at: 0,
//     out_at: 0,
//     dip: 0
// }