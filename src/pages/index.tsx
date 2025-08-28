import { FormEvent, useContext, useState } from "react";
import Head from "next/head";
import { Dialog } from "@headlessui/react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import Link from "next/link";
import { toast } from "react-toastify";
import { AuthContexts } from "@/contexts/AuthContexts";
import Image from "next/image";
import imgLogo from "../../public/logo_login.png";
import heroImg from "../../public/hero-people.png"; // ajuste o nome conforme o arquivo salvo

export default function Home() {
  const { signIn } = useContext(AuthContexts);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin(event: FormEvent) {
    event.preventDefault();

    if (username === "" || password === "") {
      toast.warning("Preencha todos os campos!");
      return;
    }

    setLoading(true);

    let data = {
      username,
      password,
    };

    await signIn(data);
    setLoading(false);
  }
  return (
    <>
      <Head>
        <title>Conta Plus - Controle suas finanças</title>
      </Head>

      <header className="flex items-center justify-between px-8 py-4 bg-white shadow">
        <div>
          <Image src={imgLogo} alt="" />
        </div>
        <div className="flex gap-2">
          <Link
            href="/signup"
            className="h-10 px-4 bg-primary flex items-center text-center text-sm text-white font-bold rounded-lg hover:opacity-90"
          >
            Criar Conta
          </Link>
          <button
            onClick={() => setIsModalOpen(true)}
            className="h-10 px-4 bg-creme text-gray-900 font-bold rounded-lg hover:bg-gray-200"
          >
            Entrar
          </button>
        </div>
      </header>

      {/* HERO */}
      <section className="relative overflow-hidden min-h-[420px] flex items-center justify-center bg-creme py-20">
        {/* Imagem decorativa no topo direito */}
        <div className="absolute top-0 right-0 w-[60vw] max-w-[600px] h-full pointer-events-none select-none hidden sm:block">
          <Image
            src={heroImg}
            alt="Ilustração pessoas"
            fill
            style={{ objectFit: "contain", objectPosition: "top right" }}
            className="z-10"
            priority
          />
        </div>
        {/* Conteúdo do hero */}
        <div className="relative z-20 max-w-2xl mx-auto text-center px-4">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 drop-shadow">
            Gerencie suas finanças com facilidade
          </h2>
          <p className="max-w-xl mx-auto text-lg text-gray-700 mb-6">
            O Conta Plus ajuda você a controlar receitas, organizar despesas,
            definir metas financeiras e ter insights sobre sua saúde financeira.
          </p>
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-6 py-3 bg-primary text-white rounded-lg font-bold text-lg hover:opacity-90 shadow-lg"
          >
            Começar Agora
          </button>
        </div>
      </section>
      {/* FEATURES */}
      <section className="py-20 px-8 bg-white">
        <h2 className="text-[#111418] text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5">
          Principais recursos
        </h2>
        <div className="flex flex-col gap-10 px-4 py-10 @container">
          <div className="flex flex-col gap-4">
            <h1 className="text-[#111418] tracking-light text-[32px] font-bold leading-tight @[480px]:text-4xl @[480px]:font-black @[480px]:leading-tight @[480px]:tracking-[-0.033em] max-w-[720px]">
              Todas as ferramentas que você precisa para controlar suas finanças
            </h1>
            <p className="text-[#111418] text-base font-normal leading-normal max-w-[720px]">
              O Conta Plus ajuda você a controlar receitas, organizar despesas,
              definir metas financeiras e ter insights sobre sua saúde
              financeira.
            </p>
          </div>
          <div className="grid grid-cols-[repeat(auto-fit,minmax(158px,1fr))] gap-3 p-0">
            <div className="flex flex-1 gap-3 rounded-lg border border-[#dbe0e6] bg-white p-4 flex-col">
              <div
                className="text-[#111418]"
                data-icon="CurrencyDollar"
                data-size="24px"
                data-weight="regular"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24px"
                  height="24px"
                  fill="currentColor"
                  viewBox="0 0 256 256"
                >
                  <path d="M152,120H136V56h8a32,32,0,0,1,32,32,8,8,0,0,0,16,0,48.05,48.05,0,0,0-48-48h-8V24a8,8,0,0,0-16,0V40h-8a48,48,0,0,0,0,96h8v64H104a32,32,0,0,1-32-32,8,8,0,0,0-16,0,48.05,48.05,0,0,0,48,48h16v16a8,8,0,0,0,16,0V216h16a48,48,0,0,0,0-96Zm-40,0a32,32,0,0,1,0-64h8v64Zm40,80H136V136h16a32,32,0,0,1,0,64Z"></path>
                </svg>
              </div>
              <div className="flex flex-col gap-1">
                <h2 className="text-[#111418] text-base font-bold leading-tight">
                  Controle de Receitas
                </h2>
                <p className="text-[#60758a] text-sm font-normal leading-normal">
                  Acompanhe facilmente todas as suas fontes de receita em um só
                  lugar.
                </p>
              </div>
            </div>
            <div className="flex flex-1 gap-3 rounded-lg border border-[#dbe0e6] bg-white p-4 flex-col">
              <div
                className="text-[#111418]"
                data-icon="Receipt"
                data-size="24px"
                data-weight="regular"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24px"
                  height="24px"
                  fill="currentColor"
                  viewBox="0 0 256 256"
                >
                  <path d="M72,104a8,8,0,0,1,8-8h96a8,8,0,0,1,0,16H80A8,8,0,0,1,72,104Zm8,40h96a8,8,0,0,0,0-16H80a8,8,0,0,0,0,16ZM232,56V208a8,8,0,0,1-11.58,7.15L192,200.94l-28.42,14.21a8,8,0,0,1-7.16,0L128,200.94,99.58,215.15a8,8,0,0,1-7.16,0L64,200.94,35.58,215.15A8,8,0,0,1,24,208V56A16,16,0,0,1,40,40H216A16,16,0,0,1,232,56Zm-16,0H40V195.06l20.42-10.22a8,8,0,0,1,7.16,0L96,199.06l28.42-14.22a8,8,0,0,1,7.16,0L160,199.06l28.42-14.22a8,8,0,0,1,7.16,0L216,195.06Z"></path>
                </svg>
              </div>
              <div className="flex flex-col gap-1">
                <h2 className="text-[#111418] text-base font-bold leading-tight">
                  Gestão de Despesas
                </h2>
                <p className="text-[#60758a] text-sm font-normal leading-normal">
                  Categorize e gerencie suas despesas para ver para onde vai seu
                  dinheiro.
                </p>
              </div>
            </div>
            <div className="flex flex-1 gap-3 rounded-lg border border-[#dbe0e6] bg-white p-4 flex-col">
              <div
                className="text-[#111418]"
                data-icon="Target"
                data-size="24px"
                data-weight="regular"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24px"
                  height="24px"
                  fill="currentColor"
                  viewBox="0 0 256 256"
                >
                  <path d="M221.87,83.16A104.1,104.1,0,1,1,195.67,49l22.67-22.68a8,8,0,0,1,11.32,11.32l-96,96a8,8,0,0,1-11.32-11.32l27.72-27.72a40,40,0,1,0,17.87,31.09,8,8,0,1,1,16-.9,56,56,0,1,1-22.38-41.65L184.3,60.39a87.88,87.88,0,1,0,23.13,29.67,8,8,0,0,1,14.44-6.9Z"></path>
                </svg>
              </div>
              <div className="flex flex-col gap-1">
                <h2 className="text-[#111418] text-base font-bold leading-tight">
                  Definição de Metas
                </h2>
                <p className="text-[#60758a] text-sm font-normal leading-normal">
                  Defina e acompanhe suas metas financeiras para alcançar seus
                  objetivos.
                </p>
              </div>
            </div>
            <div className="flex flex-1 gap-3 rounded-lg border border-[#dbe0e6] bg-white p-4 flex-col">
              <div
                className="text-[#111418]"
                data-icon="PresentationChart"
                data-size="24px"
                data-weight="regular"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24px"
                  height="24px"
                  fill="currentColor"
                  viewBox="0 0 256 256"
                >
                  <path d="M216,40H136V24a8,8,0,0,0-16,0V40H40A16,16,0,0,0,24,56V176a16,16,0,0,0,16,16H79.36L57.75,219a8,8,0,0,0,12.5,10l29.59-37h56.32l29.59,37a8,8,0,1,0,12.5-10l-21.61-27H216a16,16,0,0,0,16-16V56A16,16,0,0,0,216,40Zm0,136H40V56H216V176ZM104,120v24a8,8,0,0,1-16,0V120a8,8,0,0,1,16,0Zm32-16v40a8,8,0,0,1-16,0V104a8,8,0,0,1,16,0Zm32-16v56a8,8,0,0,1-16,0V88a8,8,0,0,1,16,0Z"></path>
                </svg>
              </div>
              <div className="flex flex-col gap-1">
                <h2 className="text-[#111418] text-base font-bold leading-tight">
                  Visão Geral em Painéis
                </h2>
                <p className="text-[#60758a] text-sm font-normal leading-normal">
                  Tenha uma visão clara de sua situação financeira com painéis
                  interativos.
                </p>
              </div>
            </div>
            <div className="flex flex-1 gap-3 rounded-lg border border-[#dbe0e6] bg-white p-4 flex-col">
              <div
                className="text-[#111418]"
                data-icon="FileXls"
                data-size="24px"
                data-weight="regular"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24px"
                  height="24px"
                  fill="currentColor"
                  viewBox="0 0 256 256"
                >
                  <path d="M156,208a8,8,0,0,1-8,8H120a8,8,0,0,1-8-8V152a8,8,0,0,1,16,0v48h20A8,8,0,0,1,156,208ZM92.65,145.49a8,8,0,0,0-11.16,1.86L68,166.24,54.51,147.35a8,8,0,1,0-13,9.3L58.17,180,41.49,203.35a8,8,0,0,0,13,9.3L68,193.76l13.49,18.89a8,8,0,0,0,13-9.3L77.83,180l16.68-23.35A8,8,0,0,0,92.65,145.49Zm98.94,25.82c-4-1.16-8.14-2.35-10.45-3.84-1.25-.82-1.23-1-1.12-1.9a4.54,4.54,0,0,1,2-3.67c4.6-3.12,15.34-1.72,19.82-.56a8,8,0,0,0,4.07-15.48c-2.11-.55-21-5.22-32.83,2.76a20.58,20.58,0,0,0-8.95,14.95c-2,15.88,13.65,20.41,23,23.11,12.06,3.49,13.12,4.92,12.78,7.59-.31,2.41-1.26,3.33-2.15,3.93-4.6,3.06-15.16,1.55-19.54.35A8,8,0,0,0,173.93,214a60.63,60.63,0,0,0,15.19,2c5.82,0,12.3-1,17.49-4.46a20.81,20.81,0,0,0,9.18-15.23C218,179,201.48,174.17,191.59,171.31ZM40,112V40A16,16,0,0,1,56,24h96a8,8,0,0,1,5.66,2.34l56,56A8,8,0,0,1,216,88v24a8,8,0,1,1-16,0V96H152a8,8,0,0,1-8-8V40H56v72a8,8,0,0,1-16,0ZM160,80h28.68L160,51.31Z"></path>
                </svg>
              </div>
              <div className="flex flex-col gap-1">
                <h2 className="text-[#111418] text-base font-bold leading-tight">
                  Importação via Excel
                </h2>
                <p className="text-[#60758a] text-sm font-normal leading-normal">
                  Importe seus dados financeiros de planilhas Excel.
                </p>
              </div>
            </div>
            <div className="flex flex-1 gap-3 rounded-lg border border-[#dbe0e6] bg-white p-4 flex-col">
              <div
                className="text-[#111418]"
                data-icon="Bell"
                data-size="24px"
                data-weight="regular"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24px"
                  height="24px"
                  fill="currentColor"
                  viewBox="0 0 256 256"
                >
                  <path d="M221.8,175.94C216.25,166.38,208,139.33,208,104a80,80,0,1,0-160,0c0,35.34-8.26,62.38-13.81,71.94A16,16,0,0,0,48,200H88.81a40,40,0,0,0,78.38,0H208a16,16,0,0,0,13.8-24.06ZM128,216a24,24,0,0,1-22.62-16h45.24A24,24,0,0,1,128,216ZM48,184c7.7-13.24,16-43.92,16-80a64,64,0,1,1,128,0c0,36.05,8.28,66.73,16,80Z"></path>
                </svg>
              </div>
              <div className="flex flex-col gap-1">
                <h2 className="text-[#111418] text-base font-bold leading-tight">
                  Alertas
                </h2>
                <p className="text-[#60758a] text-sm font-normal leading-normal">
                  Receba alertas sobre eventos e prazos financeiros importantes.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="py-20 px-8 bg-creme">
        <h2 className="text-[#111418] text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5">
          Preços e Planos
        </h2>
        <div className="grid grid-cols-[repeat(auto-fit,minmax(228px,1fr))] gap-2.5 px-4 py-3 @3xl:grid-cols-4">
          <div className="flex flex-1 flex-col gap-4 rounded-lg border border-solid border-[#dbe0e6] bg-white p-6">
            <div className="flex flex-col gap-1">
              <h1 className="text-[#111418] text-base font-bold leading-tight">
                Free
              </h1>
              <p className="flex items-baseline gap-1 text-[#111418]">
                <span className="text-[#111418] text-4xl font-black leading-tight tracking-[-0.033em]">
                  R$0
                </span>
                <span className="text-[#111418] text-base font-bold leading-tight">
                  /mês
                </span>
              </p>
            </div>
            <Link
              href="/signup"
              className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-[#f0f2f5] text-[#111418] text-sm font-bold leading-normal tracking-[0.015em]"
            >
              <span className="truncate">Cadastre-se</span>
            </Link>
            <div className="flex flex-col gap-2">
              <div className="text-[13px] font-normal leading-normal flex gap-3 text-[#111418]">
                <div
                  className="text-[#111418]"
                  data-icon="Check"
                  data-size="20px"
                  data-weight="regular"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20px"
                    height="20px"
                    fill="currentColor"
                    viewBox="0 0 256 256"
                  >
                    <path d="M229.66,77.66l-128,128a8,8,0,0,1-11.32,0l-56-56a8,8,0,0,1,11.32-11.32L96,188.69,218.34,66.34a8,8,0,0,1,11.32,11.32Z"></path>
                  </svg>
                </div>
                Durante um mês
              </div>
              <div className="text-[13px] font-normal leading-normal flex gap-3 text-[#111418]">
                <div
                  className="text-[#111418]"
                  data-icon="Check"
                  data-size="20px"
                  data-weight="regular"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20px"
                    height="20px"
                    fill="currentColor"
                    viewBox="0 0 256 256"
                  >
                    <path d="M229.66,77.66l-128,128a8,8,0,0,1-11.32,0l-56-56a8,8,0,0,1,11.32-11.32L96,188.69,218.34,66.34a8,8,0,0,1,11.32,11.32Z"></path>
                  </svg>
                </div>
                Avaliar sistema e recursos
              </div>
            </div>
          </div>
          <div className="flex flex-1 flex-col gap-4 rounded-lg border border-solid border-[#dbe0e6] bg-white p-6">
            <div className="flex flex-col gap-1">
              <h1 className="text-[#111418] text-base font-bold leading-tight">
                Mensal
              </h1>
              <p className="flex items-baseline gap-1 text-[#111418]">
                <span className="text-[#111418] text-4xl font-black leading-tight tracking-[-0.033em]">
                  R$15
                </span>
                <span className="text-[#111418] text-base font-bold leading-tight">
                  /mês
                </span>
              </p>
            </div>
            <Link
              href="/signup"
              className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-[#f0f2f5] text-[#111418] text-sm font-bold leading-normal tracking-[0.015em]"
            >
              <span className="truncate">Cadastre-se</span>
            </Link>
            <div className="flex flex-col gap-2">
              <div className="text-[13px] font-normal leading-normal flex gap-3 text-[#111418]">
                <div
                  className="text-[#111418]"
                  data-icon="Check"
                  data-size="20px"
                  data-weight="regular"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20px"
                    height="20px"
                    fill="currentColor"
                    viewBox="0 0 256 256"
                  >
                    <path d="M229.66,77.66l-128,128a8,8,0,0,1-11.32,0l-56-56a8,8,0,0,1,11.32-11.32L96,188.69,218.34,66.34a8,8,0,0,1,11.32,11.32Z"></path>
                  </svg>
                </div>
                Mensal
              </div>
              <div className="text-[13px] font-normal leading-normal flex gap-3 text-[#111418]">
                <div
                  className="text-[#111418]"
                  data-icon="Check"
                  data-size="20px"
                  data-weight="regular"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20px"
                    height="20px"
                    fill="currentColor"
                    viewBox="0 0 256 256"
                  >
                    <path d="M229.66,77.66l-128,128a8,8,0,0,1-11.32,0l-56-56a8,8,0,0,1,11.32-11.32L96,188.69,218.34,66.34a8,8,0,0,1,11.32,11.32Z"></path>
                  </svg>
                </div>
                Avaliar sistema e recursos
              </div>
            </div>
          </div>
          <div className="flex flex-1 flex-col gap-4 rounded-lg border border-solid border-[#dbe0e6] bg-white p-6">
            <div className="flex flex-col gap-1">
              <div className="flex items-center justify-between">
                <h1 className="text-[#111418] text-base font-bold leading-tight">
                  Semestral
                </h1>
                <p className="text-white text-xs font-medium leading-normal tracking-[0.015em] rounded-lg bg-[#0d80f2] px-3 py-[3px] text-center">
                  Mais Popular
                </p>
              </div>
              <p className="flex items-baseline gap-1 text-[#111418]">
                <span className="text-[#111418] text-4xl font-black leading-tight tracking-[-0.033em]">
                  R$ 81,00
                </span>
                <span className="text-[#111418] text-base font-bold leading-tight">
                  /semestral
                </span>
              </p>
            </div>
            <Link
              href="/signup"
              className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-[#f0f2f5] text-[#111418] text-sm font-bold leading-normal tracking-[0.015em]"
            >
              <span className="truncate">Cadastre-se</span>
            </Link>
            <div className="flex flex-col gap-2">
              <div className="text-[13px] font-normal leading-normal flex gap-3 text-[#111418]">
                <div
                  className="text-[#111418]"
                  data-icon="Check"
                  data-size="20px"
                  data-weight="regular"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20px"
                    height="20px"
                    fill="currentColor"
                    viewBox="0 0 256 256"
                  >
                    <path d="M229.66,77.66l-128,128a8,8,0,0,1-11.32,0l-56-56a8,8,0,0,1,11.32-11.32L96,188.69,218.34,66.34a8,8,0,0,1,11.32,11.32Z"></path>
                  </svg>
                </div>
                Use o sistema e os recusos como quiser
              </div>
              <div className="text-[13px] font-normal leading-normal flex gap-3 text-[#111418]">
                <div
                  className="text-[#111418]"
                  data-icon="Check"
                  data-size="20px"
                  data-weight="regular"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20px"
                    height="20px"
                    fill="currentColor"
                    viewBox="0 0 256 256"
                  >
                    <path d="M229.66,77.66l-128,128a8,8,0,0,1-11.32,0l-56-56a8,8,0,0,1,11.32-11.32L96,188.69,218.34,66.34a8,8,0,0,1,11.32,11.32Z"></path>
                  </svg>
                </div>
                Chat de suporte
              </div>
            </div>
          </div>
          <div className="flex flex-1 flex-col gap-4 rounded-lg border border-solid border-[#dbe0e6] bg-white p-6">
            <div className="flex flex-col gap-1">
              <h1 className="text-[#111418] text-base font-bold leading-tight">
                Anual
              </h1>
              <p className="flex items-baseline gap-1 text-[#111418]">
                <span className="text-[#111418] text-4xl font-black leading-tight tracking-[-0.033em]">
                  R$ 162,00
                </span>
                <span className="text-[#111418] text-base font-bold leading-tight">
                  /ano
                </span>
              </p>
            </div>
            <Link
              href="/signup"
              className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-[#f0f2f5] text-[#111418] text-sm font-bold leading-normal tracking-[0.015em]"
            >
              <span className="truncate">Cadastre-se</span>
            </Link>
            <div className="flex flex-col gap-2">
              <div className="text-[13px] font-normal leading-normal flex gap-3 text-[#111418]">
                <div
                  className="text-[#111418]"
                  data-icon="Check"
                  data-size="20px"
                  data-weight="regular"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20px"
                    height="20px"
                    fill="currentColor"
                    viewBox="0 0 256 256"
                  >
                    <path d="M229.66,77.66l-128,128a8,8,0,0,1-11.32,0l-56-56a8,8,0,0,1,11.32-11.32L96,188.69,218.34,66.34a8,8,0,0,1,11.32,11.32Z"></path>
                  </svg>
                </div>
                Pague uma vez por ano
              </div>
              <div className="text-[13px] font-normal leading-normal flex gap-3 text-[#111418]">
                <div
                  className="text-[#111418]"
                  data-icon="Check"
                  data-size="20px"
                  data-weight="regular"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20px"
                    height="20px"
                    fill="currentColor"
                    viewBox="0 0 256 256"
                  >
                    <path d="M229.66,77.66l-128,128a8,8,0,0,1-11.32,0l-56-56a8,8,0,0,1,11.32-11.32L96,188.69,218.34,66.34a8,8,0,0,1,11.32,11.32Z"></path>
                  </svg>
                </div>
                Prioridade no suporte
              </div>
              <div className="text-[13px] font-normal leading-normal flex gap-3 text-[#111418]">
                <div
                  className="text-[#111418]"
                  data-icon="Check"
                  data-size="20px"
                  data-weight="regular"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20px"
                    height="20px"
                    fill="currentColor"
                    viewBox="0 0 256 256"
                  >
                    <path d="M229.66,77.66l-128,128a8,8,0,0,1-11.32,0l-56-56a8,8,0,0,1,11.32-11.32L96,188.69,218.34,66.34a8,8,0,0,1,11.32,11.32Z"></path>
                  </svg>
                </div>
                Recuro exclusivo, direito a declaração de imposto de renda
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="py-20 px-8 text-center bg-white">
        <div className="flex flex-col justify-end gap-6 px-4 py-10 @[480px]:gap-8 @[480px]:px-10 @[480px]:py-20">
          <div className="flex flex-col items-center gap-2 text-center">
            <h1 className="text-[#111418] text-[32px] font-bold leading-tight @[480px]:text-4xl @[480px]:font-black @[480px]:leading-tight @[480px]:tracking-[-0.033em] max-w-[720px]">
              Comece a Gerenciar Suas Finanças Hoje
            </h1>
            <p className="text-[#111418] text-base font-normal leading-normal max-w-[720px]">
              Crie sua conta no Conta Plus e assuma o controle do seu futuro
              financeiro com nosso plano gratuito.
            </p>
          </div>
          <div className="flex flex-1 justify-center">
            <div className="flex justify-center">
              <Link
                href="/signup"
                className="px-6 py-3 bg-creme text-dashboard font-bold rounded-lg hover:bg-gray-100"
              >
                Criar Conta
              </Link>
            </div>
          </div>
        </div>
      </section>
      {/* FOOTER */}
      <footer className="flex flex-col gap-6 px-5 py-10 text-center @container">
        <div className="flex flex-wrap items-center justify-center gap-6 @[480px]:flex-row @[480px]:justify-around">
          <Link
            href="/termosdeuso"
            className="text-[#60758a] text-base font-normal leading-normal min-w-40"
          >
            Termos de Serviço
          </Link>
          <Link
            href="/politicadeprivacidade"
            className="text-[#60758a] text-base font-normal leading-normal min-w-40"
          >
            Política de Privacidade
          </Link>
        </div>
        <div className="flex flex-wrap justify-center gap-4">
          <a href="#">
            <div
              className="text-[#60758a]"
              data-icon="TwitterLogo"
              data-size="24px"
              data-weight="regular"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24px"
                height="24px"
                fill="currentColor"
                viewBox="0 0 256 256"
              >
                <path d="M247.39,68.94A8,8,0,0,0,240,64H209.57A48.66,48.66,0,0,0,168.1,40a46.91,46.91,0,0,0-33.75,13.7A47.9,47.9,0,0,0,120,88v6.09C79.74,83.47,46.81,50.72,46.46,50.37a8,8,0,0,0-13.65,4.92c-4.31,47.79,9.57,79.77,22,98.18a110.93,110.93,0,0,0,21.88,24.2c-15.23,17.53-39.21,26.74-39.47,26.84a8,8,0,0,0-3.85,11.93c.75,1.12,3.75,5.05,11.08,8.72C53.51,229.7,65.48,232,80,232c70.67,0,129.72-54.42,135.75-124.44l29.91-29.9A8,8,0,0,0,247.39,68.94Zm-45,29.41a8,8,0,0,0-2.32,5.14C196,166.58,143.28,216,80,216c-10.56,0-18-1.4-23.22-3.08,11.51-6.25,27.56-17,37.88-32.48A8,8,0,0,0,92,169.08c-.47-.27-43.91-26.34-44-96,16,13,45.25,33.17,78.67,38.79A8,8,0,0,0,136,104V88a32,32,0,0,1,9.6-22.92A30.94,30.94,0,0,1,167.9,56c12.66.16,24.49,7.88,29.44,19.21A8,8,0,0,0,204.67,80h16Z"></path>
              </svg>
            </div>
          </a>
          <a href="#">
            <div
              className="text-[#60758a]"
              data-icon="FacebookLogo"
              data-size="24px"
              data-weight="regular"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24px"
                height="24px"
                fill="currentColor"
                viewBox="0 0 256 256"
              >
                <path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm8,191.63V152h24a8,8,0,0,0,0-16H136V112a16,16,0,0,1,16-16h16a8,8,0,0,0,0-16H152a32,32,0,0,0-32,32v24H96a8,8,0,0,0,0,16h24v63.63a88,88,0,1,1,16,0Z"></path>
              </svg>
            </div>
          </a>
          <a href="#">
            <div
              className="text-[#60758a]"
              data-icon="InstagramLogo"
              data-size="24px"
              data-weight="regular"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24px"
                height="24px"
                fill="currentColor"
                viewBox="0 0 256 256"
              >
                <path d="M128,80a48,48,0,1,0,48,48A48.05,48.05,0,0,0,128,80Zm0,80a32,32,0,1,1,32-32A32,32,0,0,1,128,160ZM176,24H80A56.06,56.06,0,0,0,24,80v96a56.06,56.06,0,0,0,56,56h96a56.06,56.06,0,0,0,56-56V80A56.06,56.06,0,0,0,176,24Zm40,152a40,40,0,0,1-40,40H80a40,40,0,0,1-40-40V80A40,40,0,0,1,80,40h96a40,40,0,0,1,40,40ZM192,76a12,12,0,1,1-12-12A12,12,0,0,1,192,76Z"></path>
              </svg>
            </div>
          </a>
        </div>
        <p className="text-[#60758a] text-base font-normal leading-normal">
          © 2025 Conta Plus. Todos os direitos reservados.
        </p>
      </footer>
      {/* MODAL DE LOGIN / CADASTRO */}
      <Dialog
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        className="relative z-50"
      >
        <div className="fixed inset-0 bg-black/40" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="mx-auto max-w-md w-full rounded-lg bg-white p-6 shadow-lg">
            <Dialog.Title className="text-xl font-bold text-gray-900 mb-4">
              {isLogin ? "Entrar" : "Criar Conta"}
            </Dialog.Title>

            <form onSubmit={handleLogin} className="flex flex-col gap-3">
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="E-mail Nome de Usuário"
                className="w-full border rounded-lg px-3 py-2"
              />
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="********"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full border rounded-lg px-3 py-2 pr-10"
                />
                <button
                  type="button"
                  className="absolute right-3 top-2 text-gray-600"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-primary text-white rounded-lg py-2 font-bold hover:opacity-90"
              >
                {loading ? "Entrando..." : "Entrar"}
              </button>
            </form>

            <div className="mt-4 text-center">
              {isLogin ? (
                <p>
                  Não tem uma conta?{" "}
                  <Link href="/signup" className="text-primary font-medium">
                    Criar Conta
                  </Link>
                </p>
              ) : (
                <p>
                  Já possui conta?{" "}
                  <button
                    className="text-primary font-medium"
                    onClick={() => setIsLogin(true)}
                  >
                    Entrar
                  </button>
                </p>
              )}
            </div>

            <div className="mt-6 flex justify-between text-sm text-gray-500">
              <Link href="/login" className="hover:text-primary">
                Ir para página de Login
              </Link>
              <Link href="/signup" className="hover:text-primary">
                Ir para página de Cadastro
              </Link>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>
    </>
  );
}
