import stocktwits from './stocktwits'
import alpaca from './alpaca'

console.log('starting trade app')
stocktwits.init()
alpaca.init()

const appLoop = 
    () => {
        stocktwits.getMessages()
    }

setInterval(appLoop, 60000)


