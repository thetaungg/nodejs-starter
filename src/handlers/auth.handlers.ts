import { Request, Response } from "express";
import { Types } from "mongoose";

import { IUserAuthRequest, IUserToken } from "@/interfaces/user.interface";
import User from "@/models/user.model";

export const loginUser = async (req: Request, res: Response): Promise<any> => {
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password); // static
        const token = await user.generateAuthToken(); // method

        return res.send({ user, token });
    } catch (e) {
        return res.status(400).send(e);
    }
};

export const logoutUser = async (req: IUserAuthRequest, res: Response): Promise<any> => {
    try {
        req.user.tokens = [
            ...req.user.tokens.filter((item) => item.token !== req.token),
        ] as Types.DocumentArray<IUserToken>;

        await req.user.save();

        return res.status(200).send();
    } catch (e) {
        return res.status(500).send();
    }
};

export const logoutAllUserSessions = async (req: IUserAuthRequest, res: Response): Promise<void> => {
    try {
        req.user.tokens = [] as Types.DocumentArray<IUserToken>;

        await req.user.save();
        res.status(200).send();
    } catch (e) {
        res.status(500).send();
    }
};
