import { FormEvent, useCallback, useState } from 'react';
import { GoogleAuthProvider, signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { IoLogoGoogle } from 'react-icons/io5';
import styles from './Login.module.css';
import { useAuth } from '../../contexts/useAuth';
import { PageLayout } from '../../components/PageLayout/PageLayout';
import { TextInput } from '../../components/TextInput/TextInput';
import { Button } from '../../components/Button/Button';
import { auth } from '../../../utils/firebaseConfig';

const googleProvider = new GoogleAuthProvider();
// const facebookProvider = new FacebookAuthProvider();
// const appleProvider = new OAuthProvider('apple.com');

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const { setUser } = useAuth();

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

  const singInWithGoogle = useCallback(() => {
    signInWithPopup(auth, googleProvider)
      .then(result => {
        const user = result.user;
        setUser(user);
        navigate('/content');
      })
      .catch(error => {
        // Handle Errors here.
        const errorCode = error.code;
        const errorMessage = error.message;
        throw Error(errorCode, errorMessage);
      });
  }, [navigate, setUser]);

  // const singInWithFacebook = useCallback(() => {
  //   signInWithPopup(auth, facebookProvider)
  //     .then(result => {
  //       const user = result.user;
  //       setUser(user);
  //       navigate('/content');
  //     })
  //     .catch(error => {
  //       // Handle Errors here.
  //       const errorCode = error.code;
  //       const errorMessage = error.message;
  //       throw Error(errorCode, errorMessage);
  //     });
  // }, [navigate, setUser]);

  // const singInWithApple = useCallback(() => {
  //   signInWithPopup(auth, appleProvider)
  //     .then(result => {
  //       const user = result.user;
  //       setUser(user);
  //       navigate('/content');
  //     })
  //     .catch(error => {
  //       // Handle Errors here.
  //       const errorCode = error.code;
  //       const errorMessage = error.message;
  //       throw Error(errorCode, errorMessage);
  //     });
  // }, [navigate, setUser]);

  const changeEmail = useCallback((email: string) => {
    setEmail(email);
  }, []);

  const changePassword = useCallback((password: string) => {
    setPassword(password);
  }, []);

  return (
    <PageLayout>
      <form onSubmit={signIn}>
        <TextInput type="email" onChange={changeEmail} value={email} placeholder="Email" />
        <TextInput type="password" onChange={changePassword} value={password} placeholder="Password" />
        <Button type="submit">Log in</Button>
      </form>
      <Button onClick={singInWithGoogle}>
        <div className={styles.googleLoginContainer}>
          <IoLogoGoogle />
          <div>Log in</div>
        </div>
      </Button>
      {/* <Button onClick={singInWithFacebook}>Log in using Facebook</Button>
      <Button onClick={singInWithApple}>Log in using Apple</Button> */}

      <p>You don't have an account?</p>
      <Button onClick={() => navigate('/signup')}>Sign up</Button>
    </PageLayout>
  );
}

export default Login;
