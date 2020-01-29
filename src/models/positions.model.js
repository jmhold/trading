import Mongoose from 'mongoose'

export const posSchema = Mongoose.Schema({
    asset_id: String,
    symbol: String,
    side: String, // long or short
    created: Date
})

let posModel = Mongoose.model('Position', posSchema)

export default posModel 