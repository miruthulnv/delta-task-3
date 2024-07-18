import express from "express";
import * as viewController from "./../controllers/viewController.js";
import * as authController from "./../controllers/authController.js";

const router = express.Router();

router.get("/", viewController.getHome);
router.get("/login", viewController.getLogin);
router.get("/signup", viewController.getSignup);
router.route('/song/:id').get(viewController.getSong);
router.route('/albums').get(viewController.getAlbum);
export default router;