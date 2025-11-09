import express from "express"
import cors from "cors"

const app = express()

app.use(cors())

app.use(express.json())
app.use(cookieParser())

// Routes 
import userRouter from "./routes/user.routes"
import cookieParser from "cookie-parser"

app.use("/api/v1/users", userRouter)

export { app }
