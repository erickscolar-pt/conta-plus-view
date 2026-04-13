import { AppProps } from "next/app";
import { Inter } from "next/font/google";
import "../../styles/globals.scss";
import Head from "next/head";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import { AuthProvider } from "../contexts/AuthContexts";
import GoogleAnalytics from "@/component/GoogleAnalytics";
import AvisosDeAtualizacao from "@/component/avisosdeatualizacao";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <div className={`${inter.className} min-h-screen font-sans antialiased`}>
      <Head>
        <title>Conta+</title>
        <meta
          name="description"
          content="Gestão financeira pessoal e compartilhada: entradas, dívidas, metas e visão clara do seu dinheiro."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <GoogleAnalytics />
      <AvisosDeAtualizacao />
      <AuthProvider>
        <Component {...pageProps} />
        <ToastContainer autoClose={3000} />
      </AuthProvider>
    </div>
  );
}

export default MyApp;
