import { iAnnouncement } from '../components/validators/announcements.validator';
import logger from '../config/logger';

const NAMESPACE = 'Announcements API Calls';
const API_BASE = process.env.NEXT_PUBLIC_API_BASE;

export interface iAPIAnnouncement {
    name: string;
    description: string;
    publication_date: Date;
    expiration_date: Date;
    permalink: string;
    publish?: boolean;
    _id: string;
    createdAt: Date | string;
}

type GENERAL_RETURN_TYPE = 'success' | 'fail';

export const getPermalinkFromAPI = async (title: string): Promise<string> => {
    try {
        const res = await fetch(`${API_BASE}/announcements/get-permalink`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title }),
        });
        const data = await res.json();
        return data.permalink;
    } catch (err: any) {
        console.log(err);
        return '';
    }
};

export const getAllAnnouncementsFromAPI = async (): Promise<iAPIAnnouncement[]> => {
    try {
        const token = <string>localStorage.getItem('skon-auth-token');
        const res = await fetch(`${API_BASE}/announcements`, { headers: { 'skon-auth-token': token } });
        const data: iAPIAnnouncement[] = await res.json();
        return data;
    } catch (err: any) {
        logger.error(NAMESPACE, 'Error getting announcement list', err);
        return [];
    }
};

export const deleteAnnouncementFromAPI = async (id: string): Promise<'success' | 'fail'> => {
    try {
        const token = <string>localStorage.getItem('skon-auth-token');
        const res = await fetch(`${API_BASE}/announcements/${id}`, {
            method: 'DELETE',
            headers: { 'skon-auth-token': token },
        });
        const data = await res.json();

        if (data.msg) {
            return 'success';
        } else {
            return 'fail';
        }
    } catch (err: any) {
        logger.error(NAMESPACE, 'Error Deleting Announcement', err);
        return 'fail';
    }
};

export const createAnnouncementFromAPI = async (data: iAnnouncement): Promise<GENERAL_RETURN_TYPE> => {
    try {
        const formData = new FormData();

        formData.append('name', data.name);
        formData.append('description', data.description);
        formData.append('publication_date', data.publication_date);
        formData.append('expiration_date', data.expiration_date);
        formData.append('permalink', data.permalink);
        formData.append('publish', data.publish.toString());

        const token = localStorage.getItem('skon-auth-token') as string;
        const res = await fetch(`${API_BASE}/announcements/create`, {
            method: 'POST',
            headers: { 'skon-auth-token': token },
            body: formData,
        });
        const info = await res.json();

        if (info.success) {
            return 'success';
        } else {
            return 'fail';
        }
    } catch (err: any) {
        logger.error(NAMESPACE, 'Create Announcement Error', err);
        return 'fail';
    }
};

export const getSingleAnnouncementFromAPI = async (id: string): Promise<iAPIAnnouncement | null> => {
    try {
        const token = <string>localStorage.getItem('skon-auth-token');
        const res = await fetch(`${API_BASE}/announcements/${id}`, { headers: { 'skon-auth-token': token } });
        const data = await res.json();
        return data;
    } catch (err: any) {
        logger.error(NAMESPACE, 'Get Single Announcement', err);
        return null;
    }
};

export const updateAnnouncementfromAPI = async (id: string, announcement: iAnnouncement): Promise<boolean> => {
    try {
        const token = <string>localStorage.getItem('skon-auth-token');
        const res = await fetch(`${API_BASE}/announcements/update`, {
            method: 'PATCH',
            headers: { 'skon-auth-token': token, 'Content-Type': 'application/json' },
            body: JSON.stringify({
                announcementId: id,
                name: announcement.name,
                description: announcement.description,
                publication_date: announcement.publication_date,
                expiration_date: announcement.expiration_date,
                permalink: announcement.permalink,
                publish: announcement.publish,
            }),
        });
        const data = await res.json();

        if (data.errors) {
            logger.error(NAMESPACE, 'Checking error: ', data);
            return false;
        }

        return true;
    } catch (err: any) {
        logger.error(NAMESPACE, 'Update announcement error');
        return false;
    }
};
