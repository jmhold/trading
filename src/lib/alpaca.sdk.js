import Alpaca from '@alpacahq/alpaca-trade-api'
import {
    PAPER_APCA_API_KEY,
    PAPER_APCA_API_SECRET
} from './alpaca.vars'

// Alpaca SDK
const PAPER = false
export default new Alpaca({
                    keyId: process.env.NODE_ENV === 'dev' ?  PAPER_APCA_API_KEY : APCA_API_KEY, 
                    secretKey:  process.env.NODE_ENV === 'dev' ?  PAPER_APCA_API_SECRET : APCA_API_SECRET, 
                    paper: PAPER
                })