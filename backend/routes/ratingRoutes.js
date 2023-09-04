import express from "express";

import { isLogin } from "../middlewares/userMiddleware.js";
import { createRatings } from "../controllers/ratingController.js";

//router object
const router = express.Router();

//user creation routes | signup
router.post("/rating", createRatings);
export default router;
