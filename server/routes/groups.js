import express from "express"
import { verifyCsrfToken } from "../middleware/verifyCsrfToken.js";
import { getCharacterGroups, makeNewRank, editRank, deleteRank, editPermission, updateRankPermissions, editEmployee, deleteEmployee} from "../controllers/groups.js"

const router = express.Router()

router.post("/getGroupData", getCharacterGroups)

router.post("/makeNewRank", verifyCsrfToken, makeNewRank)
router.post("/editRank", verifyCsrfToken, editRank)
router.post("/deleteRank", verifyCsrfToken, deleteRank)
router.post("/updateRankPermissions", verifyCsrfToken, updateRankPermissions)

router.post("/editPermission", verifyCsrfToken, editPermission)

router.post("/editEmployee", verifyCsrfToken, editEmployee)
router.post("/deleteEmployee", verifyCsrfToken, deleteEmployee)

export default router
