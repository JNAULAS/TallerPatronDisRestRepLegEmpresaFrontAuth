
const db = require('mongoose')
db.Promise = global.Promise

async function conectar( url ) {
    await db.connect( url, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        dbname: 'ups'
    } )
    .then (() => console.log('[db] - conexion exitosa.') )
    .catch( (error) => console.error( `[db] - ${error}` ) )
}
/*
import mongoose from "mongoose"
import config from "./config"
mongoose.set('strictQuery', false)
mongoose.connect(config.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then((data) => console.log('DB se encuentra conectada.'))
    .catch((error) => console.log(error))
*/
module.exports = conectar