import _ from 'lodash'
import {
    db,
    stkAPI,
    STKTWTS_API_ACCESS_TOKEN
} from './exports'
import {alp} from './alpaca'
import {alerts} from './lib/alerts'

let following = db.get('following')


export const stk = {
    async init() {
        console.log('StockTwits Init')      
        // await this.getFollowing()
        await this.seedUser() // This is here until better message searching can be achieved
        this.getMessages()
        following.write();
        
    },
    async seedUser() { // This is here until better message searching can be achieved
        console.log('Seed User')
        try {
            const response = await stkAPI.get('streams/user/' + 1702156 + '.json')
            const user = response.data.user
            
            if(!following.find({id: user.id}).value())
            {
                following.push(
                    {
                        id: user.id,
                        name: user.username,
                        messages: [],
                        latestMsgId: 0
                    }
                ).write()
            }
        } catch (error) {
            console.log(error)
        }
    },
    async getFollowing() {
        let response = null;
        try {
            response = await stkAPI.get(
                'graph/following.json',
                {
                    params: {
                        access_token: STKTWTS_API_ACCESS_TOKEN
                    }
                })
        } catch (error) {
            console.log(error)
        }

        let followedUsers = response.data.users
        for(let i in followedUsers)
        {
            if(!following.find({id: followedUsers[i].id}).value())
            {
                following.push(
                    {
                        id: followedUsers[i].id,
                        name: followedUsers[i].username,
                        messages: []
                    }).write()
            }
        }
    },
    async getMessages(){
        const users = following.value()
        
        for(let i in users)
        {
            try {
                console.log('Getting new messages from StockTwits for: ' + users[i].name)
                const msgParams = users[i].messages.length ? 
                    { since: users[i].latestMsgId } : 
                    {}
                const response = await stkAPI.get('streams/user/' + users[i].id + '.json',
                    {
                        params: msgParams
                    })
                if(response && response.data && response.data.messages)
                {
                    if(this.pruneMessages(users[i].id, response.data.messages))
                    {
                        alp.newMsgs(users[i].id, users[i].latestMsgId)
                    }
                }
            } catch (error) {
                console.log(error)
            }
        }
    },
    pruneMessages(userID, msgs) {
        const user = following.find({id: userID})
        const alertIndex = _.findIndex(alerts, {id: userID})
        const buyAlert = alertIndex >= 0 ? alerts[alertIndex].alert : alerts[0].alert
        let newAlerts = false
        console.log('Running Prune Messages')
        for(let i in msgs)
        {
            if(
                msgs[i].body.match(buyAlert) 
                && msgs[i].symbols 
                && user.get('messages').find({id: msgs[i].id}).value() == undefined
            )
            {
                newAlerts = true
                following.find({id: userID})
                    .get('messages')
                    .push({
                        id: msgs[i].id,
                        body: msgs[i].body,
                        symbols: msgs[i].symbols,
                        created: msgs[i].created_at
                    }).write()
            }
        }
        return newAlerts
    }
}
