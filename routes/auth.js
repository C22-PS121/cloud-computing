import { createRequire } from "module";
const require = createRequire(import.meta.url);

require('dotenv').config();

import jwt from 'jsonwebtoken';

export function generateAccessToken(user) {
    return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '24h' });
}

export function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if(token === undefined) {
        return res.status(401).json({
            status: "Gagal",
            message: "Unauthorize"
        });
    }

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if(err) {
            return res.status(403).json({
                status: "Gagal",
                message: "Unauthorize"
            });
        }
        req.user = user;
        next();
    });
}