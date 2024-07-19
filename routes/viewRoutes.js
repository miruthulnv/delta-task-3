import express from "express";
import * as viewController from "./../controllers/viewController.js";
import * as authController from "./../controllers/authController.js";

const router = express.Router();

router.route("/signup").get(viewController.getSignup);
router.route("/login").get(viewController.getLogin);

router.use(authController.isLoggedIn)

router.route("/").get(viewController.getHome);
router.route('/song/:id').get(viewController.getSong);
router.route('/albums').get(viewController.getAlbum);
export default router;