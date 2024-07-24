import express from "express";
import * as viewController from "./../controllers/viewController.js";
import * as authController from "./../controllers/authController.js";

const router = express.Router();

router.route("/signup").get(viewController.getSignup);
router.route("/login").get(viewController.getLogin);

router.use(authController.isLoggedIn);

router.route("/").get(viewController.getHome);
router.route('/playlist').get(authController.protect,viewController.getPlaylists);
router.route('/playlist/:id/song/:songNum').get(authController.protect,viewController.getPlaylistForUser);
router.route('/song/:id').get(authController.protect, viewController.getSong);
router.route('/albums').get(viewController.getAlbum);
router.route('/albums/:albumSlug').get(viewController.getSongsInAlbum);
router.route('/search').get(viewController.getSearch);

export default router;
