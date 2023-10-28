import express from 'express'
import morgan from 'morgan'
import pkg from '../package.json'

import { create_roles } from './libs/initialSetup'
import authRoutes from './routes/auth.routes'
import userRoutes from './routes/user.routes'

import cors from 'cors'; // Import the cors package


const app = express()
//create_roles()

app.set('pkg', pkg)
app.use(morgan('dev'))
app.set("json spaces", 4);

app.use(cors()); // Enable CORS for all routes

app.get('/', (req, res) => {
    res.json({
        name: app.get('pkg').name,
        author: app.get('pkg').author,
        description: app.get('pkg').description,
        version: app.get('pkg').version
    })
})

app.use( express.json() )
app.use( express.urlencoded({extended:false}) )

app.use('/users', userRoutes)
app.use('/auth', authRoutes)

export default app