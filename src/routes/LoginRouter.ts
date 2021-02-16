import express, { Router } from 'express';
import AuthController from '../controllers/AuthController';
const LoginRouter = express.Router();

LoginRouter.post('/login', AuthController.login);

export default LoginRouter;