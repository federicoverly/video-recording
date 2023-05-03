import { useContext } from 'react';
import { AuthContext } from './ProvideUser';

export function useAuth() {
  const contextValue = useContext(AuthContext);
  if (!contextValue) {
    throw new Error('For useAuth to work, render ProvideUser in the root component.');
  }
  return contextValue;
}
