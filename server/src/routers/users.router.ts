import { Router, Request, Response } from 'express';
import { getUserList, getSingleUser, updateUser, deleteUser, updateAccount, updatePassword } from '../controllers/users.controller';
import { verifyToken } from '../middlewares/access-control.middleware';
const router = Router();

router.get('/', getUserList);
router.patch('/update', updateUser);
router.patch('/update-account', verifyToken, updateAccount);
router.patch('/update-password', verifyToken, updatePassword);
router.post('/forgot-password', (req: Request, res: Response) => res.send('hi'));
router.get('/:id', getSingleUser);
router.delete('/:id', deleteUser);

export default router;
