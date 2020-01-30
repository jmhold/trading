import axios from 'axios'
import {
    APCA_API_KEY,
    APCA_API_SECRET
} from './alpaca.vars'

// Alpaca API
export default axios.create({
                    baseURL: APCA_API_BASE_URL,
                    headers: {
                        "APCA-API-KEY-ID": APCA_API_KEY,
                        "APCA-API-SECRET-KEY": APCA_API_SECRET
                    }
                })