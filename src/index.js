import {alpAPI} from './exports'
import { stk } from './stocktwits'
import { alp } from './alpaca'


stk.init()
alp.init()

const appLoop = () => {
                    stk.getMessages()
                }

let appInterval = setInterval(appLoop, 60000)

setInterval(async () => {
    const clock = await alpAPI.get('clock');
    const now = new Date();
    if(!clock.is_open && now.getHours < 9 || now.getHours > 17)
    {
        appInterval.clearInterval()
    } else if(appInterval == undefined) {
        appInterval = setInterval(appLoop, 60000)
    }
}, (3600000/4))


