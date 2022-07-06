import { Request, Response } from "express";

import { IUserAuthRequest } from "@/interfaces/user.interface";
import User from "@/models/user.model";

import { sendResetPasswordTokenMail } from "../mail";

export const createUser = async (req: Request, res: Response): Promise<any> => {
    const user = new User(req.body);

    try {
        await user.save();

        return res.status(201).send({ user });
    } catch (e) {
        return res.status(400).send(e);
    }
};

export const getUser = (req: IUserAuthRequest, res: Response): void => {
    res.send(req.user); // user is provided by auth handler
};

export const updateUser = async (req: IUserAuthRequest, res: Response): Promise<any> => {
    const updates = Object.keys(req.body);
    const allowedUpdate = ["name", "email", "password"];
    const isValidOperation = updates.every((update) => allowedUpdate.includes(update));

    if (!isValidOperation) {
        return res.status(400).send({ error: "Invalid updates!" });
    }

    try {
        updates.forEach((update) => (req.user[update] = req.body[update]));
        await req.user.save(); // saving a newly updated user

        return res.send(req.user);
    } catch (e) {
        return res.status(400).send(e);
    }
};

export const deleteUser = async (req: IUserAuthRequest, res: Response): Promise<any> => {
    try {
        await req.user.remove(); //mongoose method to delete documents

        return res.send(req.user);
    } catch (e) {
        return res.status(500).send();
    }
};

export const forgetPassword = async (req: Request, res: Response): Promise<any> => {
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
        return res.status(400).send({ error: "User not found" });
    }

    try {
        const { token, expiresAt } = await user.generateResetPasswordToken();

        await sendResetPasswordTokenMail({ email: req.body.email, token });

        return res.send({ token, expiresAt });
    } catch (e) {
        return res.status(500).send();
    }
};

export const resetPassword = async (req: IUserAuthRequest, res: Response): Promise<any> => {
    if (!req.body.password) {
        return res.status(400).send({ error: "Password is required" });
    }

    try {
        req.user.password = req.body.password;
        req.user.passwordResetToken = undefined;
        req.user.passwordResetTokenExpiresAt = undefined;

        await req.user.save();

        return res.send("Password Reset Successfully");
    } catch (e) {
        return res.status(500).send();
    }
};
