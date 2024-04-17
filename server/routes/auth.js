import express from "express";
import { login, logout, register, activateAccount, resendConfirmationCode, recoveryPassword, changePassword } from "../controllers/auth.js";

const router = express.Router()

router.post("/login", login)
router.post("/logout", logout)
router.post("/register", register)
router.post("/activateAccount", activateAccount)
router.post("/resendConfirmationCode", resendConfirmationCode)
router.post("/recoveryPassword", recoveryPassword)
router.post("/changePassword", changePassword)

export default router