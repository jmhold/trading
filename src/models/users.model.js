import Mongoose from 'mongoose'
import { msgSchema } from './messages.model'

const userSchema = Mongoose.Schema({
    id: Number,
    name: String,
    messages: [msgSchema],
    latestMsgId: Number
})

let usersModel = Mongoose.model('User', userSchema)

export default usersModel 