import mongoose from "mongoose"
// import {Buffer} from "buffer"
import slugify from "slugify";
const songSchema = new mongoose.Schema({
    filename: {
        type: String,
        minLength: [3,'filename too short'],
        required:[true,'filename is missing'],
        validate: {
            validator: function(val){
                return val.endsWith('.mp3');
            },
        message: `{VALUE} does not end with .mp3`
        }
    },
    title:{
        type: String,
        minLength: [3,'title too short'],
    },
    album: {
        type: String,
        required: true,
    },
    year:{
        type: Number,
        min: 1900,
    },
    albumArtist:{
      type:String,
    },
    artists: [{
        type: String,
    }],
    duration:{
        type: Number,
    },
    language: {
        type: String,
    },
    albumSlug:{
        type: String,
    },
    image: {
        data: {type:Buffer,select:false},
        contentType: String,
    },
    likesCount:{
        type: Number,
        default: 0,
    },
    views:{
        type: Number,
        default: 0,
    }
});

songSchema.pre('save', function(next) {
    if (!this.title) {
         this.title = this.filename.slice(0, -4);
    }
    if (!this.albumSlug){
        this.albumSlug = slugify(this.album, {lower: true});
    }
    next();
});


const Song = mongoose.model('Song',songSchema);

export default Song;