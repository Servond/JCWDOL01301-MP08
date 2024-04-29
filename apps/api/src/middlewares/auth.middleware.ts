import { Request, NextFunction } from 'express';
import { verify } from 'jsonwebtoken';
import { API_KEY } from '@/config';
import { User } from '@/types/express';

export class AuthMiddlewares {
  async verifyToken(req: Request, next: NextFunction) {
    try {
      const token = req.header('Authorization')?.replace('Bearer ', '');
      if (!token) throw new Error('Token invalid!');

      const verifyUser = verify(token, String(API_KEY));
      if (!verifyUser) throw new Error('Unauthorized!');

      req.user = verifyUser as User;

      next();
    } catch (e) {
      next(e);
    }
  }

  async adminGuard(req: Request, next: NextFunction) {
    try {
      if (req.user?.role.toLowerCase() !== 'admin')
        throw new Error('Unauthorized!');
      next();
    } catch (e) {
      next(e);
    }
  }
}
