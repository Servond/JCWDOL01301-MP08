export interface User {
  id?: number;
  username: string;
  email: string;
  password: string;
  isVerified: Boolean;
  role: {
    name: string;
  };
}
