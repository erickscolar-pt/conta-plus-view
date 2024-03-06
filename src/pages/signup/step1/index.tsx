import { useContext, useState } from 'react';
import styles from './styles.module.scss'
import { FaArrowRight, FaUser } from "react-icons/fa";
import { toast } from 'react-toastify';
import Router from 'next/router'

export default function Step1({ userData, setUserData, nextStep }) {
  const [isValidEmail, setIsValidEmail] = useState(true);

  const handleNext = () => {
    if (userData.email === '') {
      toast.warning('Preencha o email para poder prosseguir.', {
        position: toast.POSITION.TOP_CENTER
      });
    } else if (!isValidEmail) {
      toast.error('Insira um email válido.', {
        position: toast.POSITION.TOP_CENTER
      });
    } else {
      nextStep();
    }
  };

  const validateEmail = (email) => {
    // Regex para validar o formato do e-mail
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const handleChangeEmail = (e) => {
    const { value } = e.target;
    setUserData({ ...userData, email: value });
    setIsValidEmail(validateEmail(value));
  };

  return (
    <div className={styles.container}>
      <div className={styles.formContainer}>
        <form>
          <span className={styles.title}>E-mail</span>
          <h1>Primeiro, informe seu e-mail</h1>
          <span>Você usará o e-mail para efetuar o seu login.</span>

          <span className={styles.lable}>Seu e-mail</span>
          <input
            type="email"
            placeholder="exemplo@email.com.br"
            value={userData.email}
            onChange={handleChangeEmail}
          />
        </form>
      </div>

      <div className={styles.buttonContainer}>
        <button onClick={()=>{Router.push('/')}}><FaUser/> Voltar ao Login</button>
        <button onClick={handleNext}>Avançar <FaArrowRight /></button>
      </div>
    </div>
  );
}
