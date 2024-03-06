import { useContext, useState } from 'react';
import styles from './styles.module.scss'
import { FaArrowRight } from "react-icons/fa";
import { toast } from 'react-toastify';

export default function Step1({ userData, setUserData, nextStep }) {
  const handleNext = () => {
    console.log(userData.email)
    if(userData.email === ''){
      toast.warning('Preencha o email para poder prosseguir.', {
        position: toast.POSITION.TOP_CENTER
    });
    }else{
      nextStep();
    }
  };


  return (
    <div className={styles.container}>
      <div className={styles.form}>
        <span className={styles.title}>E-mail</span>
        <h1>Primeiro, informe seu e-mail</h1>
        <span>Você usará o e-mail para efetuar o seu login.</span>

        <span className={styles.lable}>Seu e-mail</span>
        <input
          type="email"
          placeholder="exemplo@email.com.br"
          value={userData.email}
          onChange={(e) => setUserData({ ...userData, email: e.target.value })}
        />
      </div>

      <div className={styles.buttonContainer}>
        <button onClick={handleNext}>Avançar <FaArrowRight /></button>
      </div>
    </div>
  );
}
