export interface User {
    id?: string;
    username: string;
    email?: string;
    success?: boolean;
    message?: string;
    role?: string;
  }
  
  export interface UserContextType {
    user: User | null;
    isGuest: boolean;
    setUser: (user: User | null) => void;
    setIsGuest: (isGuest: boolean) => void;
  }