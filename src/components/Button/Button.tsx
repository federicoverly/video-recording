import { ReactNode } from 'react';
import styles from './Button.module.css';
import { classNames } from '../../../utils/classNames';

export interface ButtonProps {
  children: ReactNode;
  className?: string;
  type?: 'button' | 'submit' | 'reset' | undefined;
  label?: string;
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  onClick?: () => void;
}

export const Button = ({ children, type = 'button', disabled = false, size = 'medium', className, label, onClick }: ButtonProps) => {
  return (
    <button
      onClick={onClick}
      type={type}
      aria-label={label}
      className={classNames(styles.button, styles[`${size}`], className)}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

Button.displayName = 'Button';
