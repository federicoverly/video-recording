import { createContext, useState, ReactNode, useMemo } from 'react';
import { User, onAuthStateChanged } from 'firebase/auth';
import { auth } from '../../utils/firebaseConfig';

interface AuthState {
  user: User | undefined;
  setUser: (user: User | undefined) => void;
}
export const AuthContext = createContext<AuthState | null>(null);
AuthContext.displayName = 'AuthContext';

export function ProvideUser({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | undefined>(undefined);

  onAuthStateChanged(auth, user => {
    if (auth.currentUser) {
      setUser(auth.currentUser);
    }
    void user;
  });

  const contextValue = useMemo(() => ({ user, setUser }), [user, setUser]);

  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>;
}
