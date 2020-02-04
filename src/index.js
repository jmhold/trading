import stocktwits from './controllers/stocktwits'
import alpaca from './controllers/alpaca'

console.log('starting trade app')
stocktwits.init()
alpaca.init()

const appLoop = 
    () => {
        stocktwits.getMessages()
        alpaca.getPositions()
    }

setInterval(appLoop, 60000)
