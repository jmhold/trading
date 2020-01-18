// LowDB
const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')
const adapter = new FileSync('db.json')
export const db = low(adapter)
db.defaults({ following: [] }).write()

