import express from 'express';
import { Signup, Login, Logout, Check_Auth, Update_Assistant, askAssistant } from '../controllers/auth.controller.js';
import auth from '../middlewares/auth.middleware.js';
import multer from 'multer';
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const authRouter = express.Router();

authRouter.post('/register', Signup);
authRouter.post('/login',  Login);   
authRouter.post('/logout', auth, Logout);
authRouter.get('/check-auth', auth, Check_Auth)
authRouter.post('/update-assistant', auth ,upload.single('file'), Update_Assistant)
authRouter.post('/askassistant' , auth, askAssistant)

export default authRouter;