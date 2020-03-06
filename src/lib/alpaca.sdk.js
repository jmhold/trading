import Alpaca from '@alpacahq/alpaca-trade-api'
import {
    PAPER_APCA_API_KEY,
    PAPER_APCA_API_SECRET,
    APCA_API_KEY,
    APCA_API_SECRET
} from './alpaca.vars'

// Alpaca SDK
export default new Alpaca({
                    keyId: APCA_API_KEY, 
                    secretKey:  APCA_API_SECRET, 
                    paper: false
                })

export const PaperAlpaca = 
    new Alpaca({
            keyId: PAPER_APCA_API_KEY,
            secretKey:  PAPER_APCA_API_SECRET,
            paper: true
        })