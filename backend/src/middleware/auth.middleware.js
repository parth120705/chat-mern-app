import jwt from "jsonwebtoken"
import User from "../models/user.model.js"

export const protectedRoute=async(req,res,next)=>{
    try {
        const token=req.cookies.jwt;
        if(!token){
            return res.status(400).json({message:"Unauthorized-No token provided"});
        }
        const decodedToken=jwt.verify(token,process.env.JWT_SECRET);

        if(!decodedToken){
            return res.status(400).json({message:"Unauthorized-Invalid token"});
        }
        const user=await User.findById(decodedToken.userId).select(
            "-password"
        )
        if(!user){
            return res.status(404).json({message:"User not found"});
        }
        req.user=user;
        next();
    } catch (error) {
        console.log("error in protectedRoute middleware ",error.message)
        res.status(500).json({message:"Internal server Error"})
    }
}