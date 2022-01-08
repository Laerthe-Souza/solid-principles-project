import { container } from 'tsyringe';

import { UsersRepository } from '@modules/users/infra/typeorm/repositories/UsersRepository';
import { IUsersRepository } from '@modules/users/repositories/IUsersRepository';
import { IHashProvider } from '@shared/providers/HashProvider/IHashProvider';
import { BcryptHashProvider } from '@shared/providers/HashProvider/implementations/BcryptHashProvider';
import { JsonWebTokenProvider } from '@shared/providers/TokenProvider/implementations/JsonWebTokenProvider';
import { ITokenProvider } from '@shared/providers/TokenProvider/ITokenProvider';

container.registerSingleton<IUsersRepository>(
  'UsersRepository',
  UsersRepository,
);

container.registerSingleton<IHashProvider>('HashProvider', BcryptHashProvider);

container.registerSingleton<ITokenProvider>(
  'TokenProvider',
  JsonWebTokenProvider,
);
