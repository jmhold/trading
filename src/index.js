import {alpAPI} from './exports'
import { stk } from './stocktwits'
import { alp } from './alpaca'


stk.init()
alp.init()

const appLoop = () => {
                    stk.getMessages()
                }

setInterval(appLoop, 60000)


