export interface User {
    username: string;
    email: string;
    password: string;
    image: string;
  }
  export interface LoginResult {
    success: boolean;
    message: string;
    user?: User;
  }