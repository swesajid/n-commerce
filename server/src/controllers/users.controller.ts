import { constants } from 'buffer';
import { Request, Response } from 'express';
import logger from '../config/logger';
import { iApiUser } from '../interfaces/auth.interface';
import User from '../models/User.model';
import { formatError } from '../utils/error.util';
import * as bcrypt from 'bcryptjs'

const NAMESPACE = 'User Controller';

export const getUserList = async (req: Request, res: Response) => {
    try {
        const users = await User.find({}).select('_id name email username role active ');
        res.json(users);
    } catch (err) {
        logger.error(NAMESPACE, 'Error getting users');
        return res.status(500).json(formatError('Server error'));
    }
};

export const getSingleUser = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const userFound = await User.findById(id).select('_id name email username role active ');

        if (!userFound) {
            return res.status(404).json(formatError('User not found'));
        }

        res.json(userFound);
    } catch (err: any) {
        logger.error(NAMESPACE, 'Error getting user');
        return res.status(500).json(formatError('Server error'));
    }
};

export const updateUser = async (req: Request, res: Response) => {
    const { _id, name, email, username, active, role } = req.body;

    try {
        const userFound = await User.findById(_id);

        if (!userFound) {
            return res.status(404).json(formatError('User not found'));
        }

        const updated = await User.findByIdAndUpdate(_id, { name, email, username, active, role });

        res.status(200).json({ msg: 'Updated user' });
    } catch (err) {
        logger.error(NAMESPACE, 'Error updating user');
        return res.status(500).json(formatError('Server error'));
    }
};

export const deleteUser = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const userFound = await User.findById(id);

        if (!userFound) {
            return res.status(404).json(formatError('User not found'));
        }

        const deleted = await User.findByIdAndDelete(id);

        res.json({ msg: 'Deleted user' });
    } catch (err: any) {
        logger.error(NAMESPACE, 'Error deleting user');
        return res.status(500).json(formatError('Server error'));
    }
};

export const updateAccount = async (req: Request, res: Response) => {
    try {
        
        const { _id, name, email, username, role } = req.body;
		const api_user: iApiUser = req.body.api_user
		
        const userFound = await User.findById(_id);
		
        if (!userFound) {
            return res.status(404).json(formatError('User not found'));
        }

		if(userFound._id.toString() !== api_user._id) {
			return res.status(404).json(formatError('You can only change the account of your own.'));
		}
		
		const updated = await User.findByIdAndUpdate(_id, { name, email, username, role });
        res.json({ msg: 'Updated account' });
    } catch (err: any) {
        logger.error(NAMESPACE, 'Error updating user account', err);
        return res.status(500).json(formatError('Server error'));
    }
};

export const updatePassword = async (req: Request, res: Response) => {
    try {
        
        const { _id, prev_password, password, reenter_password } = req.body;
		const api_user: iApiUser = req.body.api_user
		
        const userFound = await User.findById(_id);
		
        if (!userFound) {
            return res.status(404).json(formatError('User not found'));
        }

		if(userFound._id.toString() !== api_user._id) {
			return res.status(404).json(formatError('You can only change account password of your own.'));
		}

		const passwordMatched = await bcrypt.compare(prev_password, userFound.password);

        if (!passwordMatched) {
            return res.status(401).json(formatError("Previous Password doesn't match"));
        }
		if ( password !== reenter_password ) {
            return res.status(401).json(formatError("Password and Re-type password doesn't match"));
        }

		// Hash Password
		const encrypted = await bcrypt.hash(password, 10);
		
		const updated = await User.findByIdAndUpdate(_id, { password: encrypted });
		
        res.json({ msg: 'Password updated ' });
    } catch (err: any) {
        logger.error(NAMESPACE, 'Error updating user password', err);
        return res.status(500).json(formatError('Server error'));
    }
};
