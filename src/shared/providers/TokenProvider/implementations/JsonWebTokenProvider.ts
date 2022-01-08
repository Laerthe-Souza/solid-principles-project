import jwt from 'jsonwebtoken';

import { ITokenProvider } from '../ITokenProvider';

type IPayload = {
  iat: number;
  exp: number;
  sub: string;
};

export class JsonWebTokenProvider implements ITokenProvider {
  generateToken(data: string): string {
    return jwt.sign({}, process.env.JWT_SECRET_KEY as string, {
      expiresIn: process.env.JWT_EXPIRES_IN,
      subject: data,
    });
  }

  verifyToken(token: string): string {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET_KEY as string,
    ) as IPayload;

    return decoded.sub;
  }
}
