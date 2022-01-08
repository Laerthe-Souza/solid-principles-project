import { NextFunction, Request, Response } from 'express';

import { AppError } from '@shared/errors/AppError';
import { JsonWebTokenProvider } from '@shared/providers/TokenProvider/implementations/JsonWebTokenProvider';

export function ensureAuthentication(
  request: Request,
  response: Response,
  next: NextFunction,
): void {
  const { authorization } = request.headers;

  if (!authorization) {
    throw new AppError('Token not provided', 401);
  }

  const [schema, token] = authorization.split(' ');

  if (!/^Bearer$/i.test(schema)) {
    throw new AppError('Invalid token', 401);
  }

  const jsonWebTokenProvider = new JsonWebTokenProvider();

  try {
    const id = jsonWebTokenProvider.verifyToken(token);

    Object.assign(request, { user: { id } });

    next();
  } catch {
    throw new AppError('Invalid token', 401);
  }
}
