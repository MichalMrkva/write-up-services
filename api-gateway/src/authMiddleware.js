import jwt, { decode } from 'jsonwebtoken';


export default function authMiddleware(req, res, next) {
    try {
        const authHeader = req.headers['authorization'];
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ code: "NoToken", message: "Missing or invalid token" });
        }

        const token = authHeader.split(" ")[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        delete req.headers['x-user-id']
        delete req.headers['x-user-email']
        delete req.headers['x-user-username']
        
        req.headers['x-user-id'] = decoded.userId
        req.headers['x-user-email'] = decoded.email
        req.headers['x-user-username'] = decoded.username

        next(); 
    } catch (err) {
        console.error("Auth middleware error:", err);
        return res.status(401).json({ code: "InvalidToken", message: "Token is invalid or expired" });
    }
}


