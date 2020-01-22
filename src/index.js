import {alpAPI} from './exports'
import { stk } from './stocktwits'
import { alp } from './alpaca'

console.log('starting trade app')
stk.init()
alp.init()

const appLoop = () => {
                    stk.getMessages()
                }

setInterval(appLoop, 60000)


