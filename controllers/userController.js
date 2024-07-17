import * as factory from "./handlerFactory.js";
import User from "../models/userModel.js";
import Song from "../models/songModel.js";
import AppError from "../utils/appError.js";


const removeEl = (arr,el)=>{
    const index = arr.indexOf(el);
    if (index > -1){
        arr.splice(index,1);
    }
    return arr;
}

export const getAllUsers = factory.getAll(User);
export const getUser = factory.getOne(User)
export const updateUser = factory.updateOne(User);
export const deleteUser = factory.deleteOne(User);

export const friendRequest = async(req,res,next) =>{
    const user = req.user;
    const friendId = req.params.id;
    const friend = await User.findOne({_id: friendId});
    if ((!friend)){
        return next(new AppError('User not found', 404));
    }
    if (user._id == friendId){
        return next(new AppError('Don\'t try to play the fool with me niggesh. You cannot send friend request to yourself', 400));
    }
    if(user.friends.includes(friendId)){
       return next(new AppError(`You are already friends with ${friend.name}`, 400));
    }
    if(user.friendRequests.includes(friendId)){
        return next(new AppError(`You already have a pending friend request from ${friend.name}`, 400));
    }
    if(friend.friendRequests.includes(user._id)){
        return next(new AppError(`You have already sent a friend request to ${friend.name}`, 400));
    }
    friend.friendRequests.push(user._id);
    await friend.save({validateBeforeSave: false});
    res.status(200).json({
        status: 'success',
        message: 'Friend request sent successfully',
    });
};
export const acceptFriendRequest = async(req,res,next) =>{
    const user = req.user;
    const friendId = req.params.id;
    const friend = await User.findOne({_id: friendId});
    if (!friend){
        return next(new AppError('User not found', 404));
    };
    if(!user.friendRequests.includes(friendId)){
        return next(new AppError(`You don't have friend request from ${friend.name}. Try giving a request.`,400));
    }
    if(user.friends.includes(friendId)){
        return next(new AppError(`You are already friends with ${friend.name}`, 400));
    }
    user.friends.push(friendId);
    friend.friends.push(user._id);
    //remove from user.friendrequests
    user.friendRequests = user.friendRequests.filter((el)=>el!=friendId);
    user.save({validateBeforeSave:false});
    friend.save({validateBeforeSave:false});
    res.status(200).json({
        status:'success',
        message:`${friend.name} is now your friend`
    })
};
export const unFriend = async(req,res,next) =>{
    const user = req.user;
    const friendId = req.params.id;
    const friend = await User.findOne({_id: friendId});
    if (user.friends.includes(friendId)) {
        user.friends = removeEl(user.friends, friendId);
        friend.friends = removeEl(friend.friends, user._id.toString());
        user.save({validateBeforeSave: false});
        friend.save({validateBeforeSave: false});
        res.status(200).json({
            status: 'success',
            message: `${friend.name} is no longer your friend`
        })
    } else{
        return next( new AppError('You are not friends with this user or this user no longer exits', 400));
    }
};
export const rejectFriendRequest = async(req,res,next) =>{
    const user = req.user;
    const friendId = req.params.id;
    const friend = await User.findOne({_id: friendId});
    if (!friend){
        return next(new AppError('User not found', 404));
    };
    if(!user.friendRequests.includes(friendId)){
        return next(new AppError(`You don't have friend request from ${friend.name}. Try giving a request.`,400));
    }
    user.friendRequests = removeEl(user.friendRequests,friendId);
    user.save({validateBeforeSave:false});
    res.status(200).json({
        status:'success',
        message:`Friend request from ${friend.name} rejected`
    });
};