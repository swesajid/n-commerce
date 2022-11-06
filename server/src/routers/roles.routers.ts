import { Router } from 'express';
import {
    getRoleList,
    createRole,
    getSingleRole,
    updateRole,
    deleteRole,
} from '../controllers/role.controller';
import { verifyToken } from '../middlewares/access-control.middleware';
import validateRequest from '../middlewares/error.validation';
import { createRoleSchema, updateRoleSchema } from '../validators/role.validator'
const router = Router();

router.patch('/update', updateRoleSchema, validateRequest, verifyToken, updateRole);
router.post('/create', createRoleSchema, validateRequest, verifyToken, createRole);
router.get('/', getRoleList);
router.get('/:id', getSingleRole);
router.delete('/:id', verifyToken, deleteRole);

export default router;
