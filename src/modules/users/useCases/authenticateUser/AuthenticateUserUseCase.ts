import { inject, injectable } from 'tsyringe';

import { User } from '@modules/users/infra/typeorm/models/User';
import { IUsersRepository } from '@modules/users/repositories/IUsersRepository';
import { AppError } from '@shared/errors/AppError';
import { IHashProvider } from '@shared/providers/HashProvider/IHashProvider';
import { ITokenProvider } from '@shared/providers/TokenProvider/ITokenProvider';

type IAuthenticateUserRequest = {
  email: string;
  password: string;
};

type IAuthenticateUserResponse = {
  token: string;
  user: User;
};

@injectable()
export class AuthenticateUserUseCase {
  constructor(
    @inject('UsersRepository')
    private readonly usersRepository: IUsersRepository,
    @inject('HashProvider')
    private readonly hashProvider: IHashProvider,
    @inject('TokenProvider')
    private readonly tokenProvider: ITokenProvider,
  ) {}

  async execute({
    email,
    password,
  }: IAuthenticateUserRequest): Promise<IAuthenticateUserResponse> {
    const user = await this.usersRepository.findByEmail(email);

    if (!user) {
      throw new AppError('Invalid credentials');
    }

    const passwordMatched = await this.hashProvider.compareData({
      data: password,
      hash: user.password,
    });

    if (!passwordMatched) {
      throw new AppError('Invalid credentials');
    }

    const token = this.tokenProvider.generateToken(user.id);

    return {
      token,
      user,
    };
  }
}
