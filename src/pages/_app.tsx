import { AppProps } from "next/app"
import '../../styles/globals.scss'
import Head from "next/head"
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify'
import { AuthProvider } from "../contexts/AuthContexts";
import GoogleAnalytics from "@/component/GoogleAnalytics";

function MyApp({ Component, pageProps }: AppProps) {
    return (
        <>
            <Head>
                <title>Conta+</title>
                <meta name='description' content='Simplifique suas finanças com Conta Plus: gerenciamento inteligente de contas pessoais para um futuro financeiro mais tranquilo e organizado.' />
            </Head>
            <GoogleAnalytics/>
            <AuthProvider>
                <Component {...pageProps} />
                <ToastContainer autoClose={3000} />
            </AuthProvider>

        </>
    )
}

export default MyApp