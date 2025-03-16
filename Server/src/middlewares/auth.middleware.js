import jwt from 'jsonwebtoken';
import { User } from '../models/user.model.js';

// ✅ Middleware: Check if User is Logged In
const verifyToken = async (req, res, next) => {
    try {
        const token = req.cookies?.token || req.header("Authorization")?.replace("Bearer " , "")
        // console.log(token)
        if(!token){
            // throw new ApiError(401 , "Unauthorized Request")
            return res.status(401).json({
                success : false ,
                message : "Unauthorized Request" ,
            })
        }
    
        const decodedToken = jwt.verify(token , process.env.ACCESS_TOKEN_SECRET)
    
        const user = await User.findById(decodedToken._id).select("-password")
        if(!user){
            // throw new ApiError(401 , "Invalid Access Token")
            return res.status(401).json({
                success : false ,
                message : "Invalid Access Token" ,
            })
        }
    
        req.user = user ,
        next()
    } catch (error) {
        // throw new ApiError(401 , error?.message || "Invalid Access Token")
        return res.status(401).json({
            success : false ,
            message : "adfwefInvalid Access Token" ,
        })
    }
};

// ✅ Middleware: Check User Role Authorization
const authorizedRoles = (...roles) => {
    return (req, res, next) => {
        if (!req.user || !req.user.role) {
            return res.status(403).json({
                success: false,
                message: "❌ Unauthorized access. Please log in."
            });
        }

        if (!roles.includes(req.user.role)) {
            return res.status(403).json({
                success: false,
                message: "❌ You don't have permission to access this route."
            });
        }

        next();
    };
};

export {
    verifyToken,
    authorizedRoles
};
