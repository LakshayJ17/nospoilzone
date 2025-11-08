import dotenv from "dotenv"

dotenv.config()

interface Config {
    port : number;
    mongouri : string;
    accesstokensecret : string;
    accesstokenexpiry : string;
}

if (!process.env.MONGO_URI){
    throw new Error("Missing required env variable: MONGO_URI")
}

if (!process.env.ACCESS_TOKEN_SECRET){
        throw new Error("Missing required env variable: JWT_SECRET")
}

if (!process.env.ACCESS_TOKEN_EXPIRY){
    throw new Error("Missing required env vatiable : ACCESS_TOKEN_SECRET")
}

export const config : Config = {
    port : Number(process.env.PORT) || 8000,
    mongouri : process.env.MONGO_URI!,
    accesstokensecret : process.env.ACCESS_TOKEN_SECRET!,
    accesstokenexpiry :  process.env.ACCESS_TOKEN_EXPIRY
}