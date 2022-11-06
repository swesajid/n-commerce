import { body } from 'express-validator';

export const createResourceSchema = [
    body('name', 'Resource name is required').isString(),
    body('description', 'Resource description is required').isString(),
    body('tag', 'Resource main tag is required').isString(),
    body('additionalTags', 'Resource additional tag is required').isString().optional(),
    body('permalink', 'Resource permalink is required').isString(),
    body('publish', 'Resource publishing decision is required').isBoolean({ loose: true }),
];

export const updateResourceSchema = [
    body('name', 'Resource name is required').isString(),
    body('description', 'Resource description is required').isString(),
    body('tag', 'Resource main tag is required').isString(),
    body('additionalTags', 'Resource additional tag is required').isString().optional(),
    body('permalink', 'Resource permalink is required').isString(),
    body('publish', 'Resource publishing decision is required').isBoolean({ loose: true }),
];
