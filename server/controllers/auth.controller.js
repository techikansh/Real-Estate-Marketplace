import User from "../models/user.model.js";
import jwt from "jsonwebtoken";

export async function signup(req, res, next) {
    const { username, email, password } = req.body;

    const isUser1 = await User.findOne({ username });
    const isUser2 = await User.findOne({ email });

    if (isUser1 || isUser2) {
        return res
            .status(400)
            .json({ success: false, message: "User already exists" });
    }

    try {
        const user = await User.create({ username, email, password });
        return res.status(201).json({
            success: true,
            message: "signup success",
            user,
        });
    } catch (error) {
        next();
    }
}

export async function signin(req, res, next) {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({
                success: false,
                message: "Kein User gefunden",
            });
        }
        if (user.password !== password) {
            return res.status(400).json({
                success: false,
                message: "Falsche Email oder Passwort",
            });
        }
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
            expiresIn: "1h",
        });
        const { password: userPassword, ...rest } = user._doc;
        return res
            .cookie("access_token", token, { httpOnly: true, sameSite: "None" })
            .status(200)
            .json({
                success: true,
                message: "Login erfolgreich",
                user: rest,
            });
    } catch (error) {
        next();
    }
}

export async function google(req, res, next) {
    try {
        const { name, email, image } = req.body;
        const user = await User.findOne({ email });
        if (user) {
            // Signin
            const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
                expiresIn: "1h",
            });
            const { password, ...rest } = user._doc;
            return res
                .cookie("access_token", token, {
                    httpOnly: true,
                    sameSite: "None",
                })
                .status(200)
                .json({
                    success: true,
                    message: "Login erfolgreich",
                    user: rest,
                });
        } else {
            // Signup
            const randomPassword = Math.random().toString(36).slice(-8);
            const updatedUsername =
                name.split(" ").join("").toLowerCase() +
                Math.random().toString(36).slice(-4);
            const newUser = await User.create({
                username: updatedUsername,
                email: email,
                password: randomPassword,
                avatar: image,
            });
            const token = jwt.sign(
                { id: newUser._id },
                process.env.JWT_SECRET,
                { expiresIn: "1h" }
            );
            const { password, ...rest } = newUser._doc;
            return res
                .cookie("access_token", token, { httpOnly: true, sameSite: "None" })
                .status(200)
                .json({
                    success: true,
                    message: "Registierung erfolgreich",
                    user: rest,
                });
        }
    } catch (error) {
        next();
    }
}

export async function signout(req, res, next) {
    try {
        res.clearCookie("access_token", { httpOnly: true }).status(200).json({
            success: true,
            message: "Logout erfolgreich",
        });
    } catch (error) {
        next(error);
    }
}
