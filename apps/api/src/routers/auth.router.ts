import { AuthControllers } from '@/controllers/auth.controller';
import { Router } from 'express';

export class AuthRouter {
  private router: Router;
  private authControllers: AuthControllers;

  constructor() {
    this.authControllers = new AuthControllers();
    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.post("/register", this.authControllers.registerController)
    this.router.post("/login", this.authControllers.loginController)
  }

  getRouter(): Router {
    return this.router;
  }
}
