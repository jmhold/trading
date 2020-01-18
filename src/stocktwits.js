import 'https'
import db from './exports'

const STKTWTS_API_BASE_URL= 'https://api.stocktwits.com/api/2/'


let messageJSON
let stk = {}

stk.user_search = (usr) => {
    return https.get($.STKTWTS_API_BASE_URL + 'search/users.json?q=' + usr, (resp) => {
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
}

stk.user_messages = () => {
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
}

stk.prune = () => {
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

