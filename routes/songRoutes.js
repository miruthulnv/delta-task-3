import express from 'express'
import * as authController from './../controllers/authController.js'
import * as songController from './../controllers/songController.js'
import * as userController from './../controllers/userController.js'

const router = express.Router();

// router.use(authController.protect);

router.route('/')
    .get(songController.getAllSongs)
    .post(songController.createSong);

router.route('/albums')
    .get(songController.getAllAlbums);

router.route('/:id/image')
    .get(songController.getSongImage);

router.route('/:id/like')
    .patch(authController.protect, songController.likeSong);

router.route('/:id')
    .get(songController.getSong)
    .patch(songController.updateSong)
    .delete(songController.deleteSong);






export default router;