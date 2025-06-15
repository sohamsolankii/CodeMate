require("dotenv").config()

const express = require("express")
const cookieParser = require("cookie-parser")
const cors = require("cors")
const http = require("http")
const connectDB = require("./config/database")

const app = express()
// require("./utils/cronjob");

app.use(
	cors({
		origin: process.env.CORS_ORIGIN,
		credentials: true,
	})
)
app.use(express.json())
app.use(cookieParser())

const authRouter = require("./routes/auth")
const profileRouter = require("./routes/profile")
const requestRouter = require("./routes/request")
const userRouter = require("./routes/user")
const paymentRouter = require("./routes/payment")
const initializeSocket = require("./utils/socket")
const chatRouter = require("./routes/chat")

app.use("/api/v1/auth", authRouter)
app.use("/api/v1/profile", profileRouter)
app.use("/api/v1/request", requestRouter)	
app.use("/api/v1/user", userRouter)
app.use("/api/v1/payment", paymentRouter)
app.use("/api/v1/chat", chatRouter)

const server = http.createServer(app)
initializeSocket(server)

connectDB()
	.then(() => {
		console.log("Database connection established...")
		server.listen(process.env.PORT, () => {
			console.log(
				"Server is successfully listening on port " +
					process.env.PORT +
					"..."
			)
		})
	})
	.catch((err) => {
		console.error("Database cannot be connected!!" + err.message)
	})
