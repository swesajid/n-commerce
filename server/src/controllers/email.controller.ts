import { Request, Response } from 'express';
import logger from '../config/logger';
import { iApiUser } from '../interfaces/auth.interface';
import Email from '../models/Email.model';
import { formatError } from '../utils/error.util';

const NAMESPACE = 'Email Controller';

export const getEmailList = async (req: Request, res: Response) => {
    try {
        const emails = await Email.find({}).select('_id name subject description');
        res.json(emails);
    } catch (err) {
        logger.error(NAMESPACE, 'Error getting emails');
        return res.status(500).json(formatError('Server error'));
    }
};

// Create Event
export const createEmail = async (req: Request, res: Response) => {
    try {
        const { name, subject, description } = req.body;
        const user: iApiUser = req.body.api_user;

        const newEmail = new Email({ name, subject, description });

        await newEmail.save();

        res.json({ success: true });
    } catch (err: any) {
        logger.error(NAMESPACE, 'Create email error', err);
        res.status(500).json(formatError('Server error'));
    }
};

export const getSingleEmail = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const emailFound = await Email.findById(id).select('_id name subject description');

        if (!emailFound) {
            return res.status(404).json(formatError('Email not found'));
        }

        res.json(emailFound);
    } catch (err: any) {
        logger.error(NAMESPACE, 'Error getting email');
        return res.status(500).json(formatError('Server error'));
    }
};

export const updateEmail = async (req: Request, res: Response) => {
    const { emailId, name, subject, description } = req.body;

    try {
        const emailFound = await Email.findById(emailId);

        if (!emailFound) {
            return res.status(404).json(formatError('Email not found'));
        }

        const updated = await Email.findByIdAndUpdate(emailId, { name, subject, description });

        res.status(200).json({ msg: 'Updated email' });
    } catch (err) {
        logger.error(NAMESPACE, 'Error updating email');
        return res.status(500).json(formatError('Server error'));
    }
};