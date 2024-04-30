import prisma from '@/prisma';

export class UserQueries {
  async getUserByEmailOrUsername(username: string, email: string) {
    try {
      const user = await prisma.user.findFirst({
        where: {
          OR: [
            {
              email: email,
            },
            {
              username: username,
            },
          ],
        },
      });
      return user;
    } catch (e) {
      throw e;
    }
  }

  async getUserByEmail(email: string) {
    try {
        const user = await prisma.user.findUnique({
          include: {
            role: true,
          },
          where: {
            email,
          },
        });
    
        return user;
      } catch (err) {
        throw err;
      }
  }
}
