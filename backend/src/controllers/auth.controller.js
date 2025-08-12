import cloudinary from "../lib/cloudinary.js";
import { generateToken } from "../lib/utils.js";
import User from "../models/user.model.js"
import bcrypt from "bcrypt"

export const signup = async(req,res)=> {
    const {email,password,fullname} =req.body;
    try{
        if(!email ||!fullname || !password){
            return res.status(400).json({message:"All feilds are required"});
        }
        if(password.length<6){
            return res.status(400).json({message:"password must be at least 6 characters"});
        }
        const user=await User.findOne({email});
        if(user) return res.status(400).json({message:"user already exist"});

        const salt=await bcrypt.genSalt(10);
        const hashpswd=await bcrypt.hash(password,salt);

        const newUser=new User({
            fullname,
            email,
            password:hashpswd
        })
        if(newUser){
            generateToken(newUser._id,res);
            await newUser.save();

            res.status(201).json({
                _id:newUser._id,
                fullname:newUser.fullname,
                email:newUser.email,
                profilepic:newUser.profilepic
            })
        } else{
            res.status(400).json({message:"invalid user data"})
        }



    }catch(error){
        console.log("error in signup conroller ",error.message)
        res.status(500).json({message:"Internal server Error"})
    }
}
export const login=async(req,res)=>{
    const {email,password}=req.body 

    try{
        if(!email || !password){
            return res.status(400).json({message:"All feilds are required"})
            
        }

        const user=await User.findOne({email});
        if(!user){
            return res.status(400).json({message:"Invalid credentials"})
        }

        const isPasswordCorrect=await bcrypt.compare(password,user.password);
        if(!isPasswordCorrect){
            return res.status(400).json({message:"Invalid credentials"})
        }
        generateToken(user._id,res);

        res.status(200).json({
            _id:user._id,
            fullname:user.fullname,
            email:user.email,
            profilepic:user.profilepic
        })

    }catch(error){
        console.log("Error in login Controller ",error.message);
        res.status(500).json({message:"Internal server Error"})
    }
}
export const logout=async (req,res)=>{
    try {
        res.cookie("jwt","",{maxAge:0})
        res.status(200).json({message:"User logged out successfully"})
    } catch (error) {
        console.log("Error in logout Controller ",error.message);
        res.status(500).json({message:"Internal server Error"})
    }
}

export const updateProfile=async(req,res)=>{
    try {
        const {profilepic}=req.body;
        const userId=req.user._id;
        if(!profilepic){
            return res.status(400).json({message:"Profile pic is required"})
        }
        const uploadResponse=await cloudinary.uploader.upload(profilepic);
        const updateUser=await User.findByIdAndUpdate(userId,{profilepic:uploadResponse.secure_url},{new:true})
        res.status(200).json(updateUser);
    } catch (error) {
        console.log("Error in updateProfile Controller ",error.message);
        res.status(500).json({message:"Internal server Error"})
    }


}

export const checkAuth=(req,res)=>{
    try {
        res.status(200).json(req.user)
    } catch (error) {
        console.log("Error in checkAuth Controller ",error.message);
        res.status(500).json({message:"Internal server Error"})
    }
}