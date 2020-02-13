// LowDB
const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')
// const adapter = new FileSync('./dist/db.json')
// export const db = low(adapter)
// db.defaults({ following: [] }).write()



// Mongo DB
// const MongoClient = require('mongodb').MongoClient;
// const uri = "mongodb+srv://jmhold:<password>@jh-algo-alpaca-92lf7.mongodb.net/test?retryWrites=true&w=majority";
// const client = new MongoClient(uri, { useNewUrlParser: true });
// client.connect(err => {
//   const collection = client.db("test").collection("devices");
//   // perform actions on the collection object
//   client.close();
// });

// Mongoose
const mongoose = require('mongoose')
if(process.env.NODE_ENV === 'prod')
{
mongoose.connect(
    'mongodb+srv://jmhold:' + 
    // process.env.MONGO_ATLAS_PW +
    "vxfivQ2onkqbOM1h" +
    '@jh-algo-alpaca-92lf7.mongodb.net/test?retryWrites=true&w=majority', 
    {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
} else {
    mongoose.connect(
        'mongodb+srv://jmhold:' + 
        // process.env.MONGO_ATLAS_PW +
        "vxfivQ2onkqbOM1h" +
        '@jh-algo-alpaca-92lf7.mongodb.net/test?retryWrites=true&w=majority', 
        {
            useNewUrlParser: true,
            useUnifiedTopology: true
        })
}

// Utils

export const utils = {
    handleErrors(error) {
        if (error.response) {
            /*
             * The request was made and the server responded with a
             * status code that falls out of the range of 2xx
             */
            console.log(error.response.status);
            console.log(error.response.headers);
        } else if (error.request) {
            /*
             * The request was made but no response was received, `error.request`
             * is an instance of XMLHttpRequest in the browser and an instance
             * of http.ClientRequest in Node.js
             */
            console.log(error.request);
        } else {
            // Something happened in setting up the request and triggered an Error
            console.log('Error', error.message);
        }
    }
}
