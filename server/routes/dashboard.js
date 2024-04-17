import express from "express"
import { getAllStats, getAll, getServerStats, getTopPlayers, getServerTimestamp } from "../controllers/dashboard.js"

const router = express.Router()

router.post("/getAllStats", getAllStats)
router.get("/getAll", getAll)
router.get("/getServerStats", getServerStats)
router.get("/getTopPlayers", getTopPlayers)
router.get("/getServerTimestamp", getServerTimestamp)

export default router
