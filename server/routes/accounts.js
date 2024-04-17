import express from "express";
import { verifyCsrfToken } from "../middleware/verifyCsrfToken.js";
import { getCurrentAccount, getNotifications, changeNotification, getRecentLogins, changePassword } from "../controllers/accounts.js";

const router = express.Router();

router.post("/current", verifyCsrfToken, getCurrentAccount);
router.get("/getNotifications", verifyCsrfToken, getNotifications);
router.post("/changeNotification", verifyCsrfToken, changeNotification);

router.post("/changePassword", verifyCsrfToken, changePassword)
router.get("/getRecentLogins", verifyCsrfToken, getRecentLogins)

export default router;