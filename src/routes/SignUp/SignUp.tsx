import { FormEvent, useCallback, useMemo, useState } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/useAuth';
import { auth } from '../../../utils/firebaseConfig';
import { Button } from '../../components/Button/Button';
import { TextInput } from '../../components/TextInput/TextInput';
import { PageLayout } from '../../components/PageLayout/PageLayout';

function SignUp() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [repeatPassword, setRepeatPassword] = useState('');

  const { setUser } = useAuth();

  const navigate = useNavigate();

  const signUpWithEmailAndPassword = useCallback(
    (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      createUserWithEmailAndPassword(auth, email, password)
        .then(userCredential => {
          const user = userCredential.user;
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

  const changeRepeatPassword = useCallback((password: string) => {
    setRepeatPassword(password);
  }, []);

  const isButtonDisabled = useMemo(() => {
    return email === '' || password === '' || repeatPassword === '' || password !== repeatPassword;
  }, [email, password, repeatPassword]);

  return (
    <PageLayout>
      <>
        <form onSubmit={signUpWithEmailAndPassword}>
          <TextInput type="email" onChange={changeEmail} value={email} placeholder="Email" />
          <TextInput type="password" onChange={changePassword} value={password} placeholder="Password" />
          <TextInput type="password" onChange={changeRepeatPassword} value={repeatPassword} placeholder="Repeat password" />

          <Button type="submit" disabled={isButtonDisabled}>
            Sign up
          </Button>
        </form>
      </>
    </PageLayout>
  );
}

export default SignUp;
