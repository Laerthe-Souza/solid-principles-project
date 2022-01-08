import { ICreateUserDTO } from '@modules/users/dtos/ICreateUserDTO';
import { User } from '@modules/users/infra/typeorm/models/User';
import { IUsersRepository } from '@modules/users/repositories/IUsersRepository';
import { AppError } from '@shared/errors/AppError';
import { BcryptHashProvider } from '@shared/providers/HashProvider/implementations/BcryptHashProvider';

import { CreateUserUseCase } from './CreateUserUseCase';

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
let hashProvider: BcryptHashProvider;
let createUserUseCase: CreateUserUseCase;

describe('CreateUser', () => {
  beforeEach(() => {
    usersRepositoryMock = new UsersRepositoryMock();
    hashProvider = new BcryptHashProvider();
    createUserUseCase = new CreateUserUseCase(
      usersRepositoryMock,
      hashProvider,
    );
  });

  it('should be able to create a new user', async () => {
    const user = await createUserUseCase.execute({
      name: 'John Doe',
      email: 'johndoe@teste.com.br',
      password: '123456',
    });

    expect(user).toHaveProperty('id');
    expect(user.password).not.toBe('123456');
  });

  it('should not be able to create a new user with existing email', async () => {
    await createUserUseCase.execute({
      name: 'John Doe',
      email: 'johndoe@teste.com.br',
      password: '123456',
    });

    await expect(
      createUserUseCase.execute({
        name: 'John Doe',
        email: 'johndoe@teste.com.br',
        password: '123456',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
