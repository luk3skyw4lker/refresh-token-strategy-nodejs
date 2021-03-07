import { Router } from 'express';

import RefreshController from '../controllers/RefreshController';
import UserController from '../controllers/UserController';

const authRouter = Router();

authRouter.get('/refresh', RefreshController.refresh);
authRouter.post('/users', UserController.create);
authRouter.post('/login', UserController.login);

export { authRouter };
