import { Request, Response } from 'express';
import logger from '../config/logger';
import { iApiUser } from '../interfaces/auth.interface';
import Tag from '../models/Tag.model';
import { formatError } from '../utils/error.util';
import fs from 'fs/promises';
import path from 'path';
import { promisify } from 'util';

const NAMESPACE = 'Tags Controller';
// const ALLOWED_EXTENSIONS = /png|jpg|jpeg|webp/;

// Create Event
export const createTag = async (req: Request, res: Response) => {
    try {
        const { name, description, slug } = req.body;
        const user: iApiUser = req.body.api_user;

        const newTag = new Tag({ name, description, slug });

        newTag.user = user._id;

        await newTag.save();

        res.json({ success: true });
    } catch (err: any) {
        logger.error(NAMESPACE, 'Create tag error', err);
        res.status(500).json(formatError('Server error'));
    }
};

// Update Event
export const updateTag = async (req: Request, res: Response) => {
    const { tagId, name, description, slug } = req.body;

    try {
        const tagFound = await Tag.findById(tagId);

        if (!tagFound) {
            return res.status(404).json(formatError('Tag not found'));
        }

        const to_update: any = {
            name,
            description,
            slug,
        };

        await Tag.findByIdAndUpdate(tagId, to_update);

        res.json({ success: true });
    } catch (err: any) {
        logger.error(NAMESPACE, 'Update tag error', err);
        res.status(500).json(formatError('Server error'));
    }
};

// View Single Event
export const singleTag = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const tagFound = await Tag.findById(id);

        if (!tagFound) {
            return res.status(404).json(formatError('No tags found'));
        }

        res.json(tagFound);
    } catch (err: any) {
        logger.error(NAMESPACE, 'View single tag error', err);
        res.status(500).json(formatError('Server error'));
    }
};

// View Single Event
export const deleteTag = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const tagFound = await Tag.findById(id);

        if (!tagFound) {
            return res.status(404).json(formatError('No tags found'));
        }

        await Tag.findByIdAndDelete(id);

        res.json({ msg: 'success' });
    } catch (err: any) {
        logger.error(NAMESPACE, 'View single tag error', err);
        res.status(500).json(formatError('Server error'));
    }
};

// Get All Events
export const getAllTags = async (req: Request, res: Response) => {
    try {
        const published = req.query.published;

        if (published === 'true') {
            const today = new Date().toISOString();
            const tags = await Tag.find({ publish: true }).sort({ date: 'asc' });
            return res.json(tags);
        } else {
            const tags = await Tag.find({}).sort({ date: 'asc' });
            return res.json(tags);
        }
    } catch (err: any) {
        logger.error(NAMESPACE, 'View all tags error', err);
        res.status(500).json(formatError('Server error'));
    }
};
