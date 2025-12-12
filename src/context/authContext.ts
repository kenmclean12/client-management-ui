import { createContext, useContext } from "react";
import type { UserResponseDto } from "../types";

export interface AuthContextType {
  isAuthenticated: boolean;
  user: UserResponseDto | null;
  login: (
    access_token: string,
    user: UserResponseDto
  ) => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType>(null!);

export const useAuth = () => useContext(AuthContext);
