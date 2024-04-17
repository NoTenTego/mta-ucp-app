import Express from "express"
const app = Express()
import cors from "cors"
import cookieParser from "cookie-parser"
import dotenv from "dotenv"

//Routes
import tokenRoutes from "./routes/token.js"
import accountsRoutes from "./routes/accounts.js"
import authRoutes from "./routes/auth.js"
import dashboardRoutes from "./routes/dashboard.js"
import charactersRoutes from "./routes/characters.js"
import adminRoutes from "./routes/admin.js"
import helpdeskRoutes from "./routes/helpdesk.js"
import groupRoutes from "./routes/groups.js"

dotenv.config()

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Credentials", true)
  res.header("Access-Control-Allow-Origin", process.env.API_ORIGIN || "https://avalon-rp.pl")
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization")
  next()
})

app.use(Express.json())

app.use(
  cors({
    optionsSuccessStatus: 200,
    credentials: true,
    origin: process.env.API_ORIGIN || "https://avalon-rp.pl",
  })
)
app.use(cookieParser())

app.use("/api/token", tokenRoutes)
app.use("/api/accounts", accountsRoutes)
app.use("/api/auth", authRoutes)
app.use("/api/dashboard", dashboardRoutes)
app.use("/api/characters", charactersRoutes)
app.use("/api/admin", adminRoutes)
app.use("/api/helpdesk", helpdeskRoutes)
app.use("/api/groups", groupRoutes)

app.listen(8800, () => {
  console.log("API working!")
})
