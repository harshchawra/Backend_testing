import jwt from 'jsonwebtoken';
import User from '../models/auth.model.js';

const authenticateUser = async (req, res, next) => {
    try {
        const token = req.cookies.token || req.header("Authorization")?.replace("Bearer ", "");
        // console.log(token);
        if (!token) {
            return res.status(401).json({ error: "Unauthorized - No Token Provided" });
        }

        
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        if (!decoded || !decoded.userId) {
            return res.status(401).json({ error: "Unauthorized - Invalid Token" });
        }

        
        const user = await User.findById(decoded.userId).select("-password");
        if (!user) {
            return res.status(404).json({ error: "Unauthorized - User Not Found" });
        }
        // console.log("User Authenticated");
        req.user= user; 
        next(); 

    } catch (error) {
        console.error("Auth Error:", error.message);
        res.status(403).json({ error: "Forbidden - Invalid or Expired Token" });
    }
};

export default authenticateUser;
