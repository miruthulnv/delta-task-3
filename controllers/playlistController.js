import * as factory from "./handlerFactory.js";
import Playlist from "../models/playlistModel.js";
import AppError from "../utils/appError.js";
import catchAsync from "../utils/catchAsync.js";


export const getAllPlaylists = factory.getAll(Playlist);
export const createPlaylist = factory.createOne(Playlist);
export const getPlaylist = factory.getOne(Playlist)
export const updatePlaylist = factory.updateOne(Playlist);
export const deletePlaylist = factory.deleteOne(Playlist);

export const addSongToPlaylist = catchAsync(async (req, res, next) => {
    const playlist = await Playlist.findById(req.params.id);
    if(!playlist) return next(new AppError('No playlist found with that ID', 404));
    console.log('hii');
    console.log(playlist.user, req.user._id)
    if(String(req.user._id)!==String(playlist.user)) return next(new AppError('You are not authorized to add songs to this playlist', 401));
    if (!playlist.songs.includes(req.body.song)) {
        playlist.songs.push(req.body.song);
    }
    await playlist.save();
    res.status(200).json({
        status: 'success',
        message: 'Song added to playlist',
    })
});
export const removeSongFromPlaylist = catchAsync(async (req, res, next) => {
    const playlist = await Playlist.findById(req.params.id);
    if(!playlist) return next(new AppError('No playlist found with that ID', 404));
    if(String(req.user._id)!==String(playlist.user)) return next(new AppError('You are not authorized to remove songs from this playlist', 401));
    if (playlist.songs.includes(req.body.song)) {
        playlist.songs.splice(playlist.songs.indexOf(req.body.song), 1);
    }
    await playlist.save();
    res.status(200).json({
        status: 'success',
        message: 'Song removed from playlist',
    })
});
export const addUserToPlaylist = (req, res, next) => {
    req.body.user = req.user._id;
    next();
}