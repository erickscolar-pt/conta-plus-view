import { useContext, useState } from 'react';
import styles from './styles.module.scss'
import { FaArrowRight, FaUser } from "react-icons/fa";
import { toast } from 'react-toastify';
import Router from 'next/router'
import { isValidUsername, validateEmail } from '@/helper';

export default function Step1({ userData, setUserData, nextStep }) {
  const [isValidEmail, setIsValidEmail] = useState(true);

  const handleNext = () => {
    if (userData.email === '' || userData.username === '') {
      toast.warning('Preencha o email e o nome de usuário para prosseguir.', {
        position: toast.POSITION.TOP_CENTER
      });
    } else if (!isValidEmail) {
      toast.error('Insira um email válido.', {
        position: toast.POSITION.TOP_CENTER
      });
    } else if (userData.username.length < 10) {
      toast.error('O nome de usuário deve ter pelo menos 10 caracteres.', {
        position: toast.POSITION.TOP_CENTER
      });
    } else if (!isValidUsername(userData.username)) {
      toast.error('O nome de usuário deve conter apenas letras, números e caracteres especiais permitidos.', {
        position: toast.POSITION.TOP_CENTER
      });
    } else {
      nextStep();
    }
  };
 

  const handleChangeEmail = (e) => {
    const { value } = e.target;
    setUserData({ ...userData, email: value });
    setIsValidEmail(validateEmail(value));
  };

  const handleChangeNome = (e) => {
    const { value } = e.target;
    setUserData({ ...userData, nome: value });
    setIsValidEmail(validateEmail(value));
  };

  const handleChangeUsername = (e) => {
    const { value } = e.target;
    setUserData({ ...userData, username: value });
  };

  return (
    <div className={styles.container}>
      <div className={styles.formContainer}>
        <div className={styles.form}>
          <span className={styles.title}>E-mail</span>
          <h1>Primeiro, informe seu nome, e-mail e nome de usuario</h1>
          <span>Você usará o e-mail ou nome de usuario para efetuar o seu login.</span>

          <span className={styles.lable}>Seu nome</span>
          <input
            type="text"
            placeholder="Seu nome"
            value={userData.nome}
            onChange={handleChangeNome}
          />

          <span className={styles.lable}>Seu e-mail</span>
          <input
            type="email"
            placeholder="exemplo@email.com.br"
            value={userData.email}
            onChange={handleChangeEmail}
          />

          <span className={styles.lable}>Seu nome de usuario</span>
          <input
            type="text"
            placeholder="nome_de_usuario"
            value={userData.username}
            onChange={handleChangeUsername}
          />
        </div>
      </div>

      <div className={styles.buttonContainer}>
        <button onClick={() => { Router.push('/') }}><FaUser /> Voltar ao Login</button>
        <button onClick={handleNext}>Avançar <FaArrowRight /></button>
      </div>
    </div>
  );
}
