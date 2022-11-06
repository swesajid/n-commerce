import { iSingleAccount } from '../components/validators/accounts.validator';
import { iPassword } from '../components/validators/password.validator';
import { iSingleUser } from '../components/validators/users.validator';
import logger from '../config/logger';
import { USER_ROLE } from '../server/src/types';

const NAMESPACE = 'Users API Calls';
const API_BASE = process.env.NEXT_PUBLIC_API_BASE;

export interface iAPIUSer {
    name: string;
    active: string;
    email: string;
    role: USER_ROLE;
    username: string;
    _id: string;
}

export const getAllUsersFromAPI = async (): Promise<iAPIUSer[]> => {
    try {
        const token = <string>localStorage.getItem('skon-auth-token');
        const res = await fetch(`${API_BASE}/users`, { headers: { 'skon-auth-token': token } });
        const data: iAPIUSer[] = await res.json();
        return data;
    } catch (err: any) {
        logger.error(NAMESPACE, 'Error getting user list', err);
        return [];
    }
};

export const deleteUserFromAPI = async (id: string): Promise<'success' | 'fail'> => {
    try {
        const token = <string>localStorage.getItem('skon-auth-token');
        const res = await fetch(`${API_BASE}/users/${id}`, { method: 'DELETE', headers: { 'skon-auth-token': token } });
        const data = await res.json();

        if (data.msg) {
            return 'success';
        } else {
            return 'fail';
        }
    } catch (err: any) {
        logger.error(NAMESPACE, 'Error Deleting User', err);
        return 'fail';
    }
};

export const getSingleUserFromAPI = async (id: string): Promise<iAPIUSer | null> => {
    try {
        const token = <string>localStorage.getItem('skon-auth-token');
        const res = await fetch(`${API_BASE}/users/${id}`, { headers: { 'skon-auth-token': token } });
        const data = await res.json();
        return data;
    } catch (err: any) {
        logger.error(NAMESPACE, 'Get Single User', err);
        return null;
    }
};

export const updateUserfromAPI = async (id: string, userInfo: iSingleUser): Promise<boolean> => {
    try {
        const token = <string>localStorage.getItem('skon-auth-token');
        const res = await fetch(`${API_BASE}/users/update`, {
            method: 'PATCH',
            headers: { 'skon-auth-token': token, 'Content-Type': 'application/json' },
            body: JSON.stringify({
                _id: id,
                name: userInfo.name,
                email: userInfo.email,
                username: userInfo.username,
                role: userInfo.role,
                active: userInfo.active,
                // active: userInfo.active === 'Active' ? 'Active' : "Inactive",
            }),
        });
        const data = await res.json();

        if (data.msg) {
            return true;
        } else {
            return false;
        }

        // if (data.errors) {
        //     return false;
        // }

        // return true;
    } catch (err: any) {
        logger.error(NAMESPACE, 'Update user error');
        return false;
    }
};

export const updateUserAccountfromAPI = async (id: string, userDetails: iSingleAccount): Promise<boolean> => {
    try {
        const token = <string>localStorage.getItem('skon-auth-token');
        const res = await fetch(`${API_BASE}/users/update-account`, {
            method: 'PATCH',
            headers: { 'skon-auth-token': token, 'Content-Type': 'application/json' },
            body: JSON.stringify({
                _id: id,
                name: userDetails.name,
                email: userDetails.email,
                username: userDetails.username,
                role: userDetails.role,
            }),
        });
        const data = await res.json();

        if (data.msg) {
            return true;
        } else {
            return false;
        }
    } catch (err: any) {
        logger.error(NAMESPACE, 'Update user error');
        return false;
    }
};

export const updateUserPasswordfromAPI = async (id: string, passDetails: iPassword): Promise<boolean> => {
    try {
        const token = <string>localStorage.getItem('skon-auth-token');
        const res = await fetch(`${API_BASE}/users/update-password`, {
            method: 'PATCH',
            headers: { 'skon-auth-token': token, 'Content-Type': 'application/json' },
            body: JSON.stringify({
                _id: id,
                prev_password: passDetails.prev_password,
                password: passDetails.password,
                reenter_password: passDetails.reenter_password,
            }),
        });
        const data = await res.json();

        if (data.msg) {
            return true;
        } else {
            return false;
        }
    } catch (err: any) {
        logger.error(NAMESPACE, 'Update password error');
        return false;
    }
};