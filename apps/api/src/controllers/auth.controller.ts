import { Request, Response, NextFunction } from 'express';
import { AuthAction } from '@/actions/auth.action';
import { Container, Service } from 'typedi';

@Service()
export class AuthControllers {
  private authAction: AuthAction;

  constructor() {
    this.authAction = new AuthAction();
  }

  public registerController = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const data = await this.authAction.registerAction(req.body);
      res.status(200).json({
        message: 'Register success, please check the email first before login',
        data: data,
      });
    } catch (e) {
      next(e);
    }
  };
  public loginController = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    const authAction = new AuthAction();
    try {
      const data = await authAction.loginAction(req.body);
      res.status(200).json({
        message: 'Login success!',
        data: data,
      });
    } catch (e) {
      next(e);
    }

  };

  public refreshTokenController = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const { email } = req.body;
      const data = await this.authAction.refreshTokenAction(email);
      res.status(200).json({
        message: 'Refresh token success',
        data: data,
      });
    } catch (e) {
      next(e);
    }
  };

  public verifyController = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const { email } = req.body;
      const data = await this.authAction.verifyAction(email);
      res.status(200).json({
        message: `Email verified, Enjoy!`,
        data: data,

      });
    } catch (e) {
      next(e);
    }

  };

}
