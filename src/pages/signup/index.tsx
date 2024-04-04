import { useContext, useState } from 'react';
import Step1 from './step1';
import Step2 from './step2';
import Step3 from './step3';
import { AuthContexts } from '@/contexts/AuthContexts';

export default function Cadastro() {
  const { signUp } = useContext(AuthContexts)
  const [step, setStep] = useState(1);
  const [userData, setUserData] = useState({
    nome: '',
    email: '',
    username: '',
    password: '',
    confirmPassword: '',
    referralCode: '',
  });
  
  const nextStep = () => {
    setStep(step + 1);
  };

  const prevStep = () => {
    setStep(step - 1);
  };

  async function handleFormSubmit() {
    // Envie os dados do usuário para o servidor ou realize outra ação
    await signUp({
      email: userData.email,
      username: userData.username,
      senha: userData.password,
      codigoRecomendacao: userData.referralCode,
      nome: userData.nome
    })
  };

  function handleStep1(nome, email, username){
    setUserData({...userData, nome, email, username})
  }

  function handleStep2(password, confirmPassword){
    setUserData({ ...userData, password, confirmPassword });

  }

  function handleStep3(referralCode){
    setUserData({ ...userData, referralCode });

  }

  return (
    <div>
      {step === 1 && (
        <Step1 userData={userData} setUserData={handleStep1} nextStep={nextStep} />
      )}
      {step === 2 && (
        <Step2 userData={userData} setUserData={handleStep2} nextStep={nextStep} prevStep={prevStep} />
      )}
      {step === 3 && (
        <Step3 userData={userData} setUserData={handleStep3} handleFormSubmit={handleFormSubmit} prevStep={prevStep} />
      )}
    </div>
  );
}
