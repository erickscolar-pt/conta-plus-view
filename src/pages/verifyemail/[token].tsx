// pages/verify-email.js
import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import { setupAPIClient } from "@/services/api";

export default function VerifyEmail() {
  const [status, setStatus] = useState("");
  const router = useRouter();
  const { token } = router.query;

  async function verify() {
    const apiClient = setupAPIClient();
    if (token) {
      const response = await apiClient
        .get(`/user/verify-email?token=${token}`)
        .then((response) => {
          setStatus("E-mail verificado com sucesso!");
          setTimeout(() => {
            router.push("/");
          }, 3000);
        })
        .catch((error) => {
          setStatus("Token de verificação inválido ou expirado.");
        });
    } else {
      setStatus("Token de verificação ausente.");
    }
  }
  useEffect(() => {
    verify()
  }, [token, router]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-lg text-center">
        <h1 className="text-2xl font-semibold mb-4">Verificação de E-mail</h1>
        <p className="text-gray-700">
          {status === "" ? "Verificando..." : status}
        </p>
      </div>
    </div>
  );
}
