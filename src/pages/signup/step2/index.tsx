import React, { useState } from 'react';
import { FaArrowRight, FaArrowLeft, FaEye, FaEyeSlash } from 'react-icons/fa';
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

export default function Step2({ userData = { password: "", confirmPassword: "" }, setUserData, nextStep, prevStep }: Step2Props) {
  const [password, setPassword] = useState(userData.password || "");
  const [confirmPassword, setConfirmPassword] = useState(userData.confirmPassword || "");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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
    <div className="flex flex-col items-center justify-center min-h-screen bg-blue-400 p-6">
      <div className="bg-white shadow-md rounded-lg p-6 w-full max-w-md">
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-bold mb-2">Agora, crie uma senha</h1>
          <p className="text-gray-600">Crie uma senha forte e garanta segurança para sua conta</p>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Digite a senha</label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 px-3 flex items-center text-gray-500"
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">Repita a senha</label>
          <div className="relative">
            <input
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirme a senha"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute inset-y-0 right-0 px-3 flex items-center text-gray-500"
            >
              {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
        </div>

        <div className="mb-6 text-sm text-gray-600">
          <p><strong>Dica para a sua senha:</strong> ela deve conter no mínimo 8 caracteres, sendo ao menos 1 letra maiúscula, 1 número e 1 caractere especial.</p>
        </div>

        <div className="flex justify-between items-center">
          <button
            onClick={handlePrevious}
            className="flex items-center text-primary hover:text-primary-dark"
          >
            <FaArrowLeft className="mr-2" /> Voltar
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
