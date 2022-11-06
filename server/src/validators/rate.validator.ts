import { body } from 'express-validator';

export const createRateSchema = [
    body('first_rate', 'Vehicle First Hour Rate is required').isString().optional(),
    body('all_rate', 'Vehicle All Hours Rate is required').isString().optional(),
    body('allday_rate', 'Vehicle 24 Hours Rate is required').isString().optional(),
    body('categorie', 'Vehicle categorie is required').isString().optional(),,
    // body('additionalCategories', 'Vehicle additional categories is required').isString().optional(),
];

export const updateRateSchema = [
    body('first_rate', 'Vehicle First Hour Rate is required').isString().optional(),
    body('all_rate', 'Vehicle All Hours Rate is required').isString().optional(),
    body('allday_rate', 'Vehicle 24 Hours Rate is required').isString().optional(),
    body('categorie', 'Vehicle categorie is required').isString().optional(),,
    // body('additionalCategories', 'Vehicle additional categories is required').isString().optional(),
];
