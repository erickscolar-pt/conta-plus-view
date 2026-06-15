import { AppProps } from "next/app";
import "../../styles/globals.scss";
import Head from "next/head";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import { AuthProvider } from "../contexts/AuthContexts";
import GoogleAnalytics from "@/component/GoogleAnalytics";
import AvisosDeAtualizacao from "@/component/avisosdeatualizacao";
import InstallAppPrompt from "@/component/pwa/InstallAppPrompt";
import PwaUpdateModal from "@/component/pwa/PwaUpdateModal";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <div className="min-h-screen font-sans antialiased">
      <Head>
        <title>Conta+</title>
        <meta
          name="description"
          content="Gestão financeira pessoal e compartilhada: entradas, dívidas, metas e visão clara do seu dinheiro."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#1A1216" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="Conta+" />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.webmanifest" />
      </Head>
      <GoogleAnalytics />
      <AvisosDeAtualizacao />
      <PwaUpdateModal />
      <AuthProvider>
        <Component {...pageProps} />
        <InstallAppPrompt />
        <ToastContainer autoClose={3000} />
      </AuthProvider>
    </div>
  );
}

export default MyApp;
