import { errorHandler } from "./errorHandler.js";
import jwt from "jsonwebtoken";


export function authenticateToken (req, res, next) {
    const token = req.cookies.access_token;
    // console.log(token);
    if (!token) return next(errorHandler(401, "Unauthorized"));

    jwt.verify (token, process.env.JWT_SECRET, (err, user) => {
        if (err) return next(errorHandler(403, "Forbidden"));
        req.user = user;
        next();
    });
}