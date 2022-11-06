import { Request, Response } from 'express';
import logger from '../config/logger';
import { iApiUser } from '../interfaces/auth.interface';
import Announcement from '../models/Announcement.model';
import { formatError } from '../utils/error.util';
import fs from 'fs/promises';
import path from 'path';
import { promisify } from 'util';

const NAMESPACE = 'Announcements Controller';

// Get Permalink
export const getpermalinkFromTitle = async (req: Request, res: Response) => {
    const title: string = req.body.title;

    try {
        if (!req.body.title) {
            return res.status(400).json(formatError('Invalid Title'));
        }
        let permalink = title.toLowerCase().trim().split(' ').join('-');
        const permalinks = await Announcement.find({ permalink: new RegExp(permalink) }).select('permalink');

        if (permalinks.length > 0) {
            permalink = `${permalink}-${permalinks.length}`;
        }

        res.json({ permalink });
    } catch (err: any) {
        logger.error(NAMESPACE, 'Permalink generation error', err);
        res.status(500).json(formatError('Server Error'));
    }
};

// Create Announcement
export const createAnnouncement = async (req: Request, res: Response) => {
    try {
        const { name, description, publication_date, expiration_date, permalink, publish } = req.body;
        const user: iApiUser = req.body.api_user;

        const newAnnouncement = new Announcement({ name, description, publication_date, expiration_date, permalink, publish });
        const permalinks = await Announcement.find({ permalink: new RegExp(permalink) }).select('permalink');

        if (permalinks.length > 0) {
            newAnnouncement.permalink = `${newAnnouncement.permalink}-${permalinks.length}`;
        }

        newAnnouncement.user = user._id;

        await newAnnouncement.save();

        res.json({ success: true });
    } catch (err: any) {
        logger.error(NAMESPACE, 'Create announcement error', err);
        res.status(500).json(formatError('Server error'));
    }
};

// Update Announcement
export const updateAnnouncement = async (req: Request, res: Response) => {
    const { announcementId, name, description, publication_date, expiration_date, permalink, publish } = req.body;

    try {
        const announcementFound = await Announcement.findById(announcementId);

        if (!announcementFound) {
            return res.status(404).json(formatError('Announcement not found'));
        }

        const to_update: any = {
            name,
            description,
            publication_date,
            expiration_date,
            permalink,
            publish,
        };

        await Announcement.findByIdAndUpdate(announcementId, to_update);

        res.json({ success: true });
    } catch (err: any) {
        logger.error(NAMESPACE, 'Update announcement error', err);
        res.status(500).json(formatError('Server error'));
    }
};

// View Single Announcement
export const singleAnnouncement = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const announcementFound = await Announcement.findById(id);

        if (!announcementFound) {
            return res.status(404).json(formatError('No announcements found'));
        }

        res.json(announcementFound);
    } catch (err: any) {
        logger.error(NAMESPACE, 'View single announcement error', err);
        res.status(500).json(formatError('Server error'));
    }
};

// View Single Announcement
export const deleteAnnouncement = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const announcementFound = await Announcement.findById(id);

        if (!announcementFound) {
            return res.status(404).json(formatError('No announcements found'));
        }

        await Announcement.findByIdAndDelete(id);

        res.json({ msg: 'success' });
    } catch (err: any) {
        logger.error(NAMESPACE, 'View single announcement error', err);
        res.status(500).json(formatError('Server error'));
    }
};

// Get All Announcements
export const getAllAnnouncements = async (req: Request, res: Response) => {
    try {
        const published = req.query.published;

        if (published === 'true') {
            const announcements = (await Announcement.find({ publish: true })).reverse();
            return res.json(announcements);
        } else {
            const announcements = (await Announcement.find({})).reverse();
            return res.json(announcements);
        }
    } catch (err: any) {
        logger.error(NAMESPACE, 'View all announcements error', err);
        res.status(500).json(formatError('Server error'));
    }
};
