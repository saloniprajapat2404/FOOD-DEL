import express from "express";
import { register, login } from "../controllers/authController.js";

const authRouter = express.Router();

authRouter.post('/register', register);
authRouter.post('/login', login);

// temporary health check to confirm router is mounted
authRouter.get('/ping', (req, res) => {
	res.json({ success: true, msg: 'auth router OK' });
});

export default authRouter;
