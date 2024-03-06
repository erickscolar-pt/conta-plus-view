import { AppProps } from "next/app"
import '../../styles/globals.scss'
import Head from "next/head"
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify'
import { AuthProvider } from "../contexts/AuthContexts";
import GeradorDeLink from "./geradordelink";

function MyApp({ Component, pageProps }: AppProps) {
    return (
        <>
            <Head>
                <title>Redireciona Link</title>


            </Head>
            <AuthProvider>
                <Component {...pageProps} />
                <ToastContainer autoClose={3000} />
            </AuthProvider>

        </>
    )
}

export default MyApp