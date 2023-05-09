import React, { useCallback } from 'react';
import styles from './TextInput.module.css';

export interface TextInputProps {
  type?: string;
  value: string;
  placeholder: string;
  onChange: (newValue: string) => void;
}

export const TextInput = ({ type, value, placeholder, onChange }: TextInputProps) => {
  const handleChange = useCallback(
    (event: React.FormEvent<HTMLInputElement>) => {
      onChange?.(event.currentTarget.value);
    },
    [onChange]
  );

  return <input type={type} onChange={handleChange} value={value} placeholder={placeholder} className={styles.textInput} />;
};

TextInput.displayName = 'TextInput';
