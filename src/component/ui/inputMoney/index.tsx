import React, { useEffect, useState } from 'react';
import styles from './styles.module.scss';

interface InputMoneyProps  {
  onChange: (value: number) => void;
  value?: number;
}

export default function InputMoney({ onChange, value = 0, ...rest }: InputMoneyProps) {
  const [formattedValue, setFormattedValue] = useState('');

  useEffect(() => {
    setFormattedValue(formatCurrency(value));
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    const numberValue = parseFloat(inputValue.replace(/\D/g, '')) / 100;
    onChange(numberValue);
    setFormattedValue(formatCurrency(numberValue));
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  return (
    <div className={styles.inputMoney}>
      <input
        type="text"
        value={formattedValue}
        onChange={handleChange}
        className={styles.inputField}
        {...rest}
      />
    </div>
  );
}


