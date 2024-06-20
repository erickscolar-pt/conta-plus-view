// pages/manual.js
import HeaderAviso from "@/component/headeraviso";
import Head from "next/head";
import React from "react";

export default function Manual() {
  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <Head>
        <title>Manual de instruções</title>
      </Head>
      <HeaderAviso />
      <div className="min-h-screen bg-gray-100 py-10">
        <div className="container mx-auto px-4">
          <div className="bg-white p-8 rounded-lg shadow-md">
            <h1 className="text-3xl font-bold mb-6">Manual de Instruções</h1>

            <section className="mb-6">
              <h2 className="text-2xl font-semibold mb-3">Introdução</h2>
              <p className="text-gray-700">
                Bem-vindo ao Conta Plus! Este manual de instruções foi criado
                para ajudá-lo a navegar e usar nossa plataforma de forma eficaz.
              </p>
            </section>

            <section className="mb-6">
              <h2 className="text-2xl font-semibold mb-3">Como Usar</h2>
              <ol className="list-decimal list-inside text-gray-700">
                <li className="mb-2">
                  Cadastre-se ou faça login na plataforma.
                </li>
                <li className="mb-2">
                  Adicione suas finanças pessoais, como rendas e dívidas.
                </li>
                <li className="mb-2">
                  Gerencie suas contas e acompanhe seus objetivos financeiros.
                </li>
                <li className="mb-2">
                  Receba notificações e lembretes sobre suas finanças.
                </li>
              </ol>
            </section>

            <section className="mb-6">
              <h2 className="text-2xl font-semibold mb-3">Funcionalidades</h2>
              <ul className="list-disc list-inside text-gray-700">
                <li className="mb-2">
                  <strong>Gerenciamento de Rendas:</strong> Adicione e acompanhe
                  suas fontes de renda.
                </li>
                <li className="mb-2">
                  <strong>Controle de Dívidas:</strong> Registre e monitore suas
                  dívidas e contas a pagar.
                </li>
                <li className="mb-2">
                  <strong>Objetivos Financeiros:</strong> Defina e alcance seus
                  objetivos financeiros.
                </li>
                <li className="mb-2">
                  <strong>Notificações:</strong> Receba lembretes de contas a
                  pagar e outras notificações importantes.
                </li>
              </ul>
            </section>

            <section className="mb-6">
              <h2 className="text-2xl font-semibold mb-3">FAQs</h2>
              <div className="text-gray-700">
                <p className="mb-2">
                  <strong>Como posso redefinir minha senha?</strong>
                </p>
                <p className="mb-4">
                  Você pode redefinir sua senha clicando em "Esqueci minha
                  senha" na página de login e seguindo as instruções.
                </p>

                <p className="mb-2">
                  <strong>Como adiciono uma nova dívida?</strong>
                </p>
                <p className="mb-4">
                  Para adicionar uma nova dívida, vá para a seção "Dívidas" e
                  clique em "Adicionar Dívida". Preencha as informações
                  necessárias e salve.
                </p>

                <p className="mb-2">
                  <strong>Posso configurar notificações?</strong>
                </p>
                <p className="mb-4">
                  Sim, você pode configurar notificações nas configurações de
                  sua conta para receber lembretes sobre contas a pagar e outros
                  alertas.
                </p>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
