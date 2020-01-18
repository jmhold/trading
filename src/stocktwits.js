import {https} from 'https'
import axios from 'axios'
import {db} from './exports'

const STKTWTS_API_BASE_URL= 'https://api.stocktwits.com/api/2/'

const userSeed = [
    'mrinvestorpro',
    'Michael_Hunt'
]

const STKTWTS_API_ACCESS_TOKEN= '1fe2f9e9b8b0e2dfc94bcb8fdcf3479f24d9474a'

let messageJSON
export const stk = {
    init() {
        let self = this
        let count = db.get('following').value().length
        if(!count)
        {
            for(let usr in userSeed)
            {
                console.log(self.seedUsers(usr))
                    // .then(val => {
                    //     console.log(val)
                    // })
            }
        }
    },
    async seedUsers(usr) {
        
        try {
            const response = await axios.get(STKTWTS_API_BASE_URL + 'search/users.json?q=' + usr)
            const data = response.data.results
            if(data)
            {
                if(data.length > 1)
                {
                    console.log(data)
                } else {
                    return data.id
                }
            }
        } catch (error) {
            console.log(error)
        }
        // return https.get($.STKTWTS_API_BASE_URL + 'search/users.json?q=' + usr, (resp) => {
        //     let data = ''
        
        //     // A chunk of data has been recieved.
        //     resp.on('data', (chunk) => {
        //     data += chunk
        //     });
        
        //     // The whole response has been received. Print out the result.
        //     resp.on('end', () => {
                
        //     return JSON.parse(data).messages
        //     });
        
        // }).on("error", (err) => {
        //     console.log("Error: " + err.message)
        // });
    },
    user_messages() {
        return https.get($.STKTWTS_API_BASE_URL + 'streams/user/1702156.json', (resp) => {
            let data = ''
        
            // A chunk of data has been recieved.
            resp.on('data', (chunk) => {
            data += chunk
            });
        
            // The whole response has been received. Print out the result.
            resp.on('end', () => {
                
            messageJSON = JSON.parse(data).messages
            });
        
        }).on("error", (err) => {
            console.log("Error: " + err.message)
        });
    },
    prune() {
        let user = $.db.get('users').find({ id: 1702156 })
        let messages = user.get('messages')
    
        let buyAlert = /^\$[A-Z]{2,4}( ([B,b]uying|[A,a]dding|[O,o]pening)|(.* ([B,b]uying here|[A,a]dding here|[O,o]pening here)))/g
    
        for(let i in feed)
        {
            if(feed[i].body.match(buyAlert) && feed[i].symbols && user.get('messages').find({id: feed[i].id}).value() == undefined)
            {
                
                user.get('messages').push(
                    {
                        id: feed[i].id,
                        body: feed[i].body,
                        symbol: feed[i].symbols[0].symbol,
                        created: feed[i].created_at
                    }
                ).write()
            }
        }
    }
}
