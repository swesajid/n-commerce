import { Request, Response } from 'express';
import { UploadedFile } from 'express-fileupload';
import logger from '../config/logger';
import { iApiUser } from '../interfaces/auth.interface';
import Resource from '../models/Resource.model';
import { formatError } from '../utils/error.util';
import { uploadFileToCDN } from '../utils/upload.util'; 

const NAMESPACE = 'Resources Controller';
const ALLOWED_FILE_EXTENSIONS = /pdf|doc|docx/;
const ALLOWED_VIDEO_EXTENSIONS = /m4v|avi|mpg|mp4|webm/;
const ALLOWED_IMAGE_EXTENSIONS = /png|jpg|jpeg|webp/;

// Get Permalink
export const getpermalinkFromTitle = async (req: Request, res: Response) => {
    const title: string = req.body.title;

    try {
        if (!req.body.title) {
            return res.status(400).json(formatError('Invalid Title'));
        }
        let permalink = title.toLowerCase().trim().split(' ').join('-');
        const permalinks = await Resource.find({ permalink: new RegExp(permalink) }).select('permalink');

        if (permalinks.length > 0) {
            permalink = `${permalink}-${permalinks.length}`;
        }

        res.json({ permalink });
    } catch (err: any) {
        logger.error(NAMESPACE, 'Permalink generation error', err);
        res.status(500).json(formatError('Server Error'));
    }
};

// Create Event
export const createResource = async (req: Request, res: Response) => {
    try {
        const { name, description, tag, additionalTags, featured_image, videolink, permalink, publish } = req.body;
        const user: iApiUser = req.body.api_user;

        const newResource = new Resource({ name, description, tag, additionalTags: JSON.parse(additionalTags), featured_image, videolink, permalink, publish });
        const permalinks = await Resource.find({ permalink: new RegExp(permalink) }).select('permalink');

        if (permalinks.length > 0) {
            newResource.permalink = `${newResource.permalink}-${permalinks.length}`;
        }

        newResource.user = user._id;

        if (req.files) {

			// Get Featured Image
			if (req.files.featured_image) {
				const featured_image: any = req.files.featured_image;
				const featureImageExtName = featured_image.name.split(".")[
					featured_image.name.split(".").length - 1
				];
				if (!ALLOWED_IMAGE_EXTENSIONS.test(featureImageExtName)) {
					return res
						.status(400)
						.json(
							formatError(
								"Only Image files are acceptable for profile image"
							)
						);
				}
				const featuredImageUrl = await uploadFileToCDN(featured_image, featured_image.name);
				newResource.featured_image = featuredImageUrl;
				
			}

			// Get Video File
			if (req.files.videofile) {
				const videofile: any = req.files.videofile;
				const videoFileExtName = videofile.name.split(".")[
					videofile.name.split(".").length - 1
				];
				if (!ALLOWED_VIDEO_EXTENSIONS.test(videoFileExtName.toLowerCase())) {
					return res
						.status(400)
						.json(
							formatError(
								"Only m4v, avi, mpg, mp4 and webm files are acceptable for video file"
							)
						);
				}
				const videoFileUrl = await uploadFileToCDN(videofile, videofile.name);
				newResource.videofile = videoFileUrl;
				
			}

			// Get Resources Files
			if (req.files.resource_files) {
				const resource_files: any = req.files.resource_files;
				const resourceUrls: string[] = [];
				if(Array.isArray(req.files.resource_files)) {
					resource_files.forEach( async (resource_file: any) => {
						const resourceExtName = resource_file.name.split(".")[
							resource_file.name.split(".").length - 1
						];
						if (!ALLOWED_FILE_EXTENSIONS.test(resourceExtName)) {
							return res
								.status(400)
								.json(
									formatError(
										"Only pdf, doc and docx files are acceptable for resource files"
									)
								);
						}
						const resourceUrl = await uploadFileToCDN(resource_file, resource_file.name);
						resourceUrls.push(resourceUrl)
					})

				} else {
					const resourceExtName = resource_files.name.split(".")[
						resource_files.name.split(".").length - 1
					];
					if (!ALLOWED_FILE_EXTENSIONS.test(resourceExtName)) {
						return res
							.status(400)
							.json(
								formatError(
									"Only pdf, doc and docx files are acceptable for resource files"
								)
							);
					}
					const resourceUrl = await uploadFileToCDN(resource_files, resource_files.name);
					resourceUrls.push(resourceUrl)
				}
				
				newResource.resource_files = resourceUrls;
			}

        }

        await newResource.save();

        res.json({ success: true });
    } catch (err: any) {
        logger.error(NAMESPACE, 'Create resource error', err);
        res.status(500).json(formatError('Server error'));
    }
};

