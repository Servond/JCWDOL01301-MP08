import { Request, Response, NextFunction } from 'express';
import { AuthAction } from '@/actions/auth.action';

export class AuthControllers {
  async registerController(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    const authAction = new AuthAction();
    try {
      const data = await authAction.registerAction(req.body);
      res.status(200).json({
        message: 'Register success, please check the email first before login',
        data,
      });
    } catch (e) {
      next(e);
    }
  }
  async loginController(req: Request, res: Response, next: NextFunction) {
    const authAction = new AuthAction();
    try {
      const data = await authAction.loginAction(req.body);
      res.status(200).json({
        message: 'Login success!',
        data,
      });
    } catch (e) {
      next(e);
    }
  }

  async verifyController(req: Request, res: Response, next: NextFunction) {
    const authAction = new AuthAction();
    try {
      const data = await authAction.verifyAction(req.body);
      res.status(200).json({
        message: `Email verified, Enjoy!`,
        data,
      });
    } catch (e) {
      next(e);
    }
  }
}
