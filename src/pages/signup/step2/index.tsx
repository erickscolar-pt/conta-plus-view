import React, { useState } from 'react';
import { FaArrowRight, FaArrowLeft } from 'react-icons/fa';
import styles from './styles.module.scss';
import { toast } from 'react-toastify';

interface Step2Props {
  userData: {
    password: string;
    confirmPassword: string;
  };
  setUserData: (
    password: string,
    confirmPassword: string
  ) => void;
  nextStep: () => void;
  prevStep: () => void;
}

export default function Step2({ userData={password:"",confirmPassword:""}, setUserData, nextStep, prevStep }: Step2Props)  {
  const [password, setPassword] = useState(userData.password ||"")
  const [confirmPassword, setConfirmPassword] = useState(userData.confirmPassword || "")

  const isPasswordValid = (password: string): boolean => {
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;
    return passwordRegex.test(password);
  };

  const handleNext = () => {
    if (!isPasswordValid(password)) {
      showToast('A senha deve ter no mínimo 8 caracteres, incluindo pelo menos 1 letra maiúscula, 1 número e 1 caractere especial.');
    } else if (password !== confirmPassword) {
      showToast('As senhas não coincidem.');
    } else {
      setUserData(password, confirmPassword)
      nextStep();
      
    }
  };

  const handlePrevious = () => {
    prevStep();
  };

  const showToast = (message: string) => {
    toast.warning(message, {
      position: toast.POSITION.TOP_CENTER
    });
  };
  

  return (
    <div className={styles.container}>
      <div className={styles.formContainer}>
        <div className={styles.form}>
          <div className={styles.information}>
            <h1>Agora, crie uma senha</h1>
            <span>Crie uma senha forte e garanta segurança para sua conta</span>
          </div>

          <div className={styles.senha}>
            <span>Digite a senha</span>
            <input
              type="password"
              placeholder="Senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div className={styles.senha}>
            <span>Repita a senha</span>
            <input
              type="password"
              placeholder="Confirme a senha"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>
          <div className={styles.dica}>
            <span>Dica para a sua senha:</span> ela deve conter no mínimo 8 caracteres, sendo ao menos 1 letra maiúscula, 1 número e 1 caractere especial.
          </div>
        </div>
      </div>
      <div className={styles.buttonContainer}>
        <button onClick={handlePrevious}><FaArrowLeft/> Voltar</button>
        <button onClick={handleNext}>Avançar <FaArrowRight /></button>
      </div>
    </div>
  );
};
