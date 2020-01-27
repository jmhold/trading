import Mongoose from 'mongoose'

export const msgSchema = Mongoose.Schema({
    id: Number,
    nabodyme: String,
    symbols: [String],
    created: Date
})

let msgsModel = Mongoose.model('msg', msgSchema)

export default msgsModel 