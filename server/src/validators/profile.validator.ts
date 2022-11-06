import { body } from 'express-validator';

export const createProfileSchema = [
    body('club_name', 'Club/School name is required').isString(),
    body('nccp_number', 'NCCP number is required').isString(),
    body('club_number', 'Club number is required').isString(),
    body('about_us', 'About us is required').isString(),
    body('contact_name', 'Contact name is required').isString(),
    body('address', 'Address is required').isString(),
    body('tel', 'Tel is required').isString(),
    body('email', 'Email is required').isString(),
];

export const updateProfileSchema = [
    body('club_name', 'Club/School name is required').isString(),
    body('nccp_number', 'NCCP number is required').isString(),
    body('club_number', 'Club number is required').isString(),
    body('about_us', 'About us is required').isString(),
    body('excellencedetails', 'Can skate excellence details is required').isString().optional(),
    body('contact_name', 'Contact name is required').isString(),
    body('address', 'Address is required').isString(),
    body('tel', 'Tel is required').isString(),
    body('email', 'Email is required').isString(),
];
