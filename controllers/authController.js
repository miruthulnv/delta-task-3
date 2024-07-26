import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

import User from "../models/userModel.js";
import catchAsync from "../utils/catchAsync.js";
import AppError from "../utils/appError.js";
import {promisify} from "util";


const signToken = function (user) {
    return jwt.sign({id: user._id}, process.env.JWT_SECRET,
        {expiresIn: process.env.JWT_EXPIRE});
}
const createSendToken = function (user, statusCode, res) {
    const token = signToken(user);
    const cookieOptions = {
        expires: new Date(Date.now() + process.env.JWT_COOKIE_VALID * 24 * 60 * 60 * 1000),
        httpOnly: true,
    }
    // console.log('All prepared to send token')
    // console.log(process.env.JWT_COOKIE_VALID);
    res.cookie('jwt', token, cookieOptions);
    res.status(statusCode).json({
        status: 'success',
        message: `Logged in as ${user.email}. Role: ${user.role}`,
        token,
    });
}

export const signUp = catchAsync(async (req, res, next) => {
    // console.log('Inside sign up');
    const userRole = (req.body.role !== 'admin') ? req.body.role : 'user';
    const newUser = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        confirmPassword: req.body.confirmPassword,
        role: userRole,
    });
    // console.log('created token.. initiating to send token')
    createSendToken(newUser, 201, res);
});

export const login = catchAsync(async (req, res, next) => {
    const {email, password} = req.body;
    if (!email || !password) {
        return next(new AppError('Both email and password are mandatory', 400));
    } else {
        const user = await User.findOne({email});
        if (!user) {
            return next(new AppError(`There is no account registered with that email`, 400));
        }
        if (!(await bcrypt.compare(password, user.password))) {
            return next(new AppError('Incorrect password', 400));
        } else {
            createSendToken(user, 200, res);
        }
    }
});

export const protect = catchAsync(async (req, res, next) => {
    let token;
    if (req.cookies.jwt) {
        token = req.cookies.jwt;
    }
    if (req.headers.authorization?.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }
    if (!token) {
        return next(new AppError('You are not logged in. Please log in ', 401));
    }
    const decoded = await jwt.verify(token, process.env.JWT_SECRET);
    const id = decoded.id;
    req.user = await User.findOne({_id: id});
    if (!req.user) {
        return next(new AppError('Log in Again. The is no user assigned with your token.',400))
    }
    // console.log(req.user)
    next();
});

export const restrictTo = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return next(new AppError(`Dear ${req.user.name}, \nYou do not have permission to perform this action`, 403));
        }
        next();
    }
}

export const logout = (req, res) => {
    res.cookie('jwt', 'logged out', {
        expires: new Date(Date.now() + 100),
        httpOnly: true,
    });
    res.locals.user = undefined;
    res.status(200).json({
        status: 'success',
        message: 'Logged out successfully',
    });
}

export const isLoggedIn = async (req, res, next) => {
    try {
        // console.log('checking if logged in..')
        let token;
        if (req.cookies.jwt) {
            token = req.cookies.jwt;
        }
        if (token) {
            // console.log('Fuckkr seems to have a token');
            const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
            const freshUser = await User.findById(decoded.id);
            if (!freshUser) return next();
            if (freshUser.passwordExpired(decoded.iat)) return next();
            res.locals.user = freshUser;//Locals can be accessed inside the pug templates.
        } else{
            console.log('no token found')
            res.locals.user = undefined;
        }
        return next();
    } catch (err) {
        // console.log(err)
        return next();
    }
}