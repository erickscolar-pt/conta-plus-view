import { useContext, useState } from "react";
import Step1 from "./step1";
import Step2 from "./step2";
import { AuthContexts } from "@/contexts/AuthContexts";
import Step4 from "./step4";

export type Usuario = {
  id: number;
  nome: string;
  username: string;
  email: string;
  senha?: string;
  codigoReferencia: string;
  codigoRecomendacao: string | null;
  created_at: string;
  updated_at: string;
};

export default function Cadastro() {
  const { signUp } = useContext(AuthContexts);
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  const [usuario, setUsuario] = useState<Usuario>({
    id: 0,
    nome: "",
    email: "",
    username: "",
    senha: "",
    codigoReferencia: "",
    codigoRecomendacao: "",
    created_at: "",
    updated_at: "",
  });

  const [userData, setUserData] = useState({
    nome: "",
    email: "",
    username: "",
    acceptTerms: false,
  });

  const nextStep = () => {
    setStep((s) => s + 1);
  };

  const prevStep = () => {
    setStep((s) => s - 1);
  };

  async function handleSignUp(senha: string) {
    setLoading(true);
    try {
      const res = await signUp({
        email: userData.email,
        username: userData.username,
        senha,
        codigoRecomendacao: "",
        nome: userData.nome,
        acceptTerms: userData.acceptTerms,
      });

      const created = res.data as Usuario;
      setUsuario(created);
      nextStep();
    } catch {
      // toast já exibido em signUp
    } finally {
      setLoading(false);
    }
  }

  function handleStep1(
    nome: string,
    email: string,
    username: string,
    acceptTerms: boolean,
  ) {
    setUserData({ nome, email, username, acceptTerms });
  }

  return (
    <div>
      {step === 1 && (
        <Step1
          userData={userData}
          setUserData={handleStep1}
          nextStep={nextStep}
        />
      )}
      {step === 2 && (
        <Step2
          userData={userData}
          handleSignUp={handleSignUp}
          loading={loading}
          prevStep={prevStep}
        />
      )}
      {step === 3 && <Step4 userData={usuario} />}
    </div>
  );
}
