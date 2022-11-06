import { Request, Response } from 'express';
import logger from '../config/logger';
import { iApiUser } from '../interfaces/auth.interface';
import Categorie from '../models/Categorie.model';
import { formatError } from '../utils/error.util';

const NAMESPACE = 'Categories Controller';


// Create Categories
export const createCategorie = async (req: Request, res: Response) => {
    try {
        const { name, description } = req.body;
        const user: iApiUser = req.body.api_user;

        const newCategorie = new Categorie({ name, description});

         newCategorie.user = user._id;

        await newCategorie.save();

        res.json({ success: true });
    } catch (err: any) {
        logger.error(NAMESPACE, 'Create categorie error', err);
        res.status(500).json(formatError(err));
    }
};

// Update Categories
export const updateCategorie = async (req: Request, res: Response) => {
    const { categorieId, name, description} = req.body;

    try {
        const categorieFound = await Categorie.findById(categorieId);

        if (!categorieFound) {
            return res.status(404).json(formatError('Categorie not found'));
        }

        const to_update: any = {
            name,
            description
        };

        await Categorie.findByIdAndUpdate(categorieId, to_update);

        res.json({ success: true });
    } catch (err: any) {
        logger.error(NAMESPACE, 'Update categorie error', err);
        res.status(500).json(formatError('Server error'));
    }
};

// View Single Categories
export const singleCategorie = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const categorieFound = await Categorie.findById(id);

        if (!categorieFound) {
            return res.status(404).json(formatError('No categories found'));
        }

        res.json(categorieFound);
    } catch (err: any) {
        logger.error(NAMESPACE, 'View single categorie error', err);
        res.status(500).json(formatError('Server error'));
    }
};

// View Single Categories
export const deleteCategorie = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const categorieFound = await Categorie.findById(id);

        if (!categorieFound) {
            return res.status(404).json(formatError('No categories found'));
        }

        await Categorie.findByIdAndDelete(id);

        res.json({ msg: 'success' });
    } catch (err: any) {
        logger.error(NAMESPACE, 'View single categorie error', err);
        res.status(500).json(formatError('Server error'));
    }
};

// Get All Categories
export const getAllCategories = async (req: Request, res: Response) => {
    try {
        const published = req.query.published;

        if (published === 'true') {
            const today = new Date().toISOString();
            const categories = await Categorie.find({ publish: true }).sort({ date: 'asc' });
            return res.json(categories);
        } else {
            const categories = await Categorie.find({}).sort({ date: 'asc' });
            return res.json(categories);
        }
    } catch (err: any) {
        logger.error(NAMESPACE, 'View all categories error', err);
        res.status(500).json(formatError('Server error'));
    }
};
