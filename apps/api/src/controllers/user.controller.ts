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

  async registerUserData (req: Request, res: Response) {
    const { username, password, email, roleID, claimedCodeID } = req.body;
    
    function generateCode(length:number) {
        const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let retVal = '';
        for (let i = 0, n = charset.length; i < length; ++i) {
          retVal += charset.charAt(Math.floor(Math.random() * n)).toUpperCase();
        }
        return retVal;
      }

    const newUserData = await prisma.user.create({
      data: { username, password, email, roleID, isVerified:false, referralCodeID:generateCode(6),claimedCodeID, point:0 },
    });

    return res.status(201).send(newUserData);
  }
}
