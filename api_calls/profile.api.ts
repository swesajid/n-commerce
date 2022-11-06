import { iSingleProfile } from "../components/validators/profiles.validator";
import logger from "../config/logger";
import { CAN_SKATE_EXCELLENCE, USER_ROLE } from "../server/src/types";

const NAMESPACE = "Users API Calls";
const API_BASE = process.env.NEXT_PUBLIC_API_BASE;

export interface iAPICoach {
    name: string;
    email: string;
    certificates: string[];
}
export interface iAPIOwner {
    name: string;
    email: string;
    title: string;
}
export interface iAPIProfile {
    _id?: string;
    profile_image?: string;
    club_name: string;
    club_logo?: string;
    nccp_number: string;
    club_number: string;
    about_us: string;
    offered_programms: string[];
    contact_name: string;
    address: string;
    tel: string;
    cell?: string;
    email: string;
    website?: string;
    job_title?: string;
    incorporation_number: string;
    facebook?: string;
    twitter?: string;
    instagram?: string;
    youtube?: string;
    linkedin?: string;
    canskateexcellence: CAN_SKATE_EXCELLENCE;
	excellencedetails: string;
    coaches: iAPICoach[];
    owners: iAPIOwner[];
    documents: string[];
}

export const getAllProfilesFromAPI = async (): Promise<iAPIProfile[]> => {
    try {
        const token = <string>localStorage.getItem("skon-auth-token");
        const res = await fetch(`${API_BASE}/profile`, {
            headers: { "skon-auth-token": token },
        });
        const data: iAPIProfile[] = await res.json();
        return data;
    } catch (err: any) {
        logger.error(NAMESPACE, "Error getting profile list", err);
        return [];
    }
};

// export const deleteUserFromAPI = async (id: string): Promise<'success' | 'fail'> => {
//     try {
//         const token = <string>localStorage.getItem('skon-auth-token');
//         const res = await fetch(`${API_BASE}/users/${id}`, { method: 'DELETE', headers: { 'skon-auth-token': token } });
//         const data = await res.json();

//         if (data.msg) {
//             return 'success';
//         } else {
//             return 'fail';
//         }
//     } catch (err: any) {
//         logger.error(NAMESPACE, 'Error Deleting User', err);
//         return 'fail';
//     }
// };

export const getSingleProfileFromAPI = async ( id: string ): Promise<iAPIProfile | null> => {
    try {
        const token = <string>localStorage.getItem("skon-auth-token");
        const res = await fetch(`${API_BASE}/profiles/by-user/${id}`, {
            headers: { "skon-auth-token": token },
        });
        const data = await res.json();
        return data;
    } catch (err: any) {
        logger.error(NAMESPACE, "Get Single Profile", err);
        return null;
    }
};

export const updateProfilefromAPI = async ( profileId: string, profileInfo: iSingleProfile ): Promise<boolean> => {
    try {
        const token = <string>localStorage.getItem("skon-auth-token");

		const formData = new FormData();

		formData.append('profileId', profileId);
		profileInfo.profile_image && formData.append('profile_image', profileInfo.profile_image);
		formData.append('club_name', profileInfo.club_name);
		profileInfo.club_logo && formData.append('club_logo', profileInfo.club_logo);
		formData.append('nccp_number', profileInfo.nccp_number);
		formData.append('club_number', profileInfo.club_number);
		formData.append('about_us', profileInfo.about_us);
		formData.append('contact_name', profileInfo.contact_name);
		formData.append('address', profileInfo.address);
		formData.append('excellencedetails', profileInfo.excellencedetails);
		formData.append('tel', profileInfo.tel);
		profileInfo.cell && formData.append('cell', profileInfo.cell);
		formData.append('email', profileInfo.email);
		profileInfo.website && formData.append('website', profileInfo.website);
		profileInfo.job_title && formData.append('job_title', profileInfo.job_title);
		formData.append('incorporation_number', profileInfo.incorporation_number);
		profileInfo.facebook && formData.append('facebook', profileInfo.facebook);
		profileInfo.twitter && formData.append('twitter', profileInfo.twitter);
		profileInfo.instagram && formData.append('instagram', profileInfo.instagram);
		profileInfo.youtube && formData.append('youtube', profileInfo.youtube);
		profileInfo.linkedin && formData.append('linkedin', profileInfo.linkedin);
		formData.append( 'canskateexcellence', profileInfo.canskateexcellence );
		formData.append( 'offered_programms', JSON.stringify(profileInfo.offered_programms));
		formData.append( 'coaches', JSON.stringify(profileInfo.coaches));
		formData.append( 'owners', JSON.stringify(profileInfo.owners));
		if (profileInfo.documents) {	
			for (let file of profileInfo.documents){
				formData.append('documents', file);
			}
		}
		
        const res = await fetch(`${API_BASE}/profiles`, {
            method: "PATCH",
            headers: {
                "skon-auth-token": token,
            },
            body: formData,
        });
        const data = await res.json();

        if (data.msg) {
            return true;
        } else {
            return false;
        }
    } catch (err: any) {
        logger.error(NAMESPACE, "Profile update error", err);
        return false;
    }
};
