import {Router} from "express"
// import { forgotPassword, getProfile, login, logout, register, resetPassword } from "../controllers/usercontroller.js";
// import { isLoggedIn } from "../middlewares/auth.middleware.js";
import { register , login , logout , getProfile } from "../controllers/user.controller.js";
import { verifyToken } from "../middlewares/auth.middleware.js";

const router=Router();

router.post('/register', register);
router.post('/login', login);
router.get('/logout', logout);
router.get('/me', verifyToken , getProfile);

export default router;