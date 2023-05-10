import React, { useCallback } from 'react';
import styles from './TextInput.module.css';

export interface TextInputProps {
  type?: string;
  value: string;
  disabled?: boolean;
  placeholder: string;
  onChange: (newValue: string) => void;
}

export const TextInput = ({ type, value, placeholder, disabled = false, onChange }: TextInputProps) => {
  const handleChange = useCallback(
    (event: React.FormEvent<HTMLInputElement>) => {
      onChange?.(event.currentTarget.value);
    },
    [onChange]
  );

  return (
    <input type={type} onChange={handleChange} value={value} placeholder={placeholder} className={styles.textInput} disabled={disabled} />
  );
};

TextInput.displayName = 'TextInput';
