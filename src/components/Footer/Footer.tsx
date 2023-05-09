import { classNames } from '../../../utils/classNames';
import styles from './Footer.module.css';

export interface FooterProps {
  className?: string;
}

export const Footer = ({ className }: FooterProps) => {
  return <div className={classNames(styles.container, className)}>I am a Footer</div>;
};

Footer.displayName = 'Footer';
