import express from 'express'
import * as authController from './../controllers/authController.js'
import * as  playlistController from './../controllers/playlistController.js'

const router = express.Router();


router.route('/').get(playlistController.getAllPlaylists)
    .post(authController.protect,
        playlistController.addUserToPlaylist,
        playlistController.createPlaylist);
router.route('/:id')
    .get(playlistController.getPlaylist)
    .patch(playlistController.updatePlaylist)
    .delete(playlistController.deletePlaylist);



export default router;