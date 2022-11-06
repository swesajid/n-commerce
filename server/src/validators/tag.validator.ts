import { body } from 'express-validator';

export const createTagSchema = [
    body('name', 'Tag name is required').isString(),
    body('description', 'Tag description is required').isString(),
    body('slug', 'Slug is required').isString(),
];

export const updateTagSchema = [
    body('name', 'Tag name is required').isString(),
    body('description', 'Tag description is required').isString(),
    body('slug', 'Slug is required').isString(),
];
