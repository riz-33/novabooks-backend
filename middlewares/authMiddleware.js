import jwt from "jsonwebtoken";

const authMiddleware = (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1] || "";

    if (!token)
        return res.status(401).json({ message: "No token, access denied" });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        console.log("Decoded user:", req.user);
        next();
    } catch (error) {
        console.error("Token verification failed:", error);
        res.status(401).json({ message: "Invalid token" });
    }
};

export default authMiddleware;
