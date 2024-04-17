import express from "express";
import { getTokens } from "../middleware/verifyCsrfToken.js";

const router = express.Router();

router.post("/getTokens", getTokens);

export default router;