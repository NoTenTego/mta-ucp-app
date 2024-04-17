import express from "express"
import { verifyCsrfToken } from "../middleware/verifyCsrfToken.js";
import { getAllTickets, getAllAnswers, makeTicket, addAnswer, toggleTicket } from "../controllers/helpdesk.js"

const router = express.Router()

router.get("/getAllTickets", verifyCsrfToken, getAllTickets)
router.post("/getAllAnswers", verifyCsrfToken, getAllAnswers)
router.post("/makeTicket", verifyCsrfToken, makeTicket)
router.post("/addAnswer", verifyCsrfToken, addAnswer)
router.post("/toggleTicket", verifyCsrfToken, toggleTicket)

export default router
