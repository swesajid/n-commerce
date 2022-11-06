import { Router } from 'express';
import { createUser, getUserInfo, loginUser, userForgotPassword } from '../controllers/auth.controller';
import { forgotPasswordValidSchema, loginValidSchema, signupValidSchema } from '../validators/auth.validator';
import validateRequest from '../middlewares/error.validation';
import { verifyToken } from '../middlewares/access-control.middleware';

const router = Router();

router.get('/', verifyToken, getUserInfo);
router.post('/forgot-password', forgotPasswordValidSchema, validateRequest, userForgotPassword);
router.post('/register', signupValidSchema, validateRequest, createUser);
router.post('/login', loginValidSchema, validateRequest, loginUser);

export default router;
