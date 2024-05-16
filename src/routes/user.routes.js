import Router from 'express';
import { registerUser, loginUser, verifyOTP, logoutUser, updateUserAvatar, updateUserAccount, getCurrentUser } from '../controllers/user.controllers.js'
import { upload } from '../middlewares/multer.middleware.js';
import verifyJWT  from '../middlewares/auth.middleware.js';

const router = Router();

router.route("/currentUser").post(verifyJWT, getCurrentUser);
router.route("/register").post(upload.single("avatar"), registerUser);
router.route("/login").post(loginUser);
router.route("/verfiy-email").post(verifyOTP);
router.route("/logout").post(verifyJWT,logoutUser);
router.route("/update-user-avatar").patch(verifyJWT,upload.single("avatar"), updateUserAvatar);
router.route("/update-user-account").patch(verifyJWT, updateUserAccount)

export {router as userRouter}