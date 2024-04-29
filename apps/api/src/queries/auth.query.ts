import prisma from '@/prisma';
import { User } from '@prisma/client';
import path from 'path';
import { PORT } from '@/config';
import * as handlebars from 'handlebars';
import fs from 'fs';
import { transporter } from '@/helpers/nodemailer';
import { Auth } from '@/interfaces/auth.interface';

export class AuthQueries {
  async generateCode(length: number) {
    const charset =
      'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let retVal = '';
    for (let i = 0, n = charset.length; i < length; ++i) {
      retVal += charset.charAt(Math.floor(Math.random() * n)).toUpperCase();
    }
    return retVal;
  }

  async registerQuery(data: User, pass: string) {
    try {
      let generateReferral = '';
      if (data.roleID === 2) {
        while (true) {
          generateReferral = await this.generateCode(6);
          const check = await prisma.user.findFirst({
            where: { referralCodeID: generateReferral },
          });
          if (!check) break;
        }
      }

      if (data.claimedCodeID) {
        const availableReferralCode = await prisma.user.findFirst({
          where: { referralCodeID: data.claimedCodeID },
        });
        if (!availableReferralCode) {
          throw new Error('Referral code not available');
        }
      }

      await prisma.$transaction(async (prisma) => {
        const newUserData = await prisma.user.create({
          data: {
            username: data.username,
            password: pass,
            email: data.email,
            roleID: data.roleID,
            isVerified: false,
            referralCodeID: generateReferral,
            claimedCodeID: data.roleID === 2 ? data.claimedCodeID : '',
            point: 0,
          },
        });

        const token = '';
        const urlVerify = ` http://localhost:${PORT}/verify?token=${token}`;
        const templatePath = path.join(
          __dirname,
          '../templates',
          'registrationEmail.hbs',
        );
        const templateSource = fs.readFileSync(templatePath, 'utf-8');
        const compiledTemplate = handlebars.compile(templateSource);
        const html = compiledTemplate({
          username: newUserData.username,
          roleID: newUserData.roleID,
          url: urlVerify,
        });
        await transporter.sendMail({
          from: 'sender address',
          to: newUserData.email,
          subject: 'Please verified before proceed buying or selling ticket!',
          html,
        });
        return newUserData;
      });
    } catch (e) {
      throw e;
    }
  }

  async loginQuery(data: Auth) {
    try {
      const login = await prisma.user.findUnique({
        select: {
          id: true,
          username: true,
          email: true,
          role: {
            select: {
              name: true,
            },
          },
        },
        where: {
          email: data.email,
          password: data.email,
        },
      });
      return login;
    } catch (e) {
      throw e;
    }
  }
}
