import { useContext, useState } from 'react';
import Step1 from './step1';
import Step2 from './step2';
import Step3 from './step3';
import { AuthContexts } from '@/contexts/AuthContexts';
import Head from 'next/head';
import Step4 from './step4';

export type Usuario = {
  id: number,
  nome: string,
  username: string,
  email: string,
  senha: string,
  codigoReferencia: string,
  codigoRecomendacao: string,
  created_at: string,
  updated_at: string
}
export default function Cadastro({planos}) {
  const { signUp } = useContext(AuthContexts)
  const [step, setStep] = useState(1);
  const [usuario, setUsuario] = useState<Usuario>({
    id: 0,
    nome: '',
    email: '',
    username: '',
    senha: '',
    codigoReferencia: '',
    codigoRecomendacao: '',
    created_at: '',
    updated_at: ''
  })
  const [userData, setUserData] = useState({
    nome: '',
    email: '',
    username: '',
    password: '',
    confirmPassword: '',
    referralCode: '',
    acceptTerms: false
  });

  const nextStep = () => {
    setStep(step + 1);
  };

  const prevStep = () => {
    setStep(step - 1);
  };

  async function handleFormSubmit() {
    const res:any = await signUp({
      email: userData.email,
      username: userData.username,
      senha: userData.password,
      codigoRecomendacao: userData.referralCode,
      nome: userData.nome,
      acceptTerms: userData.acceptTerms
    })
    const user: Usuario = await res.data
    setUsuario(user)
  };

  function handleStep1(nome, email, username, acceptTerms) {
    setUserData({ ...userData, nome, email, username, acceptTerms})
  }

  function handleStep2(password, confirmPassword) {
    setUserData({ ...userData, password, confirmPassword });

  }

  function handleStep3(referralCode) {
    setUserData({ ...userData, referralCode });
  }

  return (
    <div>
      <Head>
        <title>Conta Plus - Cadastro</title>
      </Head>
      {step === 1 && (
        <Step1 userData={userData} setUserData={handleStep1} nextStep={nextStep} />
      )}
      {step === 2 && (
        <Step2 userData={userData} setUserData={handleStep2} nextStep={nextStep} prevStep={prevStep} />
      )}
      {step === 3 && (
        <Step3 userData={userData} setUserData={handleStep3} handleFormSubmit={handleFormSubmit} nextStep={nextStep} prevStep={prevStep} />
      )}
      {step === 4 && (
        <Step4 planos={planos.data} userData={usuario} />
      )}
    </div>
  );
}


export async function getStaticProps() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/payments/planos`)
    if (!res.ok) {
      throw new Error('Failed to fetch');
    }
    const planos = await res.json()
  
    return {
      props: {
        planos,
      },
    }
  } catch (error) {
    console.error('Error fetching planos:', error);
    return {
      props: {
        planos: [],
      },
      revalidate: 10, // Revalida após 10 segundos
    }
  }
}
