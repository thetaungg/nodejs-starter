import { NextFunction, Response } from "express";

import { IUserAuthRequest } from "@/interfaces/user.interface";
import User from "@/models/user.model";

const passwordResetAuth = async (req: IUserAuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
        const user = await User.findOne({ passwordResetToken: req.params.token })
            .where("passwordResetTokenExpiresAt")
            .gt(Date.now());

        if (!user) {
            throw new Error("Token expired or invalid");
        }

        req.token = req.params.token;
        req.user = user;
        next();
    } catch (e) {
        res.status(401).send("Token expired or invalid");
    }
};

export default passwordResetAuth;
