export default function authMiddleware(req, res, next) {
    try {
        req.user={
            user_id:req.headers['x-user-id'],
            email:req.headers['x-user-email'],
            username:req.headers['x-user-username']
        }

        next(); 
    } catch (err) {
        console.error("Auth middleware error:", err);
        return res.status(401).json({ code: "InvalidToken", message: "Token is invalid or expired" });
    }
}


