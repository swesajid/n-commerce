import { body, oneOf, check } from 'express-validator';

export const loginValidSchema = [
    oneOf(
        [check('email').exists({ checkFalsy: true }), check('username').exists({ checkFalsy: true })],
        'Must login with email or username'
    ),
    // .optional()
    // .isEmail()
    // .if(body('username').isEmpty({ ignore_whitespace: true })),
    // .optional()
    // .if(body('email').isEmpty({ ignore_whitespace: true })),
    body('password', 'Invalid password').isLength({ min: 5 }),
];

export const signupValidSchema = [
    body('name', 'First name is required').isString(),
    body('email', 'Email is required').isEmail(),
    body('role', 'Role is required').isString(),
    body('username').isString().optional(),
    body('password', 'Password must be at least 6 characters').isLength({ min: 5 }),
];

export const forgotPasswordValidSchema = [body('email').isEmail()];
