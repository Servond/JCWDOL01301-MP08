import { API_KEY } from '@/config';
import { sign } from 'jsonwebtoken';
import { genSalt, hash, compare } from 'bcrypt';
import { User } from '@prisma/client';
import { Container, Service } from 'typedi';
import { AuthQueries } from '@/queries/auth.query';
import { UserQueries } from '@/queries/user.query';
import { Auth } from '@/interfaces/auth.interface';
import { HttpException } from '@/exceptions/HttpException';
import prisma from '@/prisma';

@Service()
export class AuthAction {
  authQuery = Container.get(AuthQueries);
  userQuery = Container.get(UserQueries);

  public registerAction = async (data: User) => {
    try {
      const check = await this.userQuery.getUserByEmail(data.email);

      if (check)
        throw new HttpException(
          500,
          'User already exist, choose another email or username!',
        );
      const salt = await genSalt(10);
      const hashPass = await hash(data.password, salt);

      const user = await this.authQuery.registerQuery(data, hashPass);

      return user;
    } catch (e) {
      throw e;
    }
  };

  public loginAction = async (data: Auth) => {
    try {
      const user = await this.userQuery.getUserByEmail(data.email);
      if (!user) throw new HttpException(500, "Email doesn't exist!");
      const isValid = await compare(data.password, user.password);

      if (!isValid) throw new HttpException(500, 'Wrong password!');
      if (user.isVerified === false)
        throw new HttpException(
          500,
          'Your account is not verified, Check your email first!',
        );
      const payload = {
        id: user.id,
        email: user.email,
        username: user.username,
        role: user.role.name,
      };

      const token = sign(payload, String(API_KEY), { expiresIn: '1h' });
      return { user, token };
    } catch (e) {
      throw e;
    }
  };

  public refreshTokenAction = async (email: string) => {
    try {
      const check = await this.userQuery.getUserByEmail(email);
      if (!check) throw new HttpException(500, 'Something went wrong');
      const payload = {
        email: check.email,
        isVerified: check.isVerified,
      };
      const token = sign(payload, String(API_KEY), { expiresIn: '1hr' });
      return token;
    } catch (e) {
      throw e;
    }
  };

  public verifyAction = async (email: string) => {
    try {
      const check = await this.userQuery.getUserByEmail(email);
      if (check?.isVerified === true) {
        throw new HttpException(
          500,
          'Your account is already verified, you can access your account right now',
        );
      }
      await this.authQuery.verifyQuery(check!.email);
    } catch (e) {
      throw e;
    }
  };
}
