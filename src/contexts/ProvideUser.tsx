import { createContext, useState, ReactNode, useMemo } from 'react';
import { User } from 'firebase/auth';

interface AuthState {
  user: User | undefined;
  setUser: (user: User | undefined) => void;
}
export const AuthContext = createContext<AuthState | null>(null);
AuthContext.displayName = 'AuthContext';

export function ProvideUser({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | undefined>(undefined);

  const contextValue = useMemo(() => ({ user, setUser }), [user, setUser]);

  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>;
}
