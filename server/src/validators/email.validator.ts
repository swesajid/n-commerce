import { body } from 'express-validator';

export const createEmailSchema = [
    body('name', 'Email name is required').isString(),
    body('subject', 'Subject is required').isString(),
    body('description', 'Email description is required').isString(),
];

export const updateEmailSchema = [
    // body('emailId', 'Email ID is required').isString(),
    body('name', 'Email name is required').isString().optional(),
    body('subject', 'Subject is required').isString().optional(),
    body('description', 'Email description is required').isString().optional(),
];
