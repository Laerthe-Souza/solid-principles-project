import { Router } from 'express';

import { authenticationsRoutes } from './authentications.routes';
import { usersRoutes } from './users.routes';

const routes = Router();

routes.use('/users', usersRoutes);
routes.use('/authentications', authenticationsRoutes);

export { routes };
