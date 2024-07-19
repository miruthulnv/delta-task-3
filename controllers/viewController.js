import axios from 'axios';
import Song from '../models/songModel.js';
import catchAsync from "../utils/catchAsync.js";
import * as authController from './authController.js';
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
        songs
    });
})

export const getAlbum = catchAsync(async (req, res) => {
    const response = await axios.get('http://127.0.0.1:8000/api/v1/songs/albums');
    res.status(200).render('album.pug',{
        albums: response.data.data.albums
    });

})

export const getLogin = (req, res) => {
    if (req.cookies.jwt){
        res.status(200).redirect('/');
        console.log('No need you are already logged in.')
    } else{
        res.status(200).render('login.pug');
    }
}

export const getSignup = (req, res) => {
    res.status(200).render('signup.pug');
}