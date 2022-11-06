import { iResource } from '../components/validators/resources.validator';
import logger from '../config/logger';

const NAMESPACE = 'Resources API Calls';
const API_BASE = process.env.NEXT_PUBLIC_API_BASE;

export interface iAPIResource {
    name: string;
    description: string;
    tag: string;
    additionalTags: string[];
    resource_files: string[];
    featured_image: string;
    videolink: string;
    videofile?: any;
    permalink: string;
    publish?: boolean;
    _id: string;
    createdAt: Date | string;
}

type GENERAL_RETURN_TYPE = 'success' | 'fail';

export const getPermalinkFromAPI = async (title: string): Promise<string> => {
    try {
        const res = await fetch(`${API_BASE}/resources/get-permalink`, {
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

export const getAllResourcesFromAPI = async (): Promise<iAPIResource[]> => {
    try {
        const token = <string>localStorage.getItem('skon-auth-token');
        const res = await fetch(`${API_BASE}/resources`, { headers: { 'skon-auth-token': token } });
        const data: iAPIResource[] = await res.json();
        return data;
    } catch (err: any) {
        logger.error(NAMESPACE, 'Error getting resource list', err);
        return [];
    }
};

export const deleteResourceFromAPI = async (id: string): Promise<'success' | 'fail'> => {
    try {
        const token = <string>localStorage.getItem('skon-auth-token');
        const res = await fetch(`${API_BASE}/resources/${id}`, {
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
        logger.error(NAMESPACE, 'Error Deleting Resource', err);
        return 'fail';
    }
};

export const createResourceFromAPI = async (data: iResource): Promise<GENERAL_RETURN_TYPE> => {
    try {

		console.log("Inside API",data);
		
        const formData = new FormData();

        formData.append('name', data.name);
        formData.append('description', data.description);
        formData.append('tag', data.tag);
        formData.append('additionalTags', JSON.stringify(data.additionalTags));
        formData.append('videolink', data.videolink);
        formData.append('permalink', data.permalink);
        formData.append('publish', data.publish.toString());
        data.featured_image && formData.append('featured_image', data.featured_image);
        data.videofile && formData.append('videofile', data.videofile);
		if (data.resource_files) {	
			for (let file of data.resource_files){
				formData.append('resource_files', file);
			}
		}

        const token = localStorage.getItem('skon-auth-token') as string;
        const res = await fetch(`${API_BASE}/resources/create`, {
            method: 'POST',
            headers: { 'skon-auth-token': token },
            body: formData,
        });
        const info = await res.json();

        if (info.errors) {
			console.log(info.errors);
			
            return info.errors;
        } else {
            return 'success';
        }
    } catch (err: any) {
        logger.error(NAMESPACE, 'Create Resource Error', err);
        return 'fail';
    }
};

export const getSingleResourceFromAPI = async (id: string): Promise<iAPIResource | null> => {
    try {
        const token = <string>localStorage.getItem('skon-auth-token');
        const res = await fetch(`${API_BASE}/resources/${id}`, { headers: { 'skon-auth-token': token } });
        const data = await res.json();
        return data;
    } catch (err: any) {
        logger.error(NAMESPACE, 'Get Single Resource', err);
        return null;
    }
};

export const updateResourcefromAPI = async (id: string, resource: iResource): Promise<boolean> => {
    try {
        const token = <string>localStorage.getItem('skon-auth-token');
		const formData = new FormData();

		formData.append('resourceId', id);
		formData.append('name', resource.name);
		formData.append('description', resource.description);
		formData.append('tag', resource.tag);
		formData.append( 'additionalTags', JSON.stringify(resource.additionalTags));
		formData.append('videolink', resource.videolink);
        formData.append('permalink', resource.permalink);
        formData.append('publish', resource.publish.toString());
		resource.featured_image && formData.append('featured_image', resource.featured_image);
        resource.videofile && formData.append('videofile', resource.videofile);
		if (resource.resource_files) {	
			for (let file of resource.resource_files){
				formData.append('resource_files', file);
			}
		}

		const res = await fetch(`${API_BASE}/resources/update`, {
            method: "PATCH",
            headers: {
                "skon-auth-token": token,
            },
            body: formData,
        });
        const data = await res.json();

        if (data.errors) {
            logger.error(NAMESPACE, 'Checking error: ', data);
            return false;
        }

        return true;
    } catch (err: any) {
        logger.error(NAMESPACE, 'Update resource error');
        return false;
    }
};
