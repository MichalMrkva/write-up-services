import jwt from 'jsonwebtoken';
import fetch from 'node-fetch'; // pokud není globální fetch

export default async function authMiddleware(req, res, next) {
    try {
        const authHeader = req.headers['authorization'];
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ code: "NoToken", message: "Missing or invalid token" });
        }

        const token = authHeader.split(" ")[1];
        let decoded;
        try {
            decoded = jwt.verify(token, process.env.JWT_SECRET);
        } catch {
            return res.status(401).json({ code: "InvalidToken", message: "Token is invalid or expired" });
        }

        const USER_SERVICE_URL = "http://user-service:3002/api/v1/user/getBlacklist";
        const blacklistRes = await fetch(`${USER_SERVICE_URL}?token=${token}`, {
            method: "GET",
            headers: { "Content-Type": "application/json" },
        });

        if (!blacklistRes.ok) {
            console.error("Blacklist service error:", blacklistRes.status, await blacklistRes.text());
            return res.status(500).json({ code: "ServiceError", message: "Error checking blacklist" });
        }

        const isBlacklisted = await blacklistRes.json();
        if (isBlacklisted) {
            return res.status(401).json({ code: "BlacklistedToken", message: "Token is blacklisted" });
        }

        
        req.headers['x-user-id'] = decoded.userId;
        req.headers['x-user-email'] = decoded.email;
        req.headers['x-user-username'] = decoded.username;

        next();
    } catch (err) {
        console.error("Auth middleware error:", err);
        return res.status(401).json({ code: "InvalidToken", message: "Token is invalid or expired" });
    }
}
