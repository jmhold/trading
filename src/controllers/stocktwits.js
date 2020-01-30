import _ from 'lodash'
import {
    STKTWTS_API_ACCESS_TOKEN,
    utils
} from '../lib/exports'
import User from '../models/users.model'
import Msg from '../models/messages.model'
import StkTwts from '../lib/stocktwits.api'
import alpaca from './alpaca'
import {alerts} from '../lib/alerts'

export default {
    async init() {
        console.log('StockTwits Init')      
        // await this.getFollowing()
        await this.seedUser() // This is here until better message searching can be achieved
        this.getMessages()
        // following.write();
        
    },
    async seedUser() { // This is here until better message searching can be achieved
        console.log('Seed User')
        try {
            const response = await StkTwts.get('streams/user/' + 1702156 + '.json')
            const user = response.data.user
            // console.log(user)
            let existingUser = null
            await User
                    .findOne(
                        {id: user.id},
                        (err, doc) => {
                            // console.log(doc)
                            existingUser = doc
                        }).exec()
            
            if(!existingUser)
            {
                const newUser = new User({
                    id: user.id,
                    name: user.username,
                    messages: [],
                    latestMsgId: 0
                })
                try {
                    console.log('Saving')
                    newUser.save()
                } catch (error) {
                    console.log(error)
                }
            }
        } catch (error) {
            utils.handleErrors(error)
        }
    },
    // async getFollowing() { TODO: Needs refactoring
    //     let response = null;
    //     try {
    //         response = await StkTwts.get(
    //             'graph/following.json',
    //             {
    //                 params: {
    //                     access_token: STKTWTS_API_ACCESS_TOKEN
    //                 }
    //             })
    //     } catch (error) {
    //         utils.handleErrors(error)
    //     }

    //     let followedUsers = response.data.users
    //     for(let i in followedUsers)
    //     {
    //         if(!following.find({id: followedUsers[i].id}).value())
    //         {
    //             following.push(
    //                 {
    //                     id: followedUsers[i].id,
    //                     name: followedUsers[i].username,
    //                     messages: []
    //                 }).write()
    //         }
    //     }
    // },
    async getMessages(){
        const users = 
            await User
                    .find(
                        {},
                        (err, doc) => {
                            return doc
                            // console.log(doc)
                            // existingUser = doc
                        }).exec()
        // console.log(users)
        for(let i in users)
        {
            // console.log(users[i])
            // console.log(users[i].latestMsgId)
            console.log('Getting new messages from StockTwits for: ' + users[i].name)
            console.log('latestMsgId: ' + users[i].latestMsgId)
            const msgParams = users[i].messages.length > 0 ? 
                { since: users[i].latestMsgId } : 
                {}
            try {
                const response = await StkTwts.get('streams/user/' + users[i].id + '.json',
                    {
                        params: msgParams
                    })
                if(response && response.data && response.data.messages)
                {
                    // console.log(response.data.messages)
                    this.pruneMessages(users[i].id, response.data.messages)
                }
            } catch (error) {
                utils.handleErrors(error)
            }
        }
    },
    async pruneMessages(userID, msgs) {
        
        const userDoc = await User.findOne({id: userID}, (err, doc) => doc).exec()
        if(!userDoc) {
            console.log('Prune Msgs couldn\'t find user id: ' + userId)
            return
        }
        const msgDocs = userDoc.messages
        const alertIndex = _.findIndex(alerts, {id: userID})
        const buyAlert = alertIndex >= 0 ? alerts[alertIndex].alert : alerts[0].alert
        let newAlerts = false
        console.log('Running Prune Messages')
        for(let i in msgs)
        {
            const msgDoc = _.findIndex(msgDocs, {id: msgs[i].id})
            // console.log('*****MSG BODY*****')
            // console.log(msgs[i].body)
            // console.log('*****RGEX MATCH*****')
            // console.log(msgs[i].body.match(buyAlert) )
            // console.log("Find existing doc: " + msgDoc)
            // await msgDocs.findOne({id: msgs[i].id}, (err, doc) => doc).exec()
            if(
                msgs[i].body.match(buyAlert) 
                && msgs[i].symbols 
                && !msgDoc >= 0
            )
            {
                newAlerts = true
                console.log("Adding Msg:")
                console.log(msgs[i].body)

                msgDocs.push(new Msg({
                    id: msgs[i].id,
                    body: msgs[i].body,
                    symbols: msgs[i].symbols,
                    created: msgs[i].created_at
                }))
                userDoc.latestMsgId = 
                    msgs[i].id > userDoc.latestMsgId ? 
                    msgs[i].id : userDoc.latestMsgId
                alpaca.newMsgSymbols(userDoc.name, msgs[i].symbols)
            }
        }
        await userDoc.save()
    }
}
