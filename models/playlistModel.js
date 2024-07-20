import mongoose from 'mongoose';

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
    public:{
        type: Boolean,
        default: true,
    }
});

const Playlist = new mongoose.model('Playlist',playlistSchema);

export default Playlist;