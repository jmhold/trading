// import {https} from 'https'
// import {db} from './exports'
// export let app = {
//     init: () => {
//         // seed users
//         let user = db.get('users').value().length
//         console.log(user)
//     },
//     startInterval: () => {
//         // setInterval(() => {
//             let now = new Date().getHours()
//             if(now > 8 && now < 17){
//                 https.get($.STKTWTS_API_BASE_URL, (resp) => {
//                     let data = ''
//                     // A chunk of data has been recieved.
//                     resp.on('data', (chunk) => {
//                     data += chunk
//                     });
//                     // The whole response has been received. Print out the result.
//                     resp.on('end', () => {
//                     let json = JSON.parse(data).messages
//                     start(json)
//                     });
//                 }).on("error", (err) => {
//                     console.log("Error: " + err.message)
//                 });
//             }
//         // }, 60000)
//     },
//     start: (feed) => {
//         let user = db.get('users').find({ id: 1702156 })
//         let messages = user.get('messages')
//         let buyAlert = /^\$[A-Z]{2,4}( ([B,b]uying|[A,a]dding|[O,o]pening)|(.* ([B,b]uying here|[A,a]dding here|[O,o]pening here)))/g
//         for(let i in feed)
//         {
//             if(feed[i].body.match(buyAlert) && feed[i].symbols && user.get('messages').find({id: feed[i].id}).value() == undefined)
//             {
//                 user.get('messages').push(
//                     {
//                         id: feed[i].id,
//                         body: feed[i].body,
//                         symbol: feed[i].symbols[0].symbol,
//                         created: feed[i].created_at
//                     }
//                 ).write()
//             }
//         }
//     }
// }
"use strict";