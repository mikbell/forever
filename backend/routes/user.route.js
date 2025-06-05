import express from "express";
import {
	register,
	login,
	adminLogin,
	logout,
} from "../controllers/user.controller.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/admin", adminLogin);
router.post("/logout", logout);

export default router;
