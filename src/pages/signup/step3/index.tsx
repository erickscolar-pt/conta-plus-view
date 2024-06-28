import React, { useState } from "react";
import { FaArrowLeft, FaArrowRight, FaSpinner } from "react-icons/fa";
import { toast } from "react-toastify";

interface Step3Props {
  userData: {
    referralCode: string;
  };
  setUserData: (referralCode: string) => void;
  prevStep: () => void;
  nextStep: () => void;
  handleFormSubmit: () => void;
  loading: boolean;
}

export default function Step3({
  userData = { referralCode: "" },
  setUserData,
  nextStep,
  prevStep,
  handleFormSubmit,
  loading
}: Step3Props) {
  const [referralCode, setReferralCode] = useState(userData.referralCode || "");

  const handlePrevious = () => {
    prevStep();
  };

  const handleNext = () => {
    setUserData(referralCode);
    handleFormSubmit();
    if(loading){
      nextStep();
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-blue-400 p-6">
      <div className="bg-white shadow-md rounded-lg p-6 w-full max-w-md">
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-bold mb-2">Chegou aqui por Indicação</h1>
          <p className="text-gray-600">
            Insira o código de Indicação no campo abaixo e já faça seu vinculo
            com um parceiro(a)
          </p>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Código de Indicação
          </label>
          <input
            type="text"
            placeholder="Código de Indicação"
            value={referralCode}
            onChange={(e) => setReferralCode(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary"
          />
          <span className="text-sm text-gray-500">
            Esta etapa não é obrigatória
          </span>
        </div>

        <div className="flex justify-between items-center mt-6">
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
            {loading ? (
              <FaSpinner
                size={16}
                className="animate-spin text-4xl text-white"
              />
            ) : (
              <>
                Avançar <FaArrowRight className="ml-2" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
