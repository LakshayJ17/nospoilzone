import mongoose from "mongoose"
import { DB_NAME } from "../constants"
import { config } from "../config/config"

const connectDB = async () : Promise<void> => {
    try {
        const connectionInstance = await mongoose.connect(`${config.mongouri}/${DB_NAME}`)

        console.log(`\n MONGODB CONNECTED || DB HOST : ${connectionInstance.connection.host}`)
    } catch (error) {
        console.log("Error connecting to DB : ", error)
        process.exit(1)
    }
}

export default connectDB