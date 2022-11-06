import * as Yup from 'yup';
const IMAGE_FILE_FORMATS = ['image/jpg', 'image/jpeg', 'image/png'];
export interface iResource {
    name: string;
    description: string;
    tag: string;
    additionalTags: string[];
    resource_files: File[];
    featured_image: File | string | null;
    videolink: string;
    videofile: File | null;
    permalink: string;
    publish: boolean;    
}

export const initialResource: iResource = {
    name: '',
    description: '',
    tag: '',
    additionalTags:[],
    resource_files: [],
    featured_image: "",
    videolink: '',
    videofile: null,
    permalink: '',
    publish: false,
};

export const createResourceSchema = Yup.object().shape({
    name: Yup.string()
        .max(250, 'Maximum 250 characters are allowed')
        .required('Required!'),
    description: Yup.string().min(6, 'Minimum 6 characters are required').required('Required!'),
    tag: Yup.string().required('Required'),
    additionalTags: Yup.array(),
    videolink: Yup.string().url('Must be a valid resource url').optional(),
    permalink: Yup.string().required('Required!'),
    publish: Yup.boolean().required('Required!'),
	featured_image: Yup.mixed()
		.nullable()
		.test('FILE_SIZE', 'File size is too big', (value: any) => !value || (value && value.size <= 1024 * 1024))
		.test(
			'FILE_FORMAT',
			'Unsupported file type',
			(value: any) => !value || (value && IMAGE_FILE_FORMATS.includes(value?.type))
		),
	resource_files: Yup.array().optional().nullable(),
});

export const updateResourceSchema = Yup.object().shape({
    name: Yup.string()
        .max(250, 'Maximum 250 characters are allowed')
        .required('Required!'),
    description: Yup.string().min(6, 'Minimum 6 characters are required').required('Required!'),
    tag: Yup.string().required('Required'),
    additionalTags: Yup.array(),
    videolink: Yup.string().url('Must be a valid resource url').optional(),
    permalink: Yup.string().required('Required!'),
    publish: Yup.boolean().required('Required!'),
	featured_image: Yup.mixed()
		.nullable()
		.test('FILE_SIZE', 'File size is too big', (value: any) => !value || (value && value.size <= 1024 * 1024))
		.test(
			'FILE_FORMAT',
			'Unsupported file type',
			(value: any) => !value || (value && IMAGE_FILE_FORMATS.includes(value?.type))
	),
	resource_files: Yup.array().optional().nullable(),
});

const resourcesValidator = { initialResource, createResourceSchema, updateResourceSchema };
export default resourcesValidator;
