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

  async generateCode(length: number) {
    const charset =
      'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let retVal = '';
    for (let i = 0, n = charset.length; i < length; ++i) {
      retVal += charset.charAt(Math.floor(Math.random() * n)).toUpperCase();
    }
    return retVal;
  }

  async registerUserData(req: Request, res: Response) {
    const { username, password, email, roleID, claimedCodeID } = req.body;

    let generateReferral = '';
    if (roleID === 2) {
      while (true) {
        generateReferral = await this.generateCode(6);
        const check = await prisma.user.findFirst({
          where: { referralCodeID: generateReferral },
        });
        if (!check) break;
      }
    }

    if (claimedCodeID) {
      const availableReferralCode = await prisma.user.findFirst({
        where: { referralCodeID: claimedCodeID },
      });
      if (!availableReferralCode) {
        res.status(500).send('Referral Code is not found!');
      }
    }

    await prisma.$transaction(async (prisma) => {
      const newUserData = await prisma.user.create({
        data: {
          username,
          password,
          email,
          roleID,
          isVerified: false,
          referralCodeID: generateReferral,
          claimedCodeID: roleID === 2 ? claimedCodeID : '',
          point: 0,
        },
      });
      return res.status(201).send(newUserData);
    });
  }
}
