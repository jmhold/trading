import Mongoose from 'mongoose'

export const msgSchema = Mongoose.Schema({
    id: Number,
    body: String,
    symbols: [],
    created: Date
})

let msgsModel = Mongoose.model('Message', msgSchema)

export default msgsModel 