// Update Event
export const updateResource = async (req: Request, res: Response) => {
    const { resourceId, name, description, tag, additionalTags, videolink, permalink, publish } = req.body;
    const user: iApiUser = req.body.api_user;

    try {
        const resourceFound = await Resource.findById(resourceId);

        if (!resourceFound) {
            return res.status(404).json(formatError('Resource not found'));
        }

        const to_update: any = {
            name,
            description,
            tag,
            additionalTags: JSON.parse(additionalTags),
            videolink,
            permalink,
            publish,
        };

        if (req.files) {

            // Get Featured Image
			if (req.files.featured_image) {
				const featured_image: any = req.files.featured_image;
				const featureImageExtName = featured_image.name.split(".")[
					featured_image.name.split(".").length - 1
				];
				if (!ALLOWED_IMAGE_EXTENSIONS.test(featureImageExtName)) {
					return res
						.status(400)
						.json(
							formatError(
								"Only Image files are acceptable for profile image"
							)
						);
				}
				const featuredImageUrl = await uploadFileToCDN(featured_image, featured_image.name);
				to_update.featured_image = featuredImageUrl;
				
			}

			// Get Video File
			if (req.files.videofile) {
				const videofile: any = req.files.videofile;
				const videoFileExtName = videofile.name.split(".")[
					videofile.name.split(".").length - 1
				];
				if (!ALLOWED_VIDEO_EXTENSIONS.test(videoFileExtName.toLowerCase())) {
					return res
						.status(400)
						.json(
							formatError(
								"Only m4v, avi, mpg, mp4 and webm files are acceptable for video file"
							)
						);
				}
				const videoFileUrl = await uploadFileToCDN(videofile, videofile.name);
				to_update.videofile = videoFileUrl;
				
			}

			// Get Resources Files
			if (req.files.resource_files) {
				const resource_files: any = req.files.resource_files;
				const resourceUrls: string[] = [];
				if(Array.isArray(req.files.resource_files)) {
					resource_files.forEach( async (resource_file: any) => {
						const resourceExtName = resource_file.name.split(".")[
							resource_file.name.split(".").length - 1
						];
						if (!ALLOWED_FILE_EXTENSIONS.test(resourceExtName)) {
							return res
								.status(400)
								.json(
									formatError(
										"Only pdf, doc and docx files are acceptable for resource files"
									)
								);
						}
						const resourceUrl = await uploadFileToCDN(resource_file, resource_file.name);
						resourceUrls.push(resourceUrl)
					})

				} else {
					const resourceExtName = resource_files.name.split(".")[
						resource_files.name.split(".").length - 1
					];
					if (!ALLOWED_FILE_EXTENSIONS.test(resourceExtName)) {
						return res
							.status(400)
							.json(
								formatError(
									"Only pdf, doc and docx files are acceptable for resource files"
								)
							);
					}
					const resourceUrl = await uploadFileToCDN(resource_files, resource_files.name);
					resourceUrls.push(resourceUrl)
				}
				
				to_update.resource_files = resourceUrls;
			}

        }

        await Resource.findByIdAndUpdate(resourceId, to_update);

        res.json({ success: true });
    } catch (err: any) {
        logger.error(NAMESPACE, 'Update resource error', err);
        res.status(500).json(formatError('Server error'));
    }
};

// View Single Event
export const singleResource = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const resourceFound = await Resource.findById(id);

        if (!resourceFound) {
            return res.status(404).json(formatError('No resources found'));
        }

        res.json(resourceFound);
    } catch (err: any) {
        logger.error(NAMESPACE, 'View single resource error', err);
        res.status(500).json(formatError('Server error'));
    }
};

// View Single Event
export const deleteResource = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const resourceFound = await Resource.findById(id);

        if (!resourceFound) {
            return res.status(404).json(formatError('No resources found'));
        }

        await Resource.findByIdAndDelete(id);

        res.json({ msg: 'success' });
    } catch (err: any) {
        logger.error(NAMESPACE, 'View single resource error', err);
        res.status(500).json(formatError('Server error'));
    }
};

// Get All Events
export const getAllResources = async (req: Request, res: Response) => {
    try {
        const published = req.query.published;

        if (published === 'true') {
            const today = new Date().toISOString();
            const resources = await Resource.find({ publish: true }).sort({ date: 'asc' });
            return res.json(resources);
        } else {
            const resources = await Resource.find({}).sort({ date: 'asc' });
            return res.json(resources);
        }
    } catch (err: any) {
        logger.error(NAMESPACE, 'View all resources error', err);
        res.status(500).json(formatError('Server error'));
    }
};
