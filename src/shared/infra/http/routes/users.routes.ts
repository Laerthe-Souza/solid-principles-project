import { Router } from 'express';

import { CreateUserController } from '@modules/users/useCases/createUser/CreateUserController';
import { DeleteUserController } from '@modules/users/useCases/deleteUser/DeleteUserController';

import { ensureAuthentication } from '../middlewares/ensureAuthentication';

const usersRoutes = Router();

const createUserController = new CreateUserController();
const deleteUserController = new DeleteUserController();

usersRoutes.post('/', createUserController.handle);
usersRoutes.delete('/', ensureAuthentication, deleteUserController.handle);

export { usersRoutes };
