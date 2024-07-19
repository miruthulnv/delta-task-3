import mongoose from 'mongoose';
import validator from "validator";
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
    name:{
        type: String,
        minLength: [4,'Name is too short'],
        maxLength: [25,'Name is too long'],
        required:[true,'Name missing']
    },
    email:{
        type: String,
        validate: [validator.isEmail,'Email is not valid'],
        required:[true,'Email missing'],
        unique: true,
    },
    password:{
        type: String,
        required:[true,'Password missing'],
        minLength: [8,'Password is too short']
    },
    confirmPassword:{
        type:String,
        required:[true,'Password confirm missing'],
        validate:{
            validator:function (val) {
                return this.password === val;
            },
            message: 'Passwords don\'t match!!'
        }
    },
    passwordChangedAt:{
        type:Date,
        default:Date.now(),
    },
    playlists:[{
        type: mongoose.Schema.ObjectId,
        ref: 'Playlist',
    }],
    role:{
        type:String,
        required: true,
        default: 'user',
        enum:['user','admin','artist'],
    },
    friends:[{
        type: mongoose.Schema.ObjectId,
        ref:'User',
    }],
    friendRequests:[{
       type:mongoose.Schema.ObjectId,
       ref:'User',
    }],
    likedSongs: [{
        type: mongoose.Schema.ObjectId,
        ref: 'Song'
    }],
});
// The following middleware is for encrypting the password
userSchema.pre('save',async function(next){
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password,12);
    this.confirmPassword = undefined;
    next();
});

userSchema.methods.passwordExpired = function(JWTTime){
    const changedTime = this.passwordChangedAt.getTime()/1000;
    return changedTime> JWTTime;
}
const User = mongoose.model('User',userSchema);

export default User;