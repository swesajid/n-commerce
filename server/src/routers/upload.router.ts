import { Request, Response, Router } from 'express';
import logger from '../config/logger';
import { verifyToken } from '../middlewares/access-control.middleware';
import { formatError } from '../utils/error.util';
import { uploadFileToCDN } from '../utils/upload.util';

const router = Router();

const NAMESPACE = 'Upload Image Router';

router.post('/', verifyToken, async (req: Request, res: Response) => {
    try {
        const ALLOWED_EXTENSIONS = /png|jpg|jpeg|webp/;
        if (!req.files) {
            logger.error(NAMESPACE, 'No files received');
            return res.status(400).json(formatError('No files received'));
        }

        const image: any = req.files.upload;
        const { imageName } = req.body;
        const extName = imageName.split('.')[imageName.split('.').length - 1];

        if (!ALLOWED_EXTENSIONS.test(extName)) {
            logger.error(NAMESPACE, 'Invalid file type');
            return res.status(400).json(formatError('Only Image files are acceptable'));
        }

        // Will be removed after the CDN is introduced.
        const imageUrl = await uploadFileToCDN(image, imageName);

        if (imageUrl === 'fail') {
            return res.json({ imageUrl: '' });
        }

        res.json({ imageUrl });
    } catch (err: any) {
        logger.error(NAMESPACE, 'Upload Error', err);
        res.json({ imageUrl: '' });
    }
});

export default router;
