import { body } from 'express-validator';

export const createAnnouncementSchema = [
    body('name', 'Announcement name is required').isString(),
    body('description', 'Announcement description is required').isString(),
    body('publication_date', 'Announcement publication date is required').isString(),
    body('expiration_date', 'Announcement expiration date is required').isString(),
    body('permalink', 'Announcement permalink is required').isString(),
    body('publish', 'Announcement publishing decision is required').isBoolean({ loose: true }),
];

export const updateAnnouncementSchema = [
    body('announcementId', 'Announcement ID is required').isString(),
    body('name', 'Announcement name is required').isString().optional(),
    body('description', 'Announcement description is required').isString().optional(),
    body('publication_date', 'Announcement publication date is required').isString().optional(),
    body('expiration_date', 'Announcement expiration date is required').isString().optional(),
    body('permalink', 'Announcement permalink is required').isString().optional(),
    body('publish', 'Announcement publishing decision is required').isBoolean({ loose: true }).optional(),
];
