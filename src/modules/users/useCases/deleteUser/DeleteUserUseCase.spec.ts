import { ICreateUserDTO } from '@modules/users/dtos/ICreateUserDTO';
import { User } from '@modules/users/infra/typeorm/models/User';
import { IUsersRepository } from '@modules/users/repositories/IUsersRepository';
import { AppError } from '@shared/errors/AppError';
import { BcryptHashProvider } from '@shared/providers/HashProvider/implementations/BcryptHashProvider';

import { CreateUserUseCase } from '../createUser/CreateUserUseCase';
import { DeleteUserUseCase } from './DeleteUserUseCase';

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
let createUserUseCase: CreateUserUseCase;
let deleteUserUseCase: DeleteUserUseCase;

describe('DeleteUser', () => {
  beforeEach(() => {
    usersRepositoryMock = new UsersRepositoryMock();
    bcryptHashProvider = new BcryptHashProvider();
    createUserUseCase = new CreateUserUseCase(
      usersRepositoryMock,
      bcryptHashProvider,
    );
    deleteUserUseCase = new DeleteUserUseCase(usersRepositoryMock);
  });

  it('should be able to delete a user', async () => {
    const user = await createUserUseCase.execute({
      name: 'John Doe',
      email: 'johndoe@teste.com.br',
      password: '123456',
    });

    await expect(deleteUserUseCase.execute(user.id)).resolves.toBeUndefined();
  });

  it('should not be able to delete a user with invalid id', async () => {
    await expect(
      deleteUserUseCase.execute('invalid-id'),
    ).rejects.toBeInstanceOf(AppError);
  });
});
