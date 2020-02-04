import Mongoose from 'mongoose'

export const posSchema = Mongoose.Schema({
    symbol: String,
    max_price: Number,
    max_plpc: Number,
    created: Date
})

let posModel = Mongoose.model('Position', posSchema)

export default posModel 