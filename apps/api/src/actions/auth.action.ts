import { API_KEY } from '@/config';
import { sign } from 'jsonwebtoken';
import { genSalt, hash, compare } from 'bcrypt';
import { User } from '@prisma/client';
import { AuthQueries } from '@/queries/auth.query';
import { UserQueries } from '@/queries/user.query';
import { Auth } from '@/interfaces/auth.interface';

export class AuthAction {
  async registerAction(data: User): Promise<User | void> {
    const authQueries = new AuthQueries();
    const userQueries = new UserQueries();

    try {
      const check = await userQueries.getUserByEmailOrUsername(
        data.email,
        data.username,
      );

      if (check) throw new Error('User already exist, choose another email!');
      const salt = await genSalt(10);
      const hashPass = await hash(data.password, salt);

      const user = await authQueries.registerQuery(data, hashPass);

      return user;
    } catch (e) {
      throw e;
    }
  }

  async loginAction(data: Auth) {
    const userQueries = new UserQueries();
    try {
      const user = await userQueries.getUserByEmail(data.email);
      if (!user) throw new Error("Email doesn't exist!");
      const isValid = await compare(data.password, user.password);
      if(!isValid) throw new Error("Wrong password!");
      const payload={
        id: user.id,
        email:user.email,
        username: user.username,
        role: user.role.name
      };

      const token = sign(payload, String(API_KEY), {expiresIn:"1h"})
      return{user, token};
    } catch (e) {
      throw e;
    }
  }
}
