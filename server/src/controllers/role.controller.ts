import { Request, Response } from 'express';
import logger from '../config/logger';
import { iApiUser } from '../interfaces/auth.interface';
import Role from '../models/Role.model';
import { formatError } from '../utils/error.util';

const NAMESPACE = 'Role Controller';

export const getRoleList = async (req: Request, res: Response) => {
    try {
        const roles = await Role.find({}).select('_id name description');
        res.json(roles);
    } catch (err) {
        logger.error(NAMESPACE, 'Error getting roles');
        return res.status(500).json(formatError('Server error'));
    }
};

// Create Event
export const createRole = async (req: Request, res: Response) => {
    try {
        const { name, description } = req.body;
        const user: iApiUser = req.body.api_user;

        const newRole = new Role({ name, description });

        await newRole.save();

        res.json({ success: true });
    } catch (err: any) {
        logger.error(NAMESPACE, 'Create role error', err);
        res.status(500).json(formatError('Server error'));
    }
};

export const getSingleRole = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const roleFound = await Role.findById(id).select('_id name description');

        if (!roleFound) {
            return res.status(404).json(formatError('Role not found'));
        }

        res.json(roleFound);
    } catch (err: any) {
        logger.error(NAMESPACE, 'Error getting role');
        return res.status(500).json(formatError('Server error'));
    }
};

export const updateRole = async (req: Request, res: Response) => {
    const { roleId, name, description } = req.body;

    try {
        const roleFound = await Role.findById(roleId);

        if (!roleFound) {
            return res.status(404).json(formatError('Role not found'));
        }

        const updated = await Role.findByIdAndUpdate(roleId, { name, description });

        res.status(200).json({ msg: 'Updated role' });
    } catch (err) {
        logger.error(NAMESPACE, 'Error updating role');
        return res.status(500).json(formatError('Server error'));
    }
};

export const deleteRole = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const roleFound = await Role.findById(id);

        if (!roleFound) {
            return res.status(404).json(formatError('Role not found'));
        }

        const deleted = await Role.findByIdAndDelete(id);

        res.json({ msg: 'Deleted role' });
    } catch (err: any) {
        logger.error(NAMESPACE, 'Error deleting role');
        return res.status(500).json(formatError('Server error'));
    }
};
