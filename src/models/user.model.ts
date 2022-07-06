import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { model, Schema } from "mongoose";
import validator from "validator";

import { IUser, IUserMethods, IUserModel } from "@/interfaces/user.interface";
import { JWT_SECRET_KEY } from "@/utils/constants";

const userSchema = new Schema<IUser, IUserModel, IUserMethods>({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error("Email is invalid");
            }
        },
    },
    password: {
        type: String,
        required: true,
        trim: true,
        minlength: 8,
        validate(value) {
            if (value.toLowerCase().includes("password")) {
                throw new Error("Error, please make sure your password does not contain the word password");
            }
        },
    },
    passwordResetToken: {
        type: String,
    },
    passwordResetTokenExpiresAt: {
        type: Date,
    },
    // to track the tokens generated for the users
    tokens: [
        {
            token: {
                type: String,
                required: true,
            },
        },
    ],
});

// methods(instance methods) are for the situation where we want to edit the user object
userSchema.method("generateAuthToken", async function generateAuthToken() {
    const user = this;
    const token = jwt.sign({ _id: user._id.toString() }, JWT_SECRET_KEY);

    user.tokens = user.tokens.concat({ token });

    await user.save();

    return token;
});

userSchema.method("generateResetPasswordToken", async function generateResetPasswordToken() {
    const user = this;
    const token = jwt.sign({ _id: user._id.toString() }, JWT_SECRET_KEY);

    user.passwordResetToken = token;
    user.passwordResetTokenExpiresAt = Date.now() + 3600000; // 1 hour

    await user.save();

    return { token, expiresAt: user.passwordResetTokenExpiresAt };
});

// this method gets run when the express using JSON.stringify on this to send to the users
// we're modifying this function to remove a few user properties when express stringify this meaning send to the user
// this way we don't have to edit every single request container the user object
userSchema.method("toJSON", function toJSON() {
    const user = this;
    const userObject = user.toObject(); // turn user into object format // mongoose method

    delete userObject.password;
    delete userObject.tokens;

    return userObject;
});

userSchema.static("findByCredentials", async function findByCredentials(email: string, password: string) {
    const user = await User.findOne({ email });

    if (!user) {
        throw new Error("Unable to find user");
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
        throw new Error("Credentials doesn't match");
    }

    return user;
});

// Password Hash middleware //runs before the user is saved
userSchema.pre("save", async function (next) {
    const user = this;

    //we only want to hash the password if the password is being changed or created the first time
    if (user.isModified("password")) {
        user.password = await bcrypt.hash(user.password, 8);
    }

    next();
});

//mongoose take the name of the model we provided and pluralizes it //so User becomes users when storing it as collections in mongodb
const User = model<IUser, IUserModel>("User", userSchema);

export default User;
