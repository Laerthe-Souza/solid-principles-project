import { Router } from 'express';

import { AuthenticateUserController } from '@modules/users/useCases/authenticateUser/AuthenticateUserController';

const authenticationsRoutes = Router();

const authenticateUserController = new AuthenticateUserController();

authenticationsRoutes.post('/', authenticateUserController.handle);

export { authenticationsRoutes };
