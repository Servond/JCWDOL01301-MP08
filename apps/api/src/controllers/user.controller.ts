import { Request, Response } from 'express';
import prisma from '@/prisma';

export class UserController {
  async getUserData(req: Request, res: Response) {
    const userData = await prisma.user.findMany();

    return res.status(200).send(userData);
  }

  async getUserDataById(req: Request, res: Response) {
    const { id } = req.params;

    const user = await prisma.user.findUnique({
      where: { id: Number(id) },
    });

    if (!user) {
      return res.send(404);
    }

    return res.status(200).send(user);
  }
}
