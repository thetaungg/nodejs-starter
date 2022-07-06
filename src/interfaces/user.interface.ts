import { Request } from "express";
import { HydratedDocument, Model, Types } from "mongoose";

export interface IUser {
    name: string;
    email: string;
    password: string;
    passwordResetToken: string;
    passwordResetTokenExpiresAt: Date;
    tokens: Types.DocumentArray<IUserToken>;
}

export interface IUserToken {
    _id: Types.ObjectId;
    token: string;
}

export interface IUserMethods {
    generateAuthToken: () => Promise<string>;
    generateResetPasswordToken: () => Promise<{ token: string; expiresAt: Date }>;
}

export interface IUserModel extends Model<IUser, {}, IUserMethods> {
    findByCredentials: (email: string, password: string) => Promise<HydratedDocument<IUser, IUserMethods>>; // static methods
}

export interface IUserAuthRequest extends Request {
    user: HydratedDocument<IUser>;
    token: string;
}
