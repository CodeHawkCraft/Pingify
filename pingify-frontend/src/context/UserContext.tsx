import { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";
import type { UserData } from "../types/auth.types";

type UserContextType = {
  user: UserData | null;
  setUser: (user: UserData | null) => void;
};

const UserContext = createContext<UserContextType | null>(null);

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserData | null>(null);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser(): UserContextType {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
}
