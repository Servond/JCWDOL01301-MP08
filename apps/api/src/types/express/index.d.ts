export type User = {
  id?: number;
  username: string;
  email: string;
  password: string;
  isVerified: Boolean;
  role: string
};

declare global {
  namespace Express {
    export interface Request {
      user?: User;
    }
  }
}
