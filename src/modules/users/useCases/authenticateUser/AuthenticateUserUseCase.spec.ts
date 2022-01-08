import { ICreateUserDTO } from '@modules/users/dtos/ICreateUserDTO';
import { User } from '@modules/users/infra/typeorm/models/User';
import { IUsersRepository } from '@modules/users/repositories/IUsersRepository';
import { AppError } from '@shared/errors/AppError';
import { BcryptHashProvider } from '@shared/providers/HashProvider/implementations/BcryptHashProvider';
import { JsonWebTokenProvider } from '@shared/providers/TokenProvider/implementations/JsonWebTokenProvider';

import { CreateUserUseCase } from '../createUser/CreateUserUseCase';
import { AuthenticateUserUseCase } from './AuthenticateUserUseCase';

class UsersRepositoryMock implements IUsersRepository {
  private users: User[] = [];

  async create({ name, email, password }: ICreateUserDTO): Promise<User> {
    const user = new User();

    Object.assign(user, { name, email, password });

    this.users.push(user);

    return user;
  }

  async findByEmail(email: string): Promise<User | undefined> {
    const user = this.users.find(user => user.email === email);

    return user;
  }

  async delete(id: string): Promise<void> {
    const userIndex = this.users.findIndex(user => user.id === id);

    this.users.splice(userIndex, 1);
  }

  async findById(id: string): Promise<User | undefined> {
    const user = this.users.find(user => user.id === id);

    return user;
  }
}

let usersRepositoryMock: UsersRepositoryMock;
let bcryptHashProvider: BcryptHashProvider;
let jsonWebTokenProvider: JsonWebTokenProvider;
let createUserUseCase: CreateUserUseCase;
let authenticateUserUseCase: AuthenticateUserUseCase;

describe('AuthenticateUser', () => {
  beforeEach(() => {
    usersRepositoryMock = new UsersRepositoryMock();
    bcryptHashProvider = new BcryptHashProvider();
    jsonWebTokenProvider = new JsonWebTokenProvider();
    createUserUseCase = new CreateUserUseCase(
      usersRepositoryMock,
      bcryptHashProvider,
    );
    authenticateUserUseCase = new AuthenticateUserUseCase(
      usersRepositoryMock,
      bcryptHashProvider,
      jsonWebTokenProvider,
    );
  });

  it('should be able to authenticate user', async () => {
    await createUserUseCase.execute({
      name: 'John Doe',
      email: 'johndoe@teste.com.br',
      password: '123456',
    });

    const authData = await authenticateUserUseCase.execute({
      email: 'johndoe@teste.com.br',
      password: '123456',
    });

    expect(authData).toHaveProperty('token');
  });

  it('should not be able to authenticate user with non existing email', async () => {
    await expect(
      authenticateUserUseCase.execute({
        email: 'email@teste.com.br',
        password: '123456',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to authenticate user with wrong password', async () => {
    await createUserUseCase.execute({
      name: 'John Doe',
      email: 'johndoe@teste.com.br',
      password: '123456',
    });

    await expect(
      authenticateUserUseCase.execute({
        email: 'johndoe@teste.com.br',
        password: 'wrong-password',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
