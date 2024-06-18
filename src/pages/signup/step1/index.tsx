import React, { useState } from 'react';
import { FaArrowRight, FaUser } from 'react-icons/fa';
import { toast } from 'react-toastify';
import Router from 'next/router';
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
    username: string
  ) => void;
  nextStep: () => void;
}

export default function Step1({ userData = { nome: "", email: "", username: "" }, setUserData, nextStep }: Step1Props) {
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
  };

  const handleChangeUsername = (e) => {
    const { value } = e.target;
    setUsername(value)
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen  bg-blue-400 p-6">
      <div className="bg-white shadow-md rounded-lg p-6 w-full max-w-md">
        <h1 className="text-2xl font-bold mb-4">Primeiro, informe seu nome, e-mail e nome de usuário</h1>
        <p className="text-gray-600 mb-6">Você usará o e-mail ou nome de usuário para efetuar o seu login.</p>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Seu nome</label>
          <input
            type="text"
            placeholder="Seu nome"
            value={nome}
            onChange={handleChangeNome}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Seu e-mail</label>
          <input
            type="email"
            placeholder="exemplo@email.com.br"
            value={email}
            onChange={handleChangeEmail}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary"
          />
          {!isValidEmail && <p className="text-red-500 text-xs mt-2">E-mail inválido</p>}
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">Seu nome de usuário</label>
          <input
            type="text"
            placeholder="nome_de_usuario"
            value={username}
            onChange={handleChangeUsername}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary"
          />
        </div>

        <div className="flex justify-between items-center">
          <button
            onClick={() => Router.push('/')}
            className="flex items-center text-primary hover:text-primary-dark"
          >
            <FaUser className="mr-2" /> Voltar ao Login
          </button>
          <button
            onClick={handleNext}
            className="flex items-center bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-dark"
          >
            Avançar <FaArrowRight className="ml-2" />
          </button>
        </div>
      </div>
    </div>
  );
};
