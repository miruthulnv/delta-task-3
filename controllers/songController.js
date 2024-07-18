import * as factory from "./handlerFactory.js";
import Song from "../models/songModel.js";
import AppError from "../utils/appError.js";
import ApiFeatures from "../utils/apiFeatures.js";
import {Buffer} from 'buffer';
import slugify from "slugify";
import catchAsync from "../utils/catchAsync.js";
import {parseFile} from 'music-metadata';

export const getAllSongs = factory.getAll(Song);
export const createSong = factory.createOne(Song);
export const getSong = factory.getOne(Song)
export const updateSong = factory.updateOne(Song);
export const deleteSong = factory.deleteOne(Song);

export const likeSong = async (req, res, next) => {
    const user = req.user;
    const songId = req.params.id;
    const song = await Song.findOne({_id: songId});
    if (user.likedSongs.includes(songId)) {
        return next(new AppError('Song already liked', 400));
    } else {
        user.likedSongs.push(songId);
        await user.save({validateBeforeSave: false});
        song.likesCount++;
        await song.save({validateBeforeSave: false});
        res.status(200).json({
            status: 'success',
            message: 'Song liked successfully',
        });
    }
};

export const getAllAlbums = async (req, res,) => {
    const albums = await Song.aggregate([
        {
            $group: {
                _id: '$album', // Group by album
                numSongs: {$sum: 1}, // Count songs per album
                totDuration: {$sum: '$duration'}, // Sum of durations per album
                songTitles: {$push: '$title'}, // Collect song titles per album
            }
        },
        {
            $project: {
                albumName: '$_id', // Use albumName as an alias for the group key
                _id: 0, // Exclude the default _id from the results
                numSongs: 1,
                totDuration: 1,
                songTitles: 1,
            }
        },
        // Add any other stages like $sort here
    ]);
     albums.forEach(el=>{
         el.slug = slugify(el.albumName,{lower: true});
     })
    res.status(200).json({
        status: 'success',
        results: albums.length,
        data: {
            albums,
        },
    });
};

export const getSongImageFromDB = catchAsync(async (req,res,next) =>{
    const song = await Song.findById(req.params.id).select('+image.data +image.contentType');

    if (!song || !song.image){
        return next(new AppError('No image found', 404));
    }
    else{
        res.set('Content-Type', song.image.contentType);
        res.send(song.image.data);
    }
});

export const getSongImageFromDisk = catchAsync(async (req,res,next) =>{
    const song = await Song.findById(req.params.id)
    if (!song){
        return next(new AppError('No song found with that ID', 404));
    }
    console.log(song)
    const songName = song.filename;
    const metadata = await parseFile(`public/music/${songName}`);
    const picture = Buffer.from(metadata.common.picture[0].data);
    res.set('Content-Type', 'image/png');
    res.send(picture);
})