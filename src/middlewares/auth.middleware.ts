import { NextFunction, Response } from "express";
import jwt from "jsonwebtoken";

import { IUserAuthRequest } from "@/interfaces/user.interface";
import User from "@/models/user.model";
import { JWT_SECRET_KEY } from "@/utils/constants";

const auth = async (req: IUserAuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
        const token = req.header("Authorization").replace("Bearer ", ""); // bear token on the header has "Bearer " in front of it so we're removing it
        const decoded = jwt.verify(token, JWT_SECRET_KEY);
        // @ts-ignore
        const user = await User.findOne({ _id: decoded._id, "tokens.token": token }); //filtering tokens array to look for token // probably mongoose specific capability

        if (!user) {
            throw new Error();
        }
        req.token = token;
        req.user = user;
        next();
    } catch (e) {
        res.status(401).send("Please authenticate");
    }
};

export default auth;
