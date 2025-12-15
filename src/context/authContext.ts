import { createContext, useContext } from "react";
import { UserCreateDto, UserResponseDto } from "../types";

export interface AuthContextType {
  isAuthenticated: boolean;
  user: UserResponseDto | null;
  login: (email: string, password: string) => Promise<void>;
  register: (data: UserCreateDto) => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType>(null!);

export const useAuth = () => useContext(AuthContext);
