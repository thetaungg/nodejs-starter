import { Router } from "express";
import asyncHandler from "express-async-handler";

import { loginUser, logoutAllUserSessions, logoutUser } from "@/handlers/auth.handlers";
import auth from "@/middlewares/auth.middleware";

const router = Router();

/**
 * Login User
 * @route POST /auth/login
 */
router.post("/login", asyncHandler(loginUser));

/**
 * Logout User
 * @route POST /auth/logout
 */
router.post("/logout", asyncHandler(auth), asyncHandler(logoutUser));

/**
 * Login All of User Sessions
 * @route POST /auth/logoutAll
 */
router.post("/logoutAll", asyncHandler(auth), asyncHandler(logoutAllUserSessions));

export default router;
