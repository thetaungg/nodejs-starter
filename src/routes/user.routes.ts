import { Router } from "express";
import asyncHandler from "express-async-handler";

import {
    createUser,
    deleteUser,
    forgetPassword,
    getUser,
    resetPassword,
    updateUser,
} from "@/handlers/user.handlers";
import auth from "@/middlewares/auth.middleware";
import passwordResetAuth from "@/middlewares/passwordResetAuth.middleware";

const router = Router();

/**
 * Create User
 * @route POST /users
 */
router.post("/", asyncHandler(createUser));

/**
 * Get User Object
 * @route GET /users/me
 */
router.get("/me", asyncHandler(auth), getUser);

/**
 * Update User
 * @route PATCH /users/me
 */
router.patch("/me", asyncHandler(auth), asyncHandler(updateUser));

/**
 * Delete User
 * @route DELETE /users/me
 */
router.delete("/me", asyncHandler(auth), asyncHandler(deleteUser));

/**
 * User Forget Password
 * @route POST /users/forget-password
 */
router.post("/forget-password", asyncHandler(forgetPassword));

/**
 * User Reset Password
 * @route POST /users/reset-password/:token
 */
router.post("/reset-password/:token", asyncHandler(passwordResetAuth), asyncHandler(resetPassword));

export default router;
