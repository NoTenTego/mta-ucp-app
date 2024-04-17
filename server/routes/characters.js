import express from "express"
import { verifyCsrfToken } from "../middleware/verifyCsrfToken.js";
import { getAllCharacters, getCharacterData, newCharacter, getFreeVehicles } from "../controllers/characters.js"

const router = express.Router()

router.get("/getAllCharacters", verifyCsrfToken, getAllCharacters)
router.get("/getFreeVehicles", verifyCsrfToken, getFreeVehicles)
router.post("/getCharacterData", verifyCsrfToken, getCharacterData)
router.post("/newCharacter", verifyCsrfToken, newCharacter)

export default router
