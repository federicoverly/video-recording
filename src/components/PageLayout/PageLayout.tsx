import { ReactNode } from 'react';
import { Navbar } from '../Navbar/Navbar';
import { Footer } from '../Footer/Footer';
import styles from './PageLayout.module.css';

interface PageLayoutProps {
  children: ReactNode;
}

export const PageLayout = ({ children }: PageLayoutProps) => {
  return (
    <div className={styles.appStyles}>
      <Navbar className={styles.navbar} />
      <div className={styles.content}>{children}</div>
      <Footer className={styles.foo} />
    </div>
  );
};

PageLayout.displayName = 'PageLayout';
