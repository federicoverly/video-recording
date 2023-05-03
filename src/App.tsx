import { FormEvent, useCallback, useState } from 'react';
import './App.css';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../utils/firebaseConfig';
import { useAuth } from './contexts/useAuth';
import { useNavigate } from 'react-router-dom';

function App() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const { user, setUser } = useAuth();

  const navigate = useNavigate();

  const signIn = useCallback(
    (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      signInWithEmailAndPassword(auth, email, password)
        .then(userCredentials => {
          // Signed in
          const user = userCredentials.user;
          setUser(user);
          navigate('/content');
        })
        .catch(error => {
          const errorCode = error.code;
          const errorMessage = error.message;

          throw Error(errorCode, errorMessage);
        });
    },
    [email, navigate, password, setUser]
  );

  const changeEmail = useCallback((email: string) => {
    setEmail(email);
  }, []);

  const changePassword = useCallback((password: string) => {
    setPassword(password);
  }, []);

  return (
    <>
      <form onSubmit={signIn}>
        <label>Email</label>
        <input type="email" onChange={event => changeEmail(event.target.value)} value={email} />
        <label>Password</label>
        <input type="password" onChange={e => changePassword(e.target.value)} value={password} />
        <button type="submit">Log in</button>
      </form>

      <p style={{ color: 'red' }}>{user?.email}</p>
    </>
  );
}

export default App;
