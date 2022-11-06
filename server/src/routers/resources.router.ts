import { Router } from 'express';
import {
    createResource,
    deleteResource,
    getAllResources,
    getpermalinkFromTitle,
    singleResource,
    updateResource,
} from '../controllers/resources.controller';
import { verifyToken } from '../middlewares/access-control.middleware';
import validateRequest from '../middlewares/error.validation';
import { createResourceSchema, updateResourceSchema } from '../validators/resource.validator';
const router = Router();

router.patch('/update', updateResourceSchema, validateRequest, verifyToken, updateResource);
router.post('/create', createResourceSchema, validateRequest, verifyToken, createResource);
router.post('/get-permalink', getpermalinkFromTitle);
router.get('/', getAllResources);
router.get('/:id', singleResource);
router.delete('/:id', verifyToken, deleteResource);

export default router;
