import express from 'express'
import * as authController from './../controllers/authController.js'
import * as  playlistController from './../controllers/playlistController.js'

const router = express.Router();


router.route('/getAll').get(playlistController.getAllPlaylists);
router.route('/create').get(playlistController.createPlaylist);
router.route('/getUser/:id').get(playlistController.getPlaylist);
router.route('/update/:id').patch(playlistController.updatePlaylist);
router.route('/delete/:id').delete(playlistController.deletePlaylist);



export default router;