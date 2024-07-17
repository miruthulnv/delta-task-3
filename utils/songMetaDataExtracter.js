import {parseFile} from 'music-metadata';
import {inspect} from 'util';
// import {promises as fs} from 'fs';
import * as fs from 'fs';
import path from 'path';
import {Buffer} from 'buffer';
import Song from './../models/songModel.js';
import mongoose from "mongoose";
import dotenv from "dotenv";
import chalk from 'chalk';



dotenv.config({path: './../config.env'})

const pushSongToDB = async (songName) => {
    try {
        let newSong = {};
        const metadata = await parseFile(`./../public/music/${songName}`);
        // const data = inspect(metadata, {showHidden: false, depth: null});
        // const neededData = ['albumartist', 'artists', 'album', 'title', 'genre', 'picture'];
        // neededData.forEach((el) => {
        //     if (metadata.common[el] === undefined) {
        //         console.log(`${el} : Not Found for ${songName}`);
        //     } else {
        //         console.log(`✅`);
        //     }
        // });
        newSong.filename = songName;
        newSong.title = cleanString(metadata.common.title).trim();
        newSong.album = cleanString(metadata.common.album).trim()
        newSong.year = metadata.common.year;
        newSong.albumArtist = cleanString(metadata.common.albumartist).trim().split(',')[0];
        newSong.artists = cleanString(metadata.common.artists[0]).split(',').map(el => el.trim());
        newSong.language = cleanString(metadata.common.genre[0]).trim() || "Unknown";
        newSong.duration = metadata.format.duration;
        const pictureBuffer = metadata.common.picture[0].data;
        const buffer = Buffer.from(pictureBuffer);
        newSong.image = {};
        newSong.image.data = buffer;
        newSong.image.contentType = 'image/png';
        // fs.writeFileSync('downloaded_image.png', buffer);
        await Song.create(newSong);
        console.log(`Written ${songName} to DB`);
        // console.log(cleanString(metadata.common.albumartist).trim().split(',')[0]);
    } catch (error) {
        console.error(error.message);
    }
};

const readDirectory = async (directoryPath) => {
    try {
        let count = 0;
        const files = await fs.promises.readdir(directoryPath);
        for (const file of files) {
            const filePath = path.join(directoryPath, file);
            await pushSongToDB(file);
            count = count + 1;
        }
        console.log(`Written ${count} songs to DB`);
    } catch (err) {
        console.log('Unable to scan directory:', err);
    }
};
// readDirectory('/home/miruthul/WebstormProjects/d-tunes/public/music')
const bannedWords = ['MassTamilan', 'MassTamilan.dev', 'Mp3Bhai', 'MassTamilan.com', '.dev', '.com', ''];
const regex = new RegExp(`\\b(${bannedWords.join('|')})\\b`, 'gi');

function cleanString(input) {
    return input.replace(regex, '').replaceAll('-', '')
};

const DB = process.env.DATABASE_CONNECTION.replace('<password>', process.env.DATABASE_PASSWORD);
mongoose.connect(DB, {}).then((con) => {
    console.log(chalk.cyan('Database Connected'));
}).catch((err) => {
    console.error(chalk.red.bgWhite('DATABASE NOT CONNECTED'));
    console.log(err)
})

readDirectory('/home/miruthul/WebstormProjects/d-tunes/public/music').then(() => {
        console.log(chalk.bold.underline.cyan('All songs written to DB'));
        process.exit();
    }
);
