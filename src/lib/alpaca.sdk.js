import Alpaca from '@alpacahq/alpaca-trade-api'
import {
    APCA_API_KEY,
    APCA_API_SECRET
} from './alpaca.vars'

// Alpaca SDK
const PAPER = false
export default new Alpaca({
                    keyId: APCA_API_KEY, 
                    secretKey: APCA_API_SECRET, 
                    paper: PAPER
                })