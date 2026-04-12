import React from 'react';
import Link from 'next/link';
import { FaCheckCircle } from 'react-icons/fa';

interface PaymentsProps {
    userData?: Usuario;
}

type Usuario = {
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

export default function PaymentPage({ userData }: PaymentsProps) {
    const userName = userData?.nome || "Seu cadastro";

    return (
        <div className="min-h-screen bg-blue-400 flex items-center justify-center p-6">
          <div className="bg-white shadow-md rounded-lg p-8 w-full max-w-md text-center">
            <FaCheckCircle className="mx-auto text-5xl text-emerald-500 mb-4" />
            <h1 className="text-2xl font-bold mb-2">Conta criada com sucesso</h1>
            <p className="text-gray-600 mb-2">
              {userName}, seu cadastro foi concluído e sua conta já está pronta para uso.
            </p>
            <p className="text-gray-600 mb-6">
              Agora você pode entrar e começar a organizar suas finanças.
            </p>
            <Link
              href="/login"
              className="inline-flex items-center justify-center bg-primary text-white px-5 py-3 rounded-lg font-semibold hover:opacity-90 transition"
            >
              Ir para o login
            </Link>
          </div>
        </div>
      );
    
}
