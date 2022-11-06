import { body } from 'express-validator';

export const createCategorieSchema = [
    body('name', 'Categorie name is required').isString(),
    body('description', 'Tag description is required').isString(),
];

export const updateCategorieSchema = [
    body('name', 'Categorie name is required').isString(),
    body('description', 'Tag description is required').isString(),
];
