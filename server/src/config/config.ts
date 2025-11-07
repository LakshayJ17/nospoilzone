import dotenv from "dotenv"

dotenv.config()

interface Config {
    port : number;
    mongouri : string;
    jwtSecret : string;
}

if (!process.env.MONGO_URI){
    throw new Error("Missing required env variable: MONGO_URI")
}

if (!process.env.JWT_SECRET){
        throw new Error("Missing required env variable: JWT_SECRET")
}

export const config : Config = {
    port : Number(process.env.PORT) || 8000,
    mongouri : process.env.MONGO_URI!,
    jwtSecret : process.env.JWT_SECRET!
}