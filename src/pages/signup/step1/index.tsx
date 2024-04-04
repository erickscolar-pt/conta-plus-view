import React, { useState } from 'react';
import { FaArrowRight, FaUser } from 'react-icons/fa';
import { toast } from 'react-toastify';
import Router from 'next/router';
import styles from './styles.module.scss';
import { isValidUsername, validateEmail } from '@/helper';

interface Step1Props {
  userData: {
    nome: string;
    email: string;
    username: string;
  };
  setUserData: (    
    nome: string,
    email: string,
    username: string) => void;
  nextStep: () => void;
}

export default function Step1({ userData={nome:"",email:"",username:""}, setUserData, nextStep }: Step1Props) {
  const [isValidEmail, setIsValidEmail] = useState(true);
  const [email, setEmail] = useState(userData.email || "")
  const [nome, setNome] = useState(userData.nome || "")
  const [username, setUsername] = useState(userData.username || "")

  const handleNext = () => {
    if (email === '' || username === '') {
      toast.warning('Preencha o email e o nome de usuário para prosseguir.', {
        position: toast.POSITION.TOP_CENTER,
      });
    } else if (!isValidEmail) {
      toast.error('Insira um email válido.', {
        position: toast.POSITION.TOP_CENTER,
      });
    } else if (username.length < 10) {
      toast.error('O nome de usuário deve ter pelo menos 10 caracteres.', {
        position: toast.POSITION.TOP_CENTER,
      });
    } else if (!isValidUsername(username)) {
      toast.error(
        'O nome de usuário deve conter apenas letras, números e caracteres especiais permitidos.',
        {
          position: toast.POSITION.TOP_CENTER,
        }
      );
    } else {
      setUserData(nome, email, username)
      nextStep();

    }
  };

  const handleChangeEmail = (e) => {
    const { value } = e.target;
    setEmail(value)
    setIsValidEmail(validateEmail(value));
  };

  const handleChangeNome = (e) => {
    const { value } = e.target;
    setNome(value);
    setIsValidEmail(validateEmail(value));
  };

  const handleChangeUsername = (e) => {
    const { value } = e.target;
    setUsername(value)
  };

  return (
    <div className={styles.container}>
      <div className={styles.formContainer}>
        <div className={styles.form}>
          <span className={styles.title}>E-mail</span>
          <h1>Primeiro, informe seu nome, e-mail e nome de usuário</h1>
          <span>Você usará o e-mail ou nome de usuário para efetuar o seu login.</span>

          <span className={styles.label}>Seu nome</span>
          <input
            type="text"
            placeholder="Seu nome"
            value={nome}
            onChange={handleChangeNome}
          />

          <span className={styles.label}>Seu e-mail</span>
          <input
            type="email"
            placeholder="exemplo@email.com.br"
            value={email}
            onChange={handleChangeEmail}
          />

          <span className={styles.label}>Seu nome de usuário</span>
          <input
            type="text"
            placeholder="nome_de_usuario"
            value={username}
            onChange={handleChangeUsername}
          />
        </div>
      </div>

      <div className={styles.buttonContainer}>
        <button onClick={() => Router.push('/')}>
          <FaUser /> Voltar ao Login
        </button>
        <button onClick={handleNext}>
          Avançar <FaArrowRight />
        </button>
      </div>
    </div>
  );
};

