import axios from 'axios';
import Song from '../models/songModel.js';
import catchAsync from "../utils/catchAsync.js";
import * as authController from './authController.js';
import AppError from "../utils/appError.js";
import Playlist from "../models/playlistModel.js"

export const getHome = catchAsync(async (req, res) => {
    // find 10 songs randomly from the database
    const songs = await Song.aggregate([
        {$sample: {size: 8}}
    ]);

    res.status(200).render('home', {
        songs,
    })
})

export const getSong = catchAsync(async (req, res) => {
    const song = await Song.findById(req.params.id);
    const playlists = await Playlist.find({user: req.user});
    const songs = await Song.aggregate([
        {$sample: {size: 8}}
    ]);
    if (!song) {
        return res.status(404).json({
            status: 'fail',
            message: 'No song found with that ID'
        })
    }
    res.status(200).render('song.pug', {
        song,
        songs,
        playlists
    });
})

export const getAlbum = catchAsync(async (req, res) => {
    const response = await axios.get('http://127.0.0.1:8000/api/v1/songs/albums');
    res.status(200).render('album.pug',{
        albums: response.data.data.albums
    });

})

export const getPlaylists = catchAsync(async (req, res,next) => {
    //filter such that the length of the song array is gt 0
    const playlists = await Playlist.find({user: req.user, "songs.0": { "$exists": true }});
    res.status(200).render('playlist.pug',{
        playlists,
    });
});

export const getPlaylistForUser = catchAsync(async (req, res) => {
    const playlist = await Playlist.findById(req.params.id);
    const songs = await Song.find({_id: {$in: playlist.songs}});
    const songNum = req.params.songNum;

    if (!playlist) {
        return next(new AppError('No playlist found with that ID', 404));
    }
    console.log(playlist.songs.length)
    res.status(200).render('playlistPage.pug',{
        songs,
        playlist,
        song: songs[(songNum-1)%playlist.songs.length],
    });
})

export const getLogin = (req, res) => {
    if (req.cookies.jwt){
        res.status(200).redirect('/');
    } else{
        res.status(200).render('login.pug');
    }
}

export const getSignup = (req, res) => {
    res.status(200).render('signup.pug');
}

export const getSongsInAlbum = catchAsync(async (req,res,next)=>{
    const albumSlug = req.params.albumSlug;
    const albumSongs = await Song.find({albumSlug});
    if (!albumSongs || albumSongs.length === 0){
        return next(new AppError('No album found with that slug', 404));
    };
    res.status(200).render('albumSongs.pug',{
        albumSongs,
    });
});

export const getSearch = catchAsync(async (req,res)=>{
    const query = req.query.q;
    const response = await Song.find({
        $or: [
            { title: { $regex: query, $options: 'i' } },
            { album: { $regex: query, $options: 'i' } },
            { albumArtist: { $regex: query, $options: 'i' } },
            { genre: { $regex: query, $options: 'i' } }
        ]
    });
    res.status(200).render('search.pug',{
        songs: response,
        query: query
    })
})