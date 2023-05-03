import { useCallback } from 'react';
import { useAuth } from './useAuth';

const testUser = vitest.mock('');

function TestComponent() {
  const { user, setUser } = useAuth();

  const setADifferentUser = useCallback(() => {
    setUser(testUser);
  }, []);

  return;
  <>
    <div>{user.email}</div>
    <button onClick={setADifferentUser}>Set a different user</button>
  </>;
}

test('user can be accessed from a component', () => {
  render(<TestComponent />);
});
