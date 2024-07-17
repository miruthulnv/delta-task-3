import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

import User from "../models/userModel.js";
import catchAsync from "../utils/catchAsync.js";
import AppError from "../utils/appError.js";


const signToken = function(user){
    return jwt.sign({id:user._id},process.env.JWT_SECRET,
        {expiresIn: process.env.JWT_EXPIRE});
}
const createSendToken = function(user,statusCode,res){
    const token= signToken(user);
    const cookieOptions = {
        expires: new Date(Date.now()+ process.env.JWT_COOKIE_VALID*24*60*60*1000),
        httpOnly: true,
    }
    res.cookie('jwt',token,cookieOptions);
    res.status(statusCode).json({
        status: 'success',
        message: `Logged in as ${user.email}. Role: ${user.role}`,
        token,
    });
}

export const signUp = catchAsync(async (req,res,next)=>{
    const userRole = (req.body.role !== 'admin') ? req.body.role : 'user';
    const newUser = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        confirmPassword: req.body.confirmPassword,
        role: userRole,
    });
    createSendToken(newUser,201,res);
});

export const login = catchAsync(async (req,res,next)=>{
    const {email, password} = req.body;
    if (!email || !password){
        return next(new AppError('Both email and password are mandatory',400));
    }
    else {
        const user = await User.findOne({email});
        if (!user) {
            return next(new AppError(`There is no account registered with that email`,400));
        }
        if (!(await bcrypt.compare(password,user.password))){
            return next(new AppError('Incorrect password',400));
        }
        else{
            createSendToken(user,200,res);
        }
    }
});

export const protect = catchAsync( async (req,res,next) =>{
     let token;
     if(req.headers.authorization?.startsWith('Bearer')){
          token = req.headers.authorization.split(' ')[1];
     }
     if (!token){
         return next(new AppError('You are not logged in. Please log in ',401));
     }
     const decoded = await jwt.verify(token, process.env.JWT_SECRET);
     const id = decoded.id;
     req.user = await User.findOne({_id:id});
     next();
});

export const restrictTo = (...roles)=>{
    console.log('Checking if you are authorised.')
    return (req,res,next)=>{
        if (!roles.includes(req.user.role)){
            return next(new AppError(`Dear ${req.user.name}, \nYou do not have permission to perform this action`,403));
        }
        next();
    }
}

export const logout = (req,res)=>{
    res.cookie('jwt','loggedout',{
        expires: new Date(Date.now()+10*1000),
        httpOnly: true,
    });
    res.status(200).json({
        status: 'success',
        message: 'Logged out successfully',
    });
}
