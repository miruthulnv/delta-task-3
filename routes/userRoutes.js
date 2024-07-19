import express from 'express'
import * as authController from './../controllers/authController.js'
import * as userController from './../controllers/userController.js'

const router = express.Router();

router.route('/signup').post(authController.signUp);
router.route('/login').post(authController.login);
router.route('/logout').get(authController.logout);


router.use(authController.protect);
router.use(authController.restrictTo('user','admin'));
router.route('/friendRequest/:id').post(userController.friendRequest);
router.route('/acceptFriendRequest/:id').post(userController.acceptFriendRequest);
router.route('/unfriend/:id').post(userController.unFriend);
router.route('/rejectFriendRequest/:id').post(userController.rejectFriendRequest);

// router.use(authController.restrictTo(['admin']));
router.route('/getAll').get(userController.getAllUsers);
router.route('/getUser/:id').get(userController.getUser);
router.route('/update/:id').patch(userController.updateUser);
router.route('/delete/:id').delete(userController.deleteUser);




export default router;