import express from "express"
import { verifyCsrfToken } from "../middleware/verifyCsrfToken.js";
import { getItemlist, makeItem } from "../controllers/admin/serverManagement.js"
import { getAccounts, editAccount, getCharacters, getBusinesses } from "../controllers/admin/playersManagement.js"

const router = express.Router()

router.get("/getAccounts", verifyCsrfToken, getAccounts)
router.post("/editAccount", verifyCsrfToken, editAccount)
router.get("/getCharacters", verifyCsrfToken, getCharacters)
router.get("/getBusinesses", verifyCsrfToken, getBusinesses)

router.get("/getItemlist", verifyCsrfToken, getItemlist)
router.post("/makeItem", verifyCsrfToken, makeItem)

export default router
