
import Song from '../models/songModel.js';
import catchAsync from "../utils/catchAsync.js";

export const getHome = catchAsync(async (req, res) => {
    // find 10 songs randomly from the database
    const songs = await Song.aggregate([
        { $sample: { size: 8 } }
    ]);
    songs.forEach(el =>{
        const min =String(Math.trunc(el.duration/60)).padStart(2,'0');
        const sec = String(Math.trunc(el.duration)%60).padStart(2,'0');
        el.duration = `${min}:${sec}`
        el.artists = el.artists.join(', ');
        if (el.artists.length> 20) el.artists =el.artists.slice(0,20) + `...`;
        if  (el.title.length> 15) el.title = el.title.slice(0,15) + `...`;
    });
    res.status(200).render('home', {
        songs,
    })
})

export const getSong = catchAsync(async (req, res) => {
    const song = await Song.findById(req.params.id);
    console.log(song)
    if (!song) {
        return res.status(404).json({
            status: 'fail',
            message: 'No song found with that ID'
        })
    }
    res.status(200).render('login.pug');
})

export const getLogin = (req,res) =>{
    res.status(200).render('song.pug');
}

export const getSignup = (req,res) =>{
    res.status(200).render('signup.pug');
}