import mongoose from 'mongoose';
import Song from "./songModel.js";

const playlistSchema = new mongoose.Schema({
    name:{
        type:String,
        minLength:[3,'Playlist name too short'],
        maxLength:[30,'Playlist name too long'],
        required: [true,'Playlist name missing'],
    },
    user:{
        type: mongoose.Schema.ObjectId,
        ref: 'User',
    },
    songs:[{
        type: mongoose.Schema.ObjectId,
        ref: 'Song',
        count: {type: Number, default: 0}
    }],
    public: {
        type: Boolean,
        default: true,
    },
    duration:{
        type: Number,
        default: 0,
    },
},{
    toJSON: {virtuals: true},
    toObject: {virtuals: true},
});

//Create middleware to update duration before saving
playlistSchema.pre('save',async function(next){
    this.duration = 0;
    for (let i=0;i<this.songs.length;i++){
        const song = await Song.findById(this.songs[i]);
        this.duration += song.duration;
    }
    next();
});

const Playlist = new mongoose.model('Playlist',playlistSchema);

export default Playlist;