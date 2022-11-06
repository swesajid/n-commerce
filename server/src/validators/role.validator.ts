import { body } from 'express-validator';

export const createRoleSchema = [
    body('name', 'Role name is required').isString(),
    body('description', 'Role description is required').isString(),
];

export const updateRoleSchema = [
    body('roleId', 'Role ID is required').isString(),
    body('name', 'Role name is required').isString().optional(),
    body('description', 'Role description is required').isString().optional(),
];
