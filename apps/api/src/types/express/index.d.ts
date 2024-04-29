export type User = {
    id: number;
    email: string;
    username: string;
    role: string;
  };
  
  declare global {
    namespace Express {
      export interface Request {
        user?: User;
      }
    }
  }
  