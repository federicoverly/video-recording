import { createContext, useState, useEffect, ReactNode, useMemo } from 'react';
import { User, onIdTokenChanged } from 'firebase/auth';

interface AuthState {
  user: User | undefined;
  setUser: (user: User | undefined) => void;
}
export const AuthContext = createContext<AuthState | null>(null);
AuthContext.displayName = 'AuthContext';

export function ProvideUser({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | undefined>(undefined);

  useEffect(() => {
    return onIdTokenChanged((user: User) => {
      if (user) {
        setUser(user);
      } else {
        setUser(undefined);
      }
    });
  }, []);

  const contextValue = useMemo(() => ({ user, setUser }), [user, setUser]);

  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>;
}
