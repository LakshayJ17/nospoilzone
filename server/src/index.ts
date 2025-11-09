import dotenv from 'dotenv'
import { app } from "./app";
import connectDB from './db/index';
import { config } from './config/config';

dotenv.config({
    path: ".env"
})

connectDB()
    .then(() => {
        app.listen(config.port, () => {
            console.log(`Server running on port ${config.port} `)

        })
    })
    .catch((error) => {
        console.log(`MONGODB CONNECTION FAILED ! : `, error)
    }) 