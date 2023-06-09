import styles from './Navbar.module.css';
import { classNames } from '../../../utils/classNames';
import { IoLogIn } from 'react-icons/io5';
import { Button } from '../Button/Button';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/useAuth';
import { useCallback } from 'react';
import { signOut } from 'firebase/auth';
import { auth } from '../../../utils/firebaseConfig';

export interface NavbarProps {
  className?: string;
}

export const Navbar = ({ className }: NavbarProps) => {
  const navigate = useNavigate();
  const { user, setUser } = useAuth();

  const logOut = useCallback(() => {
    signOut(auth)
      .then(() => {
        setUser(undefined);
        navigate('/');
      })
      .catch(error => {
        const errorCode = error.code;
        const errorMessage = error.message;

        throw Error(errorCode, errorMessage);
      });
  }, [navigate, setUser]);

  console.log(user);

  return (
    <div className={classNames(styles.container, className)}>
      <div className={styles.logo}>Logo will be here</div>
      <div className={styles.links}>
        <div>Link 1</div>
        <div>Link 2</div>
        <div>Link 3</div>
      </div>
      <div>
        <div className={styles.login}>
          {user ? (
            <Button className={styles.loginButton} onClick={logOut}>
              Log out
              <IoLogIn />
            </Button>
          ) : (
            <>
              <Button className={styles.loginButton} onClick={() => navigate('/login')}>
                Log in
                <IoLogIn />
              </Button>
              <Button className={styles.loginButton} onClick={() => navigate('/signup')}>
                Sign up
                <IoLogIn />
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

Navbar.displayName = 'Navbar';
