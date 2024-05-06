export type User = {
  id?: number;
  username: string;
  email: string;
  password: string;
  isVerified: Boolean;
  role: string;
};

export type UserPrisma = {
  username: string;
  password: string;
  email: string;
  roleID: number;
  isVerified: boolean;
  referralCodeID: string;
  claimedCodeID: string;
  point: number;
};

declare global {
  namespace Express {
    export interface Request {
      user?: User;
      userPrisma?: UserPrisma;
    }
  }
}
