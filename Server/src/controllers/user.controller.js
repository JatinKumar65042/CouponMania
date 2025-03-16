import cloudinary from "cloudinary";
import fs from "fs/promises"
import { User } from "../models/user.model.js";
import bcrypt from "bcrypt"

const cookieOptions={
    maxAge:24*60*60*1000,  //1 day
    httpOnly:true,
    // secure:true
}

const register=async (req,res,next)=>{
    const {username, email, password , secretKey}=req.body;
    if(!username || !email || !password || !secretKey){
        // return next(new AppError("All Fields are required",400));
        return res.status(400).json({
            success : false ,
            message : "All Fields are required",
        })
    }

    let role = "USER";

    if (secretKey === process.env.ADMIN_SECRET) {
        role = "ADMIN";
    }

    const userExists=await User.findOne({email});
    if(userExists){
        return res.status(400).json({
            success : false ,
            message : "User already Exists"
        })
    }
    try {
        const user =await User.create({
            username,
            email,
            password,
            role
        })
    
        if(!user){
            return res.status(400).json({
                success : false ,
                message : "User registration failed,please try again" ,
            })
        }
    
        await user.save();
        
        const token=await user.generateAccessToken();
        user.password=undefined;
        res.cookie('token',token, cookieOptions);
    
        res.status(201).json({
            success:true,
            message:"User registered successfully",
            user,
        })
    } catch (err) {
        // return next(new AppError(err.message,400));
        return res.status(400).json({
            success : false ,
            message : err.message
        })
    }
}


const login = async (req,res,next)=>{

    try {
        const {email,password}=req.body;

    if(!email || !password){
        // return next(new AppError("All fields are required",400))
        return res.status(400).json({
            success : false ,
            message : "All fields are required"
        })
    }

    const user= await User.findOne({email}).select('+password');
    if(!user || !(await bcrypt.compare(password,user.password))){
        // return next(new AppError("Email or password does not match",400))
        return res.status(400).json({
            success : false ,
            message : "Email or password does not match"
        })
    }

    const token=await user.generateAccessToken();
    user.password=undefined;
    res.cookie('token',token,cookieOptions);

    res.status(200).json({
        success:true,
        message:"User logged in sucessfully",
        user
    })
    } catch (err) {
        // return next(new AppError(err.message,500))
        return res.status(500).json({
            success : false ,
            message : err.message
        })
    }
    
}

const logout=(req,res)=>{
    res.cookie('token',null, {
        secure:true,
        maxAge:0,
        httpOnly:true
    });
    res.status(200).json({
        success:true,
        message:"User Logged out Successfully"
    })
}

const getProfile=async(req,res)=>{
    try {
        const userId=req.user.id;
        const user=await User.findById(userId);

        res.status(200).json({
            success:true,
            message:"User Details",
            user
        })
    } catch (err) {
        // return next(new AppError("Failed to fetch user details",400));
        return res.status(400).json({
            success : false ,
            message : "Failed to fetch user details" ,
        })
    }
    
}

export {
    register ,
    login ,
    logout ,
    getProfile
}