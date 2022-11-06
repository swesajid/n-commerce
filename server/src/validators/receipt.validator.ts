import { body } from 'express-validator';

export const createReceiptSchema = [
    body('rate', 'Vehicle categorie is required').isString().optional(),
    body('v_number', 'Vehicle number is required').isString().optional(),
    body('date', 'Vehicle date is required').isString().optional(),
    body('check', 'Vehicle check is required').isString().optional(),
];

export const updateReceiptSchema = [
    body('rate', 'Vehicle categorie is required').isString().optional(),
    body('v_number', 'Vehicle number is required').isString().optional(),
    body('date', 'Vehicle date is required').isString().optional(),
    body('check', 'Vehicle check is required').isString().optional(),
];
