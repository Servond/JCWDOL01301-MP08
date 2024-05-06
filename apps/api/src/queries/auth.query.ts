import prisma from '@/prisma';
import { User } from '@prisma/client';
import path from 'path';
import { FE_URL, API_KEY } from '@/config';
import * as handlebars from 'handlebars';
import fs from 'fs';
import { transporter } from '@/helpers/nodemailer';
import { Auth } from '@/interfaces/auth.interface';
import { Service } from 'typedi';
import { sign } from 'jsonwebtoken';
import { HttpException } from '@/exceptions/HttpException';

@Service()
export class AuthQueries {
  async generateCode(length: number) {
    try {
      const charset =
        'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
      let retVal = '';
      for (let i = 0, n = charset.length; i < length; ++i) {
        retVal += charset.charAt(Math.floor(Math.random() * n)).toUpperCase();
      }
      return retVal;
    } catch (e) {
      throw e;
    }
  }

  private async sendRegistrationEmail(data: User) {
    try {
      const payload = {
        email: data.email,
        isVerified: data.isVerified,
      };
      const token = sign(payload, String(API_KEY), { expiresIn: '1hr' });
      const urlVerify = `${FE_URL}/verify?token=${token}`;
      const templatePath = path.join(
        __dirname,
        '../templates',
        'registrationEmail.hbs',
      );
      console.log(templatePath);
      const templateSource = fs.readFileSync(templatePath, 'utf-8');
      const compiledTemplate = handlebars.compile(templateSource);
      const html = compiledTemplate({
        username: data.username,
        roleID: data.roleID === 1 ? 'Customer' : 'Event Organizer',
        act: data.roleID === 1 ? 'buy' : 'sell',
        url: urlVerify,
      });
      console.log('email terkirim!');
      await transporter.sendMail({
        from: 'TICKET',
        to: data.email,
        subject: 'Please verified before proceed buying or selling ticket!',
        html,
      });
    } catch (e) {
      throw e;
    }
  }

  public async registerQuery(data: User, pass: string) {
    try {
      let generateReferral = '';
      if (data.roleID === 1) {
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
          throw new HttpException(500, 'Referral code not available');
        } else {
          const pointReceiver = await prisma.user.findUnique({
            where: { referralCodeID: data.claimedCodeID },
          });
          await prisma.$transaction(async (prisma) => {
            await prisma.user.update({
              where: { referralCodeID: data.claimedCodeID },
              data: { point: pointReceiver.point + 10000 },
            });
          });
        }
      }

      await prisma.$transaction(async (prisma) => {
        try {
          const newUserData = await prisma.user.create({
            data: {
              username: data.username,
              password: pass,
              email: data.email,
              roleID: data.roleID,
              isVerified: false,
              referralCodeID: generateReferral,
              claimedCodeID: data.roleID === 1 ? data.claimedCodeID : '',
              point: 0,
            },
          });
          await this.sendRegistrationEmail(newUserData);
          return { newUserData };
        } catch (e) {
          throw e;
        }
      });
    } catch (e) {
      throw e;
    }
  }

  public async loginQuery(data: Auth) {
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

  public async verifyQuery(email: string) {
    try {
      await prisma.$transaction(async (prisma) => {
        try {
          const verify = await prisma.user.update({
            where: {
              email,
            },
            data: {
              isVerified: true,
            },
          });
          return verify;
        } catch (e) {
          throw e;
        }
      });
    } catch (e) {
      throw e;
    }
  }
}
