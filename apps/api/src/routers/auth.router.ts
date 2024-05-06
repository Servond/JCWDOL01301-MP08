import { AuthControllers } from '@/controllers/auth.controller';
import { AuthMiddlewares } from '@/middlewares/auth.middleware';
import { Router } from 'express';

export class AuthRouter {
  private router: Router;
  private authControllers: AuthControllers;
  private authGuard: AuthMiddlewares;

  constructor() {
    this.authControllers = new AuthControllers();
    this.authGuard = new AuthMiddlewares();
    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.post('/register', this.authControllers.registerController);
    this.router.post('/login', this.authControllers.loginController);
    this.router.get('/verify', this.authControllers.verifyController);
    this.router.get('/', this.authControllers.refreshTokenController);
    // this.router.patch('/verify', this.authControllers.verifyController);
  }

  getRouter(): Router {
    return this.router;
  }
}